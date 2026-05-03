"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { fetchApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Plus, CheckCircle2, Clock, Trash2, Calendar } from 'lucide-react';

export default function ProjectTasks() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTasks();
    if (user?.role === 'ADMIN') {
      loadUsers();
    }
  }, [id, user]);

  const loadTasks = async () => {
    try {
      const data = await fetchApi(`/tasks?projectId=${id}`);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await fetchApi('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      assignedToId: formData.get('assignedToId') || undefined,
      dueDate: formData.get('dueDate') || undefined,
      projectId: id,
    };

    try {
      await fetchApi('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      setShowCreate(false);
      loadTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await fetchApi(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      loadTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to update task status');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetchApi(`/tasks/${taskId}`, {
        method: 'DELETE',
      });
      loadTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Project Tasks</h1>
            <p className="mt-2 text-slate-600">Manage tasks for this project.</p>
          </div>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2 -ml-1" />
              New Task
            </button>
          )}
        </div>

        {showCreate && user?.role === 'ADMIN' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">Task Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  name="description"
                  id="description"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="assignedToId" className="block text-sm font-medium text-slate-700">Assign To</label>
                  <select
                    name="assignedToId"
                    id="assignedToId"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    id="dueDate"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
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
                  {isSubmitting ? 'Creating...' : 'Create Task'}
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
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                <CheckCircle2 className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">No tasks yet</h3>
                <p className="mt-1 text-sm text-slate-500">Tasks assigned to this project will appear here.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                          ${task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            'bg-slate-50 text-slate-700 border-slate-200'}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        {task.description || 'No description.'}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Assignee:</span>
                          {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {/* Status Update Dropdown (Only Admin or the Assignee can update) */}
                      {(user?.role === 'ADMIN' || user?.id === task.assignedToId) && (
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="block w-full pl-3 pr-8 py-2 text-sm border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg border bg-slate-50"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      )}
                      
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-red-200 text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 focus:outline-none transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
