import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        const { slug, title, price, receiver_address, target_url } = await req.json();

        if (!slug || !price || !receiver_address || !target_url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Insert public metadata into 'links'
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
            console.error('Link creation error:', linkError);
            return NextResponse.json({ error: 'Failed to create link metadata' }, { status: 500 });
        }

        // 2. Insert private secret into 'secrets'
        const { error: secretError } = await supabaseAdmin
            .from('secrets')
            .insert({
                link_id: slug,
                target_url: target_url,
            });

        if (secretError) {
            console.error('Secret creation error:', secretError);
            // Rollback: Delete the link if secret creation fails
            await supabaseAdmin.from('links').delete().eq('id', slug);
            return NextResponse.json({ error: 'Failed to save secret' }, { status: 500 });
        }

        return NextResponse.json({ success: true, slug });

    } catch (error) {
        console.error('Create API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
