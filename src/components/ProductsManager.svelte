<script>
    import { onMount } from 'svelte';
    import { supabase } from '../lib/supabase';

    let products = [];
    let productIdToDelete = null;
    let deleteModal;

    async function loadProducts() {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        products = data || [];
    }

    onMount(() => {
        loadProducts();
        // Ambil 'Modal' dari objek global 'bootstrap'
        const Modal = window.bootstrap.Modal;
        deleteModal = new Modal(document.getElementById('deleteProductModal'));
    });

    function openConfirmModal(id) {
        productIdToDelete = id;
        deleteModal.show();
    }

    async function confirmDelete() {
        if (!productIdToDelete) return;

        const response = await fetch(`/api/products/${productIdToDelete}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadProducts();
        } else {
            alert('Gagal menghapus produk.');
        }

        deleteModal.hide();
        productIdToDelete = null;
    }
</script>

<div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="h4">Manajemen Produk</h3>
    <button class="btn btn-primary">Tambah Produk Baru</button>
</div>

<div class="table-responsive">
    <table class="table table-hover align-middle">
        <thead>
            <tr>
                <th>Nama Produk</th>
                <th class="text-end">Aksi</th>
            </tr>
        </thead>
        <tbody>
            {#each products as product (product.id)}
                <tr>
                    <td>{product.name}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-2">Ubah</button>
                        <button class="btn btn-sm btn-outline-danger" on:click={() => openConfirmModal(product.id)}>
                            Hapus
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<div class="modal fade" id="deleteProductModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Konfirmasi Hapus</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat diurungkan.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-danger" on:click={confirmDelete}>Ya, Hapus</button>
            </div>
        </div>
    </div>
</div>