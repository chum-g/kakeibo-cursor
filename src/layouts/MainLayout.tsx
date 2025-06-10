import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TopBar } from '../components/TopBar';
import { SideBar } from '../components/SideBar';
import { BottomBar } from '../components/BottomBar';

export const MainLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <TopBar onSignOut={handleSignOut} />
      <div className="flex flex-1 w-full">
        <div className="hidden md:block min-w-[12rem]">
          <SideBar />
        </div>
        <main className="flex-1 py-4 px-2 sm:px-4 md:px-8 transition-all">
          <Outlet />
        </main>
      </div>
      <BottomBar />
    </div>
  );
}; 