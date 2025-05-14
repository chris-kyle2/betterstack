import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { ExternalLink, Clock, ArrowRight } from 'lucide-react';
import logService from '../../services/logService';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';

const EndpointStatusCard = ({ endpoint }) => {
  // Fetch recent logs for this endpoint
  const { data: endpointStats, isLoading } = useQuery(
    ['endpoint-stats', endpoint.endpoint_id],
    () => logService.getEndpointStatistics(endpoint.endpoint_id),
    { staleTime: 60000 }
  );

  // Determine status based on recent logs
  const determineStatus = () => {
    if (isLoading || !endpointStats) return 'unknown';
    if (!endpoint.is_active) return 'unknown';
    
    if (endpointStats.uptime_percentage === 100) return 'online';
    if (endpointStats.uptime_percentage === 0) return 'offline';
    return 'warning';
  };

  const status = determineStatus();

  const formatUrl = (url) => {
    return url.length > 40 ? url.substring(0, 40) + '...' : url;
  };

  return (
    <Card className="bg-dark-700 hover:border-dark-400 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium text-white">{endpoint.name || formatUrl(endpoint.url)}</h3>
            <StatusBadge status={status} className="ml-3" />
            {!endpoint.is_active && (
              <span className="ml-2 text-xs text-gray-400">(Monitoring paused)</span>
            )}
          </div>
          
          <div className="flex items-center text-gray-400 text-sm mb-3">
            <a 
              href={endpoint.url} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center hover:text-primary-400"
            >
              {formatUrl(endpoint.url)}
              <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-secondary-500" />
              <span>
                {isLoading
                  ? '...'
                  : endpointStats?.average_response_time
                  ? `${endpointStats.average_response_time.toFixed(0)} ms`
                  : 'No data'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Uptime:</span> {isLoading
                ? '...'
                : endpointStats?.uptime_percentage
                ? `${endpointStats.uptime_percentage.toFixed(2)}%`
                : 'No data'}
            </div>
            <div>
              <span className="text-gray-400">Checks:</span> {isLoading
                ? '...'
                : endpointStats?.total_checks ?? 'No data'}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Link to={`/logs/${endpoint.endpoint_id}`}>
            <Button variant="ghost" size="sm">
              Logs
            </Button>
          </Link>
          <Link to={`/endpoints/${endpoint.endpoint_id}`}>
            <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default EndpointStatusCard;