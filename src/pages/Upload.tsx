
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo, VideoFormat, VideoResolution } from '@/contexts/VideoContext';
import Navbar from '@/components/Navbar';
import ProcessingOptions from '@/components/ProcessingOptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, FileVideo, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [format, setFormat] = useState<VideoFormat>('mp4');
  const [resolution, setResolution] = useState<VideoResolution>('720p');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New processing options
  const [compression, setCompression] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(false);
  const [subtitles, setSubtitles] = useState(false);
  const [thumbnails, setThumbnails] = useState(false);
  
  const { uploadVideo } = useVideo();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/avi', 'video/x-matroska', 'video/quicktime'];
    if (!validVideoTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a video file.');
      return;
    }
    
    // Validate file size (limit to 500MB for demo)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      toast.error('File too large. Please upload a video smaller than 500MB.');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/avi', 'video/x-matroska', 'video/quicktime'];
    if (!validVideoTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a video file.');
      return;
    }
    
    // Validate file size (limit to 500MB for demo)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      toast.error('File too large. Please upload a video smaller than 500MB.');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    
    setIsUploading(true);
    try {
      // Create processing options object only if at least one option is enabled
      const processingOptions = (compression || noiseReduction || subtitles || thumbnails) 
        ? { 
            compression, 
            noiseReduction, 
            subtitles, 
            thumbnails 
          } 
        : undefined;
        
      await uploadVideo(selectedFile, format, resolution, processingOptions);
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
          <p className="text-muted-foreground mb-8">
            Upload your video file for processing and cloud storage
          </p>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center ${
                  selectedFile ? 'border-primary' : 'border-muted-foreground/25'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <FileVideo className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium mb-1">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <Button variant="outline" size="sm" onClick={handleRemoveFile}>
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      MP4, AVI, MKV or MOV (max. 500MB)
                    </p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Select File
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="video/mp4,video/x-matroska,video/avi,video/quicktime"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Output Format</label>
                <Select value={format} onValueChange={(value) => setFormat(value as VideoFormat)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                    <SelectItem value="mkv">MKV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Output Resolution</label>
                <Select value={resolution} onValueChange={(value) => setResolution(value as VideoResolution)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Collapsible
              open={isAdvancedOpen}
              onOpenChange={setIsAdvancedOpen}
              className="border rounded-md p-4"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer">
                  <h3 className="text-lg font-medium">Advanced Processing Options</h3>
                  <Button variant="ghost" size="sm">
                    {isAdvancedOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <ProcessingOptions
                  compression={compression}
                  setCompression={setCompression}
                  noiseReduction={noiseReduction}
                  setNoiseReduction={setNoiseReduction}
                  subtitles={subtitles}
                  setSubtitles={setSubtitles}
                  thumbnails={thumbnails}
                  setThumbnails={setThumbnails}
                />
              </CollapsibleContent>
            </Collapsible>
            
            <div className="flex justify-end">
              <Button
                className="bg-primary"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {selectedFile ? 'Upload and Process' : 'Select a file first'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
