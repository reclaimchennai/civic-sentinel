import { query } from "@/lib/db";

export type ProfileRow = {
  id: string;
  user_id: string;
  current_points: number;
  total_points_earned: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  streak_shields: number;
  title: string;
  avatar_frame: string;
  guild_id: string | null;
  total_endorsements: number;
};

export async function ensureProfile(sessionUserId: string): Promise<ProfileRow> {
  const inserted = await query<ProfileRow>(
    `INSERT INTO profiles (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
     RETURNING id, user_id, current_points, total_points_earned, current_streak,
               longest_streak, last_active_date, streak_shields, title, avatar_frame,
               guild_id, total_endorsements`,
    [sessionUserId]
  );
  return inserted.rows[0];
}
