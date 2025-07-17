import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Eye, EyeOff, Sparkles, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900 dark:to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/10 to-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20 dark:border-slate-700/50">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                <GraduationCap className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              Pondok Pesantren
            </h1>
            <p className="text-emerald-100 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Sistem Manajemen Keuangan
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Selamat Datang
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Masuk ke dashboard admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-md border border-white/20 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                placeholder="admin@pondok.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-md border border-white/20 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-600/50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-md text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200/50 dark:border-red-700/50">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-3 px-4 rounded-xl font-medium hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Masuk...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  Masuk
                </div>
              )}
            </button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-md rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Demo Account</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                <strong>Email:</strong> admin@pondok.com
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                <strong>Password:</strong> admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;