import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/santri', icon: Users, label: 'Data Santri' },
    { path: '/pemasukan', icon: TrendingUp, label: 'Pemasukan' },
    { path: '/pengeluaran', icon: TrendingDown, label: 'Pengeluaran' },
    { path: '/laporan', icon: FileText, label: 'Laporan' },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white w-64 min-h-screen p-4 backdrop-blur-xl bg-opacity-95 shadow-2xl relative">
      {/* Close Button - Always visible when sidebar is open */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10"
        title="Tutup Sidebar"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
        <div className="bg-gradient-to-br from-white/20 to-white/10 p-3 rounded-xl backdrop-blur-sm">
          <GraduationCap className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Pondok Pesantren
          </h1>
          <p className="text-sm text-emerald-100/80 font-medium">Manajemen Keuangan</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                // Close sidebar on mobile when menu item is clicked
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={`group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? 'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg backdrop-blur-md border border-white/20'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white hover:backdrop-blur-md hover:shadow-lg'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-white/20 shadow-md' 
                  : 'group-hover:bg-white/10'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;