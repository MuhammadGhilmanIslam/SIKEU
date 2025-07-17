import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, UserPlus, AlertTriangle, Calendar, CreditCard, PenTool, User, GraduationCap, Heart, Camera, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Santri } from '../types';

const DataSantri: React.FC = () => {
  const { santris, deleteSantri } = useData();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTunggakan, setFilterTunggakan] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // Check URL params untuk filter tunggakan
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('filter') === 'tunggakan') {
      setFilterTunggakan(true);
    }
  }, [location]);

  const filteredSantris = santris.filter(santri => {
    const matchSearch = santri.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       santri.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchSearch) return false;
    
    if (filterTunggakan) {
      // Filter hanya santri yang memiliki tunggakan
      const { getTagihanSantri } = useData();
      const tagihanSantri = getTagihanSantri(santri.id);
      const currentDate = new Date();
      
      const hasTunggakan = tagihanSantri.some(tagihan => {
        const jatuhTempo = new Date(tagihan.tanggalJatuhTempo);
        return currentDate > jatuhTempo && (tagihan.statusKas !== 'lunas' || tagihan.statusSyahriyah !== 'lunas');
      });
      
      return hasTunggakan;
    }
    
    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data santri ini?')) {
      deleteSantri(id);
    }
  };

  const handleEdit = (santri: Santri) => {
    setSelectedSantri(santri);
    setShowEditModal(true);
  };

  const handleViewDetail = (santri: Santri) => {
    setSelectedSantri(santri);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Data Santri
          </h1>
          {filterTunggakan && (
            <p className="text-orange-600 text-sm mt-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Menampilkan santri dengan tunggakan
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Santri
        </button>
      </div>

      {/* Search Bar & Filter */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-white/20 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari santri berdasarkan nama atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterTunggakan}
                onChange={(e) => setFilterTunggakan(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">Hanya Tunggakan</span>
            </label>
          </div>
        </div>
      </div>

      {/* Santri List */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Pembayaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/50">
              {filteredSantris.map((santri) => (
                <SantriRow key={santri.id} santri={santri} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleViewDetail} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredSantris.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {filterTunggakan ? 'Tidak ada santri dengan tunggakan' : 'Tidak ada data santri yang ditemukan'}
            </p>
          </div>
        )}
      </div>

      {/* Add Santri Modal */}
      {showAddModal && (
        <AddSantriModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Santri Modal */}
      {showEditModal && selectedSantri && (
        <EditSantriModal
          santri={selectedSantri}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSantri(null);
          }}
        />
      )}

      {/* Detail Santri Modal */}
      {showDetailModal && selectedSantri && (
        <DetailSantriModal
          santri={selectedSantri}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSantri(null);
          }}
        />
      )}
    </div>
  );
};

const SantriRow: React.FC<{
  santri: Santri;
  onEdit: (santri: Santri) => void;
  onDelete: (id: string) => void;
  onViewDetail: (santri: Santri) => void;
}> = ({ santri, onEdit, onDelete, onViewDetail }) => {
  const { getTagihanSantri } = useData();
  
  const tagihanSantri = getTagihanSantri(santri.id);
  const currentDate = new Date();
  
  // Hitung tunggakan (tanpa denda)
  const tunggakan = tagihanSantri.filter(tagihan => {
    const jatuhTempo = new Date(tagihan.tanggalJatuhTempo);
    return currentDate > jatuhTempo && (tagihan.statusKas !== 'lunas' || tagihan.statusSyahriyah !== 'lunas');
  });

  const totalTunggakan = tunggakan.reduce((total, tagihan) => {
    let amount = 0;
    if (tagihan.statusKas !== 'lunas') {
      amount += tagihan.jumlahKas; // Tanpa denda
    }
    if (tagihan.statusSyahriyah !== 'lunas') {
      amount += tagihan.jumlahSyahriyah; // Tanpa denda
    }
    return total + amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <tr className="hover:bg-white/70 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{santri.nama}</div>
            <div className="text-sm text-gray-500">
              Masuk: {new Date(santri.tanggalMasuk).toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{santri.alamat}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{santri.namaWali}</div>
        <div className="text-sm text-gray-500">{santri.kontakWali}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          santri.status === 'aktif' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {santri.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {totalTunggakan > 0 ? (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-xs font-semibold text-red-600">
                Tunggakan: {formatCurrency(totalTunggakan)}
              </div>
              <div className="text-xs text-red-500">
                {tunggakan.length} bulan
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">Lancar</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetail(santri)}
            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Lihat Detail & Transaksi"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(santri)}
            className="text-emerald-600 hover:text-emerald-900 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Edit Data Santri"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(santri.id)}
            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Santri"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const AddSantriModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addSantri } = useData();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Data Pribadi
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    noKTP: '',
    noKK: '',
    golonganDarah: '',
    
    // Data Wali/Orang Tua
    namaWali: '',
    pekerjaanWali: '',
    kontakWali: '',
    emailWali: '',
    alamatWali: '',
    
    // Data Pendidikan
    asalSekolah: '',
    tahunLulus: '',
    nilaiUN: '',
    
    // Data Kesehatan
    riwayatPenyakit: '',
    alergi: '',
    
    // Data Pondok
    tanggalMasuk: new Date().toISOString().split('T')[0],
    kamar: '',
    tingkat: '',
    status: 'aktif' as 'aktif' | 'nonaktif',
    
    // Data Tambahan
    hobi: '',
    cita_cita: '',
    motivasi: '',
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSantri({
      ...formData,
      foto: photoPreview || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Tambah Santri Baru</h2>
              <p className="text-emerald-100">Lengkapi semua data santri dengan teliti</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Foto Profil */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-12 h-12 text-emerald-600" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Klik untuk upload foto profil</p>
            </div>

            {/* Data Pribadi */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Data Pribadi</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Masukkan nama lengkap santri"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Kota tempat lahir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Golongan Darah
                  </label>
                  <select
                    value={formData.golonganDarah}
                    onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Pilih Golongan Darah</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    rows={3}
                    placeholder="Alamat lengkap dengan RT/RW, Kelurahan, Kecamatan, Kota"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. KTP/NIK
                  </label>
                  <input
                    type="text"
                    value={formData.noKTP}
                    onChange={(e) => setFormData({ ...formData, noKTP: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="16 digit nomor KTP"
                    maxLength={16}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Kartu Keluarga
                  </label>
                  <input
                    type="text"
                    value={formData.noKK}
                    onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="16 digit nomor KK"
                    maxLength={16}
                  />
                </div>
              </div>
            </div>

            {/* Data Wali/Orang Tua */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-800">Data Wali/Orang Tua</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaWali}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Nama lengkap wali/orang tua"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pekerjaan Wali
                  </label>
                  <input
                    type="text"
                    value={formData.pekerjaanWali}
                    onChange={(e) => setFormData({ ...formData, pekerjaanWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Pekerjaan wali"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kontak Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.kontakWali}
                    onChange={(e) => setFormData({ ...formData, kontakWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Wali
                  </label>
                  <input
                    type="email"
                    value={formData.emailWali}
                    onChange={(e) => setFormData({ ...formData, emailWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Wali
                  </label>
                  <textarea
                    value={formData.alamatWali}
                    onChange={(e) => setFormData({ ...formData, alamatWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    rows={2}
                    placeholder="Kosongkan jika sama dengan alamat santri"
                  />
                </div>
              </div>
            </div>

            {/* Data Pendidikan */}
            <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">Data Pendidikan</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.asalSekolah}
                    onChange={(e) => setFormData({ ...formData, asalSekolah: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="Nama sekolah asal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Lulus
                  </label>
                  <input
                    type="text"
                    value={formData.tahunLulus}
                    onChange={(e) => setFormData({ ...formData, tahunLulus: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="2023"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai UN/Rata-rata
                  </label>
                  <input
                    type="text"
                    value={formData.nilaiUN}
                    onChange={(e) => setFormData({ ...formData, nilaiUN: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="85.5"
                  />
                </div>
              </div>
            </div>

            {/* Data Kesehatan */}
            <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Data Kesehatan</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Riwayat Penyakit
                  </label>
                  <textarea
                    value={formData.riwayatPenyakit}
                    onChange={(e) => setFormData({ ...formData, riwayatPenyakit: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    rows={3}
                    placeholder="Riwayat penyakit yang pernah diderita (kosongkan jika tidak ada)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alergi
                  </label>
                  <textarea
                    value={formData.alergi}
                    onChange={(e) => setFormData({ ...formData, alergi: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    rows={3}
                    placeholder="Alergi makanan, obat, atau lainnya (kosongkan jika tidak ada)"
                  />
                </div>
              </div>
            </div>

            {/* Data Pondok */}
            <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Data Pondok</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Masuk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalMasuk}
                    onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kamar
                  </label>
                  <input
                    type="text"
                    value={formData.kamar}
                    onChange={(e) => setFormData({ ...formData, kamar: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    placeholder="A-101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat Pendidikan
                  </label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  >
                    <option value="">Pilih Tingkat</option>
                    <option value="Ibtidaiyah">Ibtidaiyah</option>
                    <option value="Tsanawiyah">Tsanawiyah</option>
                    <option value="Aliyah">Aliyah</option>
                    <option value="Tahfidz">Tahfidz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'aktif' | 'nonaktif' })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-aktif</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Tambahan */}
            <div className="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-800">Data Tambahan</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hobi
                  </label>
                  <input
                    type="text"
                    value={formData.hobi}
                    onChange={(e) => setFormData({ ...formData, hobi: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    placeholder="Membaca, olahraga, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cita-cita
                  </label>
                  <input
                    type="text"
                    value={formData.cita_cita}
                    onChange={(e) => setFormData({ ...formData, cita_cita: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    placeholder="Ustadz, dokter, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivasi Masuk Pondok
                  </label>
                  <textarea
                    value={formData.motivasi}
                    onChange={(e) => setFormData({ ...formData, motivasi: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    rows={3}
                    placeholder="Alasan dan motivasi masuk pondok pesantren"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white/50 backdrop-blur-md border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Simpan Data Santri
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditSantriModal: React.FC<{ santri: Santri; onClose: () => void }> = ({ santri, onClose }) => {
  const { updateSantri } = useData();
  const [photoPreview, setPhotoPreview] = useState<string | null>(santri.foto || null);
  const [formData, setFormData] = useState({
    // Data Pribadi
    nama: santri.nama || '',
    tempatLahir: santri.tempatLahir || '',
    tanggalLahir: santri.tanggalLahir || '',
    jenisKelamin: santri.jenisKelamin || '',
    alamat: santri.alamat || '',
    noKTP: santri.noKTP || '',
    noKK: santri.noKK || '',
    golonganDarah: santri.golonganDarah || '',
    
    // Data Wali/Orang Tua
    namaWali: santri.namaWali || '',
    pekerjaanWali: santri.pekerjaanWali || '',
    kontakWali: santri.kontakWali || '',
    emailWali: santri.emailWali || '',
    alamatWali: santri.alamatWali || '',
    
    // Data Pendidikan
    asalSekolah: santri.asalSekolah || '',
    tahunLulus: santri.tahunLulus || '',
    nilaiUN: santri.nilaiUN || '',
    
    // Data Kesehatan
    riwayatPenyakit: santri.riwayatPenyakit || '',
    alergi: santri.alergi || '',
    
    // Data Pondok
    tanggalMasuk: santri.tanggalMasuk || '',
    kamar: santri.kamar || '',
    tingkat: santri.tingkat || '',
    status: santri.status || 'aktif',
    
    // Data Tambahan
    hobi: santri.hobi || '',
    cita_cita: santri.cita_cita || '',
    motivasi: santri.motivasi || '',
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSantri(santri.id, {
      ...formData,
      foto: photoPreview || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Edit Data Santri</h2>
              <p className="text-blue-100">Perbarui data santri {santri.nama}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Foto Profil */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2">Klik untuk update foto profil</p>
            </div>

            {/* Data Pribadi */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Data Pribadi</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Masukkan nama lengkap santri"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Kota tempat lahir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Golongan Darah
                  </label>
                  <select
                    value={formData.golonganDarah}
                    onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Pilih Golongan Darah</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    rows={3}
                    placeholder="Alamat lengkap dengan RT/RW, Kelurahan, Kecamatan, Kota"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. KTP/NIK
                  </label>
                  <input
                    type="text"
                    value={formData.noKTP}
                    onChange={(e) => setFormData({ ...formData, noKTP: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="16 digit nomor KTP"
                    maxLength={16}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Kartu Keluarga
                  </label>
                  <input
                    type="text"
                    value={formData.noKK}
                    onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="16 digit nomor KK"
                    maxLength={16}
                  />
                </div>
              </div>
            </div>

            {/* Data Wali/Orang Tua */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-800">Data Wali/Orang Tua</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaWali}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Nama lengkap wali/orang tua"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pekerjaan Wali
                  </label>
                  <input
                    type="text"
                    value={formData.pekerjaanWali}
                    onChange={(e) => setFormData({ ...formData, pekerjaanWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Pekerjaan wali"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kontak Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.kontakWali}
                    onChange={(e) => setFormData({ ...formData, kontakWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Wali
                  </label>
                  <input
                    type="email"
                    value={formData.emailWali}
                    onChange={(e) => setFormData({ ...formData, emailWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Wali
                  </label>
                  <textarea
                    value={formData.alamatWali}
                    onChange={(e) => setFormData({ ...formData, alamatWali: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    rows={2}
                    placeholder="Kosongkan jika sama dengan alamat santri"
                  />
                </div>
              </div>
            </div>

            {/* Data Pendidikan */}
            <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">Data Pendidikan</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.asalSekolah}
                    onChange={(e) => setFormData({ ...formData, asalSekolah: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="Nama sekolah asal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Lulus
                  </label>
                  <input
                    type="text"
                    value={formData.tahunLulus}
                    onChange={(e) => setFormData({ ...formData, tahunLulus: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="2023"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai UN/Rata-rata
                  </label>
                  <input
                    type="text"
                    value={formData.nilaiUN}
                    onChange={(e) => setFormData({ ...formData, nilaiUN: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="85.5"
                  />
                </div>
              </div>
            </div>

            {/* Data Kesehatan */}
            <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Data Kesehatan</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Riwayat Penyakit
                  </label>
                  <textarea
                    value={formData.riwayatPenyakit}
                    onChange={(e) => setFormData({ ...formData, riwayatPenyakit: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    rows={3}
                    placeholder="Riwayat penyakit yang pernah diderita (kosongkan jika tidak ada)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alergi
                  </label>
                  <textarea
                    value={formData.alergi}
                    onChange={(e) => setFormData({ ...formData, alergi: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    rows={3}
                    placeholder="Alergi makanan, obat, atau lainnya (kosongkan jika tidak ada)"
                  />
                </div>
              </div>
            </div>

            {/* Data Pondok */}
            <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Data Pondok</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Masuk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalMasuk}
                    onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kamar
                  </label>
                  <input
                    type="text"
                    value={formData.kamar}
                    onChange={(e) => setFormData({ ...formData, kamar: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    placeholder="A-101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat Pendidikan
                  </label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  >
                    <option value="">Pilih Tingkat</option>
                    <option value="Ibtidaiyah">Ibtidaiyah</option>
                    <option value="Tsanawiyah">Tsanawiyah</option>
                    <option value="Aliyah">Aliyah</option>
                    <option value="Tahfidz">Tahfidz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'aktif' | 'nonaktif' })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-aktif</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Tambahan */}
            <div className="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-800">Data Tambahan</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hobi
                  </label>
                  <input
                    type="text"
                    value={formData.hobi}
                    onChange={(e) => setFormData({ ...formData, hobi: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    placeholder="Membaca, olahraga, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cita-cita
                  </label>
                  <input
                    type="text"
                    value={formData.cita_cita}
                    onChange={(e) => setFormData({ ...formData, cita_cita: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    placeholder="Ustadz, dokter, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivasi Masuk Pondok
                  </label>
                  <textarea
                    value={formData.motivasi}
                    onChange={(e) => setFormData({ ...formData, motivasi: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    rows={3}
                    placeholder="Alasan dan motivasi masuk pondok pesantren"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white/50 backdrop-blur-md border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Update Data Santri
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DetailSantriModal: React.FC<{ santri: Santri; onClose: () => void }> = ({ santri, onClose }) => {
  const { transaksis, getTagihanSantri, bayarTagihan } = useData();
  const [ttdKas, setTtdKas] = useState('');
  const [ttdSyahriyah, setTtdSyahriyah] = useState('');
  const [showTtdModal, setShowTtdModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{bulan: number, tahun: number, jenis: 'kas' | 'syahriyah'} | null>(null);

  // Filter transaksi untuk santri ini
  const santriTransaksis = transaksis.filter(t => t.santriId === santri.id);
  
  // Get tagihan untuk santri ini
  const tagihanSantri = getTagihanSantri(santri.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1];
  };

  const totalPembayaran = santriTransaksis
    .filter(t => t.jenis === 'pemasukan')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const handleBayarTagihan = (bulan: number, tahun: number, jenis: 'kas' | 'syahriyah') => {
    setSelectedPayment({ bulan, tahun, jenis });
    setShowTtdModal(true);
  };

  const confirmPayment = () => {
    if (!selectedPayment) return;
    
    const ttd = selectedPayment.jenis === 'kas' ? ttdKas : ttdSyahriyah;
    if (!ttd.trim()) {
      alert('TTD (Tertanda) harus diisi!');
      return;
    }

    bayarTagihan(santri.id, selectedPayment.bulan, selectedPayment.tahun, selectedPayment.jenis, ttd);
    setShowTtdModal(false);
    setSelectedPayment(null);
    setTtdKas('');
    setTtdSyahriyah('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Detail Santri & Riwayat Pembayaran</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Data Santri */}
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Pribadi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nama Lengkap</p>
                <p className="text-sm text-gray-900">{santri.nama}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tanggal Lahir</p>
                <p className="text-sm text-gray-900">
                  {new Date(santri.tanggalLahir).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Alamat</p>
                <p className="text-sm text-gray-900">{santri.alamat}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tanggal Masuk</p>
                <p className="text-sm text-gray-900">
                  {new Date(santri.tanggalMasuk).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Nama Wali</p>
                <p className="text-sm text-gray-900">{santri.namaWali}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Kontak Wali</p>
                <p className="text-sm text-gray-900">{santri.kontakWali}</p>
              </div>
            </div>
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="bg-emerald-50/80 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ringkasan Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pembayaran</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalPembayaran)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Jumlah Transaksi</p>
                <p className="text-lg font-bold text-emerald-600">{santriTransaksis.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  santri.status === 'aktif' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {santri.status}
                </span>
              </div>
            </div>
          </div>

          {/* Tagihan Bulanan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Tagihan Bulanan (Jatuh Tempo Tanggal 10)
            </h3>
            {tagihanSantri.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagihanSantri
                  .sort((a, b) => b.tahun - a.tahun || b.bulan - a.bulan)
                  .map((tagihan) => {
                    const currentDate = new Date();
                    const jatuhTempo = new Date(tagihan.tanggalJatuhTempo);
                    const isOverdue = currentDate > jatuhTempo;

                    return (
                      <div key={tagihan.id} className={`border rounded-lg p-4 backdrop-blur-sm ${
                        isOverdue && (tagihan.statusKas !== 'lunas' || tagihan.statusSyahriyah !== 'lunas')
                          ? 'border-red-200 bg-red-50/80' 
                          : 'border-gray-200 bg-white/80'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {getMonthName(tagihan.bulan)} {tagihan.tahun}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Jatuh Tempo: {new Date(tagihan.tanggalJatuhTempo).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          {isOverdue && (tagihan.statusKas !== 'lunas' || tagihan.statusSyahriyah !== 'lunas') && (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                        </div>

                        <div className="space-y-3">
                          {/* Kas */}
                          <div className="flex justify-between items-center p-2 bg-gray-50/80 backdrop-blur-sm rounded">
                            <div>
                              <p className="text-sm font-medium">Kas</p>
                              <p className="text-sm text-gray-600">
                                {formatCurrency(tagihan.jumlahKas)}
                              </p>
                              {tagihan.ttdKas && (
                                <div className="flex items-center gap-1 mt-1">
                                  <PenTool className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">TTD: {tagihan.ttdKas}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                tagihan.statusKas === 'lunas' 
                                  ? 'bg-green-100 text-green-800' 
                                  : tagihan.statusKas === 'terlambat'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {tagihan.statusKas === 'lunas' ? 'Lunas' : 
                                 tagihan.statusKas === 'terlambat' ? 'Terlambat' : 'Belum Lunas'}
                              </span>
                              {tagihan.statusKas !== 'lunas' && (
                                <button
                                  onClick={() => handleBayarTagihan(tagihan.bulan, tagihan.tahun, 'kas')}
                                  className="px-2 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
                                >
                                  Bayar
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Syahriyah */}
                          <div className="flex justify-between items-center p-2 bg-gray-50/80 backdrop-blur-sm rounded">
                            <div>
                              <p className="text-sm font-medium">Syahriyah</p>
                              <p className="text-sm text-gray-600">
                                {formatCurrency(tagihan.jumlahSyahriyah)}
                              </p>
                              {tagihan.ttdSyahriyah && (
                                <div className="flex items-center gap-1 mt-1">
                                  <PenTool className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">TTD: {tagihan.ttdSyahriyah}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                tagihan.statusSyahriyah === 'lunas' 
                                  ? 'bg-green-100 text-green-800' 
                                  : tagihan.statusSyahriyah === 'terlambat'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {tagihan.statusSyahriyah === 'lunas' ? 'Lunas' : 
                                 tagihan.statusSyahriyah === 'terlambat' ? 'Terlambat' : 'Belum Lunas'}
                              </span>
                              {tagihan.statusSyahriyah !== 'lunas' && (
                                <button
                                  onClick={() => handleBayarTagihan(tagihan.bulan, tagihan.tahun, 'syahriyah')}
                                  className="px-2 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
                                >
                                  Bayar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50/80 backdrop-blur-sm rounded-lg">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada tagihan untuk santri ini</p>
              </div>
            )}
          </div>

          {/* Riwayat Transaksi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Riwayat Transaksi
            </h3>
            {santriTransaksis.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm">
                  <thead className="bg-gray-50/80 backdrop-blur-sm">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Jenis
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Kategori
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Keterangan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        TTD
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/50">
                    {santriTransaksis
                      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                      .map((transaksi) => (
                        <tr key={transaksi.id} className="hover:bg-white/70 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(transaksi.tanggal).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaksi.jenis === 'pemasukan' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaksi.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                            {transaksi.kategori}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {transaksi.keterangan}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <PenTool className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {transaksi.ttd || 'Admin'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            <span className={transaksi.jenis === 'pemasukan' ? 'text-emerald-600' : 'text-red-600'}>
                              {formatCurrency(transaksi.jumlah)}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50/80 backdrop-blur-sm rounded-lg">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada riwayat transaksi untuk santri ini</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TTD Modal */}
      {showTtdModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-xl w-full max-w-md mx-4 border border-white/20">
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Pembayaran {selectedPayment.jenis === 'kas' ? 'Kas' : 'Syahriyah'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {getMonthName(selectedPayment.bulan)} {selectedPayment.tahun}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4" />
                    TTD (Tertanda)
                  </div>
                </label>
                <input
                  type="text"
                  value={selectedPayment.jenis === 'kas' ? ttdKas : ttdSyahriyah}
                  onChange={(e) => {
                    if (selectedPayment.jenis === 'kas') {
                      setTtdKas(e.target.value);
                    } else {
                      setTtdSyahriyah(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/50 backdrop-blur-sm"
                  placeholder="Nama penanggung jawab pembayaran"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowTtdModal(false);
                    setSelectedPayment(null);
                    setTtdKas('');
                    setTtdSyahriyah('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmPayment}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSantri;