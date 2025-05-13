import React, { useState, useEffect } from 'react';
import { endpointService } from '../services/endpointService';
import { toast } from 'sonner';

const TestEndpoints = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test data for creating an endpoint
  const testEndpoint = {
    name: "Test Endpoint",
    url: "https://api.example.com",
    method: "GET",
    interval: 60,
    timeout: 30,
    expected_status: 200
  };

  // Test getting all endpoints
  const testGetEndpoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await endpointService.getEndpoints();
      setEndpoints(data);
      toast.success('Successfully fetched endpoints');
      console.log('Fetched endpoints:', data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch endpoints');
      console.error('Error fetching endpoints:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test creating an endpoint
  const testCreateEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const newEndpoint = await endpointService.createEndpoint(testEndpoint);
      toast.success('Successfully created endpoint');
      console.log('Created endpoint:', newEndpoint);
      // Refresh the list
      testGetEndpoints();
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create endpoint');
      console.error('Error creating endpoint:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test updating an endpoint
  const testUpdateEndpoint = async (endpointId) => {
    if (!endpointId) {
      toast.error('No endpoint ID provided');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedEndpoint = await endpointService.updateEndpoint(endpointId, {
        ...testEndpoint,
        name: "Updated Test Endpoint"
      });
      toast.success('Successfully updated endpoint');
      console.log('Updated endpoint:', updatedEndpoint);
      // Refresh the list
      testGetEndpoints();
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update endpoint');
      console.error('Error updating endpoint:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test deleting an endpoint
  const testDeleteEndpoint = async (endpointId) => {
    if (!endpointId) {
      toast.error('No endpoint ID provided');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await endpointService.deleteEndpoint(endpointId);
      toast.success('Successfully deleted endpoint');
      // Refresh the list
      testGetEndpoints();
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete endpoint');
      console.error('Error deleting endpoint:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Test Endpoints Service</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={testGetEndpoints}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Get All Endpoints
          </button>
          
          <button
            onClick={testCreateEndpoint}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Create Test Endpoint
          </button>
        </div>

        {error && (
          <div className="text-red-500">
            Error: {error}
          </div>
        )}

        {loading && (
          <div className="text-gray-500">
            Loading...
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Endpoints List:</h3>
          {endpoints.length > 0 ? (
            <div className="space-y-2">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="border p-4 rounded">
                  <p>Name: {endpoint.name}</p>
                  <p>URL: {endpoint.url}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => testUpdateEndpoint(endpoint.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => testDeleteEndpoint(endpoint.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No endpoints found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestEndpoints; 