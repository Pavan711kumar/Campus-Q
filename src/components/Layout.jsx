import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Menu, ShoppingBag, TimerReset } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from './ui/Button.jsx';

const navByRole = {
  student: [
    ['Dashboard', '/student'],
    ['Menu', '/student/menu'],
    ['Cart', '/student/cart'],
    ['Orders', '/student/orders']
  ],
  canteen: [
    ['Dashboard', '/canteen'],
    ['Incoming Orders', '/canteen/orders'],
    ['Menu Management', '/canteen/menu']
  ],
  admin: [['Dashboard', '/admin']]
};

export function AppLayout() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const links = navByRole[profile?.role] || [];

  async function logout() {
    await signOut(auth);
    navigate('/login');
  }

  return (
    <div className="page-shell">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/82 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-600 text-white">
              <TimerReset size={22} />
            </span>
            <div>
              <p className="text-lg font-black text-stone-900">CampusQ</p>
              <p className="hidden text-xs font-semibold text-green-700 sm:block">Skip queues. Pick up faster.</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-green-50 text-green-700' : 'text-stone-600 hover:bg-stone-100'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {profile?.role === 'student' && (
              <Button variant="outline" size="sm" onClick={() => navigate('/student/cart')}>
                <ShoppingBag size={16} /> Cart
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </Button>
            <Menu className="lg:hidden" size={20} />
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-green-600 text-white' : 'bg-white text-stone-600'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
