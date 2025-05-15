// @ts-nocheck
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowLeft, Save, Trash, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import endpointService from '../../services/endpointService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FormInput from '../../components/common/FormInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

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
        methods.reset({
          url: data.url,
          is_active: data.is_active,
        });
      },
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
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(`Failed to create endpoint: ${errorMessage}`);
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
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(`Failed to update endpoint: ${errorMessage}`);
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
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(`Failed to delete endpoint: ${errorMessage}`);
      },
    }
  );
  
  const onSubmit = (data) => {
    if (isNewEndpoint) {
      createMutation.mutate({
        url: data.url,
        is_active: data.is_active
      });
    } else {
      const updateData = {
        endpoint_id: id,
        url: data.url,
        is_active: data.is_active
      };
      updateMutation.mutate(updateData);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this endpoint? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
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
            <StatusBadge 
              status={endpoint.is_active ? 'online' : 'offline'}
              text={endpoint.is_active ? 'Being Monitored' : 'Not Monitored'}
              className="ml-3" 
            />
          )}
        </div>
        
        <div className="flex space-x-2">
          {!isNewEndpoint && !isEditing && (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button 
                variant="danger" 
                icon={Trash}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
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
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (isNewEndpoint) {
                        navigate('/endpoints');
                      } else {
                        setIsEditing(false);
                        methods.reset();
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    isLoading={createMutation.isLoading || updateMutation.isLoading}
                  >
                    {isNewEndpoint ? 'Create' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">URL</label>
                  <div className="mt-1 flex items-center">
                    <a 
                      href={endpoint?.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-primary-400 hover:text-primary-300 flex items-center"
                    >
                      {endpoint?.url}
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400">Status</label>
                  <div className="mt-1">
                    <StatusBadge 
                      status={endpoint?.is_active ? 'online' : 'offline'}
                      text={endpoint?.is_active ? 'Being Monitored' : 'Not Monitored'}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </form>
      </FormProvider>
    </div>
  );
};

export default EndpointDetail;