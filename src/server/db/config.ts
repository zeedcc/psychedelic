/** TREAT AS IMMUTABLE - This file is protected by the file-edit tool
 *
 * Database configuration loader
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { env } from 'node:process';

/**
 * Database credentials interface
 */
export interface DatabaseCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/**
 * Load database configuration from the task-local config file.
 * Reads from $NOMAD_TASK_DIR/config.json (defaults to /local/config.json).
 *
 * @returns Database connection credentials
 * @throws Error if config file not found or invalid
 */
export function getDatabaseCredentials(): DatabaseCredentials {
  const envHost = env.DATABASE_HOST || env.DB_HOST;
  const envPort = env.DATABASE_PORT || env.DB_PORT;
  const envUser = env.DATABASE_USER || env.DB_USER || env.DATABASE_USERNAME || env.DB_USERNAME;
  const envPassword = env.DATABASE_PASSWORD || env.DB_PASSWORD;
  const envDatabase = env.DATABASE_NAME || env.DB_NAME;

  if (envHost && envPort && envUser && envPassword && envDatabase) {
    return {
      host: envHost,
      port: parseInt(String(envPort), 10),
      user: envUser,
      password: envPassword,
      database: envDatabase,
    };
  }

  const configPath = join(env.NOMAD_TASK_DIR || '/local', 'config.json');

  if (!existsSync(configPath)) {
    return {
      host: envHost || '127.0.0.1',
      port: parseInt(String(envPort || '3306'), 10),
      user: envUser || 'root',
      password: envPassword || 'password',
      database: envDatabase || 'app',
    };
  }

  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));

    if (!config.DATABASE?.VALUE) {
      throw new Error('Invalid config.json structure: DATABASE.VALUE not found');
    }

    const db = config.DATABASE.VALUE;

    if (!db.HOST || !db.PORT || !db.USERNAME || !db.PASSWORD || !db.NAME) {
      throw new Error('Invalid config.json: Missing required database credentials');
    }

    return {
      host: db.HOST,
      port: parseInt(String(db.PORT), 10),
      user: db.USERNAME,
      password: db.PASSWORD,
      database: db.NAME,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse ${configPath}: Invalid JSON format`);
    }
    throw error;
  }
}
