# Finance — Keuangan Pribadi

Aplikasi keuangan pribadi berbasis web. Mendukung catatan pemasukan dan pengeluaran harian, anggaran bulanan, hutang, langganan, target tabungan, kalender tagihan, serta laporan.

## Deployment Cloudflare Workers

Aplikasi dibagikan sebagai static assets Cloudflare Workers. Konfigurasi tersedia dalam `wrangler.jsonc`.

- Root directory: `/`
- Build command: kosong / None
- Deploy command: `npx wrangler deploy`
- Name: `finance`

**Privasi:** mode awal menyimpan data di browser (localStorage), tanpa sinkronisasi cloud. Jangan gunakan penyimpanan ini sebagai satu-satunya backup keuangan; gunakan ekspor JSON secara berkala. Login dan sinkronisasi lintas perangkat belum tersedia.
