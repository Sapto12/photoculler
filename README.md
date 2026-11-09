# AI Photo Culling (Pro Edition)

Aplikasi web minimalis dan modern berbasis **Next.js** untuk menyortir ratusan foto secara otomatis menggunakan **AI lokal di browser** (tanpa upload ke server luar, 100% privasi aman). Dirancang khusus dengan standar penilaian fotografer profesional (ketajaman fokus, exposure, dan komposisi).

---

##  Fitur Utama

- **100% Lokal & Privasi Terjaga:** Memproses analisis gambar langsung di perangkat pengguna (RAM/GPU lokal) tanpa menyimpannya ke server manapun.
- **Standar Culling Profesional:** Algoritma cerdas yang mendeteksi *motion blur*, salah fokus, *overexposure* (highlight silau), dan *underexposure* (terlalu gelap).
- **Drag & Drop Upload:** Mendukung unggah ratusan berkas foto sekaligus (JPG, PNG, WEBP).
- **Lightbox Viewer Utuh (Tanpa Crop):** Pratinjau foto resolusi asli secara penuh saat diklik.
- **Navigasi Cepat (Keyboard Shortcuts):** Mendukung tombol panah keyboard (`←` / `→`) dan angka (`1` untuk Bagus, `2` untuk Ragu, `3` untuk Jelek).
- **Export Arsip ZIP:** Mengunduh hasil sortir yang otomatis dikelompokkan ke dalam folder terpisah (`Bagus_Pro`, `Ragu_Review`, `Jelek_Discard`).

---

##  Standar Kriteria Penilaian AI (Ala Fotografer Profesional)

AI dalam aplikasi ini bekerja secara objektif berdasarkan 3 pilar utama:

1. **Kelayakan Teknis (Kriteria Eliminasi Utama):**
   - **Ketajaman Fokus (Focus & Sharpness):** Mendeteksi kontras tepi (*edge variance*). Foto yang mengalami *motion blur* atau meleset titik fokusnya otomatis dikategorikan ke **Jelek**.
   - **Pencahayaan & Eksposur (Exposure Accuracy):** Mendeteksi *clipping* piksel ekstrim untuk mencegah bagian silau (*overexposed*) atau terlalu gelap gulita (*underexposed*).
2. **Estetika & Zona Review:**
   - Foto yang memiliki fokus lembut (*soft focus*) atau pencahayaan unik tidak langsung dibuang, melainkan dimasukkan ke kategori **Ragu-ragu** untuk ditinjau ulang oleh fotografer.
3. **Penyortiran Transparan:**
   - Setiap kartu foto menampilkan **skor ketajaman (0-100)** dan **alasan penilaian teknis** secara rinci.

---

##  Kebutuhan Sistem & Package yang Digunakan

Proyek ini dibangun menggunakan *stack* modern berikut:

