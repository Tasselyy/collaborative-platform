'use client'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTeam } from '@/context/TeamContext';
export default function UploadPage() {
    const [file, setFile] = useState<File>()
    const [message, setMessage] = useState('');
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [visibility, setVisibility] = useState('')
    const { data: session, } = authClient.useSession()
    const { activeTeam } = useTeam();
    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file || !session) return
        try {
            const data = new FormData()
            const ownerId = session?.user.id
            const fileName = file.name
            //add userId as prefix
            const newFileName = `${session.user.id}_${file.name}`;
            const renamedFile = new File([file], newFileName, { type: file.type });
            data.set('file', renamedFile)

            setMessage('Uploading...');
            const uploadRes = await fetch('/api/cloud-upload', {
                method: 'POST',
                body: data
            })

            // handle the upload error
            if (!uploadRes.ok) {
                setMessage('Upload failed.');
                throw new Error(await uploadRes.text())
            }

            const { url: fileUrl } = await uploadRes.json()
            setMessage(`File uploaded successfully!`);
            // setMessage(`✅ File uploaded successfully! url: ${result.url}`);

            const metadataRes = await fetch('/api/dataset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    ownerId,
                    visibility,
                    fileName,
                    fileUrl,
                    teamId: visibility === "TEAM" ? activeTeam?.id : undefined,
                })
            })

            if (!metadataRes.ok) throw new Error(await metadataRes.text())

            setMessage(`Dataset saved!`)
        }
        catch (e: any) {
            // Handle errors here
            console.error(e)
        }
    }

    return (
        <form onSubmit={handleUpload}>
            <Card>
                <CardContent className="p-6 space-y-4">
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
                        <FileIcon className="w-12 h-12" />
                        <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
                        <span className="text-xs text-gray-500">CSV, JSON or Excel</span>
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
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Visibility</Label>
                        <Select onValueChange={setVisibility}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PUBLIC">Public</SelectItem>
                                <SelectItem value="PRIVATE">Private</SelectItem>
                                <SelectItem value="TEAM">Team only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {visibility === "TEAM" && activeTeam && (
                        <div className="space-y-2">
                            <Label>Selected Team</Label>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">{activeTeam.name}</span>
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button size="lg" type="submit" disabled={
                        !file || !name || !visibility || (visibility === "TEAM" && !activeTeam)
                    }>
                        Upload
                    </Button>
                    {/* Show field warning only if disabled */}
                    {(!file || !name || !visibility || (visibility === "TEAM" && !activeTeam)) && (
                        <p className="text-sm text-muted-foreground ml-1">
                            {!file || !name || !visibility
                                ? "Please fill out all required fields to upload."
                                : visibility === "TEAM" && !activeTeam
                                    ? "You must create or select a team to use Team visibility."
                                    : ""}
                        </p>
                    )}

                    {/* Upload status message */}
                    {message && (
                        <p className="text-sm text-blue-600 ml-1">
                            {message}
                        </p>
                    )}
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