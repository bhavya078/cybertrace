export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
  services: {
    persistence: {
      adapter: string;
      status: 'operational' | 'error';
    };
    aiProviders: {
      forensic: string;
      trace: string;
      guardian: string;
      mode: string;
    };
  };
}
