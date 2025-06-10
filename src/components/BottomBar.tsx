import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'ダッシュボード' },
  { to: '/expenses', label: '支出管理' },
  { to: '/categories', label: 'カテゴリ管理' },
];

export const BottomBar = () => {
  const location = useLocation();
  return (
    <footer className="fixed bottom-0 left-0 w-full h-14 bg-primary text-white flex md:hidden justify-around items-center z-20">
      {navItems.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className={`px-3 py-2 rounded hover:bg-primary-dark transition ${location.pathname === item.to ? 'bg-primary-dark font-bold' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </footer>
  );
}; 