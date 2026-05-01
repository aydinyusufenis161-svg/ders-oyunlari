import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineCog6Tooth, HiOutlinePlayCircle } from 'react-icons/hi2';
import clsx from 'clsx';

const links = [
  { to: '/dashboard', label: 'Ana Sayfa', icon: HiOutlineHome },
  { to: '/game/setup', label: 'Yeni Oyun', icon: HiOutlinePlayCircle },
  { to: '/settings', label: 'API Ayarları', icon: HiOutlineCog6Tooth },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">
          EW
        </div>
        <span className="text-lg font-bold text-slate-800">EduWheel</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-4 py-4">
        <p className="text-xs text-slate-400 text-center">EduWheel v1.0</p>
      </div>
    </aside>
  );
}
