import api from './api';

const ENDPOINTS_BASE_URL = 'endpoints';

// Endpoints service
export const endpointService = {
  // Get all endpoints
  getEndpoints: async () => {
    try {
      console.log('Attempting to fetch endpoints...');
      const response = await api.get(ENDPOINTS_BASE_URL, {
        headers: {
          'Accept': 'application/json',
        }
      });
      console.log('Endpoints fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getEndpoints:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },

  // Get a single endpoint by ID
  getEndpoint: async (id) => {
    try {
      const response = await api.get(`${ENDPOINTS_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getEndpoint:', error);
      throw error;
    }
  },

  // Create a new endpoint
  createEndpoint: async (endpointData) => {
    try {
      const response = await api.post(ENDPOINTS_BASE_URL, {
        url: endpointData.url,
        is_active: endpointData.is_active
      });
      return response.data;
    } catch (error) {
      console.error('Error creating endpoint:', error);
      throw error;
    }
  },

  // Update an existing endpoint
  updateEndpoint: async (endpointData) => {
    try {
      const { endpoint_id, ...data } = endpointData;
      const response = await api.put(`${ENDPOINTS_BASE_URL}/${endpoint_id}`, {
        url: data.url,
        is_active: data.is_active
      });
      return response.data;
    } catch (error) {
      console.error('Error updating endpoint:', error);
      throw error;
    }
  },

  // Delete an endpoint
  deleteEndpoint: async (endpointId) => {
    try {
      await api.delete(`${ENDPOINTS_BASE_URL}/${endpointId}`);
      return true;
    } catch (error) {
      console.error('Error deleting endpoint:', error);
      throw error;
    }
  },

  // Toggle endpoint status (active/inactive)
  toggleEndpointStatus: async (id, isActive) => {
    try {
      const response = await api.put(`${ENDPOINTS_BASE_URL}/${id}`, {
        is_active: isActive
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling endpoint status:', error);
      throw error;
    }
  }
};

export default endpointService;