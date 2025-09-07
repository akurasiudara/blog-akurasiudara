import { createSupabaseServerClient } from '../../lib/supabase-server';

// PERBAIKAN: Beritahu Astro untuk tidak membuat halaman ini menjadi statis
export const prerender = false;

export const POST = async ({ request, cookies, redirect }) => {
  const { email, password } = await request.json();
  const supabase = createSupabaseServerClient(cookies);

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect('/dashboard');
};