- **Node.js** (Versi 18.x atau terbaru)
- **Framework:** Next.js (App Router, JavaScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Typography:** Plus Jakarta Sans
- **Icon Library:** Lucide React (`lucide-react`)
- **Engine AI Lokal:** Transformers.js (`@huggingface/transformers`)
- **Zip Generator:** JSZip (`jszip`)

---

##  Langkah-Langkah Instalasi (Setup Lokal)

Ikuti langkah di bawah ini untuk menjalankan proyek di komputer lokalmu:

### 1. Clone Repository & Masuk ke Folder Proyek
```bash
git clone https://github.com/Sapto12/photoculler.git
cd photoculler
```

### 2. Inisialisasi Proyek & Depedensi Dasar (Jika Buat Dari Nol)
```bash
# Inisialisasi Next.js
npx create-next-app@latest ai-photo-culling

# Inisialisasi shadcn/ui
npx shadcn@latest init

# Tambah Komponen UI
npx shadcn@latest add button card tabs badge progress dialog
```

### 3. Instalasi Package Utama
Jalankan perintah berikut di terminal untuk menginstal seluruh dependensi pendukung:
```bash
npm install lucide-react @huggingface/transformers jszip
```

### 4. Jalankan Server Development Lokal
```bash
npm run dev
```

### 5. Buka di Browser
Buka browser favoritmu dan akses tautan berikut:
```text
http://localhost:3000
```

---

##  Panduan Keyboard Shortcuts (Dalam Mode Preview)

Saat kamu mengklik foto untuk melihat pratinjau layar penuh (Lightbox), gunakan tombol pintasan berikut untuk mempercepat proses sortir:
- **Panah Kanan (`→`)**: Pindah ke foto berikutnya.
- **Panah Kiri (`←`)**: Pindah ke foto sebelumnya.
- **Tombol `1`**: Ubah kategori foto menjadi **Bagus**.
- **Tombol `2`**: Ubah kategori foto menjadi **Ragu-ragu**.
- **Tombol `3`**: Ubah kategori foto menjadi **Jelek**.
- **Tombol `Esc`**: Menutup mode pratinjau.

---

##  Panduan Deploy ke Vercel

Aplikasi ini dapat dipublikasikan secara gratis menggunakan Vercel:

1. Pastikan perubahan kodemu sudah di-*commit* dan di-*push* ke GitHub:
   ```bash
   git add .
   git commit -m "penambahan fitur download, dan analisis pensortiran yang hampir sepadan dengan profesional"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/) dan login menggunakan akun GitHub.
3. Klik **Add New... > Project**, lalu pilih repository `photoculler`.
4. Biarkan pengaturan build otomatis dari Next.js, lalu klik **Deploy**.
5. Selesai! Website kamu akan langsung online dan siap digunakan di URL publik Vercel.# AI Photo Culling (Pro Edition)

Aplikasi web minimalis dan modern berbasis **Next.js** untuk menyortir ratusan foto secara otomatis menggunakan **AI lokal di browser** (tanpa upload ke server luar, 100% privasi aman). Dirancang khusus dengan standar penilaian fotografer profesional (ketajaman fokus, exposure, dan komposisi).

---

##  Fitur Utama

- **100% Lokal & Privasi Terjaga:** Memproses analisis gambar langsung di perangkat pengguna (RAM/GPU lokal) tanpa menyimpannya ke server manapun.
- **Standar Culling Profesional:** Algoritma cerdas yang mendeteksi *motion blur*, salah fokus, *overexposure* (highlight silau), dan *underexposure* (terlalu gelap).
- **Drag & Drop Upload:** Mendukung unggah ratusan berkas foto sekaligus (JPG, PNG, WEBP).
- **Lightbox Viewer Utuh (Tanpa Crop):** Pratinjau foto resolusi asli secara penuh saat diklik.
- **Navigasi Cepat (Keyboard Shortcuts):** Mendukung tombol panah keyboard (`←` / `→`) dan angka (`1` untuk Bagus, `2` untuk Ragu, `3` untuk Jelek).
- **Export Arsip ZIP:** Mengunduh hasil sortir yang otomatis dikelompokkan ke dalam folder terpisah (`Bagus_Pro`, `Ragu_Review`, `Jelek_Discard`).

---

##  Standar Kriteria Penilaian AI (Ala Fotografer Profesional)

AI dalam aplikasi ini bekerja secara objektif berdasarkan 3 pilar utama:

1. **Kelayakan Teknis (Kriteria Eliminasi Utama):**
   - **Ketajaman Fokus (Focus & Sharpness):** Mendeteksi kontras tepi (*edge variance*). Foto yang mengalami *motion blur* atau meleset titik fokusnya otomatis dikategorikan ke **Jelek**.
   - **Pencahayaan & Eksposur (Exposure Accuracy):** Mendeteksi *clipping* piksel ekstrim untuk mencegah bagian silau (*overexposed*) atau terlalu gelap gulita (*underexposed*).
2. **Estetika & Zona Review:**
   - Foto yang memiliki fokus lembut (*soft focus*) atau pencahayaan unik tidak langsung dibuang, melainkan dimasukkan ke kategori **Ragu-ragu** untuk ditinjau ulang oleh fotografer.
3. **Penyortiran Transparan:**
   - Setiap kartu foto menampilkan **skor ketajaman (0-100)** dan **alasan penilaian teknis** secara rinci.

---

##  Kebutuhan Sistem & Package yang Digunakan

Proyek ini dibangun menggunakan *stack* modern berikut:

- **Node.js** (Versi 18.x atau terbaru)
- **Framework:** Next.js (App Router, JavaScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Typography:** Plus Jakarta Sans
- **Icon Library:** Lucide React (`lucide-react`)
- **Engine AI Lokal:** Transformers.js (`@huggingface/transformers`)
- **Zip Generator:** JSZip (`jszip`)

---

##  Langkah-Langkah Instalasi (Setup Lokal)

Ikuti langkah di bawah ini untuk menjalankan proyek di komputer lokalmu:

### 1. Clone Repository & Masuk ke Folder Proyek
```bash
git clone https://github.com/Sapto12/photoculler.git
cd photoculler
```

### 2. Inisialisasi Proyek & Depedensi Dasar (Jika Buat Dari Nol)
```bash
# Inisialisasi Next.js
npx create-next-app@latest ai-photo-culling

# Inisialisasi shadcn/ui
npx shadcn@latest init

# Tambah Komponen UI
npx shadcn@latest add button card tabs badge progress dialog
```

### 3. Instalasi Package Utama
Jalankan perintah berikut di terminal untuk menginstal seluruh dependensi pendukung:
```bash
npm install lucide-react @huggingface/transformers jszip
```

### 4. Jalankan Server Development Lokal
```bash
npm run dev
```

### 5. Buka di Browser
Buka browser favoritmu dan akses tautan berikut:
```text
http://localhost:3000
```

---

##  Panduan Keyboard Shortcuts (Dalam Mode Preview)

Saat kamu mengklik foto untuk melihat pratinjau layar penuh (Lightbox), gunakan tombol pintasan berikut untuk mempercepat proses sortir:
- **Panah Kanan (`→`)**: Pindah ke foto berikutnya.
- **Panah Kiri (`←`)**: Pindah ke foto sebelumnya.
- **Tombol `1`**: Ubah kategori foto menjadi **Bagus**.
- **Tombol `2`**: Ubah kategori foto menjadi **Ragu-ragu**.
- **Tombol `3`**: Ubah kategori foto menjadi **Jelek**.
- **Tombol `Esc`**: Menutup mode pratinjau.

---

##  Panduan Deploy ke Vercel

Aplikasi ini dapat dipublikasikan secara gratis menggunakan Vercel:

1. Pastikan perubahan kodemu sudah di-*commit* dan di-*push* ke GitHub:
   ```bash
   git add .
   git commit -m "penambahan fitur download, dan analisis pensortiran yang hampir sepadan dengan profesional"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/) dan login menggunakan akun GitHub.
