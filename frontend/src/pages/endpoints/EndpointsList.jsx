// @ts-nocheck
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, X } from 'lucide-react';
import endpointService from '../../services/endpointService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EndpointStatusCard from '../../components/dashboard/EndpointStatusCard';
import EmptyState from '../../components/common/EmptyState';

const EndpointsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch endpoints with pagination
  const { data: endpointsResponse, isLoading, error, refetch } = useQuery(
    ['endpoints', currentPage, itemsPerPage, searchQuery, selectedTags],
    () => endpointService.getEndpoints(currentPage, itemsPerPage, searchQuery, selectedTags),
    { 
      staleTime: 60000,
      retry: 1,
      onError: (error) => {
        console.error('Error fetching endpoints:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      },
      onSuccess: (data) => {
        console.log('Endpoints response:', data);
      }
    }
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setCurrentPage(1);
    }
  };

  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Extract all unique tags from endpoints
  const allTags = React.useMemo(() => {
    const endpoints = endpointsResponse || [];
    const tagsSet = new Set();
    endpoints.forEach((endpoint) => {
      if (endpoint.tags) {
        endpoint.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }, [endpointsResponse]);

  // Calculate pagination
  const totalPages = Math.ceil((endpointsResponse?.length || 0) / itemsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading endpoints</p>
          <Button variant="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Ensure we have valid data
  const endpoints = endpointsResponse || [];
  const hasEndpoints = endpoints.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Endpoints</h1>
        <Link to="/endpoints/new">
          <Button variant="primary" icon={Plus}>
            Add Endpoint
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="bg-dark-700">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-dark-400 rounded-md bg-dark-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {allTags.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">Filter by Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    disabled={selectedTags.includes(tag)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(searchQuery || selectedTags.length > 0) && (
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <div key={tag} className="bg-primary-900 text-primary-200 rounded-full px-3 py-1 text-xs flex items-center">
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1.5 text-primary-300 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Endpoints List */}
      <div className="space-y-4">
        {!hasEndpoints ? (
          <EmptyState
            icon={Search}
            title="No endpoints found"
            description={
              searchQuery || selectedTags.length > 0
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by adding your first endpoint to monitor."
            }
            actionText={
              searchQuery || selectedTags.length > 0
                ? "Clear filters"
                : "Add Endpoint"
            }
            onAction={
              searchQuery || selectedTags.length > 0
                ? clearFilters
                : () => window.location.href = '/endpoints/new'
            }
          />
        ) : (
          <>
            {endpoints.map((endpoint) => (
              <EndpointStatusCard key={endpoint.endpoint_id} endpoint={endpoint} />
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between bg-dark-700 border border-dark-500 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="bg-dark-600 border border-dark-400 text-white rounded-md text-sm px-2 py-1"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-400">per page</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-dark-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-dark-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EndpointsList;