import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';

const EndpointStatusCard = ({ endpoint }) => {
  const formatUrl = (url) => {
    return url.length > 40 ? url.substring(0, 40) + '...' : url;
  };

  return (
    <Card className="bg-dark-700 hover:border-dark-400 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium text-white">{endpoint.name || formatUrl(endpoint.url)}</h3>
            <StatusBadge status={endpoint.is_active ? 'online' : 'offline'}
             text={endpoint.is_active ? 'Being Monitored' : 'Not Monitored'} 
             className="ml-3" />
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