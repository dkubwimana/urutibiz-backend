import { connectDatabase, getDatabase, closeDatabase } from '../src/config/database';

async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Connect to database
    await connectDatabase();
    console.log('✅ Database connected successfully!');
    
    // Test basic query
    const db = getDatabase();
    const result = await db.raw('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('📊 Database Info:');
    console.log(`   Time: ${result.rows[0].current_time}`);
    console.log(`   Version: ${result.rows[0].pg_version}`);
    
    // Test if we can list tables
    const tables = await db.raw(`
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
    await closeDatabase();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
testDatabaseConnection();
