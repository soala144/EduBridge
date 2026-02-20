#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Run this before deploying to catch common issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 EduBridge Deployment Verification\n');

let hasErrors = false;

// Check 1: .env file exists
console.log('1. Checking environment variables...');
if (!fs.existsSync('.env')) {
  console.error('   ❌ .env file not found!');
  console.log('   → Copy .env.example to .env and configure DATABASE_URL');
  hasErrors = true;
} else {
  const envContent = fs.readFileSync('.env', 'utf8');
  if (!envContent.includes('DATABASE_URL')) {
    console.error('   ❌ DATABASE_URL not found in .env');
    hasErrors = true;
  } else {
    console.log('   ✅ Environment variables configured');
  }
}

// Check 2: Dependencies installed
console.log('\n2. Checking dependencies...');
if (!fs.existsSync('node_modules')) {
  console.error('   ❌ node_modules not found!');
  console.log('   → Run: npm install');
  hasErrors = true;
} else {
  console.log('   ✅ Dependencies installed');
}

// Check 3: Prisma client generated
console.log('\n3. Checking Prisma client...');
if (!fs.existsSync('node_modules/.prisma/client')) {
  console.error('   ❌ Prisma client not generated!');
  console.log('   → Run: npx prisma generate');
  hasErrors = true;
} else {
  console.log('   ✅ Prisma client generated');
}

// Check 4: Required files exist
console.log('\n4. Checking required files...');
const requiredFiles = [
  'prisma/schema.prisma',
  'lib/prisma.ts',
  'app/api/attendance/mark/route.ts',
  'app/api/attendance/list/route.ts',
  'components/QRGenerator.tsx',
  'components/QRScanner.tsx',
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`   ❌ Missing: ${file}`);
    allFilesExist = false;
    hasErrors = true;
  }
});

if (allFilesExist) {
  console.log('   ✅ All required files present');
}

// Check 5: Build test
console.log('\n5. Testing build...');
console.log('   ℹ️  Run manually: npm run build');

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ Deployment verification FAILED');
  console.log('\nPlease fix the issues above before deploying.');
  process.exit(1);
} else {
  console.log('✅ Deployment verification PASSED');
  console.log('\nYou\'re ready to deploy! 🚀');
  console.log('\nNext steps:');
  console.log('1. Run: npm run build');
  console.log('2. Run: npx prisma db push (on production DB)');
  console.log('3. Deploy to your platform of choice');
}
