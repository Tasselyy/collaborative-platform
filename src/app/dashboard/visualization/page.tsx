'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import CommentSection from '@/components/comment-section';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    DoughnutController,
    PieController,
} from 'chart.js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { saveAs } from 'file-saver';
import { authClient } from '@/lib/auth-client';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    DoughnutController,
    PieController,
    ChartDataLabels
);

interface Dataset {
    id: string;
    name: string;
    fileUrl: string;
    fileName: string;
    description: string;
    createdAt: string;
    visibility: 'PUBLIC' | 'TEAM' | 'PRIVATE';
    teamId?: string;
}

interface Visualization {
    id: string;
    title: string;
    type: string;
    config: any;
    datasetId: string;
}

export default function VisualizationPage() {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(
        null
    );
    const [visualizations, setVisualizations] = useState<Visualization[]>([]);
    const [selectedVisualization, setSelectedVisualization] =
        useState<Visualization | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | null>(
        null
    );
    const [visualizationTitle, setVisualizationTitle] = useState('');
    const [datasetColors, setDatasetColors] = useState<
        { backgroundColor: string; borderColor: string }[]
    >([]);
    const [displayNumbers, setDisplayNumbers] = useState(true);
    const chartRef = useRef<any>(null);
    const { data: session } = authClient.useSession();
    const currentUserId = session?.user.id || '';
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const res = await fetch(`/api/dataset`);
                const result = await res.json();
                setDatasets(result);
            } catch (err) {
                console.error('Failed to fetch datasets:', err);
            }
        };
        fetchDatasets();
    }, []);

    useEffect(() => {
        const loadDataset = async () => {
            if (!selectedDataset) return;

            try {
                const urlRes = await fetch(
                    `/api/cloud-get?filename=${encodeURIComponent(
                        selectedDataset.fileName
                    )}`
                );
                const { url: signedUrl } = await urlRes.json();
                const dataRes = await fetch(signedUrl);
                const text = await dataRes.text();

                let parsed: any[] = [];
                if (selectedDataset.fileName.endsWith('.csv')) {
                    const [headerLine, ...lines] = text.trim().split('\n');
                    const headers = headerLine.split(',');
                    parsed = lines.map((line) => {
                        const values = line.split(',');
                        return headers.reduce((acc, header, i) => {
                            acc[header] = values[i];
                            return acc;
                        }, {} as Record<string, string>);
                    });
                } else if (selectedDataset.fileName.endsWith('.json')) {
                    parsed = JSON.parse(text);
                }

                setData(parsed);
            } catch (err) {
                console.error('Failed to load dataset:', err);
            }
        };
        loadDataset();
    }, [selectedDataset]);

    useEffect(() => {
        const fetchVisualizations = async () => {
            if (!selectedDataset) {
                setVisualizations([]);
                setSelectedVisualization(null);
                setChartType(null);
                return;
            }
            try {
                const res = await fetch(
                    `/api/visualizations?datasetId=${encodeURIComponent(
                        selectedDataset.id
                    )}`
                );
                const result = await res.json();
                setVisualizations(result);
            } catch (err) {
                console.error('Failed to fetch visualizations:', err);
                setVisualizations([]);
            }
            setSelectedVisualization(null);
            setChartType(null);
        };
        fetchVisualizations();
    }, [selectedDataset]);

    const renderChart = () => {
        if (!chartType || data.length === 0) return null;

        const keys = Object.keys(data[0]);
        const labelField =
            keys.find((k) => k.toLowerCase().includes('date')) || keys[0];

        const numericKeys = keys.filter(
            (k) => k !== labelField && typeof data[0][k] === 'number'
        );

        const plugins = {
            legend: {
                position: 'right',
                align: 'center',
            },
            title: {
                display: true,
                text: visualizationTitle || 'New Visualization',
                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
            ...(displayNumbers && {
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    offset: 5,
                    color: 'black',
                    font: {
                        size: 14,
                    },
                    formatter: (value: any, context: any) => {
                        if (chartType === 'pie') {
                            const dataset =
                                context.chart.data.datasets[
                                    context.datasetIndex
                                ];
                            const total = dataset.data.reduce(
                                (acc: number, curr: any) => acc + curr,
                                0
                            );
                            const percentage = ((value / total) * 100).toFixed(
                                2
                            );
                            return `${value} (${percentage}%)`;
                        }
                        return value;
                    },
                },
            }),
            ...(!displayNumbers && { datalabels: { display: false } }),
        };

        const options = {
            responsive: true,
            plugins: plugins,
        };

        const labelData = data.map((d) => d[labelField]);
        const chartDatasets = numericKeys.map((k, idx) => ({
            label: k,
            data: data.map((d) => d[k]),
            backgroundColor:
                datasetColors[idx]?.backgroundColor || 'rgba(75,192,192,0.4)',
            borderWidth: chartType === 'line' ? 2 : 0,
            type: chartType,
        }));

        const chartData = {
            labels: labelData,
            datasets: chartDatasets,
        };

        return (
            <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
                {chartType === 'bar' ? (
                    <Bar data={chartData} options={options} />
                ) : chartType === 'line' ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <Pie
                        data={{
                            labels: numericKeys,
                            datasets: [
                                {
                                    data: numericKeys.map((k) =>
                                        data.reduce(
                                            (sum, d) =>
                                                sum + parseFloat(d[k] || 0),
                                            0
                                        )
                                    ),
                                    backgroundColor: numericKeys.map(
                                        (_, index) => {
                                            return (
                                                datasetColors[index]
                                                    ?.backgroundColor ||
                                                '#4bc0c0'
                                            );
                                        }
                                    ),
                                    borderWidth: 0,
                                },
                            ],
                        }}
                        options={options}
                    />
                )}
            </div>
        );
    };

    useEffect(() => {
        if (selectedVisualization) {
            if (selectedVisualization.id === 'new') {
                setChartType(null);
                setVisualizationTitle('');
                setDatasetColors([]);
                setDisplayNumbers(true);
            } else if (selectedVisualization.config) {
                const { data, options } = selectedVisualization.config;

                if (data && data.datasets && data.datasets.length > 0) {
                    if (data.datasets[0].type === 'bar') {
                        setChartType('bar');
                    } else if (data.datasets[0].type === 'line') {
                        setChartType('line');
                    } else if (
                        data.datasets[0].type === 'pie' ||
                        data.datasets[0].type === 'doughnut'
                    ) {
                        setChartType('pie');
                    } else {
                        setChartType(null);
                    }
                } else {
                    setChartType(null);
                }
                setVisualizationTitle(options?.plugins?.title?.text || '');
                setDatasetColors(
                    selectedVisualization.config.datasetColors || []
                );
                setDisplayNumbers(
                    selectedVisualization.config.displayNumbers !== undefined
                        ? selectedVisualization.config.displayNumbers
                        : true
                );
            } else {
                setChartType(null);
                setVisualizationTitle('');
                setDatasetColors([]);
                setDisplayNumbers(true);
            }
        } else {
            setChartType(null);
            setVisualizationTitle('');
            setDatasetColors([]);
            setDisplayNumbers(true);
        }
    }, [selectedVisualization]);

    const saveVisualization = async () => {
        if (!chartType || !selectedDataset) return;

        const keys = Object.keys(data[0]);
        const labelField =
            keys.find((k) => k.toLowerCase().includes('date')) || keys[0];
        const labelData = data.map((d) => d[labelField]);

        const chartDatasets = keys
            .filter((k) => k !== labelField && typeof data[0][k] === 'number')
            .map((k, idx) => ({
                label: k,
                data: data.map((d) => d[k]),
                backgroundColor:
                    datasetColors[idx]?.backgroundColor ||
                    'rgba(75,192,192,0.4)',
                borderWidth: chartType === 'line' ? 2 : 0,
                type: chartType,
            }));

        const config = {
            data: {
                labels: labelData,
                datasets: chartDatasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', align: 'center' },
                    title: {
                        display: true,
                        text: visualizationTitle || 'New Visualization',
                        padding: { top: 10, bottom: 30 },
                    },
                    ...(displayNumbers && {
                        datalabels: {
                            display: true,
                            anchor: 'end',
                            align: 'top',
                            offset: 5,
                            color: 'black',
                            font: { size: 14 },
                            formatter: (value: any, context: any) => {
                                if (chartType === 'pie') {
                                    const dataset =
                                        context.chart.data.datasets[
                                            context.datasetIndex
                                        ];
                                    const total = dataset.data.reduce(
                                        (acc: number, curr: any) => acc + curr,
                                        0
                                    );
                                    const percentage = (
                                        (value / total) *
                                        100
                                    ).toFixed(2);
                                    return `${value} (${percentage}%)`;
                                }
                                return value;
                            },
                        },
                    }),
                    ...(!displayNumbers && { datalabels: { display: false } }),
                },
            },
            datasetColors: datasetColors,
            displayNumbers: displayNumbers,
        };

        try {
            const res = await fetch('/api/visualizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: visualizationTitle || 'New Visualization',
                    type: chartType,
                    config: config,
                    datasetId: selectedDataset.id,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to save visualization');
            }

            const newVisualization = await res.json();
            setVisualizations([...visualizations, newVisualization]);
            setSelectedVisualization(newVisualization);
        } catch (err) {
            console.error('Error saving visualization:', err);
        }
    };

    const exportChart = (format: 'png' | 'jpg') => {
        if (!chartRef.current) return;

        const canvas = chartRef.current.querySelector('canvas');
        if (!canvas) {
            console.error('Canvas element not found.');
            return;
        }

        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const image = canvas.toDataURL(mimeType, 1.0);

        const byteString = atob(image.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeType });
        saveAs(
            blob,
            `${visualizationTitle.replace(/\s+/g, '-').toLowerCase()}.${format}`
        );
    };

    return (
        <div className="container mx-auto p-8 space-y-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Visualization</h1>
            <div className="flex flex-wrap gap-4">
                <Card className="w-full md:w-[320px]">
                    <CardHeader>
                        <CardTitle>1. Select Dataset</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={selectedDataset?.id || ''}
                            onValueChange={(value) => {
                                const selected = datasets.find(
                                    (ds) => ds.id === value
                                );
                                setSelectedDataset(selected || null);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a dataset" />
                            </SelectTrigger>
                            <SelectContent>
                                {datasets.map((dataset) => (
                                    <SelectItem
                                        key={dataset.id}
                                        value={dataset.id}
                                    >
                                        {dataset.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {selectedDataset && (
                    <Card className="w-full md:w-[320px]">
                        <CardHeader>
                            <CardTitle>
                                2. Load or Create Visualization
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={selectedVisualization?.id || ''}
                                onValueChange={(value) => {
                                    const vis = visualizations.find(
                                        (v) => v.id === value
                                    );
                                    if (value === 'new') {
                                        setSelectedVisualization({
                                            id: 'new',
                                            title: 'New Visualization',
                                            type: chartType,
                                            config: {
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                },
                                                options: {},
                                            },
                                            datasetId: selectedDataset.id,
                                        });
                                    } else {
                                        setSelectedVisualization(vis || null);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a visualization or create new" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visualizations.map((vis) => (
                                        <SelectItem key={vis.id} value={vis.id}>
                                            {vis.title}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="new">
                                        + Create New Visualization
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                )}
            </div>
            {selectedVisualization && (
                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="font-semibold">Visualization Editor</h2>
                        {selectedVisualization?.id === 'new' && (
                            <>
                                <Select
                                    value={chartType || ''}
                                    onValueChange={(value) =>
                                        setChartType(
                                            value as 'bar' | 'line' | 'pie'
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full  md:w-[320px] mb-4">
                                        <SelectValue placeholder="Select Chart Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bar">
                                            Bar Chart
                                        </SelectItem>
                                        <SelectItem value="line">
                                            Line Chart
                                        </SelectItem>
                                        <SelectItem value="pie">
                                            Pie Chart
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {chartType && data.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        <div className="flex items-center mr-4">
                                            <Label
                                                htmlFor="displayNumbers"
                                                className="mr-2 text-sm"
                                            >
                                                Display Numbers:
                                            </Label>
                                            <Checkbox
                                                id="displayNumbers"
                                                checked={displayNumbers}
                                                onCheckedChange={(checked) =>
                                                    setDisplayNumbers(!!checked)
                                                }
                                            />
                                        </div>
                                        {Object.keys(data[0])
                                            .filter(
                                                (k) =>
                                                    k !==
                                                        Object.keys(
                                                            data[0]
                                                        ).find((k) =>
                                                            k
                                                                .toLowerCase()
                                                                .includes(
                                                                    'date'
                                                                )
                                                        ) &&
                                                    typeof data[0][k] ===
                                                        'number'
                                            )
                                            .map((key, index) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center"
                                                >
                                                    <label className="mr-1 text-sm">
                                                        {key}:
                                                    </label>
                                                    <Input
                                                        type="color"
                                                        value={
                                                            datasetColors[index]
                                                                ?.backgroundColor ||
                                                            '#4bc0c0'
                                                        }
                                                        onChange={(e) => {
                                                            const newColors = [
                                                                ...datasetColors,
                                                            ];
                                                            newColors[index] = {
                                                                ...newColors[
                                                                    index
                                                                ],
                                                                backgroundColor:
                                                                    e.target
                                                                        .value,
                                                            };
                                                            setDatasetColors(
                                                                newColors
                                                            );
                                                        }}
                                                        className="w-16 h-8 p-0"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex flex-col gap-2 mt-2">
                            {selectedVisualization?.id === 'new' &&
                                chartType && (
                                    <>
                                        <Input
                                            type="text"
                                            placeholder="Visualization Title"
                                            value={visualizationTitle}
                                            onChange={(e) =>
                                                setVisualizationTitle(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full md:w-[300px]"
                                        />
                                        <Button
                                            onClick={saveVisualization}
                                            className="w-full md:w-[200px]"
                                        >
                                            Save Visualization
                                        </Button>
                                    </>
                                )}
                            {chartType && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => exportChart('png')}
                                    >
                                        Export as PNG
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => exportChart('jpg')}
                                    >
                                        Export as JPG
                                    </Button>
                                </div>
                            )}
                        </div>

                        {chartType ? (
                            data.length > 0 ? (
                                <div className="w-full h-[300px] mt-6">
                                    {renderChart()}
                                </div>
                            ) : (
                                <p className="text-gray-500">No data loaded</p>
                            )
                        ) : (
                            <p className="text-gray-500">
                                Please select a visualization type
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
            <div className="flex flex-col md:flex-row gap-4">
                {selectedDataset && (
                    <Card className="w-full md:w-1/2">
                        <CardContent>
                            <h2 className="font-semibold mb-2">
                                Dataset Information
                            </h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Visibility</TableHead>
                                        <TableHead>Team ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {datasets
                                        .filter(
                                            (ds) => ds.id === selectedDataset.id
                                        )
                                        .map((dataset) => (
                                            <TableRow key={dataset.id}>
                                                <TableCell>
                                                    {dataset.name}
                                                </TableCell>
                                                <TableCell>
                                                    {dataset.description}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        dataset.createdAt
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                            dataset.visibility ===
                                                            'PUBLIC'
                                                                ? 'bg-green-100 text-green-800'
                                                                : dataset.visibility ===
                                                                  'TEAM'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {dataset.visibility.toLowerCase()}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {dataset.teamId || 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                <div className="w-full md:w-1/2">
                    {selectedVisualization &&
                        selectedVisualization.id !== 'new' && (
                            <CommentSection
                                visualizationId={selectedVisualization.id}
                                currentUserId={currentUserId}
                            />
                        )}
                </div>
            </div>
        </div>
    );
}
