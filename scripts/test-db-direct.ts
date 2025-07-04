import * as dotenv from 'dotenv';
import knex from 'knex';

// Load environment variables
dotenv.config();

// Override with Neon database values
const dbConfig = {
  host: 'ep-wandering-dew-a8rs9ep6-pooler.eastus2.azure.neon.tech',
  port: 5432,
  database: 'urutibizdb',
  user: 'neondb_owner',
  password: 'npg_vKmLiNQ1O5wh',
  ssl: true
};

async function testDirectConnection() {
  console.log('🔄 Testing direct database connection...');
  console.log('Database configuration:');
  console.log(`Host: ${dbConfig.host}`);
  console.log(`Port: ${dbConfig.port}`);
  console.log(`Database: ${dbConfig.database}`);
  console.log(`User: ${dbConfig.user}`);
  console.log(`SSL: ${dbConfig.ssl}`);
  
  const database = knex({
    client: 'postgresql',
    connection: {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: dbConfig.ssl ? { 
        rejectUnauthorized: false 
      } : false,
    },
    pool: {
      min: 2,
      max: 10,
    },
  });

  try {
    // Test the connection
    const result = await database.raw('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Database connected successfully!');
    console.log('📊 Database Info:');
    console.log(`   Time: ${result.rows[0].current_time}`);
    console.log(`   Version: ${result.rows[0].pg_version}`);
    
    // Test if we can list tables
    const tables = await database.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`📋 Existing tables: ${tables.rows.length > 0 ? tables.rows.map((t: any) => t.table_name).join(', ') : 'None'}`);
    
    console.log('🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await database.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
testDirectConnection();
