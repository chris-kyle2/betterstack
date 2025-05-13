import React from 'react';
import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import Button from './Button';

const DateRangePicker = ({ startDate, endDate, onChange, onClose }) => {
  const handleStartDateChange = (e) => {
    const newDate = new Date(e.target.value);
    onChange({ startDate: newDate, endDate });
  };

  const handleEndDateChange = (e) => {
    const newDate = new Date(e.target.value);
    onChange({ startDate, endDate: newDate });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Select Date Range</h3>
        <Button
          variant="ghost"
          size="sm"
          icon={X}
          onClick={onClose}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={handleStartDateChange}
              max={format(endDate, 'yyyy-MM-dd')}
              className="block w-full rounded-md border-dark-600 bg-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={handleEndDateChange}
              min={format(startDate, 'yyyy-MM-dd')}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="block w-full rounded-md border-dark-600 bg-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onClose}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker; 