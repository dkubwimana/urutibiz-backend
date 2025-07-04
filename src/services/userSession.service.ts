import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../config/database';

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  refresh_token?: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: Date;
  created_at?: Date;
}

export class UserSessionService {
  static async createSession({ user_id, session_token, refresh_token, ip_address, user_agent, expires_at }: Omit<UserSession, 'id' | 'created_at'>): Promise<UserSession> {
    const db = getDatabase();
    const [session] = await db('user_sessions')
      .insert({
        id: uuidv4(),
        user_id,
        session_token,
        refresh_token,
        ip_address,
        user_agent,
        expires_at,
      })
      .returning('*');
    return session;
  }

  static async getSessionByToken(session_token: string): Promise<UserSession | undefined> {
    const db = getDatabase();
    return db('user_sessions').where({ session_token }).first();
  }

  static async getSessionByRefreshToken(refresh_token: string): Promise<UserSession | undefined> {
    const db = getDatabase();
    return db('user_sessions').where({ refresh_token }).first();
  }

  static async deleteSession(session_token: string): Promise<number> {
    const db = getDatabase();
    return db('user_sessions').where({ session_token }).del();
  }

  static async deleteAllSessionsForUser(user_id: string): Promise<number> {
    const db = getDatabase();
    return db('user_sessions').where({ user_id }).del();
  }
}
