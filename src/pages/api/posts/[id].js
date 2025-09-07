import { createSupabaseServerClient } from '../../../lib/supabase-server';

export const prerender = false;

// Method untuk UPDATE
export const PUT = async ({ params, request, cookies }) => {
    const { id } = params;
    const supabase = createSupabaseServerClient(cookies);
    const postData = await request.json();

    const { error } = await supabase.from('posts').update(postData).eq('id', id);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Post updated' }), { status: 200 });
};

// Method untuk DELETE (tetap ada)
export const DELETE = async ({ params, cookies }) => {
    const { id } = params;
    const supabase = createSupabaseServerClient(cookies);

    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Post deleted' }), { status: 200 });
};