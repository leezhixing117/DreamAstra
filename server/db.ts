import { Pool, QueryResult } from 'pg';
import { INITIAL_USERS, INITIAL_DREAMS, INITIAL_BOOKS, INITIAL_SETTINGS, initialDreamDNA, initialConstellationNodes, initialConstellationLinks, initialThirtyNightsJourney } from '../src/data';
import { initDreamMasterTables } from './dreamMaster';

// Determine if Postgres DATABASE_URL is configured
const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;
let isPostgresReady = false;
let dbError: string | null = null;

export function getDbPool(): Pool | null {
  return pool;
}

// Initialize Postgres pool if connection string exists
if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected Postgres client error:', err);
      dbError = err.message;
    });

    // Test connection and initialize tables
    initPostgresTables().then(() => {
      isPostgresReady = true;
      console.log('✅ Render Postgres connected & tables initialized successfully');
    }).catch((err) => {
      console.warn('⚠️ Postgres initialization warning (falling back to durable store):', err.message);
      dbError = err.message;
    });
  } catch (err: any) {
    console.warn('⚠️ Could not initialize Postgres pool:', err.message);
    dbError = err.message;
  }
} else {
  console.log('ℹ️ DATABASE_URL not set in environment. Running with durable in-memory storage fallback.');
}

// In-memory durable store (fallback if Postgres is not yet configured on Render)
const memoryStore = {
  users: [...INITIAL_USERS],
  dreams: [...INITIAL_DREAMS],
  dna: { ...initialDreamDNA },
  constellation: {
    nodes: [...initialConstellationNodes],
    links: [...initialConstellationLinks],
  },
  mystery: { ...initialThirtyNightsJourney },
  books: [...INITIAL_BOOKS],
  settings: { ...INITIAL_SETTINGS },
};

// SQL Table Initialization for Postgres
async function initPostgresTables() {
  if (!pool) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS dw_users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        display_name VARCHAR(255),
        role VARCHAR(32) DEFAULT 'free',
        stars INT DEFAULT 2,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS dw_dreams (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        title VARCHAR(255) NOT NULL,
        dream_text TEXT NOT NULL,
        raw_cantonese TEXT,
        tags JSONB DEFAULT '[]'::jsonb,
        emotion VARCHAR(64) DEFAULT '焦慮',
        symbols JSONB DEFAULT '[]'::jsonb,
        report_json JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS dw_dna_stats (
        user_id VARCHAR(64) PRIMARY KEY,
        dna_json JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS dw_constellation (
        user_id VARCHAR(64) PRIMARY KEY,
        nodes JSONB NOT NULL,
        links JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS dw_mystery (
        user_id VARCHAR(64) PRIMARY KEY,
        journey_json JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS dw_books (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        status VARCHAR(32) DEFAULT 'ready',
        total_pages INT DEFAULT 100,
        processed_pages INT DEFAULT 100,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed initial admin user if empty
    const checkUser = await client.query('SELECT COUNT(*) FROM dw_users');
    if (parseInt(checkUser.rows[0].count, 10) === 0) {
      for (const u of INITIAL_USERS) {
        await client.query(
          `INSERT INTO dw_users (id, email, display_name, role, stars)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [u.id, u.email, u.display_name || '', u.role, u.stars ?? 2]
        );
      }
    }

    // Seed initial dreams if empty
    const checkDreams = await client.query('SELECT COUNT(*) FROM dw_dreams');
    if (parseInt(checkDreams.rows[0].count, 10) === 0) {
      for (const d of INITIAL_DREAMS) {
        await client.query(
          `INSERT INTO dw_dreams (id, user_id, title, dream_text, raw_cantonese, tags, report_json, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [
            d.id,
            'user_mystic',
            d.title,
            d.dream_text,
            d.rawCantoneseTranscription || '',
            JSON.stringify(d.tags || []),
            JSON.stringify(d.report_json),
            d.created_at,
          ]
        );
      }
    }

    // Initialize Dream Master SQL tables (books, dream_themes, dream_symbols, analysis_rules)
    await initDreamMasterTables(pool);
  } finally {
    client.release();
  }
}

// Health Check Query (checks SELECT 1 on Postgres or memory storage)
export async function checkDatabaseHealth(): Promise<{
  status: 'ok' | 'degraded' | 'error';
  engine: 'postgres' | 'memory_fallback';
  connected: boolean;
  latency_ms?: number;
  message?: string;
}> {
  if (pool) {
    const start = Date.now();
    try {
      await pool.query('SELECT 1');
      const latency_ms = Date.now() - start;
      return {
        status: 'ok',
        engine: 'postgres',
        connected: true,
        latency_ms,
      };
    } catch (err: any) {
      return {
        status: 'degraded',
        engine: 'postgres',
        connected: false,
        message: err.message,
      };
    }
  }

  return {
    status: 'ok',
    engine: 'memory_fallback',
    connected: true,
    message: 'Running in high-availability memory storage. Configure DATABASE_URL on Render for Postgres persistence.',
  };
}

// User Operations
export async function getUsers() {
  if (pool && isPostgresReady) {
    try {
      const res = await pool.query('SELECT * FROM dw_users ORDER BY created_at DESC');
      return res.rows;
    } catch (err) {
      console.warn('DB read error for users, falling back to memory:', err);
    }
  }
  return memoryStore.users;
}

export async function upsertUser(user: { id: string; email: string; display_name?: string; role?: string; stars?: number }) {
  if (pool && isPostgresReady) {
    try {
      await pool.query(
        `INSERT INTO dw_users (id, email, display_name, role, stars, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (id) DO UPDATE
         SET email = EXCLUDED.email,
             display_name = EXCLUDED.display_name,
             role = EXCLUDED.role,
             stars = EXCLUDED.stars,
             updated_at = NOW()`,
        [user.id, user.email, user.display_name || '', user.role || 'free', user.stars ?? 2]
      );
    } catch (err) {
      console.warn('DB upsert user error:', err);
    }
  }

  // Always sync memory store
  const idx = memoryStore.users.findIndex((u) => u.id === user.id);
  const updated = {
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    role: (user.role || 'free') as any,
    stars: user.stars ?? 2,
    created_at: new Date().toISOString(),
  };
  if (idx >= 0) {
    memoryStore.users[idx] = { ...memoryStore.users[idx], ...updated };
  } else {
    memoryStore.users.unshift(updated);
  }
  return updated;
}

export async function updateUserStars(userId: string, stars: number) {
  if (pool && isPostgresReady) {
    try {
      await pool.query('UPDATE dw_users SET stars = $1, updated_at = NOW() WHERE id = $2', [stars, userId]);
    } catch (err) {
      console.warn('DB update stars error:', err);
    }
  }
  const user = memoryStore.users.find((u) => u.id === userId);
  if (user) {
    user.stars = stars;
  }
  return user;
}

// Dream Operations
export async function getDreams(userId?: string) {
  if (pool && isPostgresReady) {
    try {
      const query = userId
        ? 'SELECT * FROM dw_dreams WHERE user_id = $1 ORDER BY created_at DESC'
        : 'SELECT * FROM dw_dreams ORDER BY created_at DESC';
      const params = userId ? [userId] : [];
      const res = await pool.query(query, params);
      return res.rows.map((r) => ({
        id: r.id,
        title: r.title,
        dream_text: r.dream_text,
        rawCantoneseTranscription: r.raw_cantonese,
        tags: r.tags || [],
        report_json: r.report_json,
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err) {
      console.warn('DB read dreams error, using memory fallback:', err);
    }
  }
  return memoryStore.dreams;
}

export async function saveDream(dream: {
  id: string;
  user_id?: string;
  title: string;
  dream_text: string;
  rawCantoneseTranscription?: string;
  tags?: string[];
  report_json: any;
  created_at?: string;
}) {
  const createdAt = dream.created_at || new Date().toISOString();
  if (pool && isPostgresReady) {
    try {
      await pool.query(
        `INSERT INTO dw_dreams (id, user_id, title, dream_text, raw_cantonese, tags, report_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE
         SET title = EXCLUDED.title,
             dream_text = EXCLUDED.dream_text,
             report_json = EXCLUDED.report_json,
             tags = EXCLUDED.tags`,
        [
          dream.id,
          dream.user_id || 'user_mystic',
          dream.title,
          dream.dream_text,
          dream.rawCantoneseTranscription || '',
          JSON.stringify(dream.tags || []),
          JSON.stringify(dream.report_json),
          createdAt,
        ]
      );
    } catch (err) {
      console.warn('DB save dream error:', err);
    }
  }

  // Sync memory store
  const entry = {
    id: dream.id,
    title: dream.title,
    dream_text: dream.dream_text,
    rawCantoneseTranscription: dream.rawCantoneseTranscription,
    tags: dream.tags || ['一般夢境'],
    report_json: dream.report_json,
    created_at: createdAt,
  };
  const idx = memoryStore.dreams.findIndex((d) => d.id === dream.id);
  if (idx >= 0) {
    memoryStore.dreams[idx] = entry;
  } else {
    memoryStore.dreams.unshift(entry);
  }
  return entry;
}

export async function deleteDream(id: string) {
  if (pool && isPostgresReady) {
    try {
      await pool.query('DELETE FROM dw_dreams WHERE id = $1', [id]);
    } catch (err) {
      console.warn('DB delete dream error:', err);
    }
  }
  memoryStore.dreams = memoryStore.dreams.filter((d) => d.id !== id);
  return { success: true };
}

// Dream DNA Stats Operations
export async function getDnaStats(userId: string = 'user_mystic') {
  if (pool && isPostgresReady) {
    try {
      const res = await pool.query('SELECT dna_json FROM dw_dna_stats WHERE user_id = $1', [userId]);
      if (res.rows.length > 0) {
        return res.rows[0].dna_json;
      }
    } catch (err) {
      console.warn('DB read DNA error:', err);
    }
  }
  return memoryStore.dna;
}

export async function saveDnaStats(userId: string = 'user_mystic', dna: any) {
  if (pool && isPostgresReady) {
    try {
      await pool.query(
        `INSERT INTO dw_dna_stats (user_id, dna_json, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET dna_json = EXCLUDED.dna_json,
             updated_at = NOW()`,
        [userId, JSON.stringify(dna)]
      );
    } catch (err) {
      console.warn('DB save DNA error:', err);
    }
  }
  memoryStore.dna = dna;
  return dna;
}

// Constellation Operations
export async function getConstellationData(userId: string = 'user_mystic') {
  if (pool && isPostgresReady) {
    try {
      const res = await pool.query('SELECT nodes, links FROM dw_constellation WHERE user_id = $1', [userId]);
      if (res.rows.length > 0) {
        return { nodes: res.rows[0].nodes, links: res.rows[0].links };
      }
    } catch (err) {
      console.warn('DB read constellation error:', err);
    }
  }
  return memoryStore.constellation;
}

export async function saveConstellationData(userId: string = 'user_mystic', data: { nodes: any[]; links: any[] }) {
  if (pool && isPostgresReady) {
    try {
      await pool.query(
        `INSERT INTO dw_constellation (user_id, nodes, links, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET nodes = EXCLUDED.nodes,
             links = EXCLUDED.links,
             updated_at = NOW()`,
        [userId, JSON.stringify(data.nodes), JSON.stringify(data.links)]
      );
    } catch (err) {
      console.warn('DB save constellation error:', err);
    }
  }
  memoryStore.constellation = data;
  return data;
}

// 30 Nights Journey Operations
export async function getMysteryJourney(userId: string = 'user_mystic') {
  if (pool && isPostgresReady) {
    try {
      const res = await pool.query('SELECT journey_json FROM dw_mystery WHERE user_id = $1', [userId]);
      if (res.rows.length > 0) {
        return res.rows[0].journey_json;
      }
    } catch (err) {
      console.warn('DB read mystery error:', err);
    }
  }
  return memoryStore.mystery;
}

export async function saveMysteryJourney(userId: string = 'user_mystic', journey: any) {
  if (pool && isPostgresReady) {
    try {
      await pool.query(
        `INSERT INTO dw_mystery (user_id, journey_json, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET journey_json = EXCLUDED.journey_json,
             updated_at = NOW()`,
        [userId, JSON.stringify(journey)]
      );
    } catch (err) {
      console.warn('DB save mystery error:', err);
    }
  }
  memoryStore.mystery = journey;
  return journey;
}
