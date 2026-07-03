# Savanna Ops: Wild Rescue

Game web 3D edukasi konservasi fauna dan simulasi penyelamatan satwa liar berbasis **Three.js + Vite + NPM**.

## Fitur utama

- Menu utama: Start Game, Pengaturan, Kredit Game, Cara Main.
- Kontrol WASD sudah mengikuti arah kamera/player, bukan mapping dunia yang terbalik.
- 3 mode kamera: FPS, third person, dan kamera atas.
- Operator/ranger bergaya ops militer konservasi dengan model tubuh saat kamera third/top.
- Pemburu liar dengan AI patrol, radius deteksi/serang 70 meter, dan mengejar pemain.
- Senjata tranquilizer sniper/tranquilizer rifle 3D yang lebih realistis, lengkap scope, suppressor, stock, grip, dan dart tube. Klik kanan untuk bidik/scope, klik kiri untuk menembak.
- Efek suara WebAudio: tembakan player yang lebih keras, tembakan musuh, reload, rescue, reward sound, ambient savana, bird call, dan musik petualangan procedural.
- Misi rescue satwa berurutan: Gajah Savana, Zebra Timur, Gazelle Muda, Zebra Barat, Gazelle Utara. Setiap satwa memiliki cerita, kronologi, dan objective masing-masing di Buku Petunjuk Operasi.
- Hewan terlihat berada di dalam kandang. Rescue baru bisa dilakukan setelah pemburu sekitar kandang dinetralisir. Setelah hewan bebas, kandang otomatis hilang dan health operator pulih ke 100%.
- HUD: health, stamina, ammo, reload pressure, objective text, FPS counter, panah objective, camera badge, dan daftar satwa.
- Minimap real-time dengan titik player, musuh, hewan, kandang, helipad, dan objective ring.
- Savana 3D: terrain, rumput, pohon acacia/baobab, bebatuan, camp pemburu, helipad, helicopter.
- Fallback asset prosedural. Game tetap berjalan tanpa GLB eksternal.
- Siap menerima asset GLB lokal di `public/assets/models`.

## Cara menjalankan

```bash
npm install
npm run dev
```

Buka URL lokal yang muncul dari Vite, biasanya:

```bash
http://localhost:5173
```

## Build produksi

```bash
npm run build
npm run preview
```

## Kontrol

- `W A S D` = bergerak
- `Mouse` = melihat arah
- `Shift` = sprint
- `Right Click` = bidik sniper/scope
- `Left Click` = tembak dart non-mematikan
- `R` = reload
- `E` = rescue/interaksi
- `B` = buka Buku Petunjuk Operasi
- `V` = ganti kamera bertahap
- `1` = kamera FPS
- `2` = kamera third person
- `3` = kamera atas
- `Esc` = pause

## Objective

1. Baca Buku Petunjuk Operasi di awal game untuk melihat kronologi dan urutan satwa yang harus diselamatkan.
2. Ikuti panah objective dan daftar rescue.
3. Datangi kandang satwa sesuai urutan misi.
4. Jika ada pemburu liar aktif di sekitar kandang, netralisir dulu dengan dart non-mematikan.
5. Setelah area aman, tekan `E` untuk rescue satwa. Kandang hilang otomatis dan health kembali 100%.
6. Setelah 5 satwa aman dan 8 pemburu dinetralisir, kembali ke helipad.

## Mengganti dengan asset GLB realistis

Masukkan file GLB ke folder:

```txt
public/assets/models/
```

Lima asset hewan yang dipakai pada misi:

```txt
Gajah_Savana.glb
Zebra_Timur.glb
Gazelle_Muda.glb
Zebra_Barat.glb
Gazelle_Utara.glb
```

Setiap kandang memuat file GLB yang sesuai dengan nama hewannya. Ukuran dan titik pijak model dinormalisasi saat dimuat agar tetap sesuai dengan kandang dan posisi misi lama. Jika file gagal dimuat, game tetap memakai fallback procedural supaya misi tidak berhenti karena asset rusak atau hilang.

Asset opsional lain yang masih otomatis dicoba oleh game:

```txt
soldier.glb
poacher.glb
helicopter.glb
tranquilizer_rifle.glb
```

Catatan: gunakan asset GLB yang memiliki izin lisensi untuk proyek Anda. Jangan memasukkan asset komersial/berhak cipta tanpa izin.

## Struktur folder

```txt
savanna-ops-wild-rescue/
├─ index.html
├─ package.json
├─ README.md
├─ public/
│  └─ assets/
│     ├─ models/
│     ├─ audio/
│     └─ textures/
└─ src/
   ├─ main.js
   └─ style.css
```

## Revisi 3

- Scope sniper diperbaiki: mesh senjata disembunyikan saat scope aktif supaya lensa/bodi tidak menutup target. Reticle putih dibuat lebih tipis, lebih presisi, dan tepat di pusat raycast kamera.
- Minimap dipindahkan ke bawah kiri layar.
- Model pemburu fallback dibuat lebih realistis: pakaian taktis, balaclava, helm, goggles, vest, pouch, sepatu, sarung tangan, rifle, dan detail camo.
- Suara sniper diganti menjadi efek procedural yang lebih berat: crack tajam, low boom, mechanical click, dan echo/tail pendek.

## Revisi 4

- Minimap dipaksa berada di pojok bawah kiri dengan override `inset/top/right`, karena rule global `canvas` sebelumnya masih menyisakan posisi atas pada canvas minimap.
- Jarak tembak sniper dart dinaikkan sampai 430 meter. Selain raycast mesh langsung, ditambahkan long-range hit assist kecil saat scope aktif agar target jauh tetap bisa terkena jika reticle tepat di badan/kepala musuh.
- Musik game dibuat dinamis/adaptif: mode Explore, Tension, Combat, Danger, dan Extraction. Musik otomatis berubah saat dekat objective, musuh mendeteksi player, health rendah, atau semua satwa sudah aman.
- Ditambahkan badge status musik di HUD dan opsi Dynamic Music On/Off di Pengaturan.
