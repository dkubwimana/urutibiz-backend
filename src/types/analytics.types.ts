export interface BookingAnalyticsParams {
  period: string; // '7d', '30d', '90d', '1y', 'custom'
  startDate?: string;
  endDate?: string;
  granularity: 'hour' | 'day' | 'week' | 'month';
  filters?: {
    status?: string[];
    countryId?: string;
    categoryId?: string;
    ownerId?: string;
    renterId?: string;
    minAmount?: number;
    maxAmount?: number;
    productIds?: string[];
  };
  compareWith?: {
    period: string;
    startDate?: string;
    endDate?: string;
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface BookingTrends {
  totalBookings: TimeSeriesData[];
  revenue: TimeSeriesData[];
  averageValue: TimeSeriesData[];
  conversionRate: TimeSeriesData[];
  cancellationRate: TimeSeriesData[];
}

export interface BookingMetrics {
  current: {
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    conversionRate: number;
    cancellationRate: number;
    completionRate: number;
    repeatCustomerRate: number;
    averageLeadTime: number; // days between booking and start date
    averageDuration: number; // booking duration in days
  };
  previous?: {
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    conversionRate: number;
    cancellationRate: number;
    completionRate: number;
    repeatCustomerRate: number;
    averageLeadTime: number;
    averageDuration: number;
  };
  growth: {
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    conversionRate: number;
    cancellationRate: number;
    completionRate: number;
    repeatCustomerRate: number;
    averageLeadTime: number;
    averageDuration: number;
  };
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  revenue: number;
  averageValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface GeographicAnalytics {
  byCountry: {
    country: string;
    countryCode: string;
    bookings: number;
    revenue: number;
    averageValue: number;
    growth: number;
  }[];
  byCity: {
    city: string;
    country: string;
    bookings: number;
    revenue: number;
    averageValue: number;
    coordinates?: { lat: number; lng: number };
  }[];
  heatmapData: {
    lat: number;
    lng: number;
    intensity: number;
    bookings: number;
    revenue: number;
  }[];
}

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  bookings: number;
  revenue: number;
  averageValue: number;
  conversionRate: number;
  popularityRank: number;
  seasonalTrend: 'peak' | 'off-peak' | 'stable';
  growthRate: number;
  topProducts: {
    productId: string;
    title: string;
    bookings: number;
    revenue: number;
  }[];
}

export interface UserBehaviorAnalytics {
  newVsReturning: {
    newUsers: { bookings: number; revenue: number; percentage: number };
    returningUsers: { bookings: number; revenue: number; percentage: number };
  };
  userLifetime: {
    averageLifetimeValue: number;
    averageBookingsPerUser: number;
    churnRate: number;
    retentionRates: {
      period: string;
      rate: number;
    }[];
  };
  behaviorPatterns: {
    averageTimeBetweenBookings: number;
    preferredBookingTime: {
      hour: number;
      dayOfWeek: number;
      count: number;
    }[];
    advanceBookingDays: {
      range: string;
      count: number;
      percentage: number;
    }[];
  };
}

export interface RevenueAnalytics {
  breakdown: {
    totalRevenue: number;
    platformFees: number;
    payouts: number;
    taxes: number;
    refunds: number;
    netRevenue: number;
  };
  revenueByPaymentMethod: {
    method: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }[];
  revenueStreams: {
    bookingFees: number;
    serviceFees: number;
    premiumFeatures: number;
    advertisements: number;
  };
  projections: {
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
  };
}

export interface PerformanceMetrics {
  responseTime: {
    averageBookingTime: number; // minutes from search to booking
    averageConfirmationTime: number; // hours from booking to confirmation
  };
  conversionFunnel: {
    stage: string;
    users: number;
    conversionRate: number;
    dropoffRate: number;
  }[];
  seasonality: {
    month: string;
    bookingIndex: number; // relative to average (1.0 = average)
    revenueIndex: number;
    demandFactor: number;
  }[];
  topPerformers: {
    products: {
      productId: string;
      title: string;
      bookings: number;
      revenue: number;
      rating: number;
    }[];
    owners: {
      ownerId: string;
      name: string;
      bookings: number;
      revenue: number;
      rating: number;
    }[];
    locations: {
      city: string;
      country: string;
      bookings: number;
      revenue: number;
    }[];
  };
}

export interface BookingAnalyticsResponse {
  period: string;
  granularity: string;
  generatedAt: Date;
  metrics: BookingMetrics;
  trends: BookingTrends;
  statusDistribution: StatusDistribution[];
  geographic: GeographicAnalytics;
  categories: CategoryAnalytics[];
  userBehavior: UserBehaviorAnalytics;
  revenue: RevenueAnalytics;
  performance: PerformanceMetrics;
  insights: AnalyticsInsight[];
  filters?: BookingAnalyticsParams['filters'];
}

export interface AnalyticsInsight {
  type: 'growth' | 'decline' | 'anomaly' | 'opportunity' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  metric: string;
  value: number;
  change: number;
  recommendation?: string;
}