3. Klik **Add New... > Project**, lalu pilih repository `photoculler`.
4. Biarkan pengaturan build otomatis dari Next.js, lalu klik **Deploy**.
5. Selesai! Website kamu akan langsung online dan siap digunakan di URL publik Vercel.# AI Photo Culling (Pro Edition)

Aplikasi web minimalis dan modern berbasis **Next.js** untuk menyortir ratusan foto secara otomatis menggunakan **AI lokal di browser** (tanpa upload ke server luar, 100% privasi aman). Dirancang khusus dengan standar penilaian fotografer profesional (ketajaman fokus, exposure, dan komposisi).

---

##  Fitur Utama

- **100% Lokal & Privasi Terjaga:** Memproses analisis gambar langsung di perangkat pengguna (RAM/GPU lokal) tanpa menyimpannya ke server manapun.
- **Standar Culling Profesional:** Algoritma cerdas yang mendeteksi *motion blur*, salah fokus, *overexposure* (highlight silau), dan *underexposure* (terlalu gelap).
- **Drag & Drop Upload:** Mendukung unggah ratusan berkas foto sekaligus (JPG, PNG, WEBP).
- **Lightbox Viewer Utuh (Tanpa Crop):** Pratinjau foto resolusi asli secara penuh saat diklik.
- **Navigasi Cepat (Keyboard Shortcuts):** Mendukung tombol panah keyboard (`←` / `→`) dan angka (`1` untuk Bagus, `2` untuk Ragu, `3` untuk Jelek).
- **Export Arsip ZIP:** Mengunduh hasil sortir yang otomatis dikelompokkan ke dalam folder terpisah (`Bagus_Pro`, `Ragu_Review`, `Jelek_Discard`).

