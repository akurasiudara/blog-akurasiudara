<script>
    let loading = false;
    let message = '';
    let messageType = 'danger';
    let email = '';
    let password = '';

    async function handleLogin(event) {
        loading = true;
        message = '';
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            // Pastikan URL-nya benar: "/api/login"
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data)
            });

            // Cek apakah server merespons (bahkan jika ada eror login)
            if (!response) {
                throw new Error("Tidak ada respons dari server. Pastikan server berjalan.");
            }

            if (!response.ok) {
                const errorText = await response.text();
                if (errorText.includes('Invalid login credentials')) {
                    throw new Error('Email atau password yang Anda masukkan salah.');
                }
                throw new Error(errorText || "Terjadi kesalahan pada server.");
            }

            messageType = 'success';
            message = 'Login berhasil! Mengarahkan ke dashboard...';
            window.location.href = '/dashboard';

        } catch (e) {
            messageType = 'danger';
            // Menampilkan pesan NetworkError dengan lebih jelas
            if (e instanceof TypeError && e.message.includes('NetworkError')) {
                message = "Koneksi ke server gagal. Periksa koneksi internet Anda dan pastikan server development sedang berjalan.";
            } else {
                message = e.message;
            }
        } finally {
            loading = false;
        }
    }
</script>

<form on:submit|preventDefault={handleLogin}>
    {#if message}
        <div class="alert alert-{messageType}">{message}</div>
    {/if}
    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" name="email" id="email" bind:value={email} required disabled={loading}>
    </div>
    <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" name="password" id="password" bind:value={password} required disabled={loading}>
    </div>
    <div class="d-grid">
        <button type="submit" class="btn btn-primary btn-lg" disabled={loading}>
            {#if loading}
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Memuat...
            {:else}
                Masuk
            {/if}
        </button>
    </div>
</form>