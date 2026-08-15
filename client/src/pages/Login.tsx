import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const r = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', r.data.token);
      nav('/personal-guardian');
    } catch (err: any) {
      console.error('Login error:', err);
      // If user account is not found, attempt auto-registration for seamless UX
      if (err.response?.status === 401) {
        try {
          const regRes = await axios.post('/api/auth/register', {
            name: email.split('@')[0] || 'User',
            email,
            password,
          });
          localStorage.setItem('token', regRes.data.token);
          nav('/personal-guardian');
          return;
        } catch (regErr: any) {
          setError(regErr.response?.data?.error || 'Invalid email or password.');
        }
      } else {
        setError(err.response?.data?.error || 'Failed to connect to backend server.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4">
      <form onSubmit={submit} className="p-8 bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-black mb-1 text-white">Login</h2>
        <p className="text-xs text-slate-400 mb-6">Sign in to access Smart Airport services</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 font-bold rounded-xl text-white shadow-lg transition active:scale-95 disabled:opacity-50 mb-4"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-400 font-bold hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