---

##  Standar Kriteria Penilaian AI (Ala Fotografer Profesional)

AI dalam aplikasi ini bekerja secara objektif berdasarkan 3 pilar utama:

1. **Kelayakan Teknis (Kriteria Eliminasi Utama):**
   - **Ketajaman Fokus (Focus & Sharpness):** Mendeteksi kontras tepi (*edge variance*). Foto yang mengalami *motion blur* atau meleset titik fokusnya otomatis dikategorikan ke **Jelek**.
   - **Pencahayaan & Eksposur (Exposure Accuracy):** Mendeteksi *clipping* piksel ekstrim untuk mencegah bagian silau (*overexposed*) atau terlalu gelap gulita (*underexposed*).
2. **Estetika & Zona Review:**
   - Foto yang memiliki fokus lembut (*soft focus*) atau pencahayaan unik tidak langsung dibuang, melainkan dimasukkan ke kategori **Ragu-ragu** untuk ditinjau ulang oleh fotografer.
3. **Penyortiran Transparan:**
   - Setiap kartu foto menampilkan **skor ketajaman (0-100)** dan **alasan penilaian teknis** secara rinci.

---

##  Kebutuhan Sistem & Package yang Digunakan

Proyek ini dibangun menggunakan *stack* modern berikut:

- **Node.js** (Versi 18.x atau terbaru)
- **Framework:** Next.js (App Router, JavaScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Typography:** Plus Jakarta Sans
- **Icon Library:** Lucide React (`lucide-react`)
- **Engine AI Lokal:** Transformers.js (`@huggingface/transformers`)
- **Zip Generator:** JSZip (`jszip`)

---

##  Langkah-Langkah Instalasi (Setup Lokal)

Ikuti langkah di bawah ini untuk menjalankan proyek di komputer lokalmu:

### 1. Clone Repository & Masuk ke Folder Proyek
```bash
git clone https://github.com/Sapto12/photoculler.git
cd photoculler
```

### 2. Inisialisasi Proyek & Depedensi Dasar (Jika Buat Dari Nol)
```bash
# Inisialisasi Next.js
npx create-next-app@latest ai-photo-culling

# Inisialisasi shadcn/ui
npx shadcn@latest init

# Tambah Komponen UI
npx shadcn@latest add button card tabs badge progress dialog
```

### 3. Instalasi Package Utama
Jalankan perintah berikut di terminal untuk menginstal seluruh dependensi pendukung:
```bash
npm install lucide-react @huggingface/transformers jszip
```

### 4. Jalankan Server Development Lokal
```bash
npm run dev
```

### 5. Buka di Browser
Buka browser favoritmu dan akses tautan berikut:
```text
http://localhost:3000
```

---

##  Panduan Keyboard Shortcuts (Dalam Mode Preview)

Saat kamu mengklik foto untuk melihat pratinjau layar penuh (Lightbox), gunakan tombol pintasan berikut untuk mempercepat proses sortir:
- **Panah Kanan (`→`)**: Pindah ke foto berikutnya.
- **Panah Kiri (`←`)**: Pindah ke foto sebelumnya.
- **Tombol `1`**: Ubah kategori foto menjadi **Bagus**.
- **Tombol `2`**: Ubah kategori foto menjadi **Ragu-ragu**.
- **Tombol `3`**: Ubah kategori foto menjadi **Jelek**.
- **Tombol `Esc`**: Menutup mode pratinjau.

---

##  Panduan Deploy ke Vercel

Aplikasi ini dapat dipublikasikan secara gratis menggunakan Vercel:

1. Pastikan perubahan kodemu sudah di-*commit* dan di-*push* ke GitHub:
   ```bash
   git add .
   git commit -m "penambahan fitur download, dan analisis pensortiran yang hampir sepadan dengan profesional"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/) dan login menggunakan akun GitHub.
3. Klik **Add New... > Project**, lalu pilih repository `photoculler`.
4. Biarkan pengaturan build otomatis dari Next.js, lalu klik **Deploy**.
5. Selesai! Website kamu akan langsung online dan siap digunakan di URL publik Vercel.
