import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Santri, Transaksi, Pembayaran, TagihanBulanan } from '../types';

interface DataContextType {
  santris: Santri[];
  transaksis: Transaksi[];
  pembayarans: Pembayaran[];
  tagihanBulanan: TagihanBulanan[];
  addSantri: (santri: Omit<Santri, 'id'>) => void;
  updateSantri: (id: string, santri: Partial<Santri>) => void;
  deleteSantri: (id: string) => void;
  addTransaksi: (transaksi: Omit<Transaksi, 'id' | 'createdAt'>) => void;
  updateTransaksi: (id: string, transaksi: Partial<Transaksi>) => void;
  deleteTransaksi: (id: string) => void;
  addPembayaran: (pembayaran: Omit<Pembayaran, 'id'>) => void;
  updatePembayaran: (id: string, pembayaran: Partial<Pembayaran>) => void;
  generateTagihanBulanan: () => void;
  bayarTagihan: (santriId: string, bulan: number, tahun: number, jenis: 'kas' | 'syahriyah', ttd: string) => void;
  getTagihanSantri: (santriId: string) => TagihanBulanan[];
  getTotalTunggakan: () => { total: number; jumlahSantri: number };
  resetTagihanBulanan: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [santris, setSantris] = useState<Santri[]>([]);
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [pembayarans, setPembayarans] = useState<Pembayaran[]>([]);
  const [tagihanBulanan, setTagihanBulanan] = useState<TagihanBulanan[]>([]);

  // Konstanta biaya bulanan yang benar
  const BIAYA_KAS_BULANAN = 10000;  // Rp 10.000
  const BIAYA_SYAHRIYAH_BULANAN = 50000;  // Rp 50.000

  useEffect(() => {
    // Load data dari localStorage
    const storedSantris = localStorage.getItem('santris');
    const storedTransaksis = localStorage.getItem('transaksis');
    const storedPembayarans = localStorage.getItem('pembayarans');
    const storedTagihanBulanan = localStorage.getItem('tagihanBulanan');

    if (storedSantris) setSantris(JSON.parse(storedSantris));
    
    // Load transaksi dan tambahkan field ttd jika belum ada
    if (storedTransaksis) {
      const transaksi = JSON.parse(storedTransaksis);
      const updatedTransaksi = transaksi.map((t: Transaksi) => ({
        ...t,
        ttd: t.ttd || 'Admin', // Default TTD jika belum ada
      }));
      setTransaksis(updatedTransaksi);
      localStorage.setItem('transaksis', JSON.stringify(updatedTransaksi));
    }
    
    if (storedPembayarans) setPembayarans(JSON.parse(storedPembayarans));
    
    // Load tagihan dan update biaya jika perlu
    if (storedTagihanBulanan) {
      const tagihan = JSON.parse(storedTagihanBulanan);
      // Update biaya pada tagihan yang sudah ada
      const updatedTagihan = tagihan.map((t: TagihanBulanan) => ({
        ...t,
        jumlahKas: BIAYA_KAS_BULANAN,
        jumlahSyahriyah: BIAYA_SYAHRIYAH_BULANAN,
        dendaKas: 0,
        dendaSyahriyah: 0,
        totalDenda: 0,
      }));
      setTagihanBulanan(updatedTagihan);
      localStorage.setItem('tagihanBulanan', JSON.stringify(updatedTagihan));
    }

    // Jika tidak ada data, load data dummy
    if (!storedSantris) {
      const dummySantris: Santri[] = [
        {
          id: '1',
          nama: 'Ahmad Fauzi',
          alamat: 'Jl. Merdeka No. 123, Bandung',
          tanggalLahir: '2005-03-15',
          namaWali: 'Bapak Usman',
          kontakWali: '08123456789',
          status: 'aktif',
          tanggalMasuk: '2024-01-01', // Masuk Januari 2024
        },
        {
          id: '2',
          nama: 'Muhammad Rizki',
          alamat: 'Jl. Sudirman No. 45, Jakarta',
          tanggalLahir: '2004-11-20',
          namaWali: 'Ibu Siti',
          kontakWali: '08987654321',
          status: 'aktif',
          tanggalMasuk: '2023-07-01', // Masuk Juli 2023
        },
      ];
      setSantris(dummySantris);
      localStorage.setItem('santris', JSON.stringify(dummySantris));
    }

    if (!storedTransaksis) {
      const dummyTransaksis: Transaksi[] = [
        {
          id: '1',
          santriId: '1',
          tanggal: '2024-01-15',
          jumlah: 50000,
          jenis: 'pemasukan',
          kategori: 'syahriyah',
          keterangan: 'Pembayaran syahriyah bulan Januari',
          ttd: 'Admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          tanggal: '2024-01-16',
          jumlah: 300000,
          jenis: 'pengeluaran',
          kategori: 'makan',
          keterangan: 'Belanja keperluan dapur',
          ttd: 'Admin',
          createdAt: new Date().toISOString(),
        },
      ];
      setTransaksis(dummyTransaksis);
      localStorage.setItem('transaksis', JSON.stringify(dummyTransaksis));
    }
  }, []);

