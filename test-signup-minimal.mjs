import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mfhitjwimeuxctvwmrpo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key';

async function testSignup() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  console.log('Attempting minimal signup...');
  const { data, error } = await supabase.auth.signUp({
    email: 'test_minimal_' + Date.now() + '@example.com',
    password: 'password123',
    // NO metadata
  });

  if (error) {
    console.error('Minimal Signup Failed:', error);
  } else {
    console.log('Minimal Signup Success:', data);
  }
}

testSignup();
