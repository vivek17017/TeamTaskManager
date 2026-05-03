"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { fetchApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { CheckCircle2, CircleDashed, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type DashboardData = {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
  };
  recentTasks: any[];
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await fetchApi('/dashboard');
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="p-8 text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}</h1>
          <p className="mt-2 text-slate-600">Here's what's happening with your tasks today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <CircleDashed className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{data?.stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 mr-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{data?.stats.completed}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{data?.stats.inProgress}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
            <div className="p-3 rounded-lg bg-red-50 text-red-600 mr-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">{data?.stats.overdue}</p>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Tasks</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {data?.recentTasks.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No tasks found.</div>
            ) : (
              data?.recentTasks.map((task) => (
                <div key={task.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Project: {task.project.name} {task.assignedTo ? `• Assigned to: ${task.assignedTo.name}` : '• Unassigned'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 
                          task.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 
                          'bg-slate-100 text-slate-800'}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <Link href={`/projects/${task.projectId}`} className="ml-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Project
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
