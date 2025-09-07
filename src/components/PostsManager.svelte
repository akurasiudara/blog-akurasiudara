<script>
    import { onMount } from 'svelte';
    import { supabase } from '../lib/supabase';
    import PostEditor from './PostEditor.svelte';

    let posts = [];
    let postIdToDelete = null;
    let postToEdit = null; 
    let isLoadingPost = false;
    
    let deleteModal;
    let editorModal;
    
    // State for the success notification
    let showNotification = false;
    let notificationMessage = '';

    async function loadPosts() {
        const { data } = await supabase.from('posts').select('id, title, created_at').order('created_at', { ascending: false });
        posts = data || [];
    }

    onMount(() => {
        loadPosts();
        // Initialize Bootstrap Modals from the global window object
        const BootstrapModal = window.bootstrap.Modal;
        deleteModal = new BootstrapModal(document.getElementById('deletePostModal'));
        editorModal = new BootstrapModal(document.getElementById('editorPostModal'));
    });

    // --- Delete Logic ---
    function openConfirmModal(id) {
        postIdToDelete = id;
        deleteModal.show();
    }
    async function confirmDelete() {
        if (!postIdToDelete) return;

        const response = await fetch(`/api/posts/${postIdToDelete}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadPosts();
        } else {
            alert('Gagal menghapus postingan.');
        }

        deleteModal.hide();
        postIdToDelete = null;
    }

    // --- Add & Edit Logic ---
    async function openEditorModal(post = null) {
        if (post && post.id) {
            // Edit Mode: Fetch the full post data
            isLoadingPost = true;
            editorModal.show();
            const { data: fullPost, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', post.id)
                .single();
            
            if (fullPost) {
                postToEdit = fullPost;
            } else {
                alert('Gagal mengambil data postingan.');
                editorModal.hide();
            }
            isLoadingPost = false;
        } else {
            // Add Mode: Open with an empty object
            postToEdit = {}; 
            editorModal.show();
        }
    }

    // This function is called when the 'save' event is dispatched from PostEditor
    function onSave() {
        editorModal.hide();
        loadPosts();
        
        // Show the success notification
        notificationMessage = 'Postingan berhasil diperbarui!';
        showNotification = true;
        setTimeout(() => {
            showNotification = false;
        }, 3000); // Hide notification after 3 seconds
    }
</script>

{#if showNotification}
    <div class="toast show align-items-center text-bg-success border-0 position-fixed top-0 end-0 m-3" style="z-index: 1100;">
        <div class="d-flex">
            <div class="toast-body">
                {notificationMessage}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" on:click={() => showNotification = false}></button>
        </div>
    </div>
{/if}

<div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="h4">Manajemen Postingan</h3>
    <button class="btn btn-primary" on:click={() => openEditorModal()}>Tambah Postingan Baru</button>
</div>

<div class="table-responsive">
    <table class="table table-hover align-middle">
        <thead>
            <tr>
                <th>Judul</th>
                <th>Tanggal Dibuat</th>
                <th class="text-end">Aksi</th>
            </tr>
        </thead>
        <tbody>
            {#each posts as post (post.id)}
                <tr>
                    <td>{post.title}</td>
                    <td>{new Date(post.created_at).toLocaleDateString('id-ID')}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-2" on:click={() => openEditorModal(post)}>Ubah</button>
                        <button class="btn btn-sm btn-outline-danger" on:click={() => openConfirmModal(post.id)}>Hapus</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<div class="modal fade" id="deletePostModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Konfirmasi Hapus</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat diurungkan.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger" on:click={confirmDelete}>Ya, Hapus</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="editorPostModal" tabindex="-1" data-bs-backdrop="static" aria-labelledby="editorModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editorModalLabel">{postToEdit && postToEdit.id ? 'Ubah Postingan' : 'Tambah Postingan Baru'}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {#if isLoadingPost}
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p>Memuat data editor...</p>
                    </div>
                {:else if postToEdit}
                    <PostEditor client:only="svelte" post={postToEdit} on:save={onSave} on:cancel={() => editorModal.hide()} />
                {/if}
            </div>
        </div>
    </div>
</div>