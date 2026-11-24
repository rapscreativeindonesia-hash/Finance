# Finance — Keuangan Pribadi

Aplikasi keuangan pribadi berbasis web. Mendukung catatan pemasukan dan pengeluaran harian, anggaran bulanan, hutang, langganan, target tabungan, kalender tagihan, serta laporan.

## Deployment Cloudflare Workers

Aplikasi dibagikan sebagai static assets Cloudflare Workers. Konfigurasi tersedia dalam `wrangler.jsonc`.

- Root directory: `/`
- Build command: kosong / None
- Deploy command: `npx wrangler deploy`
- Name: `finance`

**Privasi:** mode awal menyimpan data di browser (localStorage), tanpa sinkronisasi cloud. Jangan gunakan penyimpanan ini sebagai satu-satunya backup keuangan; gunakan ekspor JSON secara berkala. Login dan sinkronisasi lintas perangkat belum tersedia.

## Unduh Laporan PDF

Pada menu **Laporan Keuangan**, pilih periode lalu tekan **Unduh PDF**. Laporan A4 dirancang otomatis dengan header Finance, kartu KPI, grafik 6 bulan, pengeluaran per kategori, dan rincian transaksi multi-halaman. File PDF dibuat secara lokal di browser, tidak dikirim ke server pihak ketiga, dan tetap dapat diunduh saat tidak ada transaksi. Ekspor CSV tetap tersedia di **Pengaturan** sebagai data mentah.
