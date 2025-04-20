"use client";

import { saveAs } from 'file-saver';

interface ExportButtonsProps {
  chartRef: React.RefObject<any>;
  title: string;
}

export default function ExportButtons({ chartRef, title }: ExportButtonsProps) {
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

  return (
    <div className="flex space-x-3">
      <button onClick={() => exportChart('png')} className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Export PNG</button>
      <button onClick={() => exportChart('jpg')} className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm">Export JPG</button>
    </div>
  );
}