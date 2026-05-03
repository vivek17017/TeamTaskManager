"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { fetchApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Plus, FolderKanban } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchApi('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const description = formData.get('description');

    try {
      await fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      });
      setShowCreate(false);
      loadProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
            <p className="mt-2 text-slate-600">Manage your team's projects.</p>
          </div>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2 -ml-1" />
              New Project
            </button>
          )}
        </div>

        {showCreate && user?.role === 'ADMIN' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Project Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                <FolderKanban className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">No projects</h3>
                <p className="mt-1 text-sm text-slate-500">Get started by creating a new project.</p>
              </div>
            ) : (
              projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group cursor-pointer h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <FolderKanban className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {project._count.tasks} Tasks
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{project.name}</h3>
                    <p className="text-sm text-slate-500 flex-1 line-clamp-3">
                      {project.description || 'No description provided.'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 font-medium group-hover:text-blue-600 transition-colors flex items-center">
                      View details &rarr;
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
