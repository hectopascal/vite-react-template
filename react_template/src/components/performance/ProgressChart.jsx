import React from 'react';
import { useEffect, useRef } from 'react';

/**
 * A simple chart component for visualizing performance data over time
 * @param {Object} props
 * @param {Array} props.data - Array of data points to visualize
 * @param {Array} props.labels - Array of labels for the X axis
 * @param {String} props.metric - The metric being displayed
 * @param {String} props.color - The color theme for the chart
 * @param {Boolean} props.showAverage - Whether to display the average line
 */
function ProgressChart({ 
  data = [], 
  labels = [], 
  metric = 'Performance', 
  color = 'green',
  showAverage = true 
}) {
  const canvasRef = useRef(null);
  
  // Color mapping based on the color prop
  const colorMap = {
    green: {
      fill: 'rgba(34, 197, 94, 0.2)',
      stroke: 'rgb(34, 197, 94)',
      point: 'rgb(22, 163, 74)',
      average: 'rgba(220, 38, 38, 0.8)'
    },
    blue: {
      fill: 'rgba(59, 130, 246, 0.2)',
      stroke: 'rgb(59, 130, 246)',
      point: 'rgb(37, 99, 235)',
      average: 'rgba(220, 38, 38, 0.8)'
    },
    purple: {
      fill: 'rgba(139, 92, 246, 0.2)',
      stroke: 'rgb(139, 92, 246)',
      point: 'rgb(109, 40, 217)',
      average: 'rgba(220, 38, 38, 0.8)'
    }
  };
  
  const colors = colorMap[color] || colorMap.green;
  
  // Draw the chart when data changes
  useEffect(() => {
    if (!canvasRef.current || data.length === 0 || labels.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set canvas dimensions
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Chart dimensions
    const chartWidth = rect.width - 60; // Leave space for y-axis
    const chartHeight = rect.height - 40; // Leave space for x-axis
    const chartLeft = 50;
    const chartTop = 20;
    
    // Find min and max values
    const maxValue = Math.max(...data, 100); // Ensure we at least show up to 100
    const minValue = Math.min(...data, 0);
    const valueRange = maxValue - minValue;
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb'; // Light gray
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.moveTo(chartLeft, chartTop);
    ctx.lineTo(chartLeft, chartTop + chartHeight);
    
    // X-axis
    ctx.moveTo(chartLeft, chartTop + chartHeight);
    ctx.lineTo(chartLeft + chartWidth, chartTop + chartHeight);
    ctx.stroke();
    
    // Draw horizontal grid lines and y-axis labels
    const stepCount = 5;
    ctx.textAlign = 'right';
    ctx.font = '10px Arial';
    ctx.fillStyle = '#6b7280'; // Gray text
    
    for (let i = 0; i <= stepCount; i++) {
      const y = chartTop + (chartHeight / stepCount) * (stepCount - i);
      const value = minValue + (valueRange / stepCount) * i;
      
      // Grid line
      ctx.beginPath();
      ctx.strokeStyle = '#f3f4f6'; // Very light gray
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartLeft + chartWidth, y);
      ctx.stroke();
      
      // Y-axis label
      ctx.fillText(Math.round(value), chartLeft - 5, y + 3);
    }
    
    // Draw x-axis labels
    ctx.textAlign = 'center';
    const xStep = chartWidth / (labels.length - 1 || 1);
    
    labels.forEach((label, i) => {
      const x = chartLeft + i * xStep;
      ctx.fillText(label, x, chartTop + chartHeight + 15);
    });
    
    // Calculate average if needed
    let average = 0;
    if (showAverage && data.length > 0) {
      average = data.reduce((a, b) => a + b, 0) / data.length;
    }
    
    // Draw data points and connecting lines
    if (data.length > 1) {
      // Fill area under the line
      ctx.beginPath();
      ctx.moveTo(chartLeft, chartTop + chartHeight);
      
      data.forEach((value, i) => {
        const x = chartLeft + i * xStep;
        const y = chartTop + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        ctx.lineTo(x, y);
      });
      
      ctx.lineTo(chartLeft + chartWidth, chartTop + chartHeight);
      ctx.closePath();
      ctx.fillStyle = colors.fill;
      ctx.fill();
      
      // Draw line connecting data points
      ctx.beginPath();
      data.forEach((value, i) => {
        const x = chartLeft + i * xStep;
        const y = chartTop + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw data points
    data.forEach((value, i) => {
      const x = chartLeft + i * xStep;
      const y = chartTop + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors.point;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Draw average line if requested
    if (showAverage && data.length > 0) {
      const averageY = chartTop + chartHeight - ((average - minValue) / valueRange) * chartHeight;
      
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = colors.average;
      ctx.lineWidth = 1;
      ctx.moveTo(chartLeft, averageY);
      ctx.lineTo(chartLeft + chartWidth, averageY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label for average
      ctx.textAlign = 'left';
      ctx.fillStyle = colors.average;
      ctx.fillText(`Avg: ${Math.round(average)}`, chartLeft + chartWidth + 5, averageY);
    }
    
    // Draw chart title
    ctx.textAlign = 'center';
    ctx.font = '12px Arial';
    ctx.fillStyle = '#111827';
    ctx.fillText(`${metric} Progress`, chartLeft + chartWidth / 2, 12);
    
  }, [data, labels, metric, color, showAverage, colors]);
  
  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-64"
        style={{
          display: 'block',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}

export default ProgressChart;