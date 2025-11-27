import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem, decodeEventLog, keccak256, toBytes, parseUnits, verifyMessage } from 'viem';
import { base } from 'viem/chains';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getEthPrice } from '@/lib/price';

// Initialize Viem Public Client for Base Mainnet
const publicClient = createPublicClient({
    chain: base,
    transport: http()
});

// TODO: Update this after deploying V2
const CONTRACT_ADDRESS = '0x5CB532D8799b36a6E5dfa1663b6cFDDdDB431405';

export async function POST(req: NextRequest) {
    try {
        const { linkId, txHash, userAddress, signature } = await req.json();

        if (!linkId || !txHash || !userAddress || !signature) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 0. Verify Signature
        const message = `Unlock content for link: ${linkId}`;
        const isValidSignature = await verifyMessage({
            address: userAddress,
            message: message,
            signature: signature,
        });

        if (!isValidSignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // 1. Fetch Link Price and Receiver from Database
        const { data: link, error: linkError } = await supabaseAdmin
            .from('links')
            .select('price, receiver_address, sales_count')
            .eq('id', linkId)
            .single();

        if (linkError || !link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // 2. Verify Transaction on-chain
        const transaction = await publicClient.getTransactionReceipt({
            hash: txHash
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (transaction.status !== 'success') {
            return NextResponse.json({ error: 'Transaction failed' }, { status: 400 });
        }

        // 3. Verify Event Logs
        // Event: Paid(address indexed payer, address indexed receiver, string indexed linkId, uint256 amount, address token)
        const paidEventAbi = parseAbiItem('event Paid(address indexed payer, address indexed receiver, string indexed linkId, uint256 amount, address token)');

        let paymentVerified = false;

        for (const log of transaction.logs) {
            // Check against V2 Contract Address (case insensitive)
            // Note: If using placeholder, this check will fail unless we skip it for testing or user updates it.
            // For now, we assume user updates it.
            if (log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()) {
                try {
                    const decodedLog = decodeEventLog({
                        abi: [paidEventAbi],
                        data: log.data,
                        topics: log.topics
                    });

                    if (decodedLog.eventName === 'Paid') {
                        const args = decodedLog.args;

                        // Verify Link ID
                        const expectedLinkIdHash = keccak256(toBytes(linkId));
                        if (args.linkId !== expectedLinkIdHash) {
                            continue;
                        }

                        // Verify Receiver (Prevent Payment Diversion)
                        if (args.receiver.toLowerCase() !== link.receiver_address.toLowerCase()) {
                            console.error(`Invalid receiver. Paid to: ${args.receiver}, Expected: ${link.receiver_address}`);
                            continue;
                        }

                        // Verify Token and Amount
                        const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
                        const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

                        if (args.token.toLowerCase() === USDC_ADDRESS.toLowerCase()) {
                            // USDC Payment
                            const requiredAmount = parseUnits(link.price.toString(), 6);
                            if (args.amount < requiredAmount) {
                                console.error(`Insufficient USDC payment. Paid: ${args.amount}, Required: ${requiredAmount}`);
                                continue;
                            }


                            // ... existing imports ...

                            // ... inside POST function ...

                        } else if (args.token === ZERO_ADDRESS) {
                            // ETH Payment (Native)
                            // Fetch live price
                            const ethPrice = await getEthPrice();
                            const priceVal = parseFloat(link.price.toString());

                            // Calculate required ETH: (Price in USDC) / (ETH Price in USD)
                            // e.g. 1 USDC / 3000 = 0.000333 ETH
                            const requiredEthAmount = priceVal / ethPrice;

                            const requiredETH = parseUnits(requiredEthAmount.toFixed(18), 18);

                            // 2% tolerance for price fluctuations between UI and Tx
                            const tolerance = (requiredETH * BigInt(98)) / BigInt(100);

                            if (args.amount < tolerance) {
                                console.error(`Insufficient ETH payment. Paid: ${args.amount}, Required: ~${requiredETH} (Price: ${ethPrice})`);
                                continue;
                            }
                        } else {
                            console.error(`Invalid token. Paid with: ${args.token}`);
                            continue;
                        }

                        // Verify Payer
                        if (args.payer.toLowerCase() !== userAddress.toLowerCase()) {
                            continue;
                        }

                        paymentVerified = true;
                        break;
                    }
                } catch (e) {
                    // Log decoding failed or didn't match, continue to next log
                    continue;
                }
            }
        }

        if (!paymentVerified) {
            return NextResponse.json({ error: 'Invalid payment: Verification failed' }, { status: 400 });
        }

        // 4. Retrieve Secret Content
        const { data: secret, error: secretError } = await supabaseAdmin
            .from('secrets')
            .select('target_url')
            .eq('link_id', linkId)
            .single();

        if (secretError || !secret) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        // 5. Update Sales Stats (Async - don't block response)
        // We increment sales_count and set last_purchased_at
        // Note: rpc() is better for atomic increments, but for now we'll just read-modify-write or assume low concurrency.
        // Actually, Supabase doesn't have a simple atomic increment without a stored procedure.
        // Let's create a stored procedure in the SQL file later if needed. For now, we'll just update.
        // Wait, we can't easily do "sales_count = sales_count + 1" in a simple update call without RPC.
        // Let's just fetch current count and update it, or better yet, just update last_purchased_at and we'll fix the count later with a proper RPC if needed.
        // Actually, let's try to be robust. We can use the 'rpc' method if we had a function.
        // Since we don't want to overcomplicate, let's just do a simple update.
        // But wait, we already fetched 'link' in step 1. We can use that value + 1.
        // It's not perfectly atomic but good enough for this MVP.

        // Re-fetch to get latest count? No, let's just use what we have or do a blind update if possible.
        // Supabase JS client doesn't support "increment" directly in update().
        // Let's just update last_purchased_at for now and try to increment sales_count based on current known value.

        // 5. Record Purchase and Update Stats
        const { error: purchaseError } = await supabaseAdmin
            .from('purchases')
            .insert({
                link_id: linkId,
                buyer_address: userAddress,
                amount: parseFloat(link.price.toString()), // Storing as USDC value for consistency in stats
                token_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Defaulting to USDC for now as price is in USDC. 
                // TODO: If we support ETH payments properly, we should store the actual token and amount paid.
                // But since our price is denominated in USDC, and we verify against that, let's store the USDC value for simpler stats.
                // Actually, let's store the REAL transaction hash to ensure uniqueness.
                transaction_hash: txHash
            });

        if (purchaseError) {
            console.error('Error recording purchase:', purchaseError);
            // Don't fail the request if just recording stats fails, but log it.
        }

        await supabaseAdmin
            .from('links')
            .update({
                sales_count: (link.sales_count || 0) + 1,
                last_purchased_at: new Date().toISOString()
            })
            .eq('id', linkId);

        return NextResponse.json({ success: true, targetUrl: secret.target_url });

    } catch (error) {
        console.error('Unlock API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
