"use client";

interface Visualization {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie';
}

interface Props {
  visualizations: Visualization[];
  selectedVisualizationId: string;
  setSelectedVisualizationId: (id: string) => void;
  handleVisualizationChange: (id: string) => void;
  isLoading: boolean;
  isFileLoading: boolean;
  selectedDatasetId: string;
}

export default function VisualizationSelector({
  visualizations,
  selectedVisualizationId,
  setSelectedVisualizationId,
  handleVisualizationChange,
  isLoading,
  isFileLoading,
  selectedDatasetId
}: Props) {
  return (
    <div className="mb-6">
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

      {(isLoading || isFileLoading) && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading visualizations...
        </div>
      )}
    </div>
  );
}