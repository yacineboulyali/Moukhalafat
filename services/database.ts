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
      `);

      // Initialize default user if not exists
      const user = await this.getUserStats();
      if (!user) {
        await this.db.runAsync(
          'INSERT INTO user_stats (id, username, xp, level, badges_count) VALUES (1, ?, ?, ?, ?)',
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
            'INSERT INTO city_progression (id, name, unlocked, completed, score) VALUES (?, ?, ?, ?, ?)',
            city
          );
        }
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

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
}

export const dbService = new DatabaseService();
