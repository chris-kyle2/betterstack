import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { Download, ArrowLeft, Search, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import logService from '../../services/logService';
import endpointService from '../../services/endpointService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';


const LogsList = () => {
  const { endpointId } = useParams();
  const navigate = useNavigate();
  const [nextToken, setNextToken] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date()
  });
  const limit = 10;

  // Fetch endpoint details
  const { data: endpoint, isLoading: isLoadingEndpoint } = useQuery(
    ['endpoint', endpointId],
    () => endpointService.getEndpoint(endpointId),
    {
      enabled: !!endpointId,
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        toast.error(`Failed to load endpoint: ${errorMessage}`);
      }
    }
  );

  // Fetch logs
  const { data: logsResponse, isLoading: isLoadingLogs } = useQuery(
    ['logs', endpointId, nextToken, dateRange],
    () => logService.getEndpointLogs(endpointId, limit, nextToken),
    {
      enabled: !!endpointId,
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        toast.error(`Failed to load logs: ${errorMessage}`);
      }
    }
  );

  const handleExport = async () => {
    try {
      const blob = await logService.exportLogs(
        endpointId,
        dateRange.startDate.toISOString(),
        dateRange.endDate.toISOString()
      );
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${endpoint?.url}-${format(dateRange.startDate, 'yyyy-MM-dd')}-to-${format(dateRange.endDate, 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Logs exported successfully');
    } catch (error) {
      toast.error(`Failed to export logs: ${error.message}`);
    }
  };

  const handleLoadMore = () => {
    if (logsResponse?.next_token) {
      setNextToken(logsResponse.next_token);
    }
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    setNextToken(null); // Reset pagination when date range changes
  };

  if (isLoadingEndpoint || isLoadingLogs) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const logs = logsResponse?.logs || [];
  const hasMore = logsResponse?.has_more || false;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Logs</h1>
            <p className="text-gray-400">{endpoint?.url}</p>
          </div>
        </div>

        <div className="flex space-x-2">

          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

     

      {/* Logs Table */}
      <Card className="bg-dark-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Timestamp</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Region</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Response Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">DNS Latency</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Connect Latency</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Total Latency</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">SSL Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600">
              {logs.map((log) => (
                <tr key={log.log_id} className="hover:bg-dark-600">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.region || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    <StatusBadge 
                      status={log.is_up ? 'online' : 'offline'} 
                      text={log.is_up ? 'Online' : 'Offline'}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.response_time?.toFixed(2) || '-'} ms
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.dns_latency?.toFixed(2) || '-'} ms
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.connection_latency?.toFixed(2) || '-'} ms
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.total_latency?.toFixed(2) || '-'} ms
                  </td>
                  <td className="px-4 py-3">
                    {log.is_secure && (
                      <StatusBadge
                        status={log.certificate_valid ? 'online' : 'offline'}
                        text={log.certificate_valid ? 'Valid' : 'Invalid'}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.error_message || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center py-4 border-t border-dark-600">
            <Button
              variant="secondary"
              onClick={handleLoadMore}
              isLoading={isLoadingLogs}
            >
              Load More
            </Button>
          </div>
        )}

        {/* Total Count */}
        <div className="px-4 py-3 border-t border-dark-600">
          <p className="text-sm text-gray-400">
            Showing {logs.length} of {logsResponse?.total_count || 0} logs
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LogsList; 