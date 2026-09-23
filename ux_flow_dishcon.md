# Alur UX (User Experience) Platform DishCon

Sebagai CEO, memahami perjalanan pengguna (*User Journey*) adalah kunci untuk memastikan visi bisnis "Marketplace Kantong Surplus" berjalan lancar, efisien, dan memberikan *value* bagi semua pihak. Berikut adalah alur UX untuk ketiga aktor utama di dalam platform DishCon.

---

## 1. Alur Mitra UMKM (Penjual Surplus)
**Fokus UX:** Cepat, Ringkas, dan Meminimalisir Beban Kognitif di Tengah Kesibukan Jualan.

```mermaid
flowchart TD
    A[Registrasi/Login Akun Mitra] --> B{Akun Baru?};
    B -- Ya --> C[Posting Kantong Surplus Pertama];
    C --> D[Menunggu Verifikasi Admin (Sekali Saja)];
    B -- Tidak (Sudah Terverifikasi) --> E[Posting Kantong Surplus];
    E --> F[Listing Langsung Tayang di Katalog];
    F --> G[Mahasiswa Memesan (Status: Reserved)];
    D -- Diverifikasi --> F;
    
    G --> H[Notifikasi Masuk ke Dasbor Mitra];
    H --> I[Mahasiswa Datang ke Toko & Menunjukkan Kode 6-Digit];
    I --> J[Mitra Memasukkan Kode ke Dasbor];
    J --> K{Kode Valid?};
    K -- Ya --> L[Status Selesai: Stok Berkurang, Pendapatan Bertambah];
    K -- Tidak --> I;
    
    F --> M[Terjual Habis Offline?];
    M --> N[Klik 'Tandai Habis' di Dasbor];
```

**Skenario Harian Mitra:**
1. **Tutup Toko Semakin Dekat:** Mitra melihat ada sisa 5 porsi nasi ayam.
2. **Posting Cepat:** Mitra membuka DishCon, memfoto sisa makanan, memasukkan harga diskon, batas waktu ambil, dan lokasi GPS (dengan bantuan AI untuk gizi/kedaluwarsa).
3. **Menerima Pesanan:** Tanpa perlu *approve* pesanan satu per satu, pesanan masuk otomatis memotong stok.
4. **Serah Terima:** Mahasiswa datang, mitra cukup mengetik kode 6 digit dari layar mahasiswa ke Dasbor DishCon. Selesai!

---

## 2. Alur Mahasiswa (Pembeli Surplus)
**Fokus UX:** Transparan, Menggiurkan (Fokus pada Penghematan), dan Kepastian Stok.

```mermaid
flowchart TD
    A[Buka Aplikasi & Login] --> B[Masuk Halaman Katalog Utama];
    B --> C[Eksplorasi Kantong Surplus Terdekat];
    C --> D[Melihat Detail Jarak, Harga Diskon, Gizi & Sisa Waktu];
    D --> E[Klik 'Pesan Sekarang'];
    
    E --> F[Dialog Konfirmasi Sticky UI];
    F -- Batal --> C;
    F -- Konfirmasi --> G[Tiket Digital Diterbitkan (Status: Reserved)];
    
    G --> H{Aksi Selanjutnya};
    H -- Berubah Pikiran --> I[Klik 'Batalkan Pesanan'];
    I --> B;
    H -- Berangkat --> J[Tiba di Lokasi Warung/Mitra];
    
    J --> K[Tunjukkan Kode Pengambilan (Tiket Digital)];
    K --> L[Mitra Verifikasi Kode];
    L --> M[Transaksi Selesai & Makanan Diselamatkan!];
```

**Skenario Harian Mahasiswa:**
1. **Mencari Makan Murah:** Mahasiswa lapar di malam hari, membuka DishCon. 
2. **Katalog Dekat Kos:** Melihat *listing* berlabel diskon 50% di warung radius 500 meter.
3. **Pemesanan Instan:** Mahasiswa memesan tanpa perlu *chat* dengan penjual. Sistem mengunci stok *(reserve)*.
4. **Pengambilan:** Mahasiswa berjalan ke warung, menunjukkan Tiket Digital berisi Kode Pengambilan di layar ponselnya, membawa pulang makanan, dan menghemat uang jajan bulanan.

---

## 3. Alur Admin (Pengawas & Fasilitator)
**Fokus UX:** Pemantauan Skala Besar (*Helicopter View*) dan Intervensi Cepat.

```mermaid
flowchart TD
    A[Login Admin Dashboard] --> B[Pemantauan Statistik Global];
    
    B --> C[Verifikasi Mitra Baru];
    C --> D[Cek Foto, Legalitas/Kelayakan];
    D -- Lolos --> E[Akun Terverifikasi];
    D -- Tidak Lolos --> F[Akun Ditangguhkan];
    
    B --> G[Pemantauan Listing Aktif];
    G --> H{Ada Pelanggaran Keamanan Pangan?};
    H -- Ya --> I[Klik 'Tarik Listing'];
    
    B --> J[Manajemen Pengaduan (Complaints)];
    J --> K[Tindak Lanjut & Beri Status 'Selesai'];
```

**Skenario Harian Admin:**
1. **Verifikasi Keamanan (Onboarding):** Setiap ada warung UMKM baru yang mendaftar, admin akan melihat *listing* pertamanya. Jika logis dan aman, admin menekan tombol "Verifikasi".
2. **Quality Control:** Jika ada pengaduan dari mahasiswa mengenai kualitas makanan yang sudah basi, admin bisa langsung mengubah status *listing* tersebut menjadi ditarik (*takedown*) secara instan.
3. **Analisis Data:** Memantau metrik total makanan yang diselamatkan dan total rupiah yang dihemat untuk keperluan laporan dampak lingkungan (ESG) atau pelaporan bisnis.

---

> [!IMPORTANT]
> **Mengapa Alur Ini Efektif Secara Bisnis?**
> Alur ini membuang hambatan "menunggu *approval* penjual" yang biasa ada di sistem donasi. Dengan menempatkannya sebagai **Marketplace (E-Commerce)**, mahasiswa bisa membeli seketika (mengunci stok) yang mana menciptakan rasa urgensi (FOMO), dan mitra tidak perlu repot membalas *chat* di tengah kesibukannya berbenah menutup toko.
