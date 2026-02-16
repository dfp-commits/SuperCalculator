# Setup Requirements for Netlify & Neon Deployment

## What You Need to Provide

### 1. Neon PostgreSQL Database Connection String

**Where to get it:**
1. Sign up/login at [neon.tech](https://neon.tech)
2. Create a new project
3. Go to your project dashboard
4. Copy the **Connection String** (looks like: `postgresql://user:password@host/database?sslmode=require`)

**What to do with it:**
- Add it as an environment variable in Netlify (see DEPLOYMENT.md)
- Variable name: `DATABASE_URL`
- Value: Your Neon connection string

### 2. Netlify Account

**What you need:**
- A Netlify account (free tier works)
- Your GitHub repository connected

**What Netlify will provide:**
- Your site URL (e.g., `your-site.netlify.app`)
- Environment variable configuration panel
- Function logs for debugging

## Quick Setup Checklist

- [ ] Create Neon account and project
- [ ] Copy Neon connection string
- [ ] Run database schema SQL in Neon SQL Editor (see DEPLOYMENT.md)
- [ ] Connect GitHub repo to Netlify
- [ ] Add `DATABASE_URL` environment variable in Netlify
- [ ] Deploy site
- [ ] Test calculator functionality

## Files Already Created

The following files have been created for you:

1. **Netlify Functions** (`netlify/functions/`):
   - `calculate.js` - Standard calculations
   - `calculate-scientific.js` - Scientific calculations
   - `history.js` - Get calculation history
   - `history-cleanup.js` - Cleanup old records

2. **Neon Adapter** (`src/infrastructure/history-store-neon.js`):
   - PostgreSQL database adapter
   - Automatically used when `DATABASE_URL` is set

3. **Configuration** (`netlify.toml`):
   - Netlify build and redirect configuration
   - Routes API calls to serverless functions

4. **Documentation** (`DEPLOYMENT.md`):
   - Step-by-step deployment guide
   - Troubleshooting tips

## Architecture Compliance

✅ **Follows contract requirements:**
- Infrastructure layer properly separated (`src/infrastructure/`)
- Service layer orchestrates correctly (`src/services/`)
- No business logic in API handlers
- Dependencies flow downward (Interface → Services → Core → Infrastructure)
- Environment-based adapter selection (SQLite local, Neon production)

## Next Steps

1. Read `DEPLOYMENT.md` for detailed instructions
2. Set up Neon database
3. Deploy to Netlify
4. Test the calculator
