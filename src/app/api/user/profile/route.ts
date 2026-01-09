import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Base Profile Data
  let userProfile: any = {
    id: session.user?.id || 'mock-id',
    name: session.user?.name,
    email: session.user?.email,
    level: 1,
    points: 0,
    nextLevelPoints: 100,
    reports: 0,
    approved: 0,
    badges: [],
    mayorship: 'None',
    bio: "New user ready to help!",
    joinedAt: new Date().toISOString()
  };

  // Override for Demo User
  if (session.user?.id === 'demo-user-001') {
    userProfile = {
      ...userProfile,
      level: 5,
      points: 450,
      nextLevelPoints: 1000,
      reports: 12,
      approved: 10,
      badges: ['Early Adopter', 'Pothole Patrol', 'Night Owl'],
      mayorship: 'T. Nagar',
      bio: "Just a concerned citizen trying to fix the city, one pothole at a time."
    };
  }

  return NextResponse.json(userProfile);
}
