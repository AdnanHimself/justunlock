-- Create purchases table to track individual transactions
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id TEXT REFERENCES public.links(id) ON DELETE CASCADE,
    buyer_address TEXT NOT NULL,
    amount NUMERIC NOT NULL, -- Storing as numeric to handle both USDC (6 decimals) and ETH (18 decimals) values if needed, or just raw units
    token_address TEXT NOT NULL, -- Address of token used (USDC) or 0x00... for ETH
    transaction_hash TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid errors on re-run
DROP POLICY IF EXISTS "Creators can view purchases for their links" ON public.purchases;
DROP POLICY IF EXISTS "Purchases are viewable by everyone" ON public.purchases;

-- Policy: Creators can view purchases for their own links
-- (Keeping the logic simple for now as discussed)
-- CREATE POLICY "Creators can view purchases for their links"
-- ON public.purchases
-- FOR SELECT
-- USING (
--     EXISTS (
--         SELECT 1 FROM public.links
--         WHERE public.links.id = public.purchases.link_id
--         AND public.links.receiver_address = current_user
--     )
-- );

-- Allow public read for simplicity as it's on-chain data.
-- We can refine this later if we add proper authentication.
CREATE POLICY "Purchases are viewable by everyone"
ON public.purchases
FOR SELECT
USING (true);

-- Grant access to anon/authenticated for reading (if we use public client)
GRANT SELECT ON public.purchases TO anon, authenticated;
GRANT INSERT ON public.purchases TO service_role;
