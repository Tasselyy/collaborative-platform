import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface DataPoint {
  x: string | number;
  y: number;
  r?: number;
  group?: string;
}

export interface DatasetSeries {
  label: string;
  data: DataPoint[];
}

const colorPalette = [
  "#f47b89", "#6ec6ff", "#81c784", "#ffb74d", "#ba68c8", "#4db6ac", "#ffd54f"
];

const groupBy = (rows: DataPoint[]): DatasetSeries[] => {
  const grouped: Record<string, DataPoint[]> = {};

  rows.forEach(p => {
    const group = p.group || 'default';
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(p);
  });

  return Object.entries(grouped).map(([label, data]) => ({ label, data }));
};

export const parseCSV = (csvContent: string): DatasetSeries[] => {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });

  const rows = result.data as Record<string, any>[];
  if (rows.length === 0) return [];

  const points: DataPoint[] = rows.map(row => {
    if (row.x === undefined) return null;

    return {
      x: row.x,
      y: row.y !== undefined && !isNaN(row.y) ? parseFloat(row.y) : 0,
      r: row.r !== undefined && !isNaN(row.r) ? parseFloat(row.r) : undefined,
      group: row.group
    };
  }).filter((p): p is DataPoint => !!p);

  return groupBy(points);
};

export const parseJSON = (jsonContent: string): DatasetSeries[] => {
  const parsed = JSON.parse(jsonContent);
  if (!Array.isArray(parsed)) throw new Error('Expected array');

  const points: DataPoint[] = parsed.map(item => {
    if (item.x === undefined) return null;

    return {
      x: item.x,
      y: item.y !== undefined && !isNaN(item.y) ? parseFloat(item.y) : 0,
      r: item.r !== undefined && !isNaN(item.r) ? parseFloat(item.r) : undefined,
      group: item.group
    };
  }).filter((item): item is DataPoint => !!item);

  return groupBy(points);
};

export const parseExcel = async (arrayBuffer: ArrayBuffer): Promise<DatasetSeries[]> => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  const points: DataPoint[] = (jsonData as any[]).map(row => {
    if (row['x'] === undefined) return null;
    return {
      x: row['x'],
      y: row['y'] !== undefined && !isNaN(row['y']) ? parseFloat(row['y']) : 0,
      r: row['r'] !== undefined && !isNaN(row['r']) ? parseFloat(row['r']) : undefined,
      group: row['group']
    };
  }).filter((item): item is DataPoint => !!item);
  return groupBy(points);
};

export function transformChartData(
  chartType: 'bar' | 'line' | 'pie' | 'radar' | 'bubble',
  datasets: DatasetSeries[]
) {
  if (chartType === "pie") {
    const flatData = datasets[0]?.data || [];
  
    return {
      labels: flatData.map((p, i) => p.group ?? `Item ${i + 1}`),
      datasets: [
        {
          data: flatData.map(p => typeof p.x === 'number' ? p.x : parseFloat(p.x as string) || 0),
          backgroundColor: flatData.map((_, i) => colorPalette[i % colorPalette.length]),
        },
      ]
    };
  }

  if (chartType === "bubble") {
    return {
      datasets: datasets.map((series, i) => ({
        label: series.label,
        backgroundColor: colorPalette[i % colorPalette.length],
        data: series.data.map(p => ({
          x: p.x,
          y: p.y,
          r: p.r ?? 10,
        })),
      }))
    };
  }

  // bar / line / radar fallback
  const groupedData: { [key: string]: DataPoint[] } = {};

  datasets.forEach(series => {
    series.data.forEach(point => {
      const group = point.group || series.label || "default";
      if (!groupedData[group]) groupedData[group] = [];
      groupedData[group].push(point);
    });
  });

  const allXValues = Array.from(
    new Set(
      Object.values(groupedData)
        .flat()
        .map(p => p.x.toString())
    )
  );

  return {
    labels: allXValues,
    datasets: Object.entries(groupedData).map(([group, points], i) => ({
      label: group,
      data: allXValues.map(x => {
        const found = points.find(p => p.x.toString() === x);
        return found ? found.y : 0;
      }),
      backgroundColor: colorPalette[i % colorPalette.length],
      borderColor: colorPalette[i % colorPalette.length],
      borderWidth: 1,
    })),
  };
}
