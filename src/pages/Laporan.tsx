import React, { useState } from 'react';
import { Download, Filter, FileText, PenTool } from 'lucide-react';
import { useData } from '../context/DataContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Laporan: React.FC = () => {
  const { transaksis, santris } = useData();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    jenis: '',
    santriId: '',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter transaksi berdasarkan filter yang dipilih
  const filteredTransaksis = transaksis.filter(transaksi => {
    const matchDate = (!filters.startDate || transaksi.tanggal >= filters.startDate) &&
                      (!filters.endDate || transaksi.tanggal <= filters.endDate);
    const matchJenis = !filters.jenis || transaksi.jenis === filters.jenis;
    const matchSantri = !filters.santriId || transaksi.santriId === filters.santriId;
    
    return matchDate && matchJenis && matchSantri;
  });

  // Hitung statistik
  const totalPemasukan = filteredTransaksis
    .filter(t => t.jenis === 'pemasukan')
    .reduce((sum, t) => sum + t.jumlah, 0);
  
  const totalPengeluaran = filteredTransaksis
    .filter(t => t.jenis === 'pengeluaran')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('LAPORAN KEUANGAN PONDOK PESANTREN', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Periode: ${filters.startDate || 'Semua'} - ${filters.endDate || 'Semua'}`, 20, 35);
    doc.text(`Jenis: ${filters.jenis || 'Semua'}`, 20, 45);
    
    // Summary
    doc.setFontSize(14);
    doc.text('RINGKASAN:', 20, 65);
    doc.setFontSize(12);
    doc.text(`Total Pemasukan: ${formatCurrency(totalPemasukan)}`, 20, 75);
    doc.text(`Total Pengeluaran: ${formatCurrency(totalPengeluaran)}`, 20, 85);
    doc.text(`Saldo: ${formatCurrency(saldo)}`, 20, 95);

    // Prepare data for table
    const tableData = filteredTransaksis.map(transaksi => {
      const santri = santris.find(s => s.id === transaksi.santriId);
      return [
        new Date(transaksi.tanggal).toLocaleDateString('id-ID'),
        transaksi.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
        santri ? santri.nama : '-',
        transaksi.kategori,
        transaksi.keterangan,
        transaksi.ttd || 'Admin',
        formatCurrency(transaksi.jumlah)
      ];
    });

    // Add table
    (doc as any).autoTable({
      head: [['Tanggal', 'Jenis', 'Santri', 'Kategori', 'Keterangan', 'TTD', 'Jumlah']],
      body: tableData,
      startY: 110,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save('laporan-keuangan.pdf');
  };

  const exportToExcel = () => {
    const data = filteredTransaksis.map(transaksi => {
      const santri = santris.find(s => s.id === transaksi.santriId);
      return {
        Tanggal: new Date(transaksi.tanggal).toLocaleDateString('id-ID'),
        Jenis: transaksi.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
        Santri: santri ? santri.nama : '-',
        Kategori: transaksi.kategori,
        Keterangan: transaksi.keterangan,
        TTD: transaksi.ttd || 'Admin',
        Jumlah: transaksi.jumlah
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');
    XLSX.writeFile(wb, 'laporan-keuangan.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Laporan Keuangan</h1>
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Laporan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Transaksi</label>
            <select
              value={filters.jenis}
              onChange={(e) => setFilters({ ...filters, jenis: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Semua</option>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
            <select
              value={filters.santriId}
              onChange={(e) => setFilters({ ...filters, santriId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Semua</option>
              {santris.map((santri) => (
                <option key={santri.id} value={santri.id}>
                  {santri.nama}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pemasukan</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(totalPemasukan)}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalPengeluaran)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(saldo)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${saldo >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
              <FileText className={`w-6 h-6 ${saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detail Transaksi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Menampilkan {filteredTransaksis.length} transaksi
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Santri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TTD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransaksis
                .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                .map((transaksi) => {
                  const santri = santris.find(s => s.id === transaksi.santriId);
                  return (
                    <tr key={transaksi.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaksi.tanggal).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaksi.jenis === 'pemasukan' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaksi.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {santri ? santri.nama : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {transaksi.kategori}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaksi.keterangan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <PenTool className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 font-medium">
                            {transaksi.ttd || 'Admin'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaksi.jenis === 'pemasukan' ? 'text-emerald-600' : 'text-red-600'}>
                          {formatCurrency(transaksi.jumlah)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {filteredTransaksis.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada transaksi yang ditemukan</p>
            <p className="text-sm text-gray-400 mt-2">Sesuaikan filter untuk melihat data transaksi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Laporan;