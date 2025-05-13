import api from './api.js';

// Browser-compatible UUID generation
function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// Logs service
const logService = {
  // Get logs for a specific endpoint
  getEndpointLogs: async (endpointId, limit = 20, nextToken = null) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (nextToken) {
      params.append('next_token', nextToken);
    }
    const response = await api.get(`/logs/${endpointId}?${params.toString()}`);
    return response.data;
  },

  // Get logs for a specific time range
  getLogsByTimeRange: async (params) => {
    const { endpointId, startDate, endDate, limit = 10, nextToken = null } = params;
    const queryParams = new URLSearchParams();
    queryParams.append('start_time', startDate);
    queryParams.append('end_time', endDate);
    queryParams.append('limit', limit.toString());
    if (nextToken) {
      queryParams.append('next_token', nextToken);
    }
    const url = endpointId ? `/logs/${endpointId}/time-range` : '/logs/time-range';
    const response = await api.get(`${url}?${queryParams.toString()}`);
    return response.data;
  },

  // Get statistics for a specific endpoint
  getEndpointStatistics: async (endpointId, startDate = null, endDate = null, limit = 10, nextToken = null) => {
    const params = new URLSearchParams();
    params.append('endpoint_id', endpointId);  // Add endpoint_id as query param
    if (startDate) params.append('start_time', startDate);
    if (endDate) params.append('end_time', endDate);
    params.append('limit', limit.toString());
    if (nextToken) {
        params.append('next_token', nextToken);
    }
    const response = await api.get(`/logs/stats?${params.toString()}`);  // Changed URL to match backend
    return response.data;
},

  // Get overall statistics for all endpoints
  getOverallStatistics: async (startDate = null, endDate = null, limit = 10, nextToken = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_time', startDate);
    if (endDate) params.append('end_time', endDate);
    params.append('limit', limit.toString());
    if (nextToken) {
      params.append('next_token', nextToken);
    }
    const response = await api.get(`/logs/stats?${params.toString()}`);
    return response.data;
  },

  // Export logs to CSV
  exportLogs: async (endpointId, startDate, endDate) => {
    const response = await api.get(
      `/logs/${endpointId}/export?startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Add manual log for testing
  addManualLog: async (endpointId, userId) => {
    const logData = {
      log_id: generateUUID(),
      endpoint_id: endpointId,
      user_id: userId,
      timestamp: new Date().toISOString(),
      status_code: 200,
      response_time: Math.floor(Math.random() * 100) + 50, // Random response time between 50-150ms
      dns_latency: Math.floor(Math.random() * 20) + 10, // Random DNS latency between 10-30ms
      connect_latency: Math.floor(Math.random() * 30) + 20, // Random connect latency between 20-50ms
      total_latency: Math.floor(Math.random() * 150) + 100, // Random total latency between 100-250ms
      is_up: true,
      certificate_valid: true,
      error_message: null,
      is_secure: true,
      certificate_expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
      certificate_issuer: "Google Trust Services",
      tls_version: "TLSv1.3",
      secure_protocol: "TLS_AES_128_GCM_SHA256"
    };

    try {
      const response = await api.post(`/logs/${endpointId}`, logData);
      return response.data;
    } catch (error) {
      console.error('Error adding manual log:', error);
      throw error;
    }
  }
};

export default logService;