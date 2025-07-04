require('dotenv').config();

console.log('🔍 Environment Variables Debug');
console.log('==============================');

// Check if .env file exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
console.log(`📁 .env file path: ${envPath}`);
console.log(`📄 .env file exists: ${fs.existsSync(envPath)}`);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(`📏 .env file size: ${envContent.length} characters`);
  
  // Show database-related variables from .env file
  const envLines = envContent.split('\n');
  console.log('\n📋 Database variables in .env file:');
  envLines.forEach(line => {
    if (line.startsWith('DB_') || line.startsWith('NODE_ENV')) {
      console.log(`   ${line}`);
    }
  });
}

console.log('\n🌍 Current process environment variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   DB_HOST: ${process.env.DB_HOST}`);
console.log(`   DB_PORT: ${process.env.DB_PORT}`);
console.log(`   DB_NAME: ${process.env.DB_NAME}`);
console.log(`   DB_USER: ${process.env.DB_USER}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : 'undefined'}`);
console.log(`   DB_SSL: ${process.env.DB_SSL}`);

console.log('\n🔧 Fixing database configuration...');

// Let's check if we need to set demo mode properly
if (process.env.NODE_ENV === 'demo') {
  console.log('✅ Running in demo mode - database connection should be optional');
} else {
  console.log('⚠️ Not in demo mode - database connection required');
}

// Check for Windows environment variable precedence
console.log('\n💻 Windows Environment Check:');
console.log('If you see different values above than in .env file,');
console.log('Windows system environment variables might be overriding .env file.');
console.log('You can check with: echo %DB_USER% in Command Prompt');
