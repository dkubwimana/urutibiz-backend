// AI types placeholder
export interface AIRecommendation {
  productId: string;
  score: number;
  reason: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response?: string;
  timestamp: Date;
}

export interface AIAnalytics {
  userBehavior: Record<string, any>;
  recommendations: AIRecommendation[];
  insights: string[];
}
