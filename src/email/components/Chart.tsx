import React from 'react';
import { Section, Text } from '@react-email/components';

interface ChartProps {
  type: 'pie' | 'bar';
  data: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  title: string;
  width?: number;
  height?: number;
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  width = 500,
  height = 300
}) => {
  const renderPieChart = () => {
    const total = data.values.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    const radius = Math.min(width, height) / 2 - 40;
    const centerX = (width / 2) - 100;
    const centerY = height / 2;
    const legendWidth = 250;

    return (
      <svg width={width} height={height}>
        <rect x="0" y="0" width={width} height={height} fill="#ffffff" />
        
        {data.values.map((value, index) => {
          const percentage = value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = ((startAngle + angle) * Math.PI) / 180;
          const startX = centerX + radius * Math.cos(startRad);
          const startY = centerY + radius * Math.sin(startRad);
          const endX = centerX + radius * Math.cos(endRad);
          const endY = centerY + radius * Math.sin(endRad);
          const largeArcFlag = angle > 180 ? 1 : 0;

          const midAngle = (startAngle + angle / 2) * Math.PI / 180;
          const labelRadius = radius * 0.7;
          const labelX = centerX + labelRadius * Math.cos(midAngle);
          const labelY = centerY + labelRadius * Math.sin(midAngle);

          return (
            <g key={index}>
              <path
                d={`M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={data.colors[index]}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
              >
                {Math.round(percentage * 100)}%
              </text>
            </g>
          );
        })}

        <g transform={`translate(${width - legendWidth}, 10)`}>
          {data.labels.map((label, index) => {
            const truncatedLabel = label.length > 35 
              ? label.substring(0, 35) + '...'
              : label;
            
            return (
              <g key={index} transform={`translate(0, ${index * 22})`}>
                <rect
                  x="0"
                  y="0"
                  width="15"
                  height="15"
                  fill={data.colors[index]}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <text
                  x="25"
                  y="8"
                  fontSize="11"
                  fill="#666666"
                  dominantBaseline="middle"
                >
                  {truncatedLabel}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...data.values);
    const barWidth = width / (data.values.length * 2);
    const barHeight = height - 60;

    return (
      <svg width={width} height={height}>
        <rect x="0" y="0" width={width} height={height} fill="#ffffff" />

        {data.values.map((value, index) => {
          const barHeightRatio = value / maxValue;
          const x = (index * width) / data.values.length + barWidth / 2;
          const y = height - (barHeight * barHeightRatio) - 40;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight * barHeightRatio}
                fill={data.colors[index]}
              />
              <text
                x={x + barWidth / 2}
                y={y - 10}
                textAnchor="middle"
                fontSize="14"
                fill="#666666"
                fontWeight="bold"
              >
                {value} min
              </text>
              <text
                x={x + barWidth / 2}
                y={height - 20}
                textAnchor="middle"
                fontSize="14"
                fill="#666666"
              >
                {data.labels[index]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <Section className="my-6">
      <Text className="text-[#0E1F45] text-[16px] font-semibold mb-4">
        {title}
      </Text>
      {type === 'pie' ? renderPieChart() : renderBarChart()}
    </Section>
  );
};

export default Chart; 