import { Request, Response } from 'express';
import morgan from 'morgan';
import logger from '../utils/logger';

// Custom token for response time with color coding
morgan.token('response-time-colored', (_req, res) => {
  const responseTime = parseFloat(res.getHeader('X-Response-Time') as string || '0');
  const time = responseTime.toFixed(2);
  
  if (responseTime < 100) {
    return `\x1b[32m${time}ms\x1b[0m`; // Green for fast responses
  } else if (responseTime < 500) {
    return `\x1b[33m${time}ms\x1b[0m`; // Yellow for medium responses
  } else {
    return `\x1b[31m${time}ms\x1b[0m`; // Red for slow responses
  }
});

// Custom format for development
const devFormat = ':method :url :status :response-time-colored - :res[content-length]';

// Custom format for production
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

export const loggingMiddleware = morgan(
  process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
    skip: (req: Request, _res: Response) => {
      // Skip logging for health check endpoints
      return req.url === '/health' || req.url === '/api/v1/health';
    },
  }
);
