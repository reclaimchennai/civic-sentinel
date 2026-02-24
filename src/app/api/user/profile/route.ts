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
    joinedAt: new Date().toISOString(),
    // Gamification fields
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString(),
      isAtRisk: false,
      streakShields: 0,
      weeklyActivity: [false, false, false, false, false, false, false],
    },
    title: "Civic Guardian",
    activeChallenges: 0,
    guildName: null,
    endorsements: 0,
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
      badges: [
        { name: 'Rookie Sentinel', image: '/badges/Rookie Sentinel_nobg.png' },
        { name: 'Pothole Paladin', image: '/badges/pothole_paladin_nobg.png' },
        { name: 'Night Owl', image: '/badges/night_owl_nobg.png' },
        { name: '7-Day Streak', image: '/badges/7-day_streak_nobg.png' },
        { name: 'Zone Hero', image: '/badges/zone_hero_nobg.png' },
        { name: 'Verified Voice', image: '/badges/verified voice_nobg.png' }
      ],
      mayorship: 'T. Nagar',
      bio: "Just a concerned citizen trying to fix the city, one pothole at a time.",
      // Gamification overrides for demo
      streak: {
        currentStreak: 7,
        longestStreak: 14,
        lastActiveDate: new Date().toISOString(),
        isAtRisk: false,
        streakShields: 2,
        weeklyActivity: [true, true, false, true, true, true, true],
      },
      title: "Ward Protector",
      activeChallenges: 3,
      guildName: "T. Nagar Tigers",
      endorsements: 24,
    };
  }

  return NextResponse.json(userProfile);
}
