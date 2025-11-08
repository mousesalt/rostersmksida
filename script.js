document.addEventListener('DOMContentLoaded', function() {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const periods = 9;
    const tableBody = document.querySelector('tbody');
    const clearButton = document.getElementById('clearButton');

    /**
     * Fungsi untuk memuat data dari localStorage saat halaman dibuka
     */
    function loadSchedule() {
        tableBody.innerHTML = ''; // Kosongkan tabel sebelum diisi
        days.forEach(day => {
            const row = document.createElement('tr');
            
            // Sel untuk nama hari
            const dayCell = document.createElement('td');
            dayCell.className = 'p-3 whitespace-nowrap font-medium text-gray-800 bg-gray-50';
            dayCell.textContent = day;
            row.appendChild(dayCell);

            // Sel untuk jam pelajaran
            for (let i = 1; i <= periods; i++) {
                const cell = document.createElement('td');
                cell.className = 'p-2 align-top h-24'; // align-top agar konten mulai dari atas
                
                // ID unik untuk setiap sel (contoh: senin-1-subject)
                const subjectId = `${day.toLowerCase()}-${i}-subject`;
                const teacherId = `${day.toLowerCase()}-${i}-teacher`;

                // Ambil data dari localStorage
                const savedSubject = localStorage.getItem(subjectId) || '';
                const savedTeacher = localStorage.getItem(teacherId) || '';

                // Buat div yang bisa diedit
                cell.innerHTML = `
                    <div 
                        id="${subjectId}"
                        contenteditable="true" 
                        data-placeholder="Mata Pelajaran..." 
                        class="p-1 rounded text-sm font-semibold text-gray-900 min-h-[28px] focus:z-10 relative"
                    >${savedSubject}</div>
                    
                    <div 
                        id="${teacherId}"
                        contenteditable="true" 
                        data-placeholder="Nama Guru..." 
                        class="p-1 rounded text-xs text-gray-600 min-h-[24px] mt-1 focus:z-10 relative"
                    >${savedTeacher}</div>
                `;
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
        });
    }

    /**
     * Fungsi untuk menyimpan data ke localStorage
     * Menggunakan event delegation untuk efisiensi
     */
    function saveSchedule(event) {
        const target = event.target;
        // Hanya simpan jika target adalah elemen contenteditable
        if (target.hasAttribute('contenteditable')) {
            // ID elemen adalah key di localStorage
            localStorage.setItem(target.id, target.innerHTML);
        }
    }

    /**
     * Fungsi untuk mengosongkan semua data
     */
    function clearSchedule() {
        // Konfirmasi pengguna sebelum menghapus
        // Menggunakan modal kustom sederhana karena alert/confirm diblokir
        showModal('Apakah Anda yakin ingin mengosongkan seluruh roster? Aksi ini tidak dapat dibatalkan.', () => {
            localStorage.clear();
            loadSchedule(); // Muat ulang tabel (jadi kosong)
        });
    }

    // --- Event Listeners ---

    // Muat jadwal saat halaman dibuka
    loadSchedule();

    // Tambahkan listener 'input' ke seluruh tabel
    // 'input' akan aktif setiap kali ada perubahan di [contenteditable]
    tableBody.addEventListener('input', saveSchedule);
    
    // Tambahkan listener ke tombol 'Kosongkan Roster'
    clearButton.addEventListener('click', clearSchedule);

    /**
     * Pengganti 'confirm' standar yang mungkin diblokir.
     * Membuat modal kustom sederhana untuk konfirmasi.
     * @param {string} message - Pesan yang akan ditampilkan di modal.
     * @param {function} onConfirm - Callback function yang dijalankan jika pengguna menekan 'Ya'.
     */
    function showModal(message, onConfirm) {
        // Hapus modal lama jika ada
        const existingOverlay = document.getElementById('modal-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const modal = document.createElement('div');
        modal.className = 'bg-white p-6 rounded-lg shadow-xl max-w-sm w-full';
        modal.innerHTML = `
            <h3 class="text-lg font-semibold mb-4">Konfirmasi</h3>
            <p class="text-gray-700 mb-6">${message}</p>
            <div class="flex justify-end space-x-3">
                <button id="modalCancel" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Batal</button>
                <button id="modalConfirm" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">Ya, Hapus</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('modalConfirm').onclick = () => {
            document.body.removeChild(overlay);
            if (onConfirm) {
                onConfirm(); // Jalankan callback konfirmasi
            }
        };

        document.getElementById('modalCancel').onclick = () => {
            document.body.removeChild(overlay);
        };
    }
});
