export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Santri {
  id: string;
  // Data Pribadi
  nama: string;
  tempatLahir?: string;
  tanggalLahir: string;
  jenisKelamin?: string;
  alamat: string;
  noKTP?: string;
  noKK?: string;
  
  // Data Wali/Orang Tua
  namaWali: string;
  pekerjaanWali?: string;
  kontakWali: string;
  emailWali?: string;
  alamatWali?: string;
  
  // Data Pendidikan
  asalSekolah?: string;
  tahunLulus?: string;
  nilaiUN?: string;
  
  // Data Kesehatan
  golonganDarah?: string;
  riwayatPenyakit?: string;
  alergi?: string;
  
  // Data Pondok
  tanggalMasuk: string;
  kamar?: string;
  tingkat?: string;
  status: 'aktif' | 'nonaktif';
  
  // Data Tambahan
  hobi?: string;
  cita_cita?: string;
  motivasi?: string;
  foto?: string;
}

export interface Transaksi {
  id: string;
  santriId?: string;
  tanggal: string;
  jumlah: number;
  jenis: 'pemasukan' | 'pengeluaran';
  kategori: string;
  keterangan: string;
  ttd: string; // Field TTD (Tertanda)
  createdAt: string;
}

export interface Pembayaran {
  id: string;
  santriId: string;
  bulan: string;
  tahun: number;
  jenisKekurangan: 'kas' | 'syahriyah';
  jumlah: number;
  status: 'lunas' | 'belum_lunas';
  tanggalBayar?: string;
  tanggalJatuhTempo: string;
  denda?: number;
  ttd: string; // Field TTD (Tertanda)
}

export interface TagihanBulanan {
  id: string;
  santriId: string;
  bulan: number;
  tahun: number;
  jumlahKas: number;
  jumlahSyahriyah: number;
  tanggalJatuhTempo: string;
  statusKas: 'lunas' | 'belum_lunas' | 'terlambat';
  statusSyahriyah: 'lunas' | 'belum_lunas' | 'terlambat';
  tanggalBayarKas?: string;
  tanggalBayarSyahriyah?: string;
  dendaKas: number;
  dendaSyahriyah: number;
  totalDenda: number;
  ttdKas?: string; // TTD untuk pembayaran kas
  ttdSyahriyah?: string; // TTD untuk pembayaran syahriyah
}

export interface DashboardStats {
  totalSaldo: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  totalSantri: number;
  totalTunggakan: number;
  santriTunggakan: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}