<script>
    import PostsManager from './PostsManager.svelte';
    import ProductsManager from './ProductsManager.svelte';
    import LinksManager from './LinksManager.svelte';

    let activeTab = 'posts';

    async function handleLogout() {
        const { supabase } = await import('../lib/supabase');
        await supabase.auth.signOut();
        window.location.href = '/';
    }
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="display-5 fw-bold">Dashboard</h1>
    <button class="btn btn-danger" on:click={handleLogout}>Logout</button>
</div>

<ul class="nav nav-tabs mb-4">
    <li class="nav-item">
        <button class="nav-link" class:active={activeTab === 'posts'} on:click={() => activeTab = 'posts'}>Postingan</button>
    </li>
    <li class="nav-item">
        <button class="nav-link" class:active={activeTab === 'products'} on:click={() => activeTab = 'products'}>Produk</button>
    </li>
    <li class="nav-item">
        <button class="nav-link" class:active={activeTab === 'links'} on:click={() => activeTab = 'links'}>Link</button>
    </li>
</ul>

<div>
    {#if activeTab === 'posts'}
        <PostsManager client:only="svelte" />
    {:else if activeTab === 'products'}
        <ProductsManager client:only="svelte" />
    {:else if activeTab === 'links'}
        <LinksManager client:only="svelte" />
    {/if}
</div>