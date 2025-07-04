// Metrics middleware placeholder
import { Request, Response, NextFunction } from 'express';

interface MetricsData {
  requests: number;
  responseTime: number[];
  errors: number;
  statusCodes: Record<number, number>;
}

const metrics: MetricsData = {
  requests: 0,
  responseTime: [],
  errors: 0,
  statusCodes: {},
};

export const metricsMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Track request
  metrics.requests++;
  
  // Track response time and status when response finishes
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    metrics.responseTime.push(responseTime);
    
    // Track status codes
    const statusCode = res.statusCode;
    metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;
    
    // Track errors
    if (statusCode >= 400) {
      metrics.errors++;
    }
  });
  
  next();
};

export const getMetrics = (): MetricsData => {
  return {
    ...metrics,
    responseTime: [...metrics.responseTime],
  };
};
