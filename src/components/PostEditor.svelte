<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import EasyMDE from 'easymde';

    export let post = null;

    // Deklarasikan variabel form
    let title = '';
    let content = '';
    let category = '';
    let slug = '';

    let textareaEl;
    let easymde;
    const dispatch = createEventDispatcher();

    // PERBAIKAN: Gunakan Svelte Reactive Statement ($:) untuk mengisi form
    // Blok kode ini akan berjalan setiap kali nilai 'post' berubah
    $: if (post) {
        // Jika ada data 'post', isi form dengan datanya
        title = post.title || '';
        content = post.content || '';
        category = post.category || '';
        slug = post.slug || '';
        if (easymde) {
            easymde.value(content); // Update isi editor EasyMDE
        }
    } else {
        // Jika 'post' null (mode Tambah Baru), kosongkan form
        title = '';
        content = '';
        category = '';
        slug = '';
        if (easymde) {
            easymde.value('');
        }
    }

    onMount(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/easymde/dist/easymde.min.css';
        document.head.appendChild(link);

        link.onload = () => {
            if (textareaEl) {
                easymde = new EasyMDE({ 
                    element: textareaEl,
                    spellChecker: false,
                    initialValue: content
                });
            }
        };
    });

    async function handleSave() {
        const { supabase } = await import('../lib/supabase');
        const postData = { title, slug, category, content: easymde.value() };
        let response;

        if (post && post.id) {
            // Mode Ubah (UPDATE)
            response = await fetch(`/api/posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });
        } else {
            // Mode Tambah (CREATE)
            response = await fetch(`/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });
        }

        if (response.ok) {
            dispatch('save');
        } else {
            alert('Gagal menyimpan postingan.');
        }
    }
</script>

<div class="mb-3">
    <label for="post-title" class="form-label">Judul Postingan</label>
    <input type="text" id="post-title" class="form-control" bind:value={title}>
</div>
<div class="mb-3">
    <label for="post-slug" class="form-label">Slug (URL)</label>
    <input type="text" id="post-slug" class="form-control" bind:value={slug}>
</div>
<div class="mb-3">
    <label for="post-category" class="form-label">Kategori</label>
    <input type="text" id="post-category" class="form-control" bind:value={category}>
</div>
<div class="mb-3">
    <label class="form-label">Isi Konten</label>
    <textarea bind:this={textareaEl}></textarea>
</div>
<button class="btn btn-primary" on:click={handleSave}>Simpan</button>
<button class="btn btn-secondary ms-2" on:click={() => dispatch('cancel')}>Batal</button>