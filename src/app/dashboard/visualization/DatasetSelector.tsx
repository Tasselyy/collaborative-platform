"use client";

import React from "react";

interface DatasetRecord {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  ownerId: string;
  createdAt: string;
  visibility: string;
  teamId?: string;
}

interface DatasetSelectorProps {
  datasets: DatasetRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function DatasetSelector({
  datasets,
  selectedId,
  onSelect,
}: DatasetSelectorProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="dataset-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        1. Choose a Dataset:
      </label>
      <select
        id="dataset-select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="pl-3 pr-8 py-2 text-sm w-full border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white"
      >
        <option value="">Select a dataset</option>
        {datasets?.map((dataset) => (
          <option key={dataset.id} value={dataset.id}>
            {dataset.name}
          </option>
        ))}
      </select>
    </div>
  );
}
