export async function getEthPrice(): Promise<number> {
    try {
        // Use Coinbase API (public, no key needed, high reliability)
        const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot', {
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            throw new Error('Failed to fetch ETH price');
        }

        const data = await response.json();
        const price = parseFloat(data.data.amount);

        if (isNaN(price) || price <= 0) {
            throw new Error('Invalid price data');
        }

        return price;
    } catch (error) {
        console.error('Error fetching ETH price:', error);
        // Fallback to a safe conservative estimate if API fails
        // $3000 is a safe fallback to ensure we don't undercharge too much if price spikes, 
        // but actually for "paying", a LOWER price means MORE ETH required.
        // So if we fallback to $3000 and real price is $4000, user pays 1/3000 ETH instead of 1/4000 ETH.
        // 1/3000 > 1/4000. So user pays MORE. This is safe for the seller.
        return 3000;
    }
}
