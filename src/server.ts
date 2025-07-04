// server.ts - UrutiBiz Backend Server
import 'dotenv/config';
import App from './app';
import { getConfig } from './config/config';
import logger from './utils/logger';

const config = getConfig();

async function startServer(): Promise<void> {
  let app: App | null = null;
  
  try {
    app = new App();
    
    // Initialize the application
    const initResult = await app.initialize();
    
    if (!initResult.success) {
      logger.warn('Application initialization completed with warnings:', initResult.message);
      if (initResult.errors) {
        initResult.errors.forEach(error => {
          logger.warn(`${error.service}: ${error.error}`);
        });
      }
    }
    
    // Start the server
    const server = app.getServer();
    
    server.listen(config.port, () => {
      logger.info(`🚀 UrutiBiz API server running on port ${config.port}`);
      logger.info(`📱 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 API Base URL: http://localhost:${config.port}${config.apiPrefix}`);
      
      if (config.swagger.enabled) {
        logger.info(`📖 API Documentation: http://localhost:${config.port}/api-docs`);
      }
      
      logger.info(`💚 Health Check: http://localhost:${config.port}/health`);
      logger.info(`🌐 Frontend URL: ${config.frontendUrl}`);
    });

    // Graceful shutdown function
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      if (app) {
        await app.shutdown();
      }
      
      server.close((err: any) => {
        if (err) {
          logger.error('Error during server shutdown:', err);
          process.exit(1);
        }
        
        logger.info('✅ Server closed successfully');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    
    if (app) {
      try {
        await app.shutdown();
      } catch (shutdownError) {
        logger.error('❌ Error during emergency shutdown:', shutdownError);
      }
    }
    
    process.exit(1);
  }
}

// Start the server
startServer();
