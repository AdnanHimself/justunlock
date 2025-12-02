import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabaseAdmin } from '@/lib/supabase-admin';

async function main() {
    console.log('Fetching links...');
    const { data: links, error } = await supabaseAdmin
        .from('links')
        .select('*')
        .limit(10);

    if (error) {
        console.error('Error fetching links:', error);
        return;
    }

    console.log('Links found:', links.length);
    if (links.length > 0) {
        console.log('First link keys:', Object.keys(links[0]));
        console.log('First link data:', links[0]);

        // Check for undefined IDs
        const invalidLinks = links.filter((l: any) => !l.id);
        if (invalidLinks.length > 0) {
            console.log('Found links with missing ID:', invalidLinks);
        } else {
            console.log('All fetched links have an ID.');
        }
    }
}

main();
