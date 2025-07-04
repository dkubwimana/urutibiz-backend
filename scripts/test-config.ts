import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

console.log('🔧 Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_SSL:', process.env.DB_SSL);
console.log('');

import config from '../src/config/config';

console.log('🔧 Testing database configuration values:');
console.log('Config object:', JSON.stringify(config.database, null, 2));
console.log('DB_SSL environment variable:', process.env.DB_SSL);
console.log('DB_SSL parsed:', config.database.ssl);
console.log('Type of ssl:', typeof config.database.ssl);
