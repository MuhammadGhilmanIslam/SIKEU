import React, { useState } from 'react';
import { User, Lock, Save, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Pengaturan: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [institutionData, setInstitutionData] = useState({
    name: 'Pondok Pesantren Al-Hikmah',
    address: 'Jl. Raya Pesantren No. 123, Bandung, Jawa Barat',
    phone: '022-1234567',
    email: 'contact@alhikmah.sch.id',
    website: 'www.alhikmah.sch.id',
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi update profil
    alert('Profil berhasil diperbarui!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    
    if (profileData.newPassword.length < 6) {
      alert('Password minimal 6 karakter!');
      return;
    }

    // Implementasi update password
    alert('Password berhasil diperbarui!');
    setProfileData({
      ...profileData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleInstitutionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi update institusi
    alert('Data institusi berhasil diperbarui!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profil Admin
              </div>
            </button>
            <button
              onClick={() => setActiveTab('institution')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'institution'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Data Institusi
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Profile Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Profil</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Simpan Profil
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Change */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubah Password</h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        minLength={6}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'institution' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Institusi</h2>
              <form onSubmit={handleInstitutionUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Institusi
                  </label>
                  <input
                    type="text"
                    value={institutionData.name}
                    onChange={(e) => setInstitutionData({ ...institutionData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    value={institutionData.address}
                    onChange={(e) => setInstitutionData({ ...institutionData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={institutionData.phone}
                      onChange={(e) => setInstitutionData({ ...institutionData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Institusi
                    </label>
                    <input
                      type="email"
                      value={institutionData.email}
                      onChange={(e) => setInstitutionData({ ...institutionData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={institutionData.website}
                    onChange={(e) => setInstitutionData({ ...institutionData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Data Institusi
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;