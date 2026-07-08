import { useState, type FormEvent } from 'react';
import { LogIn, UserPlus, Shield, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps { onClose?: () => void }

type Mode = 'login' | 'register';

export function LoginPage({ onClose }: LoginPageProps) {
  const { login, register, googleLogin, loginModalTitle, loginModalSubtitle } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) { setError('Email and password are required'); return; }
    if (mode === 'register' && !name.trim()) { setError('Name is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setBusy(true);
    const err = mode === 'login' ? await login(email.trim(), password) : await register(name.trim(), email.trim(), password);
    setBusy(false);
    if (err) setError(err);
  };

  const handleGoogleLogin = async () => {
    setGoogleBusy(true);
    await googleLogin();
    setGoogleBusy(false);
  };

  const form = (
    <div className="bg-white rounded-lg shadow-xl border border-gold-200 p-6 space-y-4 w-full max-w-sm">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-50 rounded-lg mb-3">
          <Sparkles className="w-6 h-6 text-gold-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{loginModalTitle}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{loginModalSubtitle}</p>
      </div>

      <button onClick={handleGoogleLogin} disabled={googleBusy}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm">
        {googleBusy ? (
          <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </>
        )}
      </button>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
              className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
            className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters"
            className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2">{error}</div>}
        <button type="submit" disabled={busy}
          className="w-full flex items-center justify-center gap-2 bg-gold-600 text-white font-semibold py-2.5 rounded hover:bg-gold-700 transition-colors disabled:opacity-50">
          {busy ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : mode === 'login' ? <><LogIn className="w-4 h-4" /> Sign In</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
        </button>
        <div className="text-center">
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
            className="text-sm text-gold-600 hover:text-gold-700 font-medium">
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>

      <div className="text-center pt-1">
        <p className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1"><Shield className="w-3 h-3" /> Demo accounts</p>
        <div className="flex gap-4 text-xs text-gray-500">
          <div><span className="font-medium">Admin:</span> admin@littlesarojini.in / admin</div>
          <div><span className="font-medium">Customer:</span> customer@littlesarojini.in / customer</div>
        </div>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="relative">
          <button onClick={onClose} className="absolute -top-2 -right-2 z-10 p-1 bg-white rounded-full shadow border border-gold-200 text-gray-500 hover:text-gray-900"><X className="w-4 h-4" /></button>
          {form}
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-gradient-to-br from-gold-50 to-white flex flex-col items-center justify-center px-4">{form}</div>;
}
