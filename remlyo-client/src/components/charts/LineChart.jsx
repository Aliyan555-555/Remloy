// src/components/charts/LineChart.jsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



/**
 * LineChart component for visualizing time series data 
 * @param {Object} props
 * @param {Array} props.data - Data array for the chart
 * @param {Array} props.lines - Array of line definitions with key, color, name
 * @param {string} props.xAxisKey - Key for x-axis values
 * @param {boolean} props.showGrid - Whether to show grid lines
 * @param {boolean} props.showLegend - Whether to show the legend
 * @param {string} props.title - Chart title
 * @param {string} props.xAxisLabel - X-axis label
 * @param {string} props.yAxisLabel - Y-axis label
 * @param {Object} props.margin - Chart margins
 * @param {string} props.className - Additional CSS classes
 */
export const CustomLineChart = ({
  data = [],
  lines = [],
  xAxisKey = 'name',
  showGrid = true,
  showLegend = true,
  title,
  xAxisLabel,
  yAxisLabel,
  margin = { top: 10, right: 30, left: 0, bottom: 0 },
  className = '',
}) => {
  // If no data or lines, render a placeholder
  if (!data.length || !lines.length) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={margin}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            
            <XAxis 
              dataKey={xAxisKey} 
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : null}
            />
            
            <YAxis 
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : null}
            />
            
            <Tooltip />
            
            {showLegend && <Legend />}
            
            {lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.key}
                stroke={line.color || '#8884d8'}
                name={line.name || line.key}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// src/components/charts/BarChart.jsx
import { BarChart, Bar, ReferenceLine } from 'recharts';

/**
 * BarChart component for comparing data across categories
 * @param {Object} props
 * @param {Array} props.data - Data array for the chart
 * @param {Array} props.bars - Array of bar definitions with key, color, name
 * @param {string} props.xAxisKey - Key for x-axis values
 * @param {boolean} props.showGrid - Whether to show grid lines
 * @param {boolean} props.showLegend - Whether to show the legend
 * @param {string} props.title - Chart title
 * @param {string} props.xAxisLabel - X-axis label
 * @param {string} props.yAxisLabel - Y-axis label
 * @param {boolean} props.stacked - Whether bars should be stacked
 * @param {Object} props.margin - Chart margins
 * @param {string} props.className - Additional CSS classes
 */
export const CustomBarChart = ({
  data = [],
  bars = [],
  xAxisKey = 'name',
  showGrid = true,
  showLegend = true,
  title,
  xAxisLabel,
  yAxisLabel,
  stacked = false,
  margin = { top: 10, right: 30, left: 0, bottom: 0 },
  className = '',
}) => {
  // If no data or bars, render a placeholder
  if (!data.length || !bars.length) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={margin}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            
            <XAxis 
              dataKey={xAxisKey} 
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : null}
            />
            
            <YAxis 
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : null}
            />
            
            <Tooltip />
            
            {showLegend && <Legend />}
            
            <ReferenceLine y={0} stroke="#000" />
            
            {bars.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.key}
                fill={bar.color || '#8884d8'}
                name={bar.name || bar.key}
                stackId={stacked ? "stack" : index}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// src/components/charts/PieChart.jsx
import { PieChart, Pie, Cell, Sector } from 'recharts';

// Function to render active shape for pie chart
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 14}
        outerRadius={outerRadius + 16}
        fill={fill}
      />
      <text x={cx} y={cy + 25} textAnchor="middle" fill="#999">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

/**
 * PieChart component for showing proportions
 * @param {Object} props
 * @param {Array} props.data - Data array for the chart
 * @param {string} props.nameKey - Key for segment names
 * @param {string} props.dataKey - Key for segment values
 * @param {Array} props.colors - Array of colors for segments
 * @param {boolean} props.donut - Whether to render as a donut chart
 * @param {boolean} props.showLegend - Whether to show the legend
 * @param {string} props.title - Chart title
 * @param {number} props.innerRadius - Inner radius for donut chart
 * @param {number} props.outerRadius - Outer radius
 * @param {string} props.className - Additional CSS classes
 */
export const CustomPieChart = ({
  data = [],
  nameKey = 'name',
  dataKey = 'value',
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'],
  donut = false,
  showLegend = true,
  title,
  innerRadius = 60,
  outerRadius = 80,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // If no data, render a placeholder
  if (!data.length) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={donut ? innerRadius : 0}
              outerRadius={outerRadius}
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showLegend && <Legend />}
            <Tooltip formatter={(value) => [value, 'Value']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Export all the chart components
export { CustomLineChart as LineChart, CustomBarChart as BarChart, CustomPieChart as PieChart };