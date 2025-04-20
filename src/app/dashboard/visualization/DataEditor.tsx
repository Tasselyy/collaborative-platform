"use client";

interface Props {
  customData: string;
  setCustomData: (val: string) => void;
  applyData: () => void;
}

export default function DataEditor({ customData, setCustomData, applyData }: Props) {
  return (
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
      <button
        onClick={applyData}
        className="mt-2 px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
      >
        Apply Data
      </button>
    </div>
  );
}
