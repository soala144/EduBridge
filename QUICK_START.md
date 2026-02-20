# EduBridge - Quick Start Guide

## What You Need in .env

**ONLY ONE VARIABLE IS REQUIRED:**

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

That's it! You already have this configured ✅

---

## Deploy in 3 Steps

### Step 1: Verify Everything Works
```bash
npm run verify
```

### Step 2: Build the Project
```bash
npm run build
```

### Step 3: Deploy

#### Option A: Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# DATABASE_URL = your-database-url

# Push database schema
npx prisma db push
```

#### Option B: Manual Deploy
```bash
# On your server:
npm install
npm run build
npx prisma db push
npm start
```

---

## What's Already Done ✅

- ✅ Database configured (PostgreSQL)
- ✅ Prisma schema created
- ✅ API routes built
- ✅ QR code system working
- ✅ Live polling implemented
- ✅ CSV export ready
- ✅ Reports dashboard complete
- ✅ Mobile responsive

---

## Test Locally

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Test flow:
- Go to /attendance
- Switch to "Lecturer" role
- Generate QR code
- Switch to "Student" role  
- Enter details and scan
- Switch back to "Lecturer"
- See live attendance updates
```

---

## Production Checklist

Before deploying:
- [ ] `DATABASE_URL` is set
- [ ] Run `npm run verify`
- [ ] Run `npm run build` (no errors)
- [ ] Run `npx prisma db push` on production DB
- [ ] Test on HTTPS (required for camera)

After deploying:
- [ ] Test QR generation
- [ ] Test QR scanning on mobile
- [ ] Test live updates
- [ ] Test CSV export
- [ ] Test reports page

---

## Common Issues

**Issue:** "Can't access camera"
**Fix:** Must use HTTPS in production

**Issue:** "Database connection failed"  
**Fix:** Check `DATABASE_URL` is correct

**Issue:** "Prisma client error"
**Fix:** Run `npx prisma generate`

---

## Environment Variables Summary

| Variable | Required | Your Value |
|----------|----------|------------|
| `DATABASE_URL` | ✅ YES | Already set in .env |
| `NEXT_PUBLIC_APP_URL` | ❌ NO | Optional |

---

## Deployment Platforms

| Platform | Difficulty | Time | Cost |
|----------|-----------|------|------|
| Vercel | ⭐ Easy | 5 min | Free |
| Netlify | ⭐⭐ Medium | 10 min | Free |
| Railway | ⭐ Easy | 5 min | Free tier |
| VPS | ⭐⭐⭐ Hard | 30 min | $5/mo |

**Recommended:** Vercel (easiest, free, automatic HTTPS)

---

## Support Commands

```bash
# Verify deployment readiness
npm run verify

# View database in browser
npm run db:studio

# Push schema to database
npm run db:push

# Build for production
npm run build

# Start production server
npm start
```

---

## You're Ready! 🚀

Your app is production-ready. Just deploy and test!

Questions? Check DEPLOYMENT.md for detailed instructions.
