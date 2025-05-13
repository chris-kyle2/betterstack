import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Clock, Globe, Server, AlertTriangle, ArrowRight, Plus } from 'lucide-react';
import endpointService from '../../services/endpointService';
import logService from '../../services/logService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EndpointStatusCard from '../../components/dashboard/EndpointStatusCard';
import { ChartContainer } from '../../components/dashboard/ChartContainer';

const Dashboard = () => {
  // Fetch endpoints (limited to 5)
  const { data: endpointsResponse, isLoading: isLoadingEndpoints } = useQuery(
    ['endpoints'],
    () => endpointService.getEndpoints(),
    { 
      staleTime: 60000,
      retry: 1,
      onError: (error) => {
        console.error('Error fetching endpoints:', error);
      }
    }
  );

  // Fetch overall statistics
  const { data: statistics, isLoading: isLoadingStats } = useQuery(
    ['statistics', 7],
    () => logService.getOverallStatistics(7),
    { 
      staleTime: 300000,
      retry: 1,
      onError: (error) => {
        console.error('Error fetching statistics:', error);
      }
    }
  );

  if (isLoadingEndpoints || isLoadingStats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Ensure we have valid data
  const endpoints = endpointsResponse || [];
  const totalEndpoints = endpoints.length;
  const recentEndpoints = endpoints.slice(0, 5); // Get first 5 endpoints
  const dailyStats = statistics?.daily_stats || [];
  const uptimePercentage = statistics?.uptime_percentage || 0;
  const avgResponseTime = statistics?.average_response_time || 0;
  const errorsCount = statistics?.errors_count || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-dark-700">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-900 text-primary-500">
              <Globe className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Endpoints</p>
              <p className="text-2xl font-semibold text-white">{totalEndpoints}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-700">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-success-900 text-success-500">
              <Server className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Uptime</p>
              <p className="text-2xl font-semibold text-white">
                {uptimePercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-700">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-secondary-900 text-secondary-500">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-semibold text-white">
                {avgResponseTime.toFixed(0)} ms
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-700">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-error-900 text-error-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Errors (24h)</p>
              <p className="text-2xl font-semibold text-white">{errorsCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Performance Chart */}
      <Card title="Response Time (7 days)" className="bg-dark-700">
        <div className="h-80">
          <ChartContainer 
            data={dailyStats} 
            type="area"
          />
        </div>
      </Card>

      {/* Endpoints Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Endpoints Overview</h2>
          <div className="flex space-x-2">
            <Link to="/endpoints/new">
              <Button variant="secondary" size="sm" icon={Plus}>
                Add Endpoint
              </Button>
            </Link>
            <Link to="/endpoints">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {recentEndpoints.length === 0 ? (
            <Card className="bg-dark-700 py-8 text-center">
              <p className="text-gray-400">No endpoints found. Add your first endpoint to start monitoring.</p>
              <Link to="/endpoints/new" className="mt-4 inline-block">
                <Button variant="primary" icon={Plus}>
                  Add Endpoint
                </Button>
              </Link>
            </Card>
          ) : (
            recentEndpoints.map((endpoint) => (
              <EndpointStatusCard key={endpoint.endpoint_id} endpoint={endpoint} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;