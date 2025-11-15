document.addEventListener('DOMContentLoaded', () => {
    // Sembunyikan sidebar sebelum JS siap
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.add('sidebar-hidden');
        // Pastikan tidak ada transition yang aktif sebelum JS siap
        sidebar.style.transition = 'none';
    }
    // --- PAGE TRANSITION ANIMATION ---
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = 0;
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.4s';
            mainContent.style.opacity = 1;
        }, 50);
    }

    // Tambahkan event ke semua link internal untuk animasi fade-out
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Buka di tab baru atau external link, skip
            if (this.target === '_blank' || this.href.indexOf(window.location.host) === -1) return;
            e.preventDefault();
            if (mainContent) {
                mainContent.style.opacity = 1;
                mainContent.style.transition = 'opacity 0.3s';
                mainContent.style.opacity = 0;
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            } else {
                window.location.href = this.href;
            }
        });
    });

    // --- SIDEBAR FUNCTIONALITY ---
    const toggleButton = document.getElementById('toggle-btn');
    const isMobile = () => window.innerWidth <= 800;

    // SVG Icons
    const iconOpen = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="m313-480 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
        </svg>`; // << icon
    const iconClosed = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
        </svg>`; // >> icon

    // Function to apply sidebar state and icon
    const applySidebarState = () => {
        if (!sidebar || !toggleButton) return;
        // Sidebar selalu close di mobile
        if (isMobile()) {
            sidebar.classList.add('close');
            toggleButton.innerHTML = iconClosed;
            return;
        }
        const state = localStorage.getItem('sidebarState') || 'open';
        if (state === 'closed') {
            sidebar.classList.add('close');
            toggleButton.innerHTML = iconClosed;
        } else {
            sidebar.classList.remove('close');
            toggleButton.innerHTML = iconOpen;
        }
    };
    
    // Toggle sidebar on button click
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            if (isMobile()) return;
            const isClosed = sidebar.classList.contains('close');
            localStorage.setItem('sidebarState', isClosed ? 'open' : 'closed');
            applySidebarState();
        });
    }

    // Initial setup
    applySidebarState();
    // Setelah state diterapkan, tampilkan sidebar dengan transisi normal
    if (sidebar) {
        setTimeout(() => {
            sidebar.classList.remove('sidebar-hidden');
            sidebar.style.transition = '';
        }, 0);
    }
    window.addEventListener('resize', applySidebarState);

    // --- THEME TOGGLE FUNCTIONALITY (TAMBAHKAN KODE INI) ---
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Fungsi untuk menerapkan tema yang tersimpan di localStorage
    const applyTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        // Default ke dark mode jika tidak ada yang tersimpan
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    };

    // Fungsi untuk mengubah tema saat tombol diklik
    const toggleTheme = () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark'); // Simpan pilihan ke 'dark'
        } else {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light'); // Simpan pilihan ke 'light'
        }
    };

    // Tambahkan event listener ke tombol
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Terapkan tema yang benar saat halaman pertama kali dimuat
    applyTheme();

});