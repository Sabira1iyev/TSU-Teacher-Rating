import 'server-only';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey){
    throw new Error("Supabase environment veriables are missing.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
        autoRefreshToken:false,
        persistSession:false,
        detectSessionInUrl:false,
    },
},
);