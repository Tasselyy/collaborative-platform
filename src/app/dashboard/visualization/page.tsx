// src/app/dashboard/visualization/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import ChartRenderer from "./ChartRenderer";
import ExportButtons from "./ExportButtons";
import MetadataForm from "./MetadataForm";
import DataEditor from "./DataEditor";
import DatasetSelector from "./DatasetSelector";
import VisualizationSelector from "./VisualizationSelector";
import CommentSection from "@/components/comment-section";
import { authClient } from "@/lib/auth-client";
import { parseCSV, parseJSON, parseExcel, transformChartData, DatasetSeries } from "./utils";

export default function VisualizationPage() {
  const chartRef = useRef<any>(null);
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user.id || "";

  const [title, setTitle] = useState("Data Visualization");
  const [description, setDescription] = useState("");
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'radar' | 'bubble'>('bar');
  const [showLegend, setShowLegend] = useState(true);
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [titleFontSize, setTitleFontSize] = useState(16);

  const [datasets, setDatasets] = useState<DatasetSeries[]>([]);
  const [availableDatasets, setAvailableDatasets] = useState<any[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");
  const [visualizations, setVisualizations] = useState<any[]>([]);
  const [selectedVisualizationId, setSelectedVisualizationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [customData, setCustomData] = useState<string>("");
  const [isEditingData, setIsEditingData] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetch(`/api/visualizations/datasets?ownerId=${currentUserId}`);
        const data = await response.json();
        setAvailableDatasets(data);
      } catch (err) {
        console.error("Dataset fetch error", err);
      }
    };
    if (currentUserId) fetchDatasets();
  }, [currentUserId]);

  useEffect(() => {
    if (!selectedDatasetId) return;

    const fetchVisualizations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/dataset/${selectedDatasetId}/visualizations`);
        const data = await res.json();
        setVisualizations(data);
      } catch (e) {
        console.error("Error loading visualizations", e);
        setVisualizations([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFileFromDataset = async () => {
      const dataset = availableDatasets.find(ds => ds.id === selectedDatasetId);
      if (!dataset || !dataset.fileName) return;

      try {
        setIsFileLoading(true);
        setFileError(null);
        const fileExt = dataset.fileName.split('.').pop()?.toLowerCase() || '';
        const res = await fetch(`/api/dataset/${dataset.id}/file`);
        
        if (!res.ok) throw new Error("Failed to fetch dataset file");

        let parsed: DatasetSeries[] = [];
        if (fileExt === 'csv') {
          const text = await res.text();
          parsed = parseCSV(text);
        } else if (fileExt === 'json') {
          const text = await res.text();
          parsed = parseJSON(text);
        } else if (["xlsx", "xls"].includes(fileExt)) {
          const blob = await res.blob();
          const buffer = await blob.arrayBuffer();
          parsed = await parseExcel(buffer);
        } else {
          throw new Error(`Unsupported file format: .${fileExt}`);
        }
        console.log(parsed)
        setDatasets(parsed);
        setCustomData(JSON.stringify(parsed, null, 2));
      } catch (err: any) {
        setFileError(err.message || "Failed to load file data");
        setDatasets([]);
        setCustomData("");
      } finally {
        setIsFileLoading(false);
      }
    };

    fetchVisualizations();
    fetchFileFromDataset();
  }, [selectedDatasetId]);

  const handleVisualizationChange = async (vizId: string) => {
    setSelectedVisualizationId(vizId);
    const viz = visualizations.find(v => v.id === vizId);
    if (!viz) return;
    setTitle(viz.title);
    setDescription(viz.description || "");
    setChartType(viz.type);

    if (viz.config?.customSettings) {
      const config = viz.config.customSettings;
      setShowLegend(config.showLegend ?? true);
      setEnableAnimation(config.enableAnimation ?? true);
      setTitleFontSize(config.titleFontSize ?? 16);
    }
  };

  const data = transformChartData(chartType, datasets);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: enableAnimation ? 1000 : 0 },
    plugins: {
      legend: { display: showLegend },
      title: { display: true, text: title, font: { size: titleFontSize } },
    },
    ...(chartType !== 'pie' && {
      scales: {
        x: { title: { display: true, text: 'X' } },
        y: { beginAtZero: true, title: { display: true, text: 'Y' } },
      },
    }),
  };

  const applyCustomData = () => {
    try {
      const parsed = JSON.parse(customData);
      if (!Array.isArray(parsed)) throw new Error("Custom data must be an array");
      setDatasets(parsed);
    } catch (e: any) {
      alert("Invalid custom data: " + e.message);
    }
  };

  const saveVisualization = async () => {
    if (!selectedDatasetId) {
      alert("Please select a dataset first");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const visualization = {
        id: selectedVisualizationId || undefined,
        title,
        type: chartType,
        datasetId: selectedDatasetId,
        description,
        config: {
          data,
          options,
          customSettings: {
            showLegend,
            enableAnimation,
            titleFontSize
          }
        }
      };

      const url = selectedVisualizationId
        ? `/api/visualizations/${selectedVisualizationId}`
        : `/api/visualizations`;
      const method = selectedVisualizationId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visualization)
      });

      if (!res.ok) throw new Error("Failed to save visualization");

      const savedViz = await res.json();

      if (!selectedVisualizationId) {
        setVisualizations([...visualizations, savedViz]);
        setSelectedVisualizationId(savedViz.id);
      } else {
        setVisualizations(visualizations.map(v => v.id === savedViz.id ? savedViz : v));
      }

      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving visualization:", error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visualization</h1>
      <DatasetSelector
        datasets={availableDatasets}
        selectedId={selectedDatasetId}
        onSelect={setSelectedDatasetId}
      />
      <VisualizationSelector
        visualizations={visualizations}
        selectedVisualizationId={selectedVisualizationId}
        setSelectedVisualizationId={setSelectedVisualizationId}
        handleVisualizationChange={handleVisualizationChange}
        isLoading={isLoading}
        isFileLoading={isFileLoading}
        selectedDatasetId={selectedDatasetId}
      />
      <MetadataForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        chartType={chartType}
        setChartType={setChartType}
        showLegend={showLegend}
        setShowLegend={setShowLegend}
        titleFontSize={titleFontSize}
        setTitleFontSize={setTitleFontSize}
        enableAnimation={enableAnimation}
        setEnableAnimation={setEnableAnimation}
      />
      {fileError && <div className="text-red-600 mb-4">{fileError}</div>}
      {isEditingData ? (
        <DataEditor customData={customData} setCustomData={setCustomData} applyData={applyCustomData} />
      ) : (
        <div style={{ height: 500 }}>
          <ChartRenderer chartType={chartType} chartRef={chartRef} options={options} data={data} />
        </div>
      )}
      <div className="flex gap-2 my-4">
        <button
          onClick={() => setIsEditingData(!isEditingData)}
          className="px-4 py-1 text-sm bg-indigo-600 text-white rounded"
        >
          {isEditingData ? 'Apply Data' : 'Edit Data'}
        </button>
        <ExportButtons chartRef={chartRef} title={title} />
        <button
          onClick={saveVisualization}
          disabled={isSaving}
          className={`px-4 py-1 text-sm font-medium rounded text-white ${
            isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSaving ? "Saving..." : selectedVisualizationId ? "Update Visualization" : "Save Visualization"}
        </button>
        {saveSuccess === true && <span className="text-green-600 text-sm ml-2">Saved!</span>}
        {saveSuccess === false && <span className="text-red-600 text-sm ml-2">Save failed.</span>}
      </div>
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
}
