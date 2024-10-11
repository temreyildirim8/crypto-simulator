
import React from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TradingChart = ({ data, options }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  
  return <Line data={data} options={options} />;
};

export default TradingChart;