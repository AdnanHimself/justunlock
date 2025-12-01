import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    let uploadedFilePath: string | null = null;
    console.log('[API] Create Link Request Started');

    try {
        let slug, title, price, receiver_address, target_url, content_type;
        let file: File | null = null;

        const contentTypeHeader = req.headers.get('content-type') || '';
        console.log('[API] Content-Type:', contentTypeHeader);

        // Parse request body based on Content-Type
        if (contentTypeHeader.includes('multipart/form-data')) {
            console.log('[API] Parsing multipart/form-data');
            const formData = await req.formData();
            slug = formData.get('slug') as string;
            title = formData.get('title') as string;
            price = formData.get('price') as string;
            receiver_address = formData.get('receiver_address') as string;
            content_type = formData.get('content_type') as string;
            file = formData.get('file') as File;
        } else {
            console.log('[API] Parsing JSON body');
            const body = await req.json();
            slug = body.slug;
            title = body.title;
            price = body.price;
            receiver_address = body.receiver_address;
            target_url = body.target_url;
            content_type = body.content_type;
        }

        console.log('[API] Parsed Data:', { slug, title, price, receiver_address, content_type, hasFile: !!file, target_url });

        if (!slug || !price || !receiver_address) {
            console.error('[API] Missing required fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if ((content_type === 'url' || content_type === 'text') && !target_url) {
            console.error('[API] Missing target content for url/text');
            return NextResponse.json({ error: 'Missing target content' }, { status: 400 });
        }
        if ((content_type === 'file' || content_type === 'image') && !file) {
            console.error('[API] Missing file for file/image');
            return NextResponse.json({ error: 'Missing file' }, { status: 400 });
        }

        if (parseFloat(price) < 1) {
            return NextResponse.json({ error: 'Price must be at least 1 USDC' }, { status: 400 });
        }

        if (parseFloat(price) > 10000) {
            return NextResponse.json({ error: 'Price cannot exceed 10,000 USDC' }, { status: 400 });
        }

        // 0. Security: Verify Wallet Signature (DoS Protection)
        const signature = req.headers.get('x-signature');
        const address = req.headers.get('x-address');
        console.log('[API] Verifying signature for address:', address);

        if (!signature || !address) {
            console.error('[API] Missing signature or address headers');
            return NextResponse.json({ error: 'Missing wallet signature' }, { status: 401 });
        }

        try {
            const { verifyMessage } = await import('viem');
            const isValid = await verifyMessage({
                address: address as `0x${string}`,
                message: `Create Lock: ${slug}`,
                signature: signature as `0x${string}`,
            });

            if (!isValid) {
                console.error('[API] Invalid signature');
                return NextResponse.json({ error: 'Invalid wallet signature' }, { status: 401 });
            }
            console.log('[API] Signature verified successfully');
        } catch (sigError) {
            console.error('[API] Signature verification failed:', sigError);
            return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
        }

        // Handle File Upload
        if ((content_type === 'file' || content_type === 'image') && file) {
            console.log('[API] Processing file upload');
            // 1. Validate File Size (Max 25MB)
            const MAX_SIZE = 25 * 1024 * 1024; // 25MB
            if (file.size > MAX_SIZE) {
                console.error('[API] File size exceeds limit:', file.size);
                return NextResponse.json({ error: 'File size exceeds 25MB limit' }, { status: 400 });
            }

            // Convert File to ArrayBuffer for inspection and upload
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 2. Validate File Type (Magic Numbers)
            const { fileTypeFromBuffer } = await import('file-type');
            const type = await fileTypeFromBuffer(buffer);
            console.log('[API] Detected file type:', type);

            const ALLOWED_MIMES = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf', 'text/plain'
            ];

            if (!type || !ALLOWED_MIMES.includes(type.mime)) {
                console.error('[API] Invalid file type:', type?.mime);
                return NextResponse.json({ error: `Invalid file type. Allowed: Images, PDF.` }, { status: 400 });
            }

            const fileName = `${slug}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            console.log('[API] Uploading file to storage:', fileName);

            const { error: uploadError } = await supabaseAdmin.storage
                .from('locked_content')
                .upload(fileName, buffer, {
                    contentType: file.type,
                    upsert: false
                });

            if (uploadError) {
                console.error('[API] Storage upload error:', uploadError);
                return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
            }

            uploadedFilePath = fileName;
            target_url = fileName;
            console.log('[API] File uploaded successfully');
        }

        // 1. Insert public metadata into 'links' table
        console.log('[API] Inserting link metadata');
        const { error: linkError } = await supabaseAdmin
            .from('links')
            .insert({
                id: slug,
                price: parseFloat(price),
                receiver_address: receiver_address,
                title: title || 'Unlock Content',
                token_address: '0x0000000000000000000000000000000000000000',
                created_at: new Date().toISOString(),
            });

        if (linkError) {
            console.error('[API] Link creation error:', linkError);
            if (uploadedFilePath) {
                await supabaseAdmin.storage.from('locked_content').remove([uploadedFilePath]);
            }
            return NextResponse.json({ error: 'Failed to create link metadata: ' + linkError.message }, { status: 500 });
        }

        // 2. Insert private secret into 'secrets' table
        console.log('[API] Inserting secret');
        const { error: secretError } = await supabaseAdmin
            .from('secrets')
            .insert({
                link_id: slug,
                target_url: target_url,
                content_type: content_type || 'url',
            });

        if (secretError) {
            console.error('[API] Secret creation error:', secretError);
            await supabaseAdmin.from('links').delete().eq('id', slug);
            if (uploadedFilePath) {
                await supabaseAdmin.storage.from('locked_content').remove([uploadedFilePath]);
            }
            return NextResponse.json({ error: 'Failed to save secret: ' + secretError.message }, { status: 500 });
        }

        console.log('[API] Link created successfully:', slug);
        return NextResponse.json({ success: true, slug });

    } catch (error: any) {
        console.error('[API] Unexpected Error:', error);
        if (uploadedFilePath) {
            await supabaseAdmin.storage.from('locked_content').remove([uploadedFilePath]);
        }
        return NextResponse.json({ error: 'Internal Server Error: ' + (error.message || String(error)) }, { status: 500 });
    }
}
