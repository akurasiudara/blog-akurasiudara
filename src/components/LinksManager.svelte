<script>
    import { onMount } from 'svelte';
    import { supabase } from '../lib/supabase';

    let links = [];
    let linkIdToDelete = null;
    let deleteModal;

    async function loadLinks() {
        const { data } = await supabase.from('links').select('*').order('sort_order');
        links = data || [];
    }

    onMount(() => {
        loadLinks();
        // Ambil 'Modal' dari objek global 'bootstrap'
        const Modal = window.bootstrap.Modal;
        deleteModal = new Modal(document.getElementById('deleteLinkModal'));
    });

    function openConfirmModal(id) {
        linkIdToDelete = id;
        deleteModal.show();
    }

    async function confirmDelete() {
        if (!linkIdToDelete) return;

        const response = await fetch(`/api/links/${linkIdToDelete}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadLinks();
        } else {
            alert('Gagal menghapus link.');
        }

        deleteModal.hide();
        linkIdToDelete = null;
    }
</script>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="h4">Manajemen Link</h3>
    <button class="btn btn-primary">Tambah Link Baru</button>
</div>

<div class="table-responsive">
    <table class="table table-hover align-middle">
        <thead>
            <tr>
                <th>Judul</th>
                <th>URL</th>
                <th class="text-end">Aksi</th>
            </tr>
        </thead>
        <tbody>
            {#each links as link (link.id)}
                <tr>
                    <td>{link.title}</td>
                    <td><a href={link.url} target="_blank">{link.url}</a></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-2">Ubah</button>
                        <button class="btn btn-sm btn-outline-danger" on:click={() => openConfirmModal(link.id)}>
                            Hapus
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<div class="modal fade" id="deleteLinkModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Konfirmasi Hapus</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Apakah Anda yakin ingin menghapus link ini? Tindakan ini tidak dapat diurungkan.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger" on:click={confirmDelete}>Ya, Hapus</button>
            </div>
        </div>
    </div>
</div>