# SBM Creative — Website Order

Landing page + form order jasa video editing SBM Creative. Tanpa build tool — cukup buka `index.html` di browser, atau upload seluruh folder ke hosting apa pun (Netlify, Vercel, cPanel, GitHub Pages).

## Struktur

```
index.html                 seluruh halaman
assets/css/style.css       semua styling
assets/js/main.js          video autoplay, lightbox, kalkulator harga, form → WhatsApp
assets/img/                logo + poster video (hasil generate dari video)
assets/video/              video showcase (salinan dari video_untuk_dishow)
```

Folder lama `panduan_utama/` dan `video_untuk_dishow/` tidak diubah — hanya dibaca.

## Yang perlu diubah saat go-live

| Kebutuhan | Lokasi |
|---|---|
| Nomor WhatsApp | `assets/js/main.js` → `var WA_NUMBER = "628881123222";` |
| Email / jam operasional | `index.html` bagian `<footer>` |
| Sosial media | belum ada ikon sosial — tambahkan di `.footer__col` bila perlu |
| Harga paket | `index.html`, atribut `data-price` pada tiap `<article class="price">` |
| Tambah video | copy ke `assets/video/`, buat poster, lalu duplikasi satu `<button class="reel">` |

## Cara kerja

- **Video** autoplay muted & loop, hanya diputar saat terlihat di layar (IntersectionObserver). Klik kartu → lightbox dengan suara.
- **Harga** dihitung `harga per menit × durasi`, tersinkron antara kalkulator dan form order.
- **Form** membuka WhatsApp dengan pesan yang sudah terisi otomatis (nama, paket, durasi, deadline, revisi, estimasi total, brief).
- **Poster** video dibuat dengan perintah:
  ```bash
  ffmpeg -ss <detik> -i input.mp4 -frames:v 1 -vf "scale=720:-2" -q:v 4 poster-XX.jpg
  ```

## Catatan

- 3 video produk + 1 talking head sengaja dipisah dari 8 video motion graphics agar fokus showcase tetap ke motion graphics.
- Watermark TikTok dibiarkan apa adanya sesuai permintaan.
- Total ukuran video ± 42 MB. Untuk mobile, disarankan re-encode ke ±1 Mbps.
