import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Trophy } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[#333] bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xl">G</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">강원금연지원센터</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-[#FFD700]' : 'text-gray-400 hover:text-white'}`}>
              홈
            </Link>
            <Link to="/quiz" className={`text-sm font-medium ${location.pathname === '/quiz' ? 'text-[#FFD700]' : 'text-gray-400 hover:text-white'}`}>
              OX 퀴즈
            </Link>
            <Link to="/admin" className={`flex items-center gap-1 text-sm font-medium ${location.pathname.startsWith('/admin') ? 'text-[#FFD700]' : 'text-gray-400 hover:text-white'}`}>
              <Shield className="w-4 h-4" />
              관리자
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t border-[#333] py-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-4">
            © 2026 강원금연지원센터. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-600">
            <span>개인정보처리방침</span>
            <span>이용약관</span>
            <span>문의하기</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
