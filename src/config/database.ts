import knex, { Knex } from 'knex';
import { getConfig } from './config';
import logger from '../utils/logger';

const config = getConfig();

// Database configuration with graceful failure handling
const dbConfig: Knex.Config = {
  client: 'postgresql',
  connection: config.database.ssl ? {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    ssl: {
      rejectUnauthorized: false
    }
  } : {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
  },
  pool: {
    min: config.database.maxConnections ? Math.min(2, config.database.maxConnections) : 2,
    max: config.database.maxConnections || 10,
    createTimeoutMillis: config.database.connectionTimeoutMs || 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: config.database.idleTimeoutMs || 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  acquireConnectionTimeout: 60000,
  migrations: {
    directory: './database/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './database/seeds',
  },
};

// Create database instance
let database: Knex | undefined;

export const connectDatabase = async (): Promise<void> => {
  try {
    database = knex(dbConfig);
    
    // Test the connection
    await database.raw('SELECT 1+1 as result');
    
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

export const getDatabase = (): Knex => {
  // Check if we're in demo mode - return a mock database
  if (process.env.NODE_ENV === 'demo') {
    // Return a mock database for demo mode that doesn't require connection
    if (!database) {
      // Create a comprehensive mock database that mimics knex interface
      const mockDb = (tableName: string) => {
        // Mock query builder that mimics knex's fluent interface
        const mockQueryBuilder = {
          where: (conditions: any) => ({
            first: () => {
              // Return mock user data for auth testing
              if (tableName === 'users' && conditions.email) {
                return Promise.resolve({
                  id: 'demo-user-id',
                  email: conditions.email,
                  firstName: 'Demo',
                  lastName: 'User',
                  passwordHash: '$2b$12$demo.hash.for.testing',
                  isVerified: false,
                  isActive: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
                });
              }
              return Promise.resolve(null);
            },
            delete: () => Promise.resolve(1),
            update: (data: any) => {
              console.log('Mock DB update:', data);
              return Promise.resolve(1);
            }
          }),
          insert: (data: any) => Promise.resolve([{
            id: 'demo-id-' + Date.now(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
          }]),
          select: () => ({
            from: () => ({
              where: () => Promise.resolve([]),
              limit: () => Promise.resolve([]),
              offset: () => Promise.resolve([])
            })
          }),
          first: () => Promise.resolve(null),
          update: (data: any) => {
            console.log('Mock DB root update:', data);
            return Promise.resolve(1);
          },
          delete: () => Promise.resolve(1)
        };
        
        return mockQueryBuilder;
      };
      
      // Add additional mock methods that knex provides
      (mockDb as any).raw = () => Promise.resolve({ rows: [] });
      (mockDb as any).destroy = () => Promise.resolve();
      (mockDb as any).transaction = (callback: any) => {
        // Mock transaction - just call the callback with the mock db
        return callback(mockDb);
      };
      
      return mockDb as any;
    }
  }
  
  if (!database) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return database;
};

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.destroy();
    logger.info('Database connection closed');
  }
};

export { dbConfig };
