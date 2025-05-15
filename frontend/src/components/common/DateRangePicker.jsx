import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, X, Settings } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from './Button';

const DateRangePicker = ({ startDate, endDate, onChange, onClose }) => {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const handleStartDateChange = (date) => {
    onChange({ startDate: date, endDate });
  };

  const handleEndDateChange = (date) => {
    onChange({ startDate, endDate: date });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Select Date Range</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Settings}
            onClick={() => {/* Add settings handler */}}
            children={null}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
            children={null}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Start Date
          </label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              maxDate={endDate}
              dateFormat="yyyy-MM-dd"
              className="block w-full rounded-md border-dark-600 bg-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              open={isStartDateOpen}
              onClickOutside={() => setIsStartDateOpen(false)}
              customInput={
                <div className="relative">
                  <input
                    type="text"
                    value={format(startDate, 'yyyy-MM-dd')}
                    readOnly
                    className="block w-full rounded-md border-dark-600 bg-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                  />
                  <Calendar 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" 
                    onClick={() => setIsStartDateOpen(!isStartDateOpen)}
                  />
                </div>
              }
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            End Date
          </label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              minDate={startDate}
              maxDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="block w-full rounded-md border-dark-600 bg-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              open={isEndDateOpen}
              onClickOutside={() => setIsEndDateOpen(false)}
              customInput={
                <div className="relative">
                  <input
                    type="text"
                    value={format(endDate, 'yyyy-MM-dd')}
                    readOnly
                    className="block w-full rounded-md border-dark-600 bg-dark-700 text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                  />
                  <Calendar 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" 
                    onClick={() => setIsEndDateOpen(!isEndDateOpen)}
                  />
                </div>
              }
            />
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