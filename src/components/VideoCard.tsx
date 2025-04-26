
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Video, ProcessingStatus, ProcessingOptions } from '@/contexts/VideoContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, CheckCircle, XCircle, Clock, Download, Trash2, RefreshCw,
  FileText, Image, ZoomIn, VolumeX
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Switch
} from "@/components/ui/switch";
import { Label } from '@/components/ui/label';

interface VideoCardProps {
  video: Video;
  onDelete?: (id: string) => void;
  onReprocess?: (id: string, format: 'mp4' | 'avi' | 'mkv', resolution: '720p' | '1080p' | '480p', options?: ProcessingOptions) => void;
  isAdmin?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete, onReprocess, isAdmin = false }) => {
  const [showReprocessDialog, setShowReprocessDialog] = React.useState(false);
  const [selectedFormat, setSelectedFormat] = React.useState<'mp4' | 'avi' | 'mkv'>(video.format);
  const [selectedResolution, setSelectedResolution] = React.useState<'720p' | '1080p' | '480p'>(video.resolution);
  const [showThumbnails, setShowThumbnails] = useState(false);
  
  // Reprocessing options state
  const [compression, setCompression] = useState(video.processingOptions?.compression || false);
  const [noiseReduction, setNoiseReduction] = useState(video.processingOptions?.noiseReduction || false);
  const [subtitles, setSubtitles] = useState(video.processingOptions?.subtitles || false);
  const [thumbnails, setThumbnails] = useState(video.processingOptions?.thumbnails || false);

  const statusMap: Record<ProcessingStatus, { icon: React.ReactNode; label: string; color: string }> = {
    pending: { 
      icon: <Clock className="h-4 w-4 mr-1" />, 
      label: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
    },
    processing: { 
      icon: <Loader2 className="h-4 w-4 mr-1 animate-spin" />, 
      label: 'Processing', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
    },
    completed: { 
      icon: <CheckCircle className="h-4 w-4 mr-1" />, 
      label: 'Completed', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
    },
    failed: { 
      icon: <XCircle className="h-4 w-4 mr-1" />, 
      label: 'Failed', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
    },
  };

  const handleReprocess = () => {
    if (onReprocess) {
      const options = (compression || noiseReduction || subtitles || thumbnails) 
        ? { 
            compression, 
            noiseReduction, 
            subtitles, 
            thumbnails 
          } 
        : undefined;
      
      onReprocess(video.id, selectedFormat, selectedResolution, options);
      setShowReprocessDialog(false);
    }
  };

  const { icon, label, color } = statusMap[video.status];

  // Helper function to render feature badges
  const renderFeatureBadges = () => {
    const badges = [];
    
    if (video.processingOptions?.compression) {
      badges.push(
        <Badge key="compression" variant="outline" className="mr-1 bg-blue-50 text-blue-700 border-blue-200">
          <ZoomIn className="h-3 w-3 mr-1" />
          Compressed
        </Badge>
      );
    }
    
    if (video.processingOptions?.noiseReduction) {
      badges.push(
        <Badge key="noise" variant="outline" className="mr-1 bg-purple-50 text-purple-700 border-purple-200">
          <VolumeX className="h-3 w-3 mr-1" />
          Noise Reduced
        </Badge>
      );
    }
    
    if (video.processingOptions?.subtitles) {
      badges.push(
        <Badge key="subtitles" variant="outline" className="mr-1 bg-amber-50 text-amber-700 border-amber-200">
          <FileText className="h-3 w-3 mr-1" />
          Subtitled
        </Badge>
      );
    }
    
    if (video.processingOptions?.thumbnails) {
      badges.push(
        <Badge key="thumbnails" variant="outline" className="mr-1 bg-emerald-50 text-emerald-700 border-emerald-200">
          <Image className="h-3 w-3 mr-1" />
          Thumbnails
        </Badge>
      );
    }
    
    return badges.length > 0 ? (
      <div className="mt-2 flex flex-wrap gap-1">
        {badges}
      </div>
    ) : null;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 rounded-t-lg overflow-hidden">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
            <Badge className={`${color} mr-2`}>
              {icon}
              {label}
            </Badge>
            <Badge variant="outline" className="bg-black/50 text-white border-none">
              {video.resolution}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{video.title}</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Size: {video.size}</p>
          <p>Format: {video.format}</p>
          <p>Duration: {video.duration}</p>
          <p>Uploaded: {format(new Date(video.uploadDate), 'MMM dd, yyyy')}</p>
          {video.processedDate && (
            <p>Processed: {format(new Date(video.processedDate), 'MMM dd, yyyy')}</p>
          )}
          {renderFeatureBadges()}
        </div>
        
        {video.status === 'completed' && (
          <Accordion type="single" collapsible className="w-full mt-3">
            {video.processingOptions?.thumbnails && video.thumbnails && (
              <AccordionItem value="thumbnails">
                <AccordionTrigger className="text-sm py-2">
                  View Thumbnails
                </AccordionTrigger>
                <AccordionContent>
                  <Carousel className="w-full max-w-xs mx-auto">
                    <CarouselContent>
                      {video.thumbnails.map((thumb, index) => (
                        <CarouselItem key={index}>
                          <img 
                            src={thumb} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md" 
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                  </Carousel>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {video.processingOptions?.subtitles && video.subtitlesUrl && (
              <AccordionItem value="subtitles">
                <AccordionTrigger className="text-sm py-2">
                  Subtitles
                </AccordionTrigger>
                <AccordionContent>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(video.subtitlesUrl, '_blank')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Download Subtitles
                  </Button>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        {video.status === 'completed' && video.driveLink && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => window.open(video.driveLink, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
        
        {(video.status === 'completed' || video.status === 'failed') && onReprocess && (
          <Dialog open={showReprocessDialog} onOpenChange={setShowReprocessDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reprocess
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reprocess Video</DialogTitle>
                <DialogDescription>
                  Choose the format, resolution and processing options for "{video.title}"
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select
                    value={selectedFormat}
                    onValueChange={(value) => setSelectedFormat(value as any)}
                  >
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
                  <label className="text-sm font-medium">Resolution</label>
                  <Select
                    value={selectedResolution}
                    onValueChange={(value) => setSelectedResolution(value as any)}
                  >
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
                
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-medium mb-3">Processing Options</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reprocess-compression" className="text-sm">Lossless Compression</Label>
                      <Switch
                        id="reprocess-compression"
                        checked={compression}
                        onCheckedChange={setCompression}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reprocess-noise" className="text-sm">Noise Reduction</Label>
                      <Switch
                        id="reprocess-noise"
                        checked={noiseReduction}
                        onCheckedChange={setNoiseReduction}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reprocess-subtitles" className="text-sm">Generate Subtitles</Label>
                      <Switch
                        id="reprocess-subtitles"
                        checked={subtitles}
                        onCheckedChange={setSubtitles}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reprocess-thumbnails" className="text-sm">Generate Thumbnails</Label>
                      <Switch
                        id="reprocess-thumbnails"
                        checked={thumbnails}
                        onCheckedChange={setThumbnails}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReprocessDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReprocess}>
                  Reprocess
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {onDelete && (
          <Button 
            variant="destructive" 
            size="sm"
            className="flex-1"
            onClick={() => onDelete(video.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        
        {isAdmin && (
          <div className="w-full mt-2 text-xs text-muted-foreground">
            <span className="font-semibold">User ID:</span> {video.userId}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
