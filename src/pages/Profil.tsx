import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Camera, Shield, Calendar, MapPin, Building, Phone, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profil: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [currentCredentials, setCurrentCredentials] = useState({ email: 'admin@pondok.com', password: 'admin123' });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '08123456789',
    address: 'Jl. Raya Pesantren No. 123, Bandung',
    joinDate: '2023-01-15',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [institutionData, setInstitutionData] = useState({
    name: 'Pondok Pesantren Al-Hikmah',
    address: 'Jl. Raya Pesantren No. 123, Bandung, Jawa Barat 40123',
    phone: '022-1234567',
    email: 'contact@alhikmah.sch.id',
    website: 'www.alhikmah.sch.id',
    established: '1985',
    capacity: '500',
    currentStudents: '350',
    description: 'Pondok Pesantren Al-Hikmah adalah lembaga pendidikan Islam yang berdedikasi untuk membentuk generasi yang berakhlak mulia, berilmu, dan berwawasan luas.',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Load current credentials on component mount
  useEffect(() => {
    const storedCredentials = localStorage.getItem('loginCredentials');
    if (storedCredentials) {
      setCurrentCredentials(JSON.parse(storedCredentials));
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi update profil
    alert('Profil berhasil diperbarui!');
  };

  const handleInstitutionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi update data institusi
    alert('Data institusi berhasil diperbarui!');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    
    if (profileData.newPassword.length < 6) {
      alert('Password minimal 6 karakter!');
      return;
    }

    try {
      const success = await updatePassword(profileData.currentPassword, profileData.newPassword);
      
      if (success) {
        // Update current credentials display
        setCurrentCredentials(prev => ({
          ...prev,
          password: profileData.newPassword
        }));
        
        alert('Password berhasil diperbarui! Gunakan password baru untuk login selanjutnya.');
        setProfileData({
          ...profileData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        alert('Password saat ini tidak benar!');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengubah password!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Profil Saya
          </h1>
          <p className="text-gray-600 mt-1">Kelola informasi profil dan data institusi</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border-4 border-white/30">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-md rounded-full p-2 cursor-pointer hover:bg-white/30 transition-colors border border-white/30">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
              <p className="text-emerald-100 flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              <p className="text-emerald-100 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200/50">
          <nav className="flex space-x-8 px-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'info'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Informasi Pribadi
              </div>
            </button>
            <button
              onClick={() => setActiveTab('institution')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'security'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Keamanan
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'info' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informasi Pribadi</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nama Lengkap
                      </div>
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Nomor Telepon
                      </div>
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Tanggal Bergabung
                      </div>
                    </label>
                    <input
                      type="date"
                      value={profileData.joinDate}
                      onChange={(e) => setProfileData({ ...profileData, joinDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Alamat
                    </div>
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'institution' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Institusi</h3>
              
              {/* Institution Overview */}
              <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-md border border-emerald-200/50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="w-6 h-6 text-emerald-600" />
                  <h4 className="font-semibold text-emerald-800 text-lg">{institutionData.name}</h4>
                </div>
                <p className="text-emerald-700 mb-4">{institutionData.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{institutionData.established}</p>
                    <p className="text-sm text-emerald-700">Tahun Berdiri</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{institutionData.capacity}</p>
                    <p className="text-sm text-emerald-700">Kapasitas Santri</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{institutionData.currentStudents}</p>
                    <p className="text-sm text-emerald-700">Santri Aktif</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleInstitutionUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Nama Institusi
                    </div>
                  </label>
                  <input
                    type="text"
                    value={institutionData.name}
                    onChange={(e) => setInstitutionData({ ...institutionData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Alamat Lengkap
                    </div>
                  </label>
                  <textarea
                    value={institutionData.address}
                    onChange={(e) => setInstitutionData({ ...institutionData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Nomor Telepon
                      </div>
                    </label>
                    <input
                      type="tel"
                      value={institutionData.phone}
                      onChange={(e) => setInstitutionData({ ...institutionData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Institusi
                      </div>
                    </label>
                    <input
                      type="email"
                      value={institutionData.email}
                      onChange={(e) => setInstitutionData({ ...institutionData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website
                      </div>
                    </label>
                    <input
                      type="url"
                      value={institutionData.website}
                      onChange={(e) => setInstitutionData({ ...institutionData, website: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      placeholder="www.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Tahun Berdiri
                      </div>
                    </label>
                    <input
                      type="number"
                      value={institutionData.established}
                      onChange={(e) => setInstitutionData({ ...institutionData, established: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      min="1900"
                      max="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Kapasitas Santri
                      </div>
                    </label>
                    <input
                      type="number"
                      value={institutionData.capacity}
                      onChange={(e) => setInstitutionData({ ...institutionData, capacity: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Institusi
                  </label>
                  <textarea
                    value={institutionData.description}
                    onChange={(e) => setInstitutionData({ ...institutionData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    rows={4}
                    placeholder="Deskripsi singkat tentang institusi..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Data Institusi
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Keamanan Akun</h3>
              
              {/* Security Info - Updated with real-time credentials */}
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-md border border-blue-200/50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Status Keamanan</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Username Login</span>
                    <span className="text-sm font-medium text-blue-800 bg-blue-100/50 px-3 py-1 rounded-lg">{currentCredentials.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Password Login</span>
                    <span className="text-sm font-medium text-blue-800 bg-blue-100/50 px-3 py-1 rounded-lg">{currentCredentials.password}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Password terakhir diubah</span>
                    <span className="text-sm font-medium text-blue-800">15 hari yang lalu</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Login terakhir</span>
                    <span className="text-sm font-medium text-blue-800">Hari ini, 09:30</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="Masukkan password saat ini"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      placeholder="Masukkan password baru"
                      minLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                      placeholder="Konfirmasi password baru"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-md border border-yellow-200/50 rounded-xl p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Tips Keamanan Password:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Gunakan minimal 8 karakter</li>
                    <li>• Kombinasikan huruf besar, kecil, angka, dan simbol</li>
                    <li>• Jangan gunakan informasi pribadi</li>
                    <li>• Ubah password secara berkala</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Lock className="w-4 h-4" />
                    Update Password
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

export default Profil;