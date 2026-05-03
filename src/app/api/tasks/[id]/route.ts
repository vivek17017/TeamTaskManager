import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const updateTaskSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
  dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
});

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = updateTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (user.role === 'MEMBER') {
      // Members can only update status, and only if assigned to them
      if (task.assignedToId !== user.id) {
        return NextResponse.json({ error: 'Forbidden: Can only update your assigned tasks' }, { status: 403 });
      }
      
      const allowedUpdates = { status: result.data.status };
      const updatedTask = await prisma.task.update({
        where: { id },
        data: allowedUpdates,
        include: { assignedTo: { select: { id: true, name: true } } }
      });
      return NextResponse.json(updatedTask);
    }

    // Admin can update anything
    const updatedTask = await prisma.task.update({
      where: { id },
      data: result.data,
      include: { assignedTo: { select: { id: true, name: true } } }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Task PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Task DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
