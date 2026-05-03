"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, LayoutDashboard, FolderKanban, UserCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskPro
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link href="/projects" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <FolderKanban className="w-4 h-4 mr-2" />
                Projects
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <UserCircle className="w-5 h-5" />
              <span>{user.name}</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium border border-slate-200">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-red-600 transition-colors p-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
