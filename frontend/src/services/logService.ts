import api from './api';

// Browser-compatible UUID generation
function generateUUID(): string {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export interface Log {
  log_id: string;
  endpoint_id: string;
  timestamp: string;
  status_code: number;
  response_time: number;
  dns_latency: number;
  connect_latency: number;
  total_latency: number;
  is_up: boolean;
  certificate_valid: boolean | null;
  error_message: string | null;
  is_secure: boolean;
  certificate_expiry_date: string | null;
  certificate_issuer: string | null;
  tls_version: string | null;
  secure_protocol: string | null;
}

export interface LogsPaginatedResponse {
  data: Log[];
  total: number;
  page: number;
  limit: number;
}

export interface TimeRangeParams {
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
}

export interface LogsStatistics {
  total_checks: number;
  uptime_percentage: number;
  average_response_time: number;
  slowest_response_time: number;
  fastest_response_time: number;
  status_codes: { [key: string]: number };
  errors_count: number;
  ssl_valid_percentage: number | null;
  daily_stats: Array<{
    date: string;
    uptime_percentage: number;
    average_response_time: number;
    checks_count: number;
  }>;
}

// Logs service
const logService = {
  // Get logs for a specific endpoint
  getEndpointLogs: async (endpointId: string, page = 1, limit = 20): Promise<LogsPaginatedResponse> => {
    const response = await api.get(`/logs/${endpointId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get logs for a specific time range
  getLogsByTimeRange: async (
    params: TimeRangeParams
  ): Promise<LogsPaginatedResponse> => {
    const { startDate, endDate, page = 1, limit = 20 } = params;
    const response = await api.get(
      `/logs/time-range?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get statistics for a specific endpoint
  getEndpointStatistics: async (endpointId: string, days = 30): Promise<LogsStatistics> => {
    const response = await api.get(`/logs/stats/${endpointId}?days=${days}`);
    return response.data;
  },

  // Get overall statistics for all endpoints
  getOverallStatistics: async (days = 30): Promise<LogsStatistics> => {
    const response = await api.get(`/logs/stats?days=${days}`);
    return response.data;
  },

  // Export logs to CSV
  exportLogs: async (endpointId: string, startDate: string, endDate: string): Promise<Blob> => {
    const response = await api.get(
      `/logs/export?endpointId=${endpointId}&startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Add manual log for testing
  addManualLog: async (endpointId: string, userId: string): Promise<Log> => {
    const logData = {
      log_id: generateUUID(),
      endpoint_id: endpointId,
      user_id: userId,
      timestamp: new Date().toISOString(),
      status_code: 200,
      response_time: Math.floor(Math.random() * 100) + 50,
      dns_latency: Math.floor(Math.random() * 20) + 10,
      connect_latency: Math.floor(Math.random() * 30) + 20,
      total_latency: Math.floor(Math.random() * 150) + 100,
      is_up: true,
      certificate_valid: true,
      error_message: null,
      is_secure: true,
      certificate_expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      certificate_issuer: "Google Trust Services",
      tls_version: "TLSv1.3",
      secure_protocol: "TLS_AES_128_GCM_SHA256"
    };

    const response = await api.post(`/logs/${endpointId}`, logData);
    return response.data;
  }
};

export default logService;