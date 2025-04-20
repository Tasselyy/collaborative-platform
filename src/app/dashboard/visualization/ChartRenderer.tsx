"use client";

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
  ArcElement,
  RadialLinearScale,
  BubbleController,
} from "chart.js";

import {
  Bar,
  Line,
  Pie,
  Radar,
  Bubble
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  BubbleController
);

interface Props {
  chartType: 'bar' | 'line' | 'pie' | 'radar' | 'bubble';
  data: any;
  options: any;
  chartRef: React.RefObject<any>;
}

export default function ChartRenderer({ chartType, data, options, chartRef }: Props) {
  console.log(data)
  switch (chartType) {
    case 'bar':
      return <Bar ref={chartRef} options={options} data={data} />;
    case 'line':
      return <Line ref={chartRef} options={options} data={data} />;
    case 'pie':
      return <Pie ref={chartRef} options={options} data={data} />;
    case 'radar':
      return <Radar ref={chartRef} options={options} data={data} />;
    case 'bubble':
      return <Bubble ref={chartRef} options={options} data={data} />;
    default:
      return <Bar ref={chartRef} options={options} data={data} />;
  }
}
