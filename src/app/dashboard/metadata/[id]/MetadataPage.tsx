"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { DatasetRecord } from "@/components/data-table";

export default function MetadataPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user?.name ?? "";
  
  const [dataset, setDataset] = useState<DatasetRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<DatasetRecord>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Check if current user is the owner of the dataset
  const isOwner = dataset?.owner === currentUser;
  
  useEffect(() => {
    // Fetch dataset details
    if (params.id) {
      setIsLoading(true);
      fetch(`/api/dataset/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setDataset(data);
          setFormData(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching dataset:", err);
          setIsLoading(false);
        });
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!dataset?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/dataset/${dataset.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setDataset(updatedData);
        setIsEditing(false);
      } else {
        console.error("Failed to update dataset");
      }
    } catch (error) {
      console.error("Error updating dataset:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 ml-8">Loading dataset metadata...</div>;
  }

  if (!dataset) {
    return <div className="text-center text-red-500 ml-8">Dataset not found</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-baseline space-x-2">
      
        <h1 className="text-2xl font-bold">Dataset Metadata</h1>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push("/dashboard/dataTable")}
          className="flex items-center space-x-1"
        >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
        
        {isOwner && !isEditing && (
          <Button 
            className="ml-auto" 
            onClick={() => setIsEditing(true)}
          >
            Edit Metadata
          </Button>
        )}
        
        {isEditing && (
          <div className="ml-auto space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setFormData(dataset);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <Card className="ml-0">
        <CardHeader>
          <CardTitle>MetaData Edit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            // Edit mode
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select 
                    value={formData.visibility || ""} 
                    onValueChange={(value) => handleSelectChange("visibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="TEAM">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </>
          ) : (
            // View mode
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{dataset.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Visibility</h3>
                  <p className="mt-1">{dataset.visibility}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1">{new Date(dataset.createdAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                  <p className="mt-1">{dataset.owner}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Team</h3>
                  <p className="mt-1">{dataset.team || "None"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Visualizations</h3>
                  <p className="mt-1">{dataset.visualizations}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 whitespace-pre-wrap">{dataset.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}