import { createSupabaseServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const POST = async ({ request, cookies }) => {
    const supabase = createSupabaseServerClient(cookies);
    const postData = await request.json();

    const { error } = await supabase.from('posts').insert([postData]);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Post created' }), { status: 201 });
};