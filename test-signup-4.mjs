import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mfhitjwimeuxctvwmrpo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key';

async function testSignup4() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  console.log('Attempting signup with phone...');
  const { data, error } = await supabase.auth.signUp({
    email: 'test_phone_' + Date.now() + '@example.com',
    password: 'password123',
    options: {
      data: {
        name: 'Test User',
        role: 'mahasiswa',
        phone: '08123456789'
      }
    }
  });

  if (error) {
    console.error('Signup Failed:', error);
  } else {
    console.log('Signup Success:', data);
  }
}

testSignup4();
