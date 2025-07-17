import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import DataSantri from './pages/DataSantri';
import Pemasukan from './pages/Pemasukan';
import Pengeluaran from './pages/Pengeluaran';
import Laporan from './pages/Laporan';
import Pengaturan from './pages/Pengaturan';
import Profil from './pages/Profil';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <DataProvider>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/santri" element={<DataSantri />} />
          <Route path="/pemasukan" element={<Pemasukan />} />
          <Route path="/pengeluaran" element={<Pengeluaran />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </DataProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;