  // Reset tagihan bulanan dengan biaya yang benar
  const resetTagihanBulanan = () => {
    setTagihanBulanan([]);
    localStorage.removeItem('tagihanBulanan');
    // Generate ulang tagihan dengan biaya yang benar
    setTimeout(() => {
      generateTagihanBulanan();
    }, 100);
  };

  // Generate tagihan bulanan otomatis - DIPERBAIKI untuk menghitung dari tanggal masuk yang benar
  const generateTagihanBulanan = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const newTagihan: TagihanBulanan[] = [];

    // Filter hanya santri aktif
    const activeSantris = santris.filter(s => s.status === 'aktif');

    activeSantris.forEach(santri => {
      const tanggalMasuk = new Date(santri.tanggalMasuk);
      const masukMonth = tanggalMasuk.getMonth() + 1;
      const masukYear = tanggalMasuk.getFullYear();

      // Pastikan tanggal masuk tidak di masa depan
      if (tanggalMasuk > currentDate) {
        return; // Skip santri yang tanggal masuknya di masa depan
      }

      // Generate tagihan dari bulan masuk sampai bulan sekarang
      let targetYear = masukYear;
      let targetMonth = masukMonth;

      while (targetYear < currentYear || (targetYear === currentYear && targetMonth <= currentMonth)) {
        // Cek apakah tagihan bulan ini sudah ada
        const existingTagihan = tagihanBulanan.find(
          t => t.santriId === santri.id && t.bulan === targetMonth && t.tahun === targetYear
        );

        if (!existingTagihan) {
          // Tanggal jatuh tempo adalah tanggal 10 setiap bulan
          const tanggalJatuhTempo = new Date(targetYear, targetMonth - 1, 10);
          const isOverdue = currentDate > tanggalJatuhTempo;

          const tagihan: TagihanBulanan = {
            id: `${santri.id}-${targetMonth}-${targetYear}`,
            santriId: santri.id,
            bulan: targetMonth,
            tahun: targetYear,
            jumlahKas: BIAYA_KAS_BULANAN,  // Rp 10.000
            jumlahSyahriyah: BIAYA_SYAHRIYAH_BULANAN,  // Rp 50.000
            tanggalJatuhTempo: tanggalJatuhTempo.toISOString().split('T')[0],
            statusKas: isOverdue ? 'terlambat' : 'belum_lunas',
            statusSyahriyah: isOverdue ? 'terlambat' : 'belum_lunas',
            dendaKas: 0, // Tidak ada denda
            dendaSyahriyah: 0, // Tidak ada denda
            totalDenda: 0, // Tidak ada denda
          };

          newTagihan.push(tagihan);
        }

        // Pindah ke bulan berikutnya
        targetMonth++;
        if (targetMonth > 12) {
          targetMonth = 1;
          targetYear++;
        }
      }
    });

    if (newTagihan.length > 0) {
      const updatedTagihan = [...tagihanBulanan, ...newTagihan];
      setTagihanBulanan(updatedTagihan);
      localStorage.setItem('tagihanBulanan', JSON.stringify(updatedTagihan));
    }
  };

  // Bayar tagihan dengan TTD
  const bayarTagihan = (santriId: string, bulan: number, tahun: number, jenis: 'kas' | 'syahriyah', ttd: string) => {
    const updatedTagihan = tagihanBulanan.map(tagihan => {
      if (tagihan.santriId === santriId && tagihan.bulan === bulan && tagihan.tahun === tahun) {
        const today = new Date().toISOString().split('T')[0];
        
        if (jenis === 'kas') {
          return {
            ...tagihan,
            statusKas: 'lunas' as const,
            tanggalBayarKas: today,
            ttdKas: ttd,
          };
        } else {
          return {
            ...tagihan,
            statusSyahriyah: 'lunas' as const,
            tanggalBayarSyahriyah: today,
            ttdSyahriyah: ttd,
          };
        }
      }
      return tagihan;
    });

    setTagihanBulanan(updatedTagihan);
    localStorage.setItem('tagihanBulanan', JSON.stringify(updatedTagihan));

    // Tambahkan transaksi pemasukan dengan TTD
    const jumlah = jenis === 'kas' ? BIAYA_KAS_BULANAN : BIAYA_SYAHRIYAH_BULANAN;

    addTransaksi({
      santriId,
      tanggal: new Date().toISOString().split('T')[0],
      jumlah: jumlah,
      jenis: 'pemasukan',
      kategori: jenis,
      keterangan: `Pembayaran ${jenis} ${getMonthName(bulan)} ${tahun}`,
      ttd: ttd,
    });
  };

  const getMonthName = (month: number) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1];
  };

  const getTagihanSantri = (santriId: string): TagihanBulanan[] => {
    return tagihanBulanan.filter(t => t.santriId === santriId);
  };

  // DIPERBAIKI: Hitung tunggakan berdasarkan tanggal masuk santri
  const getTotalTunggakan = () => {
    const currentDate = new Date();
    let totalTunggakan = 0;
    const santriWithTunggakan = new Set<string>();

    // Filter hanya santri yang masih aktif
    const activeSantriIds = santris.filter(s => s.status === 'aktif').map(s => s.id);

    // Hitung tunggakan dari tagihan yang sudah jatuh tempo (lewat tanggal 10)
    tagihanBulanan.forEach(tagihan => {
      // Hanya hitung tagihan dari santri yang masih aktif
      if (!activeSantriIds.includes(tagihan.santriId)) {
        return;
      }

      // Cari data santri untuk mendapatkan tanggal masuk
      const santri = santris.find(s => s.id === tagihan.santriId);
      if (!santri) return;

      const tanggalMasukSantri = new Date(santri.tanggalMasuk);
      const tanggalTagihan = new Date(tagihan.tahun, tagihan.bulan - 1, 1);
      
      // Hanya hitung tagihan yang dibuat setelah atau pada bulan santri masuk
      if (tanggalTagihan < tanggalMasukSantri) {
        return;
      }

      const jatuhTempo = new Date(tagihan.tanggalJatuhTempo);
      
      // Hanya hitung jika sudah melewati tanggal jatuh tempo (tanggal 10)
      if (currentDate > jatuhTempo) {
        // Hitung tunggakan kas (tanpa denda)
        if (tagihan.statusKas !== 'lunas') {
          totalTunggakan += tagihan.jumlahKas;
          santriWithTunggakan.add(tagihan.santriId);
        }
        
        // Hitung tunggakan syahriyah (tanpa denda)
        if (tagihan.statusSyahriyah !== 'lunas') {
          totalTunggakan += tagihan.jumlahSyahriyah;
          santriWithTunggakan.add(tagihan.santriId);
        }
      }
    });

    return {
      total: totalTunggakan,
      jumlahSantri: santriWithTunggakan.size,
    };
  };

  // Auto-generate tagihan setiap kali santris berubah
  useEffect(() => {
    if (santris.length > 0) {
      // Delay untuk memastikan state sudah terupdate
      const timer = setTimeout(() => {
        generateTagihanBulanan();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [santris.length]);

  // Update status tagihan secara real-time (tanpa denda) - DIPERBAIKI
  useEffect(() => {
    const updateStatus = () => {
      const currentDate = new Date();
      let hasUpdates = false;

      const updatedTagihan = tagihanBulanan.map(tagihan => {
        // Cari data santri untuk validasi tanggal masuk
        const santri = santris.find(s => s.id === tagihan.santriId);
        if (!santri) return tagihan;

        const tanggalMasukSantri = new Date(santri.tanggalMasuk);
        const tanggalTagihan = new Date(tagihan.tahun, tagihan.bulan - 1, 1);
        
        // Jika tagihan dibuat sebelum santri masuk, hapus tagihan tersebut
        if (tanggalTagihan < tanggalMasukSantri) {
          hasUpdates = true;
          return null; // Akan difilter nanti
        }

        const jatuhTempo = new Date(tagihan.tanggalJatuhTempo);
        const isOverdue = currentDate > jatuhTempo;
        
        // Update biaya jika masih menggunakan biaya lama
        let updatedTagihan = { ...tagihan };
        if (tagihan.jumlahKas !== BIAYA_KAS_BULANAN || tagihan.jumlahSyahriyah !== BIAYA_SYAHRIYAH_BULANAN) {
          updatedTagihan = {
            ...tagihan,
            jumlahKas: BIAYA_KAS_BULANAN,
            jumlahSyahriyah: BIAYA_SYAHRIYAH_BULANAN,
            dendaKas: 0,
            dendaSyahriyah: 0,
            totalDenda: 0,
          };
          hasUpdates = true;
        }
        
        if (isOverdue) {
          // Update status menjadi terlambat jika belum lunas dan sudah lewat tanggal 10
          const newStatusKas = updatedTagihan.statusKas === 'belum_lunas' ? 'terlambat' as const : updatedTagihan.statusKas;
          const newStatusSyahriyah = updatedTagihan.statusSyahriyah === 'belum_lunas' ? 'terlambat' as const : updatedTagihan.statusSyahriyah;

          if (newStatusKas !== updatedTagihan.statusKas || newStatusSyahriyah !== updatedTagihan.statusSyahriyah) {
            hasUpdates = true;
            return {
              ...updatedTagihan,
              statusKas: newStatusKas,
              statusSyahriyah: newStatusSyahriyah,
            };
          }
        }
        
        return updatedTagihan;
      }).filter(Boolean) as TagihanBulanan[]; // Filter out null values

      if (hasUpdates) {
        setTagihanBulanan(updatedTagihan);
        localStorage.setItem('tagihanBulanan', JSON.stringify(updatedTagihan));
      }
    };

    // Update status saat komponen dimount
    if (tagihanBulanan.length > 0 && santris.length > 0) {
      updateStatus();
    }

    // Set interval untuk update status setiap jam
    const interval = setInterval(updateStatus, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [tagihanBulanan.length, santris.length]);

  const addSantri = (santri: Omit<Santri, 'id'>) => {
    const newSantri: Santri = {
      ...santri,
      id: Date.now().toString(),
    };
    const updatedSantris = [...santris, newSantri];
    setSantris(updatedSantris);
    localStorage.setItem('santris', JSON.stringify(updatedSantris));
  };

  const updateSantri = (id: string, santri: Partial<Santri>) => {
    const updatedSantris = santris.map(s => s.id === id ? { ...s, ...santri } : s);
    setSantris(updatedSantris);
    localStorage.setItem('santris', JSON.stringify(updatedSantris));
    
    // Jika tanggal masuk berubah, regenerate tagihan
    if (santri.tanggalMasuk) {
      // Hapus tagihan lama untuk santri ini
      const updatedTagihan = tagihanBulanan.filter(t => t.santriId !== id);
      setTagihanBulanan(updatedTagihan);
      localStorage.setItem('tagihanBulanan', JSON.stringify(updatedTagihan));
      
      // Generate ulang tagihan dengan tanggal masuk yang baru
      setTimeout(() => {
        generateTagihanBulanan();
      }, 100);
    }
  };

  const deleteSantri = (id: string) => {
    const updatedSantris = santris.filter(s => s.id !== id);
    setSantris(updatedSantris);
    localStorage.setItem('santris', JSON.stringify(updatedSantris));
    
    // Hapus juga tagihan santri yang dihapus
    const updatedTagihan = tagihanBulanan.filter(t => t.santriId !== id);
    setTagihanBulanan(updatedTagihan);
    localStorage.setItem('tagihanBulanan', JSON.stringify(updatedTagihan));
  };

  const addTransaksi = (transaksi: Omit<Transaksi, 'id' | 'createdAt'>) => {
    const newTransaksi: Transaksi = {
      ...transaksi,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedTransaksis = [...transaksis, newTransaksi];
    setTransaksis(updatedTransaksis);
    localStorage.setItem('transaksis', JSON.stringify(updatedTransaksis));
  };

  const updateTransaksi = (id: string, transaksi: Partial<Transaksi>) => {
    const updatedTransaksis = transaksis.map(t => t.id === id ? { ...t, ...transaksi } : t);
    setTransaksis(updatedTransaksis);
    localStorage.setItem('transaksis', JSON.stringify(updatedTransaksis));
  };

  const deleteTransaksi = (id: string) => {
    const updatedTransaksis = transaksis.filter(t => t.id !== id);
    setTransaksis(updatedTransaksis);
    localStorage.setItem('transaksis', JSON.stringify(updatedTransaksis));
  };

  const addPembayaran = (pembayaran: Omit<Pembayaran, 'id'>) => {
    const newPembayaran: Pembayaran = {
      ...pembayaran,
      id: Date.now().toString(),
    };
    const updatedPembayarans = [...pembayarans, newPembayaran];
    setPembayarans(updatedPembayarans);
    localStorage.setItem('pembayarans', JSON.stringify(updatedPembayarans));
  };

  const updatePembayaran = (id: string, pembayaran: Partial<Pembayaran>) => {
    const updatedPembayarans = pembayarans.map(p => p.id === id ? { ...p, ...pembayaran } : p);
    setPembayarans(updatedPembayarans);
    localStorage.setItem('pembayarans', JSON.stringify(updatedPembayarans));
  };

  return (
    <DataContext.Provider value={{
      santris,
      transaksis,
      pembayarans,
      tagihanBulanan,
      addSantri,
      updateSantri,
      deleteSantri,
      addTransaksi,
      updateTransaksi,
      deleteTransaksi,
      addPembayaran,
      updatePembayaran,
      generateTagihanBulanan,
      bayarTagihan,
      getTagihanSantri,
      getTotalTunggakan,
      resetTagihanBulanan,
    }}>
      {children}
    </DataContext.Provider>
  );
};