'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


export default function DashboardPage() {
    const router = useRouter();

    return (
        <div className="container p-8">
            <h1 className="text-3xl font-bold mb-6">
                Welcome to Your Data Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Upload Your Dataset</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col">
                        <p>
                            Start by uploading your data file. We support CSV
                            and JSON formats.
                        </p>
                        <Button
                            onClick={() => router.push('/dashboard/upload')}
                            className="w-full whitespace-normal px-4 py-2" // Added whitespace-normal and adjusted padding
                        >
                            Upload Dataset
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2. View Your Datasets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col">
                        <p>
                            Once uploaded, your dataset will be available in the
                            Datasets table.
                        </p>
                        <Button
                            onClick={() => router.push('/dashboard/dataTable')}
                            className="w-full whitespace-normal px-4 py-2" // Added whitespace-normal and adjusted padding
                        >
                            View Datasets
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>3. Create Visualizations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col">
                        <p>
                            Visualize your data by creating charts and graphs.
                            Select a dataset and create a visualization.
                        </p>
                        <Button
                            onClick={() =>
                                router.push('/dashboard/visualization')
                            }
                            className="w-full whitespace-normal px-4 py-2" // Added whitespace-normal and adjusted padding
                        >
                            Create Visualization
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                    Additional Information
                </h2>
                <p>
                    This dashboard allows you to manage and visualize your data
                    effectively. Follow the steps above to get started.
                </p>
            </div>
        </div>
    );
}
