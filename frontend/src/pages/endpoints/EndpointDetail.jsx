import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowLeft, Save, Trash, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import endpointService from '../../services/endpointService';
import logService from '../../services/logService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FormInput from '../../components/common/FormInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { ChartContainer } from '../../components/dashboard/ChartContainer';

const EndpointDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNewEndpoint = id === 'new';
  const [isEditing, setIsEditing] = useState(isNewEndpoint);
  
  const methods = useForm({
    defaultValues: {
      url: '',
      is_active: true,
    },
  });
  
  // Fetch endpoint data if not a new endpoint
  const { 
    data: endpoint, 
    isLoading: isLoadingEndpoint 
  } = useQuery(
    ['endpoint', id],
    () => endpointService.getEndpoint(id),
    { 
      enabled: !isNewEndpoint,
      onSuccess: (data) => {
        // Set form values when data is loaded
        methods.reset({
          url: data.url,
          is_active: data.is_active,
        });
      },
    }
  );
  
  // Fetch statistics for this endpoint (7 days)
  const { 
    data: statistics, 
    isLoading: isLoadingStats 
  } = useQuery(
    ['endpoint-stats', id, 7],
    () => logService.getEndpointStatistics(id, 7),
    { 
      enabled: !isNewEndpoint,
      staleTime: 300000,
    }
  );
  
  // Create endpoint mutation
  const createMutation = useMutation(
    (data) => endpointService.createEndpoint(data),
    {
      onSuccess: () => {
        toast.success('Endpoint created successfully');
        navigate('/endpoints');
      },
      onError: (error) => {
        toast.error(`Failed to create endpoint: ${error.message}`);
      },
    }
  );
  
  // Update endpoint mutation
  const updateMutation = useMutation(
    (data) => endpointService.updateEndpoint(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['endpoint', id]);
        setIsEditing(false);
        toast.success('Endpoint updated successfully');
      },
      onError: (error) => {
        toast.error(`Failed to update endpoint: ${error.message}`);
      },
    }
  );
  
  // Delete endpoint mutation
  const deleteMutation = useMutation(
    () => endpointService.deleteEndpoint(id),
    {
      onSuccess: () => {
        toast.success('Endpoint deleted successfully');
        navigate('/endpoints');
      },
      onError: (error) => {
        toast.error(`Failed to delete endpoint: ${error.message}`);
      },
    }
  );
  
  const onSubmit = (data) => {
    if (isNewEndpoint) {
      createMutation.mutate(data);
    } else {
      const updateData = {
        endpoint_id: id,
        url: data.url,
        is_active: data.is_active
      };
      console.log('Submitting update with data:', updateData);
      updateMutation.mutate(updateData);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this endpoint? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };
  
  // Determine status based on recent logs
  const determineStatus = () => {
    if (isLoadingStats || !statistics) return 'unknown';
    if (!endpoint.is_active) return 'unknown';
    
    if (statistics.uptime_percentage === 100) return 'online';
    if (statistics.uptime_percentage === 0) return 'offline';
    return 'warning';
  };
  
  if (isLoadingEndpoint && !isNewEndpoint) {
    return (
      <div className="flex h-80 items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Link to="/endpoints">
            <Button variant="ghost" size="sm" icon={ArrowLeft} className="mr-3">
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {isNewEndpoint ? 'New Endpoint' : 'Endpoint Details'}
          </h1>
          {!isNewEndpoint && !isEditing && (
            <StatusBadge status={determineStatus()} className="ml-3" />
          )}
        </div>
        
        <div className="flex space-x-2">
          {!isNewEndpoint && !isEditing && (
            <Button 
              variant="secondary" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Endpoint Details */}
          <Card 
            title={isEditing ? (isNewEndpoint ? 'Add Endpoint' : 'Edit Endpoint') : 'Endpoint Details'}
            className="bg-dark-700 mb-6"
          >
            {isEditing ? (
              // Edit Mode
              <div className="space-y-4">
                <FormInput
                  label="URL"
                  name="url"
                  required
                  placeholder="https://example.com"
                  helperText="The URL to monitor (including http:// or https://)"
                />
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...methods.register('is_active')}
                    className="h-4 w-4 rounded border-dark-400 bg-dark-600 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-300">
                    Active
                  </label>
                </div>
                
                <div className="flex justify-between pt-4">
                  {!isNewEndpoint && (
                    <Button 
                      type="button" 
                      variant="danger" 
                      icon={Trash}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  )}
                  <div className="flex space-x-3">
                    {!isNewEndpoint && (
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      variant="primary" 
                      icon={Save}
                      isLoading={createMutation.isLoading || updateMutation.isLoading}
                    >
                      {isNewEndpoint ? 'Create Endpoint' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">URL</h3>
                  <a 
                    href={endpoint?.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-primary-400 hover:text-primary-300 flex items-center"
                  >
                    {endpoint?.url}
                    <ExternalLink size={16} className="ml-1" />
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-600 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                    <p className="text-white flex items-center">
                      <StatusBadge status={determineStatus()} />
                      {!endpoint?.is_active && (
                        <span className="ml-2 text-gray-400">(Monitoring paused)</span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
                    <p className="text-white">
                      {endpoint?.created_at && format(new Date(endpoint.created_at), 'PPP')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </form>
      </FormProvider>
      
      {!isNewEndpoint && !isEditing && (
        <>
          {/* Performance Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card title="Response Time (Last 7 Days)" className="bg-dark-700">
              {isLoadingStats ? (
                <div className="h-64 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="h-64">
                  <ChartContainer 
                    data={statistics?.daily_stats || []} 
                    type="area"
                    metric="average_response_time"
                    title="Response Time"
                    color="rgb(14, 165, 233)"
                  />
                </div>
              )}
            </Card>
            
            <Card title="Uptime Percentage (Last 7 Days)" className="bg-dark-700">
              {isLoadingStats ? (
                <div className="h-64 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="h-64">
                  <ChartContainer 
                    data={statistics?.daily_stats || []} 
                    type="area"
                    metric="uptime_percentage"
                    title="Uptime"
                    color="rgb(34, 197, 94)"
                  />
                </div>
              )}
            </Card>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-dark-700">
              <div className="flex items-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-900 text-primary-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Avg Response Time</p>
                  <p className="text-xl font-semibold text-white">
                    {isLoadingStats 
                      ? "..." 
                      : `${statistics?.average_response_time?.toFixed(0) || 0} ms`}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-dark-700">
              <div className="flex items-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-success-900 text-success-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Fastest Response</p>
                  <p className="text-xl font-semibold text-white">
                    {isLoadingStats 
                      ? "..." 
                      : `${statistics?.fastest_response_time?.toFixed(0) || 0} ms`}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-dark-700">
              <div className="flex items-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-warning-900 text-warning-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Slowest Response</p>
                  <p className="text-xl font-semibold text-white">
                    {isLoadingStats 
                      ? "..." 
                      : `${statistics?.slowest_response_time?.toFixed(0) || 0} ms`}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-dark-700">
              <div className="flex items-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-error-900 text-error-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Error Rate</p>
                  <p className="text-xl font-semibold text-white">
                    {isLoadingStats 
                      ? "..." 
                      : `${(100 - (statistics?.uptime_percentage || 0)).toFixed(2)}%`}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between">
            <Link to={`/logs/${id}`}>
              <Button variant="secondary">
                View Logs
              </Button>
            </Link>
            
            <Button 
              variant="danger" 
              icon={Trash}
              onClick={handleDelete}
            >
              Delete Endpoint
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EndpointDetail;