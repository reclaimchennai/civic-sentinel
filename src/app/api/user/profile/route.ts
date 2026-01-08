import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Mock Profile Data
  // In a real app, fetch from DB using session.user.id
  const userProfile = {
    id: session.user?.id || 'mock-id',
    name: session.user?.name,
    email: session.user?.email,
    level: 5,
    points: 450,
    nextLevelPoints: 1000,
    reports: 12,
    approved: 10,
    badges: ['Early Adopter', 'Pothole Patrol', 'Night Owl'],
    mayorship: 'T. Nagar',
    joinedAt: new Date().toISOString()
  };

  return NextResponse.json(userProfile);
}
