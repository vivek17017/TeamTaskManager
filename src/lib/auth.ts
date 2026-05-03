import { verifyToken } from './jwt';
import prisma from './prisma';

export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token) as { id: string; role: string } | null;

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, role: true }
  });

  return user;
}
