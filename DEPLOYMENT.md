# Deployment Guide - Netlify & Neon

This guide explains how to deploy the Super Calculator to Netlify with Neon PostgreSQL database.

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com)
2. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Set Up Neon PostgreSQL Database

1. Log in to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the **Connection String** (it looks like: `postgresql://user:password@host/database?sslmode=require`)
4. Save this connection string - you'll need it for Netlify environment variables

### Initialize Database Schema

Run this SQL in the Neon SQL Editor to create the required table:

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

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm install` (or leave empty, Netlify will auto-detect)
   - **Publish directory**: `public`
   - **Node version**: `18` (set in netlify.toml)

5. Add environment variable:
   - Go to **Site settings** → **Environment variables**
   - Add: `DATABASE_URL` = Your Neon connection string from Step 1

6. Click **"Deploy site"**

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize site:
   ```bash
   netlify init
   ```

4. Set environment variable:
   ```bash
   netlify env:set DATABASE_URL "your-neon-connection-string"
   ```

5. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Verify Deployment

1. Visit your Netlify site URL
2. Test the calculator:
   - Enter a calculation (e.g., `2+2`)
   - Click `=`
   - Verify the result appears
   - Check that history loads

## Environment Variables

### Required for Production (Netlify)

- `DATABASE_URL`: Neon PostgreSQL connection string

### Local Development

- No environment variables needed (uses SQLite locally)
- Or set `DATABASE_URL` to use Neon locally

## Architecture Notes

- **Local Development**: Uses SQLite (`src/infrastructure/history-store.js`)
- **Production (Netlify)**: Uses Neon PostgreSQL (`src/infrastructure/history-store-neon.js`)
- **Auto-detection**: The service automatically selects the correct adapter based on `DATABASE_URL` environment variable

## Troubleshooting

### "Network error: Failed to fetch"

- Verify Netlify functions are deployed correctly
- Check Netlify function logs in the dashboard
- Ensure `netlify.toml` redirects are configured correctly

### Database Connection Errors

- Verify `DATABASE_URL` is set in Netlify environment variables
- Check Neon database is running and accessible
- Verify database schema is initialized

### Functions Not Found

- Ensure `netlify/functions/` directory exists with all function files
- Verify `netlify.toml` redirects are correct
- Check build logs for errors

## File Structure

```
SuperCalculator/
├── netlify/
│   ├── functions/
│   │   ├── calculate.js
│   │   ├── calculate-scientific.js
│   │   ├── history.js
│   │   └── history-cleanup.js
├── netlify.toml
├── src/
│   ├── infrastructure/
│   │   ├── history-store.js (SQLite - local)
│   │   └── history-store-neon.js (PostgreSQL - production)
└── public/
    └── (frontend files)
```

## Reference Documentation

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- Project Architecture: `docs/01_architecture.md`
