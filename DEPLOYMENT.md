# EduBridge Deployment Guide

## Environment Variables

Your `.env` file should contain:

```env
# Database Configuration (REQUIRED)
DATABASE_URL="postgresql://user:password@host:port/database"

# Next.js Configuration (Optional)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Current Setup
You already have a PostgreSQL database configured:
```env
DATABASE_URL="postgres://pxxluser_mlumrszia59bbb5:...@db.pxxl.pro:39697/pxxldb_mlumrszi9fcac3b"
```

This is all you need! ✅

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/edubridge.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variable:
     - Key: `DATABASE_URL`
     - Value: Your database connection string
   - Click "Deploy"

3. **After Deployment**
   ```bash
   # Run migrations on production database
   npx prisma db push
   ```

---

### Option 2: Netlify

1. **Build Configuration**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   Add in Netlify dashboard:
   - `DATABASE_URL`: Your database connection string

3. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

---

### Option 3: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set DATABASE_URL="your-connection-string"
   ```

---

### Option 4: Self-Hosted (VPS/Server)

1. **Install Dependencies**
   ```bash
   npm install
   npm run build
   ```

2. **Set Environment Variables**
   ```bash
   export DATABASE_URL="your-connection-string"
   ```

3. **Run Migrations**
   ```bash
   npx prisma db push
   ```

4. **Start Production Server**
   ```bash
   npm start
   # Or with PM2
   pm2 start npm --name "edubridge" -- start
   ```

---

## Pre-Deployment Checklist

- [ ] Database is accessible from deployment platform
- [ ] `DATABASE_URL` is set in environment variables
- [ ] Run `npx prisma generate` locally
- [ ] Run `npx prisma db push` to sync database schema
- [ ] Test QR code scanning on mobile devices
- [ ] Verify HTTPS is enabled (required for camera access)

---

## Post-Deployment Steps

1. **Test the Application**
   - Visit `/attendance` page
   - Switch to Lecturer role
   - Generate QR code
   - Switch to Student role
   - Scan QR code (or simulate)
   - Verify attendance appears in live view

2. **Test Reports**
   - Visit `/reports` page
   - Verify statistics are loading
   - Test CSV export

3. **Mobile Testing**
   - Open on mobile device
   - Test camera QR scanning
   - Verify responsive design

---

## Troubleshooting

### Issue: "PrismaClient needs to be constructed with options"
**Solution:** Already fixed in `lib/prisma.ts` with:
```typescript
new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})
```

### Issue: Camera not working
**Solution:** Ensure your site is served over HTTPS. Browsers require HTTPS for camera access.

### Issue: Database connection fails
**Solution:** 
- Verify `DATABASE_URL` is correct
- Check if database allows connections from deployment IP
- For Supabase/Neon, use connection pooling URL

### Issue: Prisma schema out of sync
**Solution:**
```bash
npx prisma generate
npx prisma db push
```

---

## Production Optimizations

1. **Enable Database Connection Pooling**
   - Use Prisma Accelerate or PgBouncer
   - Reduces connection overhead

2. **Add Caching**
   - Cache attendance stats for 10 seconds
   - Use Redis for session management

3. **Add Rate Limiting**
   - Prevent abuse of attendance marking
   - Limit QR generation requests

4. **Add Authentication**
   - Integrate NextAuth.js
   - Replace mock users with real auth

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_APP_URL` | ❌ No | Your app's public URL | `https://edubridge.com` |

---

## Quick Deploy Commands

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Push database schema
npx prisma db push

# 4. Build for production
npm run build

# 5. Start production server
npm start
```

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Prisma logs: `npx prisma studio`
- Check browser console for errors
- Verify database connectivity

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to Git
- Use environment variables in production
- Enable HTTPS for camera access
- Validate all user inputs on the server
- Add rate limiting for API routes
- Consider adding CAPTCHA for attendance marking

---

## What's Already Configured

✅ Database schema (Attendance model)
✅ API routes for attendance
✅ QR code generation and scanning
✅ Live polling (3-second refresh)
✅ CSV export functionality
✅ Attendance statistics and reports
✅ Role-based access control
✅ Responsive UI with shadcn/ui

You're ready to deploy! 🚀
