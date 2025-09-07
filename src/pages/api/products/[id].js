import { createSupabaseServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const DELETE = async ({ params, cookies }) => {
    const { id } = params;
    const supabase = createSupabaseServerClient(cookies);

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
};