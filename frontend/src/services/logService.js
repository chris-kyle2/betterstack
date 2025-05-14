import api from './api.js';

const logService = {
 
  getEndpointLogs: async (endpointId, limit = 20, nextToken = null) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (nextToken) {
      params.append('next_token', nextToken);
    }
    const response = await api.get(`/logs/${endpointId}?${params.toString()}`);
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

  
   
};

export default logService;