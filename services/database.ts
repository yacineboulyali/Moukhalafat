import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'voyage_competences.db';

export interface UserStats {
  id: number;
  username: string;
  xp: number;
  level: number;
  badges_count: number;
}

export interface CityProgression {
  id: string;
  name: string;
  unlocked: number; // 0 or 1
  completed: number; // 0 or 1
  score: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    if (this.db) return;
    
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      
      // Create tables
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS user_stats (
          id INTEGER PRIMARY KEY NOT NULL,
          username TEXT DEFAULT 'Ahmed_AlMaghribi',
          xp INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          badges_count INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS city_progression (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          unlocked INTEGER DEFAULT 0,
          completed INTEGER DEFAULT 0,
          score INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS challenges (
          id TEXT PRIMARY KEY NOT NULL,
          city_id TEXT NOT NULL,
          city_name_fr TEXT NOT NULL,
          city_name_ar TEXT,
          city_color TEXT,
          headline_fr TEXT,
          headline_ar TEXT,
          description_fr TEXT,
          description_ar TEXT,
          focus_fr TEXT,
          step_label TEXT,
          progress REAL,
          illustration_url TEXT,
          sort_order INTEGER,
          is_published INTEGER,
          missions_title_fr TEXT,
          missions_title_ar TEXT
        );

        CREATE TABLE IF NOT EXISTS missions (
          id TEXT PRIMARY KEY NOT NULL,
          challenge_id TEXT,
          city_id TEXT,
          title_fr TEXT NOT NULL,
          title_ar TEXT,
          description_fr TEXT,
          description_ar TEXT,
          mission_type TEXT,
          xp_reward INTEGER,
          sort_order INTEGER,
          is_published INTEGER,
          narration TEXT, -- JSON string
          profils TEXT,   -- JSON string
          metadata TEXT   -- JSON string
        );

        CREATE TABLE IF NOT EXISTS questions (
          id TEXT PRIMARY KEY NOT NULL,
          mission_id TEXT,
          question_fr TEXT NOT NULL,
          question_ar TEXT,
          title_fr TEXT, -- Optional title for splash screens
          title_ar TEXT, -- Optional title for splash screens
          question_type TEXT,
          options TEXT, -- JSON string
          correct_answer TEXT,
          score_decision INTEGER,
          score_equipe INTEGER,
          score_stress INTEGER,
          xp_reward INTEGER,
          time_limit_sec INTEGER,
          sort_order INTEGER,
          hint_fr TEXT,
          hint_ar TEXT,
          explanation_fr TEXT,
          explanation_ar TEXT,
          is_published INTEGER,
          soft_skills_impact TEXT, -- JSON string
          context_dialogue TEXT    -- JSON string
        );
      `);

      // Initialize default user if not exists
      const user = await this.getUserStats();
      if (!user) {
        await this.db.runAsync(
          'INSERT INTO user_stats (id, username, xp, level, badges_count) VALUES (1, ?, ?, ?, ?)',
          ['Ahmed_AlMaghribi', 0, 1, 0]
        );
      }

      // Initialize cities if empty (fallback)
      const citiesCount = await this.db.getFirstAsync<{count: number}>('SELECT COUNT(*) as count FROM city_progression');
      if (citiesCount?.count === 0) {
        const defaultCities = [
          ['rabat', 'Rabat', 1, 0, 0],
          ['chefchaouen', 'Chefchaouen', 0, 0, 0],
          ['fes', 'Fès', 0, 0, 0],
          ['marrakech', 'Marrakech', 0, 0, 0],
          ['laayoune', 'Laâyoune', 0, 0, 0],
          ['dakhla', 'Dakhla', 0, 0, 0]
        ];
        
        for (const city of defaultCities) {
          await this.db.runAsync(
            'INSERT INTO city_progression (id, name, unlocked, completed, score) VALUES (?, ?, ?, ?, ?)',
            city
          );
        }
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  // ─── USER STATS ───────────────────────────────────────────────────

  async getUserStats(): Promise<UserStats | null> {
    if (!this.db) await this.init();
    return await this.db!.getFirstAsync<UserStats>('SELECT * FROM user_stats WHERE id = 1');
  }

  async updateUserXP(xpToAdd: number) {
    if (!this.db) await this.init();
    const current = await this.getUserStats();
    if (current) {
      const newXp = current.xp + xpToAdd;
      const newLevel = Math.floor(newXp / 1000) + 1;
      await this.db!.runAsync(
        'UPDATE user_stats SET xp = ?, level = ? WHERE id = 1',
        [newXp, newLevel]
      );
    }
  }

  // ─── PROGRESSION ──────────────────────────────────────────────────

  async getCitiesProgression(): Promise<CityProgression[]> {
    if (!this.db) await this.init();
    return await this.db!.getAllAsync<CityProgression>('SELECT * FROM city_progression');
  }

  async unlockCity(cityId: string) {
    if (!this.db) await this.init();
    await this.db!.runAsync(
      'UPDATE city_progression SET unlocked = 1 WHERE id = ?',
      [cityId]
    );
  }

  async completeCity(cityId: string, score: number) {
    if (!this.db) await this.init();
    await this.db!.runAsync(
      'UPDATE city_progression SET completed = 1, score = ? WHERE id = ?',
      [score, cityId]
    );
  }

  // ─── CHALLENGES ───────────────────────────────────────────────────

  async saveChallenges(challenges: any[]) {
    if (!this.db) await this.init();
    await this.db!.runAsync('DELETE FROM challenges');
    for (const c of challenges) {
      await this.db!.runAsync(
        `INSERT INTO challenges (id, city_id, city_name_fr, city_name_ar, city_color, headline_fr, headline_ar, description_fr, description_ar, focus_fr, step_label, progress, illustration_url, sort_order, is_published, missions_title_fr, missions_title_ar) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.city_id, c.city_name_fr, c.city_name_ar, c.city_color, c.headline_fr, c.headline_ar, c.description_fr, c.description_ar, c.focus_fr, c.step_label, c.progress, c.illustration_url, c.sort_order, c.is_published ? 1 : 0, c.missions_title_fr, c.missions_title_ar]
      );
    }
  }

  async getChallenges(): Promise<any[]> {
    if (!this.db) await this.init();
    return await this.db!.getAllAsync('SELECT * FROM challenges ORDER BY sort_order');
  }

  // ─── MISSIONS ─────────────────────────────────────────────────────

  async saveMissions(missions: any[]) {
    if (!this.db) await this.init();
    // We might want to filter by challenge or city, but for a full sync we can replace all
    await this.db!.runAsync('DELETE FROM missions');
    for (const m of missions) {
      await this.db!.runAsync(
        `INSERT INTO missions (id, challenge_id, city_id, title_fr, title_ar, description_fr, description_ar, mission_type, xp_reward, sort_order, is_published, narration, profils, metadata) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [m.id, m.challenge_id, m.city_id, m.title_fr, m.title_ar, m.description_fr, m.description_ar, m.mission_type, m.xp_reward, m.sort_order, m.is_published ? 1 : 0, JSON.stringify(m.narration), JSON.stringify(m.profils), JSON.stringify(m.metadata)]
      );
    }
  }

  async getMissionsByCity(cityId: string): Promise<any[]> {
    if (!this.db) await this.init();
    const rows = await this.db!.getAllAsync('SELECT * FROM missions WHERE city_id = ? AND is_published = 1 ORDER BY sort_order', [cityId]);
    return rows.map((r: any) => ({
      ...r,
      is_published: r.is_published === 1,
      narration: r.narration ? JSON.parse(r.narration) : null,
      profils: r.profils ? JSON.parse(r.profils) : null,
      metadata: r.metadata ? JSON.parse(r.metadata) : null,
    }));
  }

  // ─── QUESTIONS ────────────────────────────────────────────────────

  async saveQuestions(questions: any[]) {
    if (!this.db) await this.init();
    await this.db!.runAsync('DELETE FROM questions');
    for (const q of questions) {
      await this.db!.runAsync(
        `INSERT INTO questions (id, mission_id, question_fr, question_ar, title_fr, title_ar, question_type, options, correct_answer, score_decision, score_equipe, score_stress, xp_reward, time_limit_sec, sort_order, hint_fr, hint_ar, explanation_fr, explanation_ar, is_published, soft_skills_impact, context_dialogue) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [q.id, q.mission_id, q.question_fr, q.question_ar, q.title_fr || null, q.title_ar || null, q.question_type, JSON.stringify(q.options), q.correct_answer, q.score_decision, q.score_equipe, q.score_stress, q.xp_reward, q.time_limit_sec, q.sort_order, q.hint_fr, q.hint_ar, q.explanation_fr, q.explanation_ar, q.is_published ? 1 : 0, JSON.stringify(q.soft_skills_impact), JSON.stringify(q.context_dialogue)]
      );
    }
  }

  async getQuestionsByMission(missionId: string): Promise<any[]> {
    if (!this.db) await this.init();
    const rows = await this.db!.getAllAsync('SELECT * FROM questions WHERE mission_id = ? AND is_published = 1 ORDER BY sort_order', [missionId]);
    return rows.map((r: any) => ({
      ...r,
      is_published: r.is_published === 1,
      options: r.options ? JSON.parse(r.options) : [],
      soft_skills_impact: r.soft_skills_impact ? JSON.parse(r.soft_skills_impact) : {},
      context_dialogue: r.context_dialogue ? JSON.parse(r.context_dialogue) : null,
    }));
  }
}

export const dbService = new DatabaseService();
