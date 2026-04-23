import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'voyage_competences.db';

function sanitizeArgs(args: any[]): any[] {
  return args.map(arg => arg === undefined ? null : arg);
}

export interface UserStats {
  id: number;
  username: string;
  xp: number;
  level: number;
  badges_count: number;
  show_dev_nav: number; // 0 or 1
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
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        
        // ─── Core Schema ──────────────────────────────────────────────
        try {
          await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS user_stats (
              id INTEGER PRIMARY KEY NOT NULL,
              username TEXT DEFAULT 'Ahmed_AlMaghribi',
              xp INTEGER DEFAULT 0,
              level INTEGER DEFAULT 1,
              badges_count INTEGER DEFAULT 0,
              show_dev_nav INTEGER DEFAULT 1
            );

            CREATE TABLE IF NOT EXISTS app_settings (
              id TEXT PRIMARY KEY NOT NULL,
              key TEXT UNIQUE NOT NULL,
              value TEXT,
              description TEXT,
              updated_at TEXT
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
              missions_title_ar TEXT,
              icon_name TEXT,
              acte_title TEXT,
              learning_outcomes TEXT
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
              narration TEXT,
              profils TEXT,
              metadata TEXT,
              soft_skill_dominant TEXT,
              bloom_level INTEGER
            );

            CREATE TABLE IF NOT EXISTS questions (
              id TEXT PRIMARY KEY NOT NULL,
              mission_id TEXT,
              question_fr TEXT NOT NULL,
              question_ar TEXT,
              title_fr TEXT,
              title_ar TEXT,
              question_type TEXT,
              options TEXT,
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
              soft_skills_impact TEXT,
              context_dialogue TEXT,
              presentation_fr TEXT,
              presentation_ar TEXT,
              audio_url TEXT,
              character_id TEXT,
              feedback_positive_fr TEXT,
              feedback_positive_ar TEXT,
              feedback_negative_fr TEXT,
              feedback_negative_ar TEXT
            );
          `);
        } catch (e) {
          console.error("Core schema creation failed:", e);
        }

        // ─── Migrations ───────────────────────────────────────────────
        
        // 1. Check for icon_name in challenges
        try {
          const challengesInfo = await this.db.getAllAsync<any>("PRAGMA table_info(challenges)");
          const hasIconName = challengesInfo.some(c => c.name === 'icon_name');
          if (!hasIconName && challengesInfo.length > 0) {
            console.log("🛠 Migrating challenges: adding icon_name...");
            await this.db.execAsync("ALTER TABLE challenges ADD COLUMN icon_name TEXT;");
          }
        } catch (e) {
          console.warn("Challenges migration check failed:", e);
        }

        // 1b. Check for acte_title and learning_outcomes in challenges
        try {
          const challengesInfo = await this.db.getAllAsync<any>("PRAGMA table_info(challenges)");
          const missingChallengesCols = ['acte_title', 'learning_outcomes'];
          for (const col of missingChallengesCols) {
            const exists = challengesInfo.some(c => c.name === col);
            if (!exists && challengesInfo.length > 0) {
              console.log(`🛠 Migrating challenges: adding ${col}...`);
              await this.db.execAsync(`ALTER TABLE challenges ADD COLUMN ${col} TEXT;`);
            }
          }
        } catch (e) {
          console.warn("Challenges extra migration check failed:", e);
        }

        // 2. Check for missing columns in questions
        try {
          const questionsInfo = await this.db.getAllAsync<any>("PRAGMA table_info(questions)");
          const requiredCols = ['presentation_fr', 'presentation_ar', 'audio_url', 'character_id', 'feedback_positive_fr', 'feedback_positive_ar', 'feedback_negative_fr', 'feedback_negative_ar'];
          
          for (const col of requiredCols) {
            const exists = questionsInfo.some(c => c.name === col);
            if (!exists && questionsInfo.length > 0) {
              console.log(`🛠 Migrating questions: adding ${col}...`);
              await this.db.execAsync(`ALTER TABLE questions ADD COLUMN ${col} TEXT;`);
            }
          }
        } catch (e) {
          console.warn("Questions migration check failed:", e);
        }

        // 3. Check for missing columns in missions
        try {
          const missionsInfo = await this.db.getAllAsync<any>("PRAGMA table_info(missions)");
          const missionCols = ['soft_skill_dominant', 'bloom_level'];
          for (const col of missionCols) {
            const exists = missionsInfo.some(c => c.name === col);
            if (!exists && missionsInfo.length > 0) {
              console.log(`🛠 Migrating missions: adding ${col}...`);
              await this.db.execAsync(`ALTER TABLE missions ADD COLUMN ${col} ${col === 'bloom_level' ? 'INTEGER' : 'TEXT'};`);
            }
          }
        } catch (e) {
          console.warn("Missions migration check failed:", e);
        }

        // ─── Initial Data ─────────────────────────────────────────────
        try {
          // Initialize default user if not exists
          const user = await this.getUserStats();
          if (!user) {
            await this.db.runAsync(
              'INSERT OR IGNORE INTO user_stats (id, username, xp, level, badges_count) VALUES (1, ?, ?, ?, ?)',
              ['Ahmed_AlMaghribi', 0, 1, 0]
            );
          }

          // Initialize cities if empty
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
                'INSERT OR IGNORE INTO city_progression (id, name, unlocked, completed, score) VALUES (?, ?, ?, ?, ?)',
                city
              );
            }
          }
        } catch (e) {
          console.error("Initial data seeding failed:", e);
        }
      } catch (error) {
        console.error("Database initialization error:", error);
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  // ─── USER STATS ───────────────────────────────────────────────────

  async getUserStats(): Promise<UserStats | null> {
    if (!this.db) await this.init();
    try {
      return await this.db!.getFirstAsync<UserStats>('SELECT * FROM user_stats WHERE id = 1');
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  }

  async updateUserXP(xpToAdd: number) {
    if (!this.db) await this.init();
    try {
      const current = await this.getUserStats();
      if (current) {
        const newXp = current.xp + xpToAdd;
        const newLevel = Math.floor(newXp / 1000) + 1;
        await this.db!.runAsync(
          'UPDATE user_stats SET xp = ?, level = ? WHERE id = 1',
          [newXp, newLevel]
        );
      }
    } catch (error) {
      console.error("Error updating user XP:", error);
    }
  }

  // ─── PROGRESSION ──────────────────────────────────────────────────

  async getCitiesProgression(): Promise<CityProgression[]> {
    if (!this.db) await this.init();
    try {
      return await this.db!.getAllAsync<CityProgression>('SELECT * FROM city_progression');
    } catch (error) {
      console.error("Error fetching cities progression:", error);
      return [];
    }
  }

  async unlockCity(cityId: string) {
    if (!this.db) await this.init();
    try {
      await this.db!.runAsync(
        'UPDATE city_progression SET unlocked = 1 WHERE id = ?',
        [cityId]
      );
    } catch (error) {
      console.error(`Error unlocking city ${cityId}:`, error);
    }
  }

  async completeCity(cityId: string, score: number) {
    if (!this.db) await this.init();
    try {
      await this.db!.runAsync(
        'UPDATE city_progression SET completed = 1, score = ? WHERE id = ?',
        [score, cityId]
      );
    } catch (error) {
      console.error(`Error completing city ${cityId}:`, error);
    }
  }

  // ─── CHALLENGES ───────────────────────────────────────────────────

  async saveChallenges(challenges: any[]) {
    if (!this.db) await this.init();
    try {
      await this.db!.withTransactionAsync(async () => {
        await this.db!.runAsync('DELETE FROM challenges');
        for (const c of challenges) {
          const args = [
            c.id, c.city_id, c.city_name_fr, c.city_name_ar, c.city_color, 
            c.headline_fr, c.headline_ar, c.description_fr, c.description_ar, 
            c.focus_fr, c.step_label, c.progress, c.illustration_url, 
            c.sort_order, c.is_published ? 1 : 0, c.missions_title_fr, 
            c.missions_title_ar, c.icon_name || null, c.acte_title || null,
            c.learning_outcomes ? JSON.stringify(c.learning_outcomes) : null
          ];
          await this.db!.runAsync(
            `INSERT OR REPLACE INTO challenges (
              id, city_id, city_name_fr, city_name_ar, city_color, 
              headline_fr, headline_ar, description_fr, description_ar, 
              focus_fr, step_label, progress, illustration_url, sort_order, 
              is_published, missions_title_fr, missions_title_ar, icon_name,
              acte_title, learning_outcomes
            ) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            sanitizeArgs(args)
          );
        }
      });
    } catch (error) {
      console.error("Failed to save challenges in transaction:", error);
      throw error;
    }
  }

  async getChallenges(): Promise<any[]> {
    if (!this.db) await this.init();
    try {
      return await this.db!.getAllAsync('SELECT * FROM challenges ORDER BY sort_order');
    } catch (error) {
      console.error("Error fetching challenges:", error);
      return [];
    }
  }

  // ─── MISSIONS ─────────────────────────────────────────────────────

  async saveMissions(missions: any[]) {
    if (!this.db) await this.init();
    try {
      await this.db!.withTransactionAsync(async () => {
        await this.db!.runAsync('DELETE FROM missions');
        for (const m of missions) {
          const args = [
            m.id, m.challenge_id, m.city_id, m.title_fr, m.title_ar, 
            m.description_fr, m.description_ar, m.mission_type, m.xp_reward, 
            m.sort_order, m.is_published ? 1 : 0, 
            m.narration ? JSON.stringify(m.narration) : null, 
            m.profils ? JSON.stringify(m.profils) : null, 
            m.metadata ? JSON.stringify(m.metadata) : null,
            m.soft_skill_dominant || null, m.bloom_level || null
          ];
          await this.db!.runAsync(
            `INSERT OR REPLACE INTO missions (
              id, challenge_id, city_id, title_fr, title_ar, description_fr, 
              description_ar, mission_type, xp_reward, sort_order, is_published, 
              narration, profils, metadata, soft_skill_dominant, bloom_level
            ) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            sanitizeArgs(args)
          );
        }
      });
    } catch (error) {
      console.error("Failed to save missions in transaction:", error);
      throw error;
    }
  }

  async getMissionsByCity(cityId: string): Promise<any[]> {
    if (!this.db) await this.init();
    try {
      const rows = await this.db!.getAllAsync('SELECT * FROM missions WHERE city_id = ? ORDER BY sort_order', [cityId]);
      return rows.map((r: any) => ({
        ...r,
        is_published: r.is_published === 1,
        narration: r.narration ? JSON.parse(r.narration) : null,
        profils: r.profils ? JSON.parse(r.profils) : null,
        metadata: r.metadata ? JSON.parse(r.metadata) : null,
        soft_skill_dominant: r.soft_skill_dominant,
        bloom_level: r.bloom_level,
      }));
    } catch (error) {
      console.error(`Error fetching missions for city ${cityId}:`, error);
      return [];
    }
  }

  // ─── QUESTIONS ────────────────────────────────────────────────────

  async saveQuestions(questions: any[]) {
    if (!this.db) await this.init();
    try {
      await this.db!.withTransactionAsync(async () => {
        await this.db!.runAsync('DELETE FROM questions');
        for (const q of questions) {
          const args = [
            q.id, q.mission_id, q.question_fr, q.question_ar, q.title_fr || null, q.title_ar || null, 
            q.question_type, q.options ? JSON.stringify(q.options) : null, q.correct_answer ?? null, q.score_decision, 
            q.score_equipe, q.score_stress, q.xp_reward, q.time_limit_sec, q.sort_order, 
            q.hint_fr, q.hint_ar, q.explanation_fr, q.explanation_ar, q.is_published ? 1 : 0, 
            q.soft_skills_impact ? JSON.stringify(q.soft_skills_impact) : null, q.context_dialogue ? JSON.stringify(q.context_dialogue) : null,
            q.presentation_fr, q.presentation_ar, q.audio_url, q.character_id,
            q.feedback_positive_fr, q.feedback_positive_ar, q.feedback_negative_fr, q.feedback_negative_ar
          ];
          await this.db!.runAsync(
            `INSERT OR REPLACE INTO questions (
              id, mission_id, question_fr, question_ar, title_fr, title_ar, question_type, options, 
              correct_answer, score_decision, score_equipe, score_stress, xp_reward, time_limit_sec, 
              sort_order, hint_fr, hint_ar, explanation_fr, explanation_ar, is_published, 
              soft_skills_impact, context_dialogue, presentation_fr, presentation_ar, audio_url, 
              character_id, feedback_positive_fr, feedback_positive_ar, feedback_negative_fr, feedback_negative_ar
            ) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            sanitizeArgs(args)
          );
        }
      });
    } catch (error) {
      console.error("Failed to save questions in transaction:", error);
      throw error;
    }
  }

  async getQuestionsByMission(missionId: string): Promise<any[]> {
    if (!this.db) await this.init();
    try {
      const rows = await this.db!.getAllAsync('SELECT * FROM questions WHERE mission_id = ? ORDER BY sort_order', [missionId]);
      return rows.map((r: any) => ({
        ...r,
        is_published: r.is_published === 1,
        options: r.options ? JSON.parse(r.options) : [],
        soft_skills_impact: r.soft_skills_impact ? JSON.parse(r.soft_skills_impact) : {},
        context_dialogue: r.context_dialogue ? JSON.parse(r.context_dialogue) : null,
      }));
    } catch (error) {
      console.error(`Error fetching questions for mission ${missionId}:`, error);
      return [];
    }
  }

  // ─── APP SETTINGS ────────────────────────────────────────────────

  async saveAppSettings(settings: any[]) {
    if (!this.db) await this.init();
    try {
      await this.db!.withTransactionAsync(async () => {
        await this.db!.runAsync('DELETE FROM app_settings');
        for (const s of settings) {
          const args = [s.id, s.key, s.value ? JSON.stringify(s.value) : null, s.description, s.updated_at];
          await this.db!.runAsync(
            `INSERT OR REPLACE INTO app_settings (id, key, value, description, updated_at) 
             VALUES (?, ?, ?, ?, ?)`,
            sanitizeArgs(args)
          );
        }
      });
    } catch (error) {
      console.error("Failed to save app settings:", error);
    }
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.init();
    try {
      const row = await this.db!.getFirstAsync<{value: string}>('SELECT value FROM app_settings WHERE key = ?', [key]);
      return row ? JSON.parse(row.value) : null;
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return null;
    }
  }
}

export const dbService = new DatabaseService();
