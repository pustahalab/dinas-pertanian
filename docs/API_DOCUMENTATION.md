# Dokumentasi REST API Integrasi DAMRI

Sistem menyediakan antarmuka Application Programming Interface (API) berbasis format JSON standar untuk mendukung integrasi dengan aplikasi mobile scanner DAMRI, handheld terminal, atau sistem pihak ketiga.

---

## 1. Verifikasi Status Kartu Tani

Mengecek keabsahan kartu tani berdasarkan nomor kartu, token QR code, atau NIK.

- **URL**: `/api/verify-card/:cardNumber` atau `/api/verify-card?card=KT-OAP-2026-0001`
- **Method**: `GET`
- **Headers**: `Accept: application/json`

### Contoh Permintaan (Request):
```bash
curl -X GET http://localhost:3000/api/verify-card/KT-OAP-2026-0001
```

### Contoh Respon Sukses (Kartu Valid):
```json
{
  "success": true,
  "valid": true,
  "status_kartu": "aktif",
  "status_verifikasi": "ditetapkan",
  "message": "KARTU TANI AKTIF & VALID. Berhak mendapatkan subsidi transportasi angkut hasil panen DAMRI Otsus.",
  "data": {
    "id": 1,
    "nomor_kartu": "KT-OAP-2026-0001",
    "nama_lengkap": "OPICE ARWAM",
    "nik": "9106010000000001",
    "distrik": "BIAK BARAT",
    "kampung": "DOUSI",
    "kelompok_tani": "Kelompok Tani Mansinam Mandiri",
    "komoditas_utama": "Keladi Biak",
    "luas_lahan": "0.50",
    "foto": "/img/default-avatar.png"
  }
}
```

### Contoh Respon Ditolak (Kartu Non-Aktif / Ditolak):
```json
{
  "success": true,
  "valid": false,
  "status_kartu": "nonaktif",
  "status_verifikasi": "ditolak",
  "message": "AKSES DITOLAK: Kartu dalam status NONAKTIF (Verifikasi: DITOLAK).",
  "data": {
    "id": 466,
    "nomor_kartu": "KT-OAP-2026-0466",
    "nama_lengkap": "DANIEL KMUR",
    "status_kartu": "nonaktif"
  }
}
```

---

## 2. Statistik Agregat Wilayah & Transportasi

Mengambil rekapitulasi data petani per distrik dan tonase transportasi hasil panen untuk integrasi visualisasi.

- **URL**: `/api/stats`
- **Method**: `GET`

### Contoh Respon:
```json
{
  "success": true,
  "data": {
    "districts": [
      { "distrik": "BIAK BARAT", "count": 85 },
      { "distrik": "BIAK UTARA", "count": 72 },
      { "distrik": "BIAK TIMUR", "count": 64 }
    ],
    "trips": [
      { "bulan": "2026-03", "trips": 35, "volume_kg": "3450.00" }
    ],
    "commodities": [
      { "komoditas": "Keladi Biak", "total_kg": "1450.00" },
      { "komoditas": "Ubi Jalar (Petatas)", "total_kg": "980.00" }
    ]
  }
}
```
