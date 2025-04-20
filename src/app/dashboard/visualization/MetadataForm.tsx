"use client";

interface Props {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  chartType: 'bar' | 'line' | 'pie' | 'radar' | 'bubble';
  setChartType: (value: 'bar' | 'line' | 'pie' | 'radar' | 'bubble') => void;
  showLegend: boolean;
  setShowLegend: (value: boolean) => void;
  titleFontSize: number;
  setTitleFontSize: (value: number) => void;
  enableAnimation: boolean;
  setEnableAnimation: (value: boolean) => void;
}

export default function MetadataForm({
  title,
  setTitle,
  description,
  setDescription,
  chartType,
  setChartType,
  showLegend,
  setShowLegend,
  titleFontSize,
  setTitleFontSize,
  enableAnimation,
  setEnableAnimation
}: Props) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Chart Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded p-2 text-sm" />
        </div>
        <div>
          <label className="text-sm">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded p-2 text-sm" />
        </div>
      </div>
      <div className="flex gap-4 items-center mt-4 flex-wrap">
        <div>
          <label className="text-sm">Chart Type</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="radar">Radar</option>
            <option value="bubble">Bubble</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={showLegend} onChange={() => setShowLegend(!showLegend)} />
          <span className="text-sm">Show Legend</span>
        </div>
        <div>
          <label className="text-sm">Title Font Size</label>
          <input type="number" value={titleFontSize} onChange={(e) => setTitleFontSize(Number(e.target.value))} className="w-16 border rounded px-2 py-1 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={enableAnimation} onChange={() => setEnableAnimation(!enableAnimation)} />
          <span className="text-sm">Enable Animation</span>
        </div>
      </div>
    </div>
  );
}
