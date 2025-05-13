import api from './api';

export interface Endpoint {
  endpoint_id: string;
  url: string;
  is_active: boolean;
  created_at: string;
  name?: string;
  description?: string;
  check_interval?: number;
  tags?: string[];
  expected_status_code?: number;
  notification_email?: string;
}

export interface CreateEndpointDto {
  url: string;
  name?: string;
  description?: string;
  is_active?: boolean;
  check_interval?: number;
  tags?: string[];
  expected_status_code?: number;
  notification_email?: string;
}

export interface UpdateEndpointDto extends Partial<CreateEndpointDto> {
  endpoint_id: string;
}

export interface EndpointsPaginatedResponse {
  data: Endpoint[];
  total: number;
  page: number;
  limit: number;
}

// Endpoints service
const endpointService = {
  // Get all endpoints with pagination
  getEndpoints: async (page = 1, limit = 10, searchQuery = '', tags?: string[]): Promise<EndpointsPaginatedResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    
    if (tags && tags.length > 0) {
      tags.forEach(tag => params.append('tags', tag));
    }
    
    const response = await api.get(`/endpoints?${params.toString()}`);
    return response.data;
  },

  // Get a single endpoint by ID
  getEndpoint: async (id: string): Promise<Endpoint> => {
    const response = await api.get(`/endpoints/${id}`);
    return response.data;
  },

  // Create a new endpoint
  createEndpoint: async (data: CreateEndpointDto): Promise<Endpoint> => {
    const response = await api.post('/endpoints', data);
    return response.data;
  },

  // Update an existing endpoint
  updateEndpoint: async (data: UpdateEndpointDto): Promise<Endpoint> => {
    const response = await api.put(`/endpoints/${data.endpoint_id}`, data);
    return response.data;
  },

  // Delete an endpoint
  deleteEndpoint: async (id: string): Promise<void> => {
    await api.delete(`/endpoints/${id}`);
  },

  // Toggle endpoint status (active/inactive)
  toggleEndpointStatus: async (id: string, isActive: boolean): Promise<Endpoint> => {
    const response = await api.patch(`/endpoints/${id}/status`, { is_active: isActive });
    return response.data;
  }
};

export default endpointService;