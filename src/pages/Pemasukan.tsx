import React, { useState } from 'react';
import { Plus, TrendingUp, Calendar, User, Tag, Edit, Trash2, PenTool } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Transaksi } from '../types';

const Pemasukan: React.FC = () => {
  const { transaksis, santris, deleteTransaksi } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);

  const pemasukanTransaksis = transaksis.filter(t => t.jenis === 'pemasukan');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleEdit = (transaksi: Transaksi) => {
    setSelectedTransaksi(transaksi);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi pemasukan ini?')) {
      deleteTransaksi(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pemasukan</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pemasukan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pemasukan</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(pemasukanTransaksis.reduce((sum, t) => sum + t.jumlah, 0))}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(
                  pemasukanTransaksis
                    .filter(t => new Date(t.tanggal).getMonth() === new Date().getMonth())
                    .reduce((sum, t) => sum + t.jumlah, 0)
                )}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jumlah Transaksi</p>
              <p className="text-2xl font-bold text-emerald-600">
                {pemasukanTransaksis.length}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Tag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Pemasukan</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pemasukanTransaksis
                .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                .map((transaksi) => {
                  const santri = santris.find(s => s.id === transaksi.santriId);
                  return (
                    <tr key={transaksi.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaksi.tanggal).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-emerald-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {santri ? santri.nama : 'Tidak ada'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 capitalize">
                          {transaksi.kategori}
                        </span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                        {formatCurrency(transaksi.jumlah)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(transaksi)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Transaksi"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaksi.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Transaksi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {pemasukanTransaksis.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada data pemasukan</p>
          </div>
        )}
      </div>

      {/* Add Pemasukan Modal */}
      {showAddModal && (
        <AddPemasukanModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Pemasukan Modal */}
      {showEditModal && selectedTransaksi && (
        <EditPemasukanModal
          transaksi={selectedTransaksi}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTransaksi(null);
          }}
        />
      )}
    </div>
  );
};

const AddPemasukanModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { santris, addTransaksi } = useData();
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    santriId: '',
    jumlah: '',
    kategori: 'syahriyah',
    keterangan: '',
    ttd: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaksi({
      tanggal: formData.tanggal,
      santriId: formData.santriId || undefined,
      jumlah: parseInt(formData.jumlah),
      jenis: 'pemasukan',
      kategori: formData.kategori,
      keterangan: formData.keterangan,
      ttd: formData.ttd,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tambah Pemasukan</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
            <select
              value={formData.santriId}
              onChange={(e) => setFormData({ ...formData, santriId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Pilih Santri (Opsional)</option>
              {santris.map((santri) => (
                <option key={santri.id} value={santri.id}>
                  {santri.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="syahriyah">Syahriyah</option>
              <option value="kas">Kas</option>
              <option value="donasi">Donasi</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
            <input
              type="number"
              value={formData.jumlah}
              onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Deskripsi pemasukan..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                TTD (Tertanda)
              </div>
            </label>
            <input
              type="text"
              value={formData.ttd}
              onChange={(e) => setFormData({ ...formData, ttd: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nama penanggung jawab transaksi"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditPemasukanModal: React.FC<{ transaksi: Transaksi; onClose: () => void }> = ({ transaksi, onClose }) => {
  const { santris, updateTransaksi } = useData();
  const [formData, setFormData] = useState({
    tanggal: transaksi.tanggal,
    santriId: transaksi.santriId || '',
    jumlah: transaksi.jumlah.toString(),
    kategori: transaksi.kategori,
    keterangan: transaksi.keterangan,
    ttd: transaksi.ttd || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTransaksi(transaksi.id, {
      tanggal: formData.tanggal,
      santriId: formData.santriId || undefined,
      jumlah: parseInt(formData.jumlah),
      kategori: formData.kategori,
      keterangan: formData.keterangan,
      ttd: formData.ttd,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Pemasukan</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
            <select
              value={formData.santriId}
              onChange={(e) => setFormData({ ...formData, santriId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Pilih Santri (Opsional)</option>
              {santris.map((santri) => (
                <option key={santri.id} value={santri.id}>
                  {santri.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="syahriyah">Syahriyah</option>
              <option value="kas">Kas</option>
              <option value="donasi">Donasi</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
            <input
              type="number"
              value={formData.jumlah}
              onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Deskripsi pemasukan..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                TTD (Tertanda)
              </div>
            </label>
            <input
              type="text"
              value={formData.ttd}
              onChange={(e) => setFormData({ ...formData, ttd: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nama penanggung jawab transaksi"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pemasukan;