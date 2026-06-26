import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('No credentials!');
  process.exit(0);
}

async function run() {
  const url = `${supabaseUrl}/rest/v1/contacts`;
  console.log('OPTIONS request to:', url);
  
  const response = await fetch(url, {
    method: 'OPTIONS',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });
  
  console.log('Status:', response.status);
  for (const [key, value] of response.headers.entries()) {
    console.log(`${key}: ${value}`);
  }
  const text = await response.text();
  console.log('Body:', text);
}

run().catch(console.error);
