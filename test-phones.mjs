import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mfhitjwimeuxctvwmrpo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key';

async function testPhones() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Create a minimal user first
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test_phones_' + Date.now() + '@example.com',
    password: 'password123',
    options: {
      data: {
        name: 'Test User',
        role: 'mahasiswa'
      }
    }
  });

  const userId = authData.user.id;
  
  const phonesToTest = [
    '',
    '08123456789',
    '+628123456789',
    '123',
    '0812-3456-789',
    null,
    ' '
  ];

  for (const phone of phonesToTest) {
    const { error } = await supabase.from('profiles').update({ phone }).eq('id', userId);
    console.log(`Phone: ${phone === null ? 'null' : '"' + phone + '"'} -> ${error ? 'Failed' : 'Success'}`);
  }
}

testPhones();
