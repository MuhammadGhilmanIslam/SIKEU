import React, { ReactNode, useState, useEffect } from 'react';
import { Bell, User, ChevronDown, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'payment' | 'warning' | 'info' | 'santri';
  link?: string;
  isNew: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { santris, transaksis, getTotalTunggakan } = useData();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate notifikasi berdasarkan data
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];
      const now = new Date();
      
      // Notifikasi transaksi terbaru (5 transaksi terakhir hari ini)
      const todayTransactions = transaksis
        .filter(t => {
          const transactionDate = new Date(t.tanggal);
          return transactionDate.toDateString() === now.toDateString();
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      todayTransactions.forEach(transaction => {
        const santri = santris.find(s => s.id === transaction.santriId);
        const timeAgo = Math.floor((now.getTime() - new Date(transaction.createdAt).getTime()) / (1000 * 60));
        
        newNotifications.push({
          id: `transaction-${transaction.id}`,
          message: `${transaction.jenis === 'pemasukan' ? 'Pembayaran' : 'Pengeluaran'} ${transaction.kategori}${santri ? ` dari ${santri.nama}` : ''} - ${formatCurrency(transaction.jumlah)}`,
          time: timeAgo < 1 ? 'Baru saja' : `${timeAgo} menit lalu`,
          type: 'payment',
          link: transaction.jenis === 'pemasukan' ? '/pemasukan' : '/pengeluaran',
          isNew: timeAgo < 30
        });
      });

      // Notifikasi tunggakan
      const tunggakanData = getTotalTunggakan();
      if (tunggakanData.total > 0) {
        newNotifications.push({
          id: 'tunggakan-alert',
          message: `${tunggakanData.jumlahSantri} santri memiliki tunggakan total ${formatCurrency(tunggakanData.total)}`,
          time: '1 jam lalu',
          type: 'warning',
          link: '/santri?filter=tunggakan',
          isNew: false
        });
      }

      // Notifikasi santri baru (yang masuk dalam 7 hari terakhir)
      const recentSantris = santris.filter(santri => {
        const masukDate = new Date(santri.tanggalMasuk);
        const daysDiff = (now.getTime() - masukDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= 7 && santri.status === 'aktif';
      });

      recentSantris.forEach(santri => {
        const daysDiff = Math.floor((now.getTime() - new Date(santri.tanggalMasuk).getTime()) / (1000 * 3600 * 24));
        newNotifications.push({
          id: `santri-${santri.id}`,
          message: `Santri baru ${santri.nama} telah terdaftar`,
          time: daysDiff === 0 ? 'Hari ini' : `${daysDiff} hari lalu`,
          type: 'santri',
          link: '/santri',
          isNew: daysDiff <= 1
        });
      });

      // Notifikasi sistem
      if (newNotifications.length === 0) {
        newNotifications.push({
          id: 'system-info',
          message: 'Sistem berjalan normal, semua data tersinkronisasi',
          time: '2 jam lalu',
          type: 'info',
          isNew: false
        });
      }

      setNotifications(newNotifications.slice(0, 5)); // Maksimal 5 notifikasi
    };

    generateNotifications();
  }, [transaksis, santris, getTotalTunggakan]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const newNotificationsCount = notifications.filter(n => n.isNew).length;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Close sidebar on window resize for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Top Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Side - Menu Toggle & Welcome */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-white/50 backdrop-blur-md border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
              </button>
              
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Selamat Datang, {user?.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola keuangan pondok pesantren dengan mudah dan efisien
                </p>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              {/* Current Date & Time */}
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-700">
                  {currentTime.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {newNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {newNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 animate-slide-down">
                    <div className="p-4 border-b border-gray-200/50">
                      <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                      <p className="text-xs text-gray-500 mt-1">{notifications.length} notifikasi</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-4 hover:bg-gray-50/50 transition-colors border-b border-gray-100/50 last:border-b-0 cursor-pointer ${
                            notification.isNew ? 'bg-emerald-50/30' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'payment' ? 'bg-emerald-500' :
                              notification.type === 'warning' ? 'bg-orange-500' :
                              notification.type === 'santri' ? 'bg-blue-500' :
                              'bg-gray-400'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {notification.isNew && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Baru</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/50 backdrop-blur-md border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 animate-slide-down">
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          navigate('/profil');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100/50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <UserCircle className="w-4 h-4" />
                        Profil Saya
                      </button>
                      <hr className="my-2 border-gray-200/50" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;