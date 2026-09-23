import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mfhitjwimeuxctvwmrpo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key';

async function testInsert() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Create a minimal user first
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test_insert_' + Date.now() + '@example.com',
    password: 'password123',
    options: {
      data: {
        name: 'Test User',
        role: 'mahasiswa'
      }
    }
  });

  if (authError) {
    console.error('Signup Failed:', authError);
    return;
  }
  
  const userId = authData.user.id;
  console.log('Signup Success, User ID:', userId);

  // Now try to update the profile with phone
  const { data, error } = await supabase.from('profiles').update({
    phone: '08123456789'
  }).eq('id', userId);

  if (error) {
    console.error('Update Failed:', error);
  } else {
    console.log('Update Success:', data);
  }
}

testInsert();
