'use client'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { getSignedFileUrl } from "@/lib/s3"

export default function UploadPage() {
    const [file, setFile] = useState<File>()
    const [message, setMessage] = useState('');

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) return

        try {
            const data = new FormData()
            data.set('file', file)

            setMessage('Uploading...');
            //upload to public
            // const res = await fetch('/api/upload', {
            //     method: 'POST',
            //     body: data
            // })
            //upload to cloud
            const res = await fetch('/api/cloud-upload', {
                method: 'POST',
                body: data
            })

            if (res.ok) {
                const result = await res.json();
                setMessage(`✅ File uploaded successfully! url: ${result.url}`);

            } else {
                setMessage('❌ Upload failed.');
            }

            // handle the error
            if (!res.ok) throw new Error(await res.text())
        } catch (e: any) {
            // Handle errors here
            console.error(e)
        }
    }
    return (
        <form onSubmit={onSubmit}>
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
                        <FileIcon className="w-12 h-12" />
                        <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
                        <span className="text-xs text-gray-500">PDF, image, video, or audio</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <Label htmlFor="file" className="text-sm font-medium">
                            File
                        </Label>
                        {/* only accpet CSV, JSON, Excel */}
                        <Input id="file" type="file" placeholder="File"
                            accept=".csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                            onChange={(e) => setFile(e.target.files?.[0])}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" type="submit">Upload</Button>
                    {message && <p className="mt-2 text-sm text-blue-600">{message}</p>}
                </CardFooter>
            </Card>
        </form>
    )
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
    )
}