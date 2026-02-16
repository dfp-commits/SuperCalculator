/**
 * History Store
 * Infrastructure layer for storing calculation history (2-day retention)
 * Reference: docs/01_architecture.md (Infrastructure layer)
 * Reference: docs/03_folder_structure.md (src/infrastructure)
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../data/calculations.db');
const RETENTION_DAYS = 2;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Ensures database directory exists
 */
function ensureDatabaseDirectory() {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

/**
 * Initializes the database and creates tables if needed
 * @returns {Promise<sqlite3.Database>} Database instance
 */
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    ensureDatabaseDirectory();
    
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create calculations table if it doesn't exist
      db.run(`
        CREATE TABLE IF NOT EXISTS calculations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          expression TEXT NOT NULL,
          result TEXT NOT NULL,
          mode TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      });
    });
  });
}

/**
 * Stores a calculation in history
 * @param {string} expression - The calculation expression
 * @param {string} result - The calculation result
 * @param {string} mode - Calculator mode ('standard' or 'scientific')
 * @returns {Promise<void>}
 */
async function storeCalculation(expression, result, mode) {
  const db = await initializeDatabase();
  
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    
    db.run(
      'INSERT INTO calculations (expression, result, mode, created_at) VALUES (?, ?, ?, ?)',
      [expression, result, mode, timestamp],
      (err) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

/**
 * Retrieves calculation history (last 2 days)
 * @param {number} [limit=50] - Maximum number of records to return
 * @returns {Promise<Array>} Array of calculation records
 */
async function getHistory(limit = 50) {
  const db = await initializeDatabase();
  const cutoffTime = Date.now() - RETENTION_MS;
  
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, expression, result, mode, created_at 
       FROM calculations 
       WHERE created_at > ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [cutoffTime, limit],
      (err, rows) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      }
    );
  });
}

/**
 * Cleans up old calculations (older than retention period)
 * @returns {Promise<number>} Number of records deleted
 */
async function cleanupOldCalculations() {
  const db = await initializeDatabase();
  const cutoffTime = Date.now() - RETENTION_MS;
  
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM calculations WHERE created_at <= ?',
      [cutoffTime],
      function(err) {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
}

module.exports = {
  storeCalculation,
  getHistory,
  cleanupOldCalculations
};
