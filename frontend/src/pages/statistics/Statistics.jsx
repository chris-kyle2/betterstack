import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Calendar, TrendingUp, Clock, ArrowRight, Clock8, ArrowUpRight, Activity } from 'lucide-react';
import logService from '../../services/logService';
import endpointService from '../../services/endpointService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ChartContainer } from '../../components/dashboard/ChartContainer';
import { Link } from 'react-router-dom';

const Statistics = () => {
  const [timeRange, setTimeRange] = useState(7); // Days
  
  // Fetch overall statistics
  const { data: statistics, isLoading: isLoadingStats, error: statsError } = useQuery(
    ['overall-statistics', timeRange],
    () => logService.getOverallStatistics(timeRange),
    { 
      staleTime: 300000,
      retry: 1,
      onError: (error) => {
        console.error('Error fetching statistics:', error);
      }
    }
  );
  
  // Fetch top endpoints
  const { data: endpointsResponse, isLoading: isLoadingEndpoints, error: endpointsError } = useQuery(
    ['endpoints', 1, 5], // First page, 5 items
    () => endpointService.getEndpoints(1, 5),
    { 
      staleTime: 60000,
      retry: 1,
      onError: (error) => {
        console.error('Error fetching endpoints:', error);
      }
    }
  );
  
  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };
  
  // Generate time labels for buttons
  const timeLabels = [
    { days: 1, label: '24 Hours' },
    { days: 7, label: '7 Days' },
    { days: 30, label: '30 Days' }
  ];
  
  if (isLoadingStats || isLoadingEndpoints) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (statsError || endpointsError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading statistics</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  // Ensure we have valid data
  const endpoints = endpointsResponse?.data || [];
  const dailyStats = statistics?.daily_stats || [];
  const statusCodes = statistics?.status_codes || {};
  const uptimePercentage = statistics?.uptime_percentage || 0;
  const avgResponseTime = statistics?.average_response_time || 0;
  const errorsCount = statistics?.errors_count || 0;
  const totalChecks = statistics?.total_checks || 0;
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with time range selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Performance Statistics</h1>
        
        <div className="flex space-x-2 bg-dark-700 p-1 rounded-md border border-dark-500">
          {timeLabels.map(({ days, label }) => (
            <button
              key={days}
              onClick={() => handleTimeRangeChange(days)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                timeRange === days
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-dark-700">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-900 text-primary-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Uptime Percentage</p>
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
              <Activity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Errors</p>
              <p className="text-2xl font-semibold text-white">
                {errorsCount}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-dark-700">
          <div className="flex items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-success-900 text-success-500">
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Checks</p>
              <p className="text-2xl font-semibold text-white">
                {totalChecks}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title={`Response Time (Last ${timeRange} days)`} className="bg-dark-700">
          <div className="h-80">
            <ChartContainer 
              data={dailyStats} 
              type="area"
              metric="average_response_time"
              title="Response Time"
              color="rgb(14, 165, 233)"
            />
          </div>
        </Card>
        
        <Card title={`Uptime Percentage (Last ${timeRange} days)`} className="bg-dark-700">
          <div className="h-80">
            <ChartContainer 
              data={dailyStats} 
              type="area"
              metric="uptime_percentage"
              title="Uptime"
              color="rgb(34, 197, 94)"
            />
          </div>
        </Card>
      </div>
      
      {/* Status Code Distribution */}
      <Card title="Status Code Distribution" className="bg-dark-700">
        <div className="h-64">
          {Object.keys(statusCodes).length > 0 ? (
            <ChartContainer
              data={Object.entries(statusCodes).map(([status, count]) => ({
                date: status,
                checks_count: count
              }))}
              type="bar"
              metric="checks_count"
              title="Status Codes"
              color="rgb(168, 85, 247)" // Purple
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No status code data available</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Top Endpoints Performance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Top Endpoints Performance</h2>
          <Link to="/endpoints">
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
              View All Endpoints
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-500 border border-dark-500 rounded-lg bg-dark-700">
            <thead className="bg-dark-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Endpoint
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Uptime
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Avg. Response
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Slowest
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Errors
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark-700 divide-y divide-dark-600">
              {endpoints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    No endpoints found
                  </td>
                </tr>
              ) : (
                endpoints.map((endpoint) => (
                  <tr key={endpoint.endpoint_id} className="hover:bg-dark-600 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {endpoint.name || 'Unnamed Endpoint'}
                        </span>
                        <span className="text-xs text-gray-400 truncate max-w-xs">
                          {endpoint.url}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-success-500">
                        99.8%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      245 ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      1.2 s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      3
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link to={`/endpoints/${endpoint.endpoint_id}`}>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;