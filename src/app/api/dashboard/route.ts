import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admins see all tasks, members see their assigned tasks
    const taskWhere = user.role === 'ADMIN' ? {} : { assignedToId: user.id };

    const totalTasks = await prisma.task.count({ where: taskWhere });
    const completedTasks = await prisma.task.count({ where: { ...taskWhere, status: 'COMPLETED' } });
    const inProgressTasks = await prisma.task.count({ where: { ...taskWhere, status: 'IN_PROGRESS' } });
    const pendingTasks = await prisma.task.count({ where: { ...taskWhere, status: 'PENDING' } });
    
    const overdueTasks = await prisma.task.count({
      where: {
        ...taskWhere,
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() }
      }
    });

    const recentTasks = await prisma.task.findMany({
      where: taskWhere,
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json({
      stats: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
        overdue: overdueTasks
      },
      recentTasks
    });
  } catch (error) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
