# Neon Database Setup

## Your Connection String

Your Neon PostgreSQL connection string is:

```
postgresql://neondb_owner:npg_o79EcCTkiGfb@ep-ancient-king-aewrsgx4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## For Netlify Environment Variable

**Variable Name:** `DATABASE_URL`

**Variable Value:** 
```
postgresql://neondb_owner:npg_o79EcCTkiGfb@ep-ancient-king-aewrsgx4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Initialize Database Schema

Run this SQL in the Neon SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS calculations (
  id SERIAL PRIMARY KEY,
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  mode TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calculations_created_at 
ON calculations(created_at);
```

## Testing Connection Locally (Optional)

To test the connection locally before deploying:

1. Set environment variable:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="postgresql://neondb_owner:npg_o79EcCTkiGfb@ep-ancient-king-aewrsgx4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   
   # Linux/Mac
   export DATABASE_URL="postgresql://neondb_owner:npg_o79EcCTkiGfb@ep-ancient-king-aewrsgx4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```

2. Run the server:
   ```bash
   npm start
   ```

3. Test a calculation - it should store in Neon instead of SQLite

## Connection String Notes

- **Pooler endpoint**: Your connection string uses the pooler endpoint (`-pooler`), which is recommended for serverless functions
- **SSL required**: `sslmode=require` ensures secure connections
- **Channel binding**: `channel_binding=require` provides additional security

The adapter automatically handles these parameters through the connection string.
