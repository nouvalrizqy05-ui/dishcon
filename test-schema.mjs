import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mfhitjwimeuxctvwmrpo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key';

async function testQuery() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  console.log('Attempting to query admin_email_allowlist...');
  const { data, error } = await supabase.from('admin_email_allowlist').select('*').limit(1);

  if (error) {
    console.error('Query Failed:', error);
  } else {
    console.log('Query Success:', data);
  }
}

testQuery();
