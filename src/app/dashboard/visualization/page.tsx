"use client";

import React, { useState, useRef, useEffect } from 'react';
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
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import Papa from 'papaparse'; // For CSV parsing
import CommentSection from "@/components/comment-section";
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

type ChartType = 'bar' | 'line' | 'pie';

// Dataset interface matching Prisma model
interface DatasetRecord {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  ownerId: string;
  visibility: "PRIVATE" | "PUBLIC" | "TEAM";
  teamId?: string;
  createdAt: string;
  visualizations?: Visualization[];
}

// Visualization interface based on the schema
interface Visualization {
  id?: string;
  title: string;
  type: string;
  config: any;
  datasetId: string;
  createdAt?: string;
  description?: string;
  // No visibility field as visualizations inherit permissions from datasets
}

// Structure for 2D data points
interface DataPoint {
  x: string | number;
  y: number;
}

import * as XLSX from 'xlsx';

const parseExcel = async (arrayBuffer: ArrayBuffer): Promise<DataPoint[]> => {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 0 });

    return jsonData
      .map(row => ({
        x: row['x'],
        y: parseFloat(row['y'])
      }))
      .filter(point => point.x !== undefined && !isNaN(point.y));
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw new Error('Failed to parse Excel data');
  }
};

export default function VisualizationPage() {
  const chartRef = useRef<any>(null);
  const router = useRouter();
  const { data: session} = authClient.useSession();
  const currentUserId = session?.user.id || '';


  // Metadata state
  const [title, setTitle] = useState<string>('Data Visualization');
  const [description, setDescription] = useState<string>('');
  
  // Chart settings
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [enableAnimation, setEnableAnimation] = useState<boolean>(true);

  const [titleFontSize, setTitleFontSize] = useState<number>(16);
  const [isEditingData, setIsEditingData] = useState<boolean>(false);
  
  // Dataset selection
  const [availableDatasets, setAvailableDatasets] = useState<DatasetRecord[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  
  // Existing visualizations
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [selectedVisualizationId, setSelectedVisualizationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // File data state
  const [fileData, setFileData] = useState<DataPoint[]>([]);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  
  // Data state
  const [xValues, setXValues] = useState<number[]>([0.0, 1.0, 2.0]);
  const [yValues, setYValues] = useState<number[]>([10, 20, 30]);
  const [customData, setCustomData] = useState<string>(
    JSON.stringify({
      labels: [0, 1, 2],
      datasets: [
        {
          label: 'Dataset',
          data: [10, 20, 30]
        },
      ]
    }, null, 2)
  );

  // Chart data
  const pieColors = ['#f47b89', '#5dade2', '#58d68d', '#f4d03f', '#a569bd', '#45b39d'];
  const data = chartType === 'line'
  ? {
      datasets: [
        {
          label: 'Dataset',
          data: xValues.map((x, i) => ({ x, y: yValues[i] })),
          backgroundColor: '#f47b89',
          borderColor: '#f47b89',
          borderWidth: 2,
          spanGaps: true,
          fill: false,
          tension: 0,
        }
      ]
    }
  : {
      labels: xValues.map(String),
      datasets: [
        {
          label: 'Dataset',
          data: yValues,
          backgroundColor: chartType === 'pie' ? pieColors.slice(0, yValues.length) : '#f47b89',
          borderColor: '#f47b89',
          borderWidth: 0
        }
      ]
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: enableAnimation ? 1000 : 0,
      },
      plugins: {
        legend: {
          display: showLegend,
          position: 'top',
        },
        title: {
          display: true,
          text: title,
          font: {
            size: titleFontSize,
            weight: 'bold',
          },
        },
      },
      scales: chartType === 'pie' ? undefined : {
        x: {
          type: chartType === 'line' ? 'linear' : 'category', 
          title: {
            display: true,
            text: 'X Values',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Y Values',
          },
        },
      },
    };

  // Fetch available datasets on component mount
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetch('/api/visualizations/datasets?ownerId=' + currentUserId);
        
        if (!response.ok) {
          throw new Error('Failed to fetch datasets');
        }
        
        const data = await response.json();
        setAvailableDatasets(data);
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
      }
    };
    
    fetchDatasets();
  }, [currentUserId]);

  // Fetch file data when dataset is selected
  useEffect(() => {
    if (!selectedDatasetId) {
      setFileData([]);
      return;
    }
  
    const fetchFileData = async () => {
      const dataset = availableDatasets.find(ds => ds.id === selectedDatasetId);
      if (!dataset || !dataset.fileName) return;
  
      setIsFileLoading(true);
      setFileError(null);
  
      try {
        const fileExt = dataset.fileName.split('.').pop()?.toLowerCase() || '';
        let parsedData: DataPoint[] = [];
    
        const response = await fetch(`/api/datasets/${dataset.id}/file`);
        if (!response.ok) {
          throw new Error('Failed to fetch file');
        }
  
        if (fileExt === 'csv' || fileExt === 'json') {
          const fileContent = await response.text();
  
          if (fileExt === 'csv') {
            parsedData = parseCSV(fileContent);
          } else if (fileExt === 'json') {
            parsedData = parseJSON(fileContent);
          }
        } else if (['xlsx', 'xls'].includes(fileExt)) {
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          parsedData = await parseExcel(arrayBuffer);
        } else {
          throw new Error(`Unsupported file format: .${fileExt}`);
        }
  
        setFileData(parsedData);
  
        if (!selectedVisualizationId) {
          loadFileDataIntoVisualization(parsedData);
        }
  
      } catch (error) {
        console.error("Error loading file data:", error);
        setFileError(error instanceof Error ? error.message : 'Failed to load file data');
      } finally {
        setIsFileLoading(false);
      }
    };
  
    fetchFileData();
  }, [selectedDatasetId, availableDatasets]);
  
  // Parse CSV file content to DataPoint array
  const parseCSV = (csvContent: string): DataPoint[] => {
    try {
      const result = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true // Convert numeric values
      });

      if (result.errors.length > 0) {
        console.error("CSV parsing errors:", result.errors);
      }

      // Extract data assuming first column is X and second column is Y
      const data: DataPoint[] = [];
      const rows = result.data as Record<string, any>[];
      
      if (rows.length === 0) return [];
      
      // Get column names
      const columns = Object.keys(rows[0]);
      if (columns.length < 2) {
        throw new Error('CSV must have at least two columns');
      }
      
      const xColumn = columns[0];
      const yColumn = columns[1];
      
      // Map rows to DataPoint objects
      rows.forEach(row => {
        const x = row[xColumn];
        const y = parseFloat(row[yColumn]);
        
        if (x !== undefined && !isNaN(y)) {
          data.push({ x, y });
        }
      });
      
      return data;
    } catch (error) {
      console.error("Error parsing CSV:", error);
      throw new Error('Failed to parse CSV data');
    }
  };
  
  // Parse JSON file content to DataPoint array
  const parseJSON = (jsonContent: string): DataPoint[] => {
    try {
      const parsed = JSON.parse(jsonContent);
      
      // Handle array of objects with x, y properties
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Check if objects have x, y properties directly
        if ('x' in parsed[0] && 'y' in parsed[0]) {
          return parsed.map(item => ({
            x: item.x,
            y: parseFloat(item.y)
          })).filter(item => !isNaN(item.y));
        }
        
        // Handle array of objects with arbitrary properties
        const keys = Object.keys(parsed[0]);
        if (keys.length >= 2) {
          const xKey = keys[0];
          const yKey = keys[1];
          
          return parsed.map(item => ({
            x: item[xKey],
            y: parseFloat(item[yKey])
          })).filter(item => !isNaN(item.y));
        }
      }
      
      throw new Error('JSON format not supported. Expected array of objects with at least two properties.');
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error('Failed to parse JSON data');
    }
  };
  
  // Load file data into visualization
  const loadFileDataIntoVisualization = (data: DataPoint[]) => {
    if (!data || data.length === 0) return;
  
    const extractedXValues = data.map(point => point.x);
    const extractedYValues = data.map(point => point.y);
  
    const dataset = availableDatasets.find(ds => ds.id === selectedDatasetId);
    if (dataset) {
      setTitle(`${dataset.name} Visualization`);
    }
  
    setXValues(extractedXValues.map(x => typeof x === 'number' ? x : parseFloat(x.toString()) || 0));
    setYValues(extractedYValues);
  
    setCustomData(JSON.stringify({
      labels: extractedXValues,
      datasets: [
        {
          label: 'Dataset',
          data: extractedYValues
        }
      ]
    }, null, 2));
  };
  
  // Fetch visualizations when dataset is selected
  useEffect(() => {
    if (!selectedDatasetId) {
      setVisualizations([]);
      setSelectedVisualizationId('');
      return;
    }
  
    const fetchVisualizations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/datasets/${selectedDatasetId}/visualizations`);
        if (!response.ok) {
          setVisualizations([]);
          return;
        }
        const data = await response.json();

        setVisualizations(data);
      } catch (error) {
        console.error("Failed to fetch visualizations:", error);
        setVisualizations([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchVisualizations();
  }, [selectedDatasetId]);

  // Load visualization
// Load visualization
const loadVisualization = async (vizId: string) => {
  if (!vizId) return;

  const selectedViz = visualizations.find(viz => viz.id === vizId);
  if (!selectedViz) return;

  setIsLoading(true);

  try {
    // Set metadata
    setTitle(selectedViz.title);
    setDescription(selectedViz.description || '');
    setChartType(selectedViz.type as ChartType);

    // Set chart options from config (not data)
    if (selectedViz.config?.customSettings) {
      const config = selectedViz.config.customSettings;
      setShowLegend(config.showLegend ?? true);
      setEnableAnimation(config.enableAnimation ?? true);
      setTitleFontSize(config.titleFontSize ?? 16);
    }

    // 🔁 Always re-parse dataset from file instead of using saved config.data
    const dataset = availableDatasets.find(ds => ds.id === selectedDatasetId);
    if (!dataset || !dataset.fileName) throw new Error("Dataset not found");

    const fileExt = dataset.fileName.split('.').pop()?.toLowerCase() || '';
    const response = await fetch(`/api/datasets/${dataset.id}/file`);
    if (!response.ok) throw new Error("Failed to fetch dataset file");

    let parsed: DataPoint[] = [];
    if (fileExt === 'csv' || fileExt === 'json') {
      const text = await response.text();
      parsed = fileExt === 'csv' ? parseCSV(text) : parseJSON(text);
    } else if (['xlsx', 'xls'].includes(fileExt)) {
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      parsed = await parseExcel(buffer);
    } else {
      throw new Error(`Unsupported file format: .${fileExt}`);
    }

    // Set chart data
    loadFileDataIntoVisualization(parsed);

    // Exit edit mode if active
    if (isEditingData) {
      setIsEditingData(false);
    }

  } catch (error) {
    console.error("Error loading visualization:", error);
    alert("Failed to load visualization from dataset file.");
  } finally {
    setIsLoading(false);
  }
};
  
  const createNewVisualization = () => {
    setSelectedVisualizationId('');
    setTitle('');
    setDescription('');
    setChartType('bar');
    setShowLegend(true);
    setEnableAnimation(true);
    setTitleFontSize(16);
  
    if (selectedDatasetId) {
      const dataset = availableDatasets.find(ds => ds.id === selectedDatasetId);
      if (dataset) {
        fetch(`/api/datasets/${dataset.id}/file`)
          .then(res => res.blob())
          .then(blob => blob.arrayBuffer())
          .then(async buffer => {
            const fileExt = dataset.fileName.split('.').pop()?.toLowerCase();
            let parsed: DataPoint[] = [];
  
            if (['xlsx', 'xls'].includes(fileExt || '')) {
              parsed = await parseExcel(buffer);
            } else {
              const text = new TextDecoder().decode(buffer);
              if (fileExt === 'csv') parsed = parseCSV(text);
              else if (fileExt === 'json') parsed = parseJSON(text);
            }
  
            loadFileDataIntoVisualization(parsed);
          })
          .catch(err => {
            console.error('Error reloading dataset file:', err);
            alert('Failed to load dataset data');
          });
      }
    }
  
    if (isEditingData) setIsEditingData(false);
  };
  
  
  
  // Handle visualization selection change
  const handleVisualizationChange = (vizId: string) => {
    setSelectedVisualizationId(vizId);
    if (vizId) {
      loadVisualization(vizId);
    } else {
      createNewVisualization();
    }
  };

  // Render the selected chart type
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar ref={chartRef} options={options} data={data} />;
      case 'line':
        return <Line ref={chartRef} options={options} data={data} />;
      case 'pie':
        return <Pie ref={chartRef} options={options} data={data} />;    
      default:
        return <Bar ref={chartRef} options={options} data={data} />;
    }
  };
  
  // Export chart as image
  const exportChart = (format: 'png' | 'jpg') => {
    if (!chartRef.current) return;
  
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const base64Image = chartRef.current.toBase64Image(mimeType, 1.0);
  
    const byteString = atob(base64Image.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([ab], { type: mimeType });
    saveAs(blob, `${title.replace(/\s+/g, '-').toLowerCase()}.${format}`);
  };
  
 
  
  // Toggle data edit mode
  const toggleDataEdit = () => {
    if (isEditingData) {
      try {
        const parsedData = JSON.parse(customData);
        if (parsedData && parsedData.labels && parsedData.datasets) {
          // Update X values
          setXValues(parsedData.labels.map(x => typeof x === 'number' ? x : parseFloat(x.toString()) || 0));
          
          // Update Y values for dataset 1
          if (parsedData.datasets[0] && parsedData.datasets[0].data) {
            setYValues(parsedData.datasets[0].data.map(Number));
          }
        
        }
      } catch (e) {
        alert('Invalid JSON format. Please check your data.');
        return;
      }
    } else {
      setCustomData(JSON.stringify({
        labels: xValues,
        datasets: [
          {
            label: 'Dataset',
            data: yValues
          },
        
        ]
      }, null, 2));
    }
    setIsEditingData(!isEditingData);
  };

  // Save visualization to database
  const saveVisualization = async () => {
    if (!selectedDatasetId) {
      alert("Please select a dataset first");
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(null);
    
    try {
      const visualizationData: Visualization = {
        id: selectedVisualizationId || undefined, // Include ID if updating existing
        title,
        type: chartType,
        config: {
          options,
          data:  data,
          customSettings: {
            showLegend,
            enableAnimation,
            titleFontSize
          }
        },
        datasetId: selectedDatasetId,
        description
      };
      
      // Save visualization to API
      const url = selectedVisualizationId 
        ? `/api/visualizations/${selectedVisualizationId}` 
        : '/api/visualizations';
      const method = selectedVisualizationId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visualizationData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save visualization');
      }
      
      const savedViz = await response.json();
      
      // Update visualizations list
      if (!selectedVisualizationId) {
        // If new visualization, add to list and select it
        setVisualizations([...visualizations, savedViz]);
        setSelectedVisualizationId(savedViz.id);
      } else {
        // Update existing visualization
        setVisualizations(visualizations.map(viz => 
          viz.id === selectedVisualizationId ? savedViz : viz
        ));
      }
      
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving visualization:", error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
      
      // Reset save success notification after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Visualization</h1>
      
      {/* Dataset and Visualization Selection */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Select Dataset & Visualization</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dataset-select" className="block text-sm font-medium text-gray-700 mb-1">
              1. Choose a Dataset:
            </label>
            <select
              id="dataset-select"
              value={selectedDatasetId}
              onChange={(e) => setSelectedDatasetId(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm w-full border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
            >
              <option value="">Select a dataset</option>
              {availableDatasets.map(dataset => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </option>
              ))}
            </select>
            
            {isFileLoading && (
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading dataset file...
              </div>
            )}
            
            {fileError && (
              <div className="mt-2 text-sm text-red-600">
                Error: {fileError}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="visualization-select" className="block text-sm font-medium text-gray-700 mb-1">
              2. Create New or Load Existing:
            </label>
            <div className="flex space-x-2">
              <select
                id="visualization-select"
                value={selectedVisualizationId}
                onChange={(e) => handleVisualizationChange(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm flex-grow border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
                disabled={!selectedDatasetId || isLoading || isFileLoading}
              >
                <option value="">Create New Visualization</option>
                {visualizations.map(viz => (
                  <option key={viz.id} value={viz.id}>
                    {viz.title} ({viz.type})
                  </option>
                ))}
              </select>
            
            </div>
            
            {isLoading && (
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading visualizations...
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Visualization Editor Section */}
      {selectedDatasetId && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Visualization Editor</h2>
          
          {/* Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="chart-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title:
              </label>
              <input
                id="chart-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-3 pr-3 py-1 text-sm w-full border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
              />
            </div>
            <div>
              <label htmlFor="chart-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description:
              </label>
              <input
                id="chart-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pl-3 pr-3 py-1 text-sm w-full border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
                placeholder="Optional description"
              />
            </div>
          </div>
          
          {/* Chart Settings */}
          <div className="flex flex-wrap items-center mb-4 gap-4">
            <div>
              <label htmlFor="chart-type" className="text-sm font-medium text-gray-700 mr-3">
                Chart Type:
              </label>
              <select
                id="chart-type"
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
                className="pl-3 pr-8 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white w-40"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="show-legend"
                type="checkbox"
                checked={showLegend}
                onChange={() => setShowLegend(!showLegend)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="show-legend" className="ml-2 text-sm text-gray-700">
                Show Legend
              </label>
            </div>
            
            <div>
              <label htmlFor="title-font-size" className="text-sm font-medium text-gray-700 mr-3">
                Title Size:
              </label>
              <input
                id="title-font-size"
                type="number"
                min="12"
                max="32"
                value={titleFontSize}
                onChange={(e) => setTitleFontSize(parseInt(e.target.value))}
                className="pl-3 pr-3 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white w-16"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between mb-4">
            <div className="flex space-x-3">
              <button
                onClick={toggleDataEdit}
                className="px-3 py-1 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditingData ? 'Apply Data' : 'Edit Data'}
              </button>
              <button
                onClick={() => exportChart('png')}
                className="px-3 py-1 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Export as PNG
              </button>

              <button
                onClick={() => exportChart('jpg')}
                className="px-3 py-1 text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Export as JPG
              </button>
              
            </div>
            
            <div>
              <button
                onClick={saveVisualization}
                disabled={isSaving || !selectedDatasetId}
                className={`px-4 py-1 text-sm font-medium rounded-md text-white ${
                  isSaving || !selectedDatasetId 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSaving ? 'Saving...' : selectedVisualizationId ? 'Update Visualization' : 'Save New Visualization'}
              </button>
              
              {saveSuccess === true && (
                <span className="ml-2 text-sm text-green-600">
                  {selectedVisualizationId ? 'Updated successfully!' : 'Saved successfully!'}
                </span>
              )}
              
              {saveSuccess === false && (
                <span className="ml-2 text-sm text-red-600">Save failed. Please try again.</span>
              )}
            </div>
          </div>
          
          {/* Chart or Data Editor */}
          {isEditingData ? (
            <div className="mb-4">
              <label htmlFor="custom-data" className="block text-sm font-medium text-gray-700 mb-2">
                Edit Chart Data (JSON):
              </label>
              <textarea
                id="custom-data"
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                className="w-full h-64 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : (
            <div style={{ height: '500px', maxWidth: '900px', margin: '0 auto' }}>
              {renderChart()}
            </div>
          )}
        </div>
      )}
      
      {/* Dataset Information */}
      {selectedDatasetId && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Dataset Information</h2>
          {availableDatasets.filter(ds => ds.id === selectedDatasetId).map(dataset => (
            <div key={dataset.id} className="text-sm">
              <p><span className="font-medium">Name:</span> {dataset.name}</p>
              <p><span className="font-medium">Description:</span> {dataset.description}</p>
              <p><span className="font-medium">File Name:</span> {dataset.fileName}</p>
              <p><span className="font-medium">Owner ID:</span> {dataset.ownerId}</p>
              <p><span className="font-medium">Created:</span> {new Date(dataset.createdAt).toLocaleDateString()}</p>
              <p>
                <span className="font-medium">Visibility:</span> {' '}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" 
                      style={{ 
                        backgroundColor: dataset.visibility === 'PUBLIC' 
                          ? '#dcfce7' 
                          : dataset.visibility === 'TEAM' 
                            ? '#dbeafe' 
                            : '#fee2e2',
                        color: dataset.visibility === 'PUBLIC' 
                          ? '#166534' 
                          : dataset.visibility === 'TEAM' 
                            ? '#1e40af' 
                            : '#991b1b'
                      }}>
                  {dataset.visibility.toLowerCase()}
                </span>
              </p>
              {dataset.teamId && (
                <p><span className="font-medium">Team ID:</span> {dataset.teamId}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedVisualizationId && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <CommentSection
            visualizationId={selectedVisualizationId}
            currentUserId={currentUserId}
          />
        </div>
      )}
    </div>
    
  );