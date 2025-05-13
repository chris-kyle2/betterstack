import React from 'react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export const ChartContainer = ({
  data,
  type = 'line',
  metric = 'average_response_time',
  title = 'Response Time',
  color = 'rgb(14, 165, 233)',
}) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const labels = sortedData.map(item => 
    format(new Date(item.date), 'MMM dd')
  );
  
  const values = sortedData.map(item => item[metric] || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: type === 'area' 
          ? `rgba(${parseInt(color.split('(')[1].split(',')[0])}, ${parseInt(color.split(',')[1])}, ${parseInt(color.split(',')[2].split(')')[0])}, 0.2)` 
          : color,
        tension: 0.3,
        fill: type === 'area',
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: metric !== 'uptime_percentage',
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: 'rgba(209, 213, 219, 0.8)',
          font: {
            size: 11,
          },
          callback: function(value) {
            if (metric === 'uptime_percentage') return value + '%';
            if (metric === 'average_response_time') return value + 'ms';
            return value;
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(209, 213, 219, 0.8)',
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(156, 163, 175)',
        borderColor: 'rgba(55, 65, 81, 1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let value = context.raw;
            if (metric === 'uptime_percentage') return `Uptime: ${value}%`;
            if (metric === 'average_response_time') return `Avg. Response: ${value}ms`;
            if (metric === 'checks_count') return `Checks: ${value}`;
            return `${title}: ${value}`;
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
      }
    },
  };

  if (type === 'bar') {
    return <Bar data={chartData} options={options} />;
  }

  return <Line data={chartData} options={options} />;
};

export default ChartContainer;