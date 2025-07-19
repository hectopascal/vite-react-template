import React from 'react';

/**
 * ProgressChart component for visualizing performance metrics over time
 * @param {Array} data - Array of numerical data points
 * @param {Array} labels - Array of labels for each data point
 * @param {string} metric - Name of the metric being displayed
 * @param {string} color - Color theme for the chart (green, blue, purple, orange)
 * @param {boolean} showAverage - Whether to display the average line
 */
function ProgressChart({ data, labels, metric, color = 'green', showAverage = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Calculate chart dimensions
  const chartHeight = 200;
  const barWidth = 40;
  const barGap = 20;
  const chartWidth = data.length * (barWidth + barGap);
  
  // Calculate max and min values for scaling
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  // Calculate average if needed
  const average = showAverage ? data.reduce((sum, val) => sum + val, 0) / data.length : null;

  // Map color prop to tailwind classes
  const colorClasses = {
    green: {
      bar: 'fill-green-500',
      text: 'text-green-600',
      light: 'fill-green-200'
    },
    blue: {
      bar: 'fill-blue-500',
      text: 'text-blue-600',
      light: 'fill-blue-200'
    },
    purple: {
      bar: 'fill-purple-500',
      text: 'text-purple-600',
      light: 'fill-purple-200'
    },
    orange: {
      bar: 'fill-orange-500',
      text: 'text-orange-600',
      light: 'fill-orange-200'
    },
  };
  
  const colorClass = colorClasses[color] || colorClasses.green;

  // Helper function to calculate bar height
  const getBarHeight = (value) => {
    // Keep a small bar even for minimum value
    const minBarHeight = 20;
    return minBarHeight + ((value - minValue) / range) * (chartHeight - minBarHeight);
  };

  // Calculate average position
  const averageY = average ? chartHeight - getBarHeight(average) : null;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">{metric}</h3>
        {showAverage && (
          <div className="flex items-center">
            <div className={`w-3 h-3 ${colorClass.text} mr-1`}>
              <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="5" width="12" height="2" className="fill-current" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Average: {average?.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <svg 
          width={chartWidth} 
          height={chartHeight + 40} 
          className="min-w-full"
        >
          {/* Y-axis labels */}
          <text x="0" y="10" className="text-xs fill-gray-400">
            {maxValue}
          </text>
          <text x="0" y={chartHeight} className="text-xs fill-gray-400">
            {minValue}
          </text>

          {/* Chart bars */}
          {data.map((value, index) => {
            const barHeight = getBarHeight(value);
            const x = index * (barWidth + barGap) + barGap;
            const y = chartHeight - barHeight;

            return (
              <g key={index}>
                {/* Background bar */}
                <rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={chartHeight}
                  className="fill-gray-50"
                  rx={4}
                />
                {/* Value bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  className={colorClass.bar}
                  rx={4}
                />
                {/* Data point value */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-700"
                >
                  {value}
                </text>
                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {labels[index]}
                </text>
              </g>
            );
          })}

          {/* Average line */}
          {showAverage && averageY !== null && (
            <>
              <line
                x1={0}
                y1={averageY}
                x2={chartWidth}
                y2={averageY}
                strokeWidth={2}
                strokeDasharray="5,5"
                className={`stroke-current ${colorClass.text}`}
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

export default ProgressChart;