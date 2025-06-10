import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'ダッシュボード' },
  { to: '/expenses', label: '支出管理' },
  { to: '/categories', label: 'カテゴリ管理' },
];

export const SideBar = () => {
  const location = useLocation();
  return (
    <aside className="h-full w-48 bg-primary text-white flex flex-col py-6 px-3 space-y-2">
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`px-3 py-2 rounded hover:bg-primary-dark transition ${location.pathname === item.to ? 'bg-primary-dark font-bold' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}; 