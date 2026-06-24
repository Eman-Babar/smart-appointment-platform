import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="relative z-20 glass border-b border-white/10 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="font-bold text-white text-base tracking-tight">AppointEase</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-white/10 text-white/80 px-2.5 py-1 rounded-full font-medium capitalize border border-white/20">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
          {user?.role}
        </span>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white/20">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none">{user?.name}</p>
            <p className="text-xs text-white/50 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}