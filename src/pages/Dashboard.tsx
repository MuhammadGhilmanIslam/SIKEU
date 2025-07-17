import React, { useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { TrendingUp, TrendingDown, Users, Wallet, ChevronLeft, ChevronRight, AlertTriangle, Sparkles, ArrowUpRight, ArrowDownRight, BarChart3, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

const Dashboard: React.FC = () => {
  const { santris, transaksis, getTotalTunggakan } = useData();
  const navigate = useNavigate();
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  const tunggakanData = getTotalTunggakan();

  // Hitung statistik
  const stats: DashboardStats = {
    totalPemasukan: transaksis
      .filter(t => t.jenis === 'pemasukan')
      .reduce((sum, t) => sum + t.jumlah, 0),
    totalPengeluaran: transaksis
      .filter(t => t.jenis === 'pengeluaran')
      .reduce((sum, t) => sum + t.jumlah, 0),
    totalSaldo: 0,
    totalSantri: santris.filter(s => s.status === 'aktif').length,
    totalTunggakan: tunggakanData.total,
    santriTunggakan: tunggakanData.jumlahSantri,
  };
  
  stats.totalSaldo = stats.totalPemasukan - stats.totalPengeluaran;

  // Generate data untuk grafik tren 6 bulan terakhir
  const generateTrendData = () => {
    const months = [];
    const pemasukanData = [];
    const pengeluaranData = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
      months.push(monthName);

      const monthTransaksis = transaksis.filter(t => {
        const transactionDate = new Date(t.tanggal);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });

      const monthPemasukan = monthTransaksis
        .filter(t => t.jenis === 'pemasukan')
        .reduce((sum, t) => sum + t.jumlah, 0);
      
      const monthPengeluaran = monthTransaksis
        .filter(t => t.jenis === 'pengeluaran')
        .reduce((sum, t) => sum + t.jumlah, 0);

      pemasukanData.push(monthPemasukan);
      pengeluaranData.push(monthPengeluaran);
    }

    return { months, pemasukanData, pengeluaranData };
  };

  const trendData = generateTrendData();

  // Data untuk grafik berdasarkan kategori
  const chartCategories = [
    {
      title: 'Pemasukan vs Pengeluaran',
      data: {
        labels: ['Pemasukan', 'Pengeluaran'],
        datasets: [{
          data: [stats.totalPemasukan, stats.totalPengeluaran],
          backgroundColor: [
            '#10B981',
            '#EF4444'
          ],
          borderColor: [
            '#059669',
            '#DC2626'
          ],
          borderWidth: 3,
          hoverOffset: 20,
        }]
      }
    },
    {
      title: 'Kategori Pemasukan',
      data: {
        labels: ['Syahriyah', 'Kas', 'Donasi', 'Lainnya'],
        datasets: [{
          data: [
            transaksis.filter(t => t.jenis === 'pemasukan' && t.kategori === 'syahriyah').reduce((sum, t) => sum + t.jumlah, 0),
            transaksis.filter(t => t.jenis === 'pemasukan' && t.kategori === 'kas').reduce((sum, t) => sum + t.jumlah, 0),
            transaksis.filter(t => t.jenis === 'pemasukan' && t.kategori === 'donasi').reduce((sum, t) => sum + t.jumlah, 0),
            transaksis.filter(t => t.jenis === 'pemasukan' && !['syahriyah', 'kas', 'donasi'].includes(t.kategori)).reduce((sum, t) => sum + t.jumlah, 0),
          ],
          backgroundColor: [
            '#10B981',
            '#3B82F6',
            '#F59E0B',
            '#8B5CF6'
          ],
          borderColor: [
            '#059669',
            '#2563EB',
            '#D97706',
            '#7C3AED'
          ],
          borderWidth: 3,
          hoverOffset: 20,
        }]
      }
    },
    {
      title: 'Kategori Pengeluaran',
      data: {
        labels: ['Makan', 'Sarpras', 'Operasional', 'Lainnya'],
        datasets: [{
          data: [
            transaksis.filter(t => t.jenis === 'pengeluaran' && t.kategori === 'makan').reduce((sum, t) => sum + t.jumlah, 0),
            transaksis.filter(t => t.jenis === 'pengeluaran' && t.kategori === 'sarpras').reduce((sum, t) => sum + t.jumlah, 0),
            transaksis.filter(t => t.jenis === 'pengeluaran' && t.kategori === 'operasional').reduce((sum, t) => sum + t.jumlah, 0),
            transaksis.filter(t => t.jenis === 'pengeluaran' && !['makan', 'sarpras', 'operasional'].includes(t.kategori)).reduce((sum, t) => sum + t.jumlah, 0),
          ],
          backgroundColor: [
            '#EF4444',
            '#F97316',
            '#8B5CF6',
            '#6B7280'
          ],
          borderColor: [
            '#DC2626',
            '#EA580C',
            '#7C3AED',
            '#4B5563'
          ],
          borderWidth: 3,
          hoverOffset: 20,
        }]
      }
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const nextChart = () => {
    setCurrentChartIndex((prev) => (prev + 1) % chartCategories.length);
  };

  const prevChart = () => {
    setCurrentChartIndex((prev) => (prev - 1 + chartCategories.length) % chartCategories.length);
  };

  // Handler untuk navigasi kartu statistik
  const handleCardClick = (type: string) => {
    switch (type) {
      case 'saldo':
        navigate('/laporan');
        break;
      case 'pemasukan':
        navigate('/pemasukan');
        break;
      case 'pengeluaran':
        navigate('/pengeluaran');
        break;
      case 'santri':
        navigate('/santri');
        break;
      case 'tunggakan':
        navigate('/santri?filter=tunggakan');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Dashboard Keuangan
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Ringkasan keuangan pondok pesantren secara real-time
          </p>
        </div>
      </div>

      {/* Stats Cards - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Saldo */}
        <div 
          onClick={() => handleCardClick('saldo')}
          className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                stats.totalSaldo >= 0 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {stats.totalSaldo >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stats.totalSaldo >= 0 ? 'Surplus' : 'Defisit'}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Saldo</p>
              <p className={`text-2xl font-bold ${stats.totalSaldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(stats.totalSaldo)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Pemasukan */}
        <div 
          onClick={() => handleCardClick('pemasukan')}
          className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                <ArrowUpRight className="w-3 h-3" />
                Masuk
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Pemasukan</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(stats.totalPemasukan)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div 
          onClick={() => handleCardClick('pengeluaran')}
          className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                <ArrowDownRight className="w-3 h-3" />
                Keluar
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.totalPengeluaran)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Santri */}
        <div 
          onClick={() => handleCardClick('santri')}
          className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                <Users className="w-3 h-3" />
                Aktif
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Santri</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalSantri}
              </p>
            </div>
          </div>
        </div>

        {/* Total Tunggakan */}
        <div 
          onClick={() => handleCardClick('tunggakan')}
          className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                <AlertTriangle className="w-3 h-3" />
                {stats.santriTunggakan} Santri
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tunggakan</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.totalTunggakan)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Tunggakan */}
      {stats.totalTunggakan > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-50/80 to-amber-50/80 backdrop-blur-xl border border-orange-200/50 rounded-2xl p-6 shadow-lg animate-pulse-slow">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-800 text-lg mb-1">Peringatan Tunggakan</h3>
              <p className="text-orange-700">
                Terdapat <span className="font-bold">{stats.santriTunggakan} santri</span> dengan total tunggakan{' '}
                <span className="font-bold">{formatCurrency(stats.totalTunggakan)}</span>. 
                Segera lakukan penagihan untuk menghindari penumpukan tunggakan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                {chartCategories[currentChartIndex].title}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Visualisasi data keuangan
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={prevChart}
                className="p-3 bg-white/50 backdrop-blur-md border border-white/20 text-gray-600 hover:text-emerald-600 hover:bg-white/70 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {chartCategories.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentChartIndex 
                        ? 'bg-emerald-500 w-6' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextChart}
                className="p-3 bg-white/50 backdrop-blur-md border border-white/20 text-gray-600 hover:text-emerald-600 hover:bg-white/70 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-80 h-80 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 w-full h-full">
                <Doughnut
                  data={chartCategories[currentChartIndex].data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 25,
                          usePointStyle: true,
                          pointStyle: 'circle',
                          font: {
                            size: 14,
                            weight: '500',
                          },
                          color: '#374151',
                        },
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1F2937',
                        bodyColor: '#374151',
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 12,
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                          },
                        },
                      },
                    },
                    animation: {
                      animateRotate: true,
                      duration: 1500,
                      easing: 'easeInOutQuart',
                    },
                    cutout: '60%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Tren Keuangan 6 Bulan
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Perbandingan pemasukan dan pengeluaran
            </p>
          </div>

          <div className="h-80">
            <Line
              data={{
                labels: trendData.months,
                datasets: [
                  {
                    label: 'Pemasukan',
                    data: trendData.pemasukanData,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10B981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                  },
                  {
                    label: 'Pengeluaran',
                    data: trendData.pengeluaranData,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#EF4444',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      pointStyle: 'circle',
                      font: {
                        size: 14,
                        weight: '500',
                      },
                      color: '#374151',
                      padding: 20,
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1F2937',
                    bodyColor: '#374151',
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 12,
                    padding: 12,
                    callbacks: {
                      label: (context) => {
                        const label = context.dataset.label || '';
                        const value = formatCurrency(context.parsed.y);
                        return `${label}: ${value}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: '#6B7280',
                      font: {
                        size: 12,
                        weight: '500',
                      },
                    },
                  },
                  y: {
                    grid: {
                      color: 'rgba(107, 114, 128, 0.1)',
                    },
                    ticks: {
                      color: '#6B7280',
                      font: {
                        size: 12,
                        weight: '500',
                      },
                      callback: (value) => {
                        return new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          notation: 'compact',
                        }).format(value as number);
                      },
                    },
                  },
                },
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                animation: {
                  duration: 1500,
                  easing: 'easeInOutQuart',
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Transaksi Terbaru
            </h2>
            <p className="text-gray-600">5 transaksi terakhir yang dilakukan</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {transaksis
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((transaksi) => (
              <div key={transaksi.id} className="group flex items-center justify-between p-4 hover:bg-white/50 rounded-xl transition-all duration-300 border border-transparent hover:border-white/30">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl shadow-lg ${
                    transaksi.jenis === 'pemasukan' 
                      ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
                      : 'bg-gradient-to-br from-red-500 to-pink-500'
                  }`}>
                    {transaksi.jenis === 'pemasukan' ? (
                      <TrendingUp className="w-5 h-5 text-white" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {transaksi.keterangan}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 capitalize">
                        {transaksi.kategori}
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-sm text-gray-500">
                        {transaksi.ttd || 'Admin'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${
                    transaksi.jenis === 'pemasukan' 
                      ? 'text-emerald-600' 
                      : 'text-red-600'
                  }`}>
                    {transaksi.jenis === 'pemasukan' ? '+' : '-'}{formatCurrency(transaksi.jumlah)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaksi.tanggal).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;