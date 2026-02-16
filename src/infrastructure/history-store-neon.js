/**
 * History Store - Neon PostgreSQL
 * Infrastructure layer for storing calculation history (2-day retention) using Neon PostgreSQL
 * Reference: docs/01_architecture.md (Infrastructure layer)
 * Reference: docs/03_folder_structure.md (src/infrastructure)
 */

const { Pool } = require('pg');

const RETENTION_DAYS = 2;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

// Initialize PostgreSQL connection pool
let pool = null;

/**
 * Gets or creates the database connection pool
 * @returns {Pool} PostgreSQL connection pool
 */
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Initialize table on first connection
    initializeTable().catch(err => {
      console.error('Error initializing database table:', err);
    });
  }
  
  return pool;
}

/**
 * Initializes the calculations table if it doesn't exist
 * @returns {Promise<void>}
 */
async function initializeTable() {
  const client = await getPool().connect();
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS calculations (
        id SERIAL PRIMARY KEY,
        expression TEXT NOT NULL,
        result TEXT NOT NULL,
        mode TEXT NOT NULL,
        created_at BIGINT NOT NULL
      )
    `);
    
    // Create index on created_at for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_calculations_created_at 
      ON calculations(created_at)
    `);
  } finally {
    client.release();
  }
}

/**
 * Stores a calculation in history
 * @param {string} expression - The calculation expression
 * @param {string} result - The calculation result
 * @param {string} mode - Calculator mode ('standard' or 'scientific')
 * @returns {Promise<void>}
 */
async function storeCalculation(expression, result, mode) {
  const client = await getPool().connect();
  const timestamp = Date.now();
  
  try {
    await client.query(
      'INSERT INTO calculations (expression, result, mode, created_at) VALUES ($1, $2, $3, $4)',
      [expression, result, mode, timestamp]
    );
  } finally {
    client.release();
  }
}

/**
 * Retrieves calculation history (last 2 days)
 * @param {number} [limit=50] - Maximum number of records to return
 * @returns {Promise<Array>} Array of calculation records
 */
async function getHistory(limit = 50) {
  const client = await getPool().connect();
  const cutoffTime = Date.now() - RETENTION_MS;
  
  try {
    const result = await client.query(
      `SELECT id, expression, result, mode, created_at 
       FROM calculations 
       WHERE created_at > $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [cutoffTime, limit]
    );
    
    return result.rows || [];
  } finally {
    client.release();
  }
}

/**
 * Cleans up old calculations (older than retention period)
 * @returns {Promise<number>} Number of records deleted
 */
async function cleanupOldCalculations() {
  const client = await getPool().connect();
  const cutoffTime = Date.now() - RETENTION_MS;
  
  try {
    const result = await client.query(
      'DELETE FROM calculations WHERE created_at <= $1',
      [cutoffTime]
    );
    
    return result.rowCount || 0;
  } finally {
    client.release();
  }
}

module.exports = {
  storeCalculation,
  getHistory,
  cleanupOldCalculations
};
