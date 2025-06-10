import React from 'react';

export const TopBar: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => (
  <header className="w-full h-14 flex items-center px-6 bg-primary text-white shadow z-10">
    <div className="flex-1 flex items-center">
      <span className="text-lg font-bold tracking-wide">家計簿アプリ</span>
    </div>
    <div>
      <button
        onClick={onSignOut}
        className="bg-white text-primary font-bold px-4 py-2 rounded hover:bg-gray-100 transition"
      >
        ログアウト
      </button>
    </div>
  </header>
); 