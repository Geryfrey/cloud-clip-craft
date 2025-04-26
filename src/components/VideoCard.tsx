
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
  FileText, Image, ZoomIn, VolumeX, Play
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
import VideoPlayer from './VideoPlayer';
import { useToast } from '@/hooks/use-toast';

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
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const { toast } = useToast();
  
  // Reprocessing options state
  const [compression, setCompression] = useState(video.processingOptions?.compression || false);
  const [noiseReduction, setNoiseReduction] = useState(video.processingOptions?.noiseReduction || false);
  const [subtitles, setSubtitles] = useState(video.processingOptions?.subtitles || false);
  const [thumbnails, setThumbnails] = useState(video.processingOptions?.thumbnails || false);

  // Generate a base64 video URL based on the video ID and filename for demo purposes
  // In a real app, this would be an actual URL to your storage bucket/CDN
  const generateVideoUrl = () => {
    if (video.status !== 'completed') return '';
    
    // For demo purposes, create a data URI that represents our video
    // In production, this would be replaced with a real URL to the video file
    const videoData = `data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAAAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAACgAAAAEAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAr/4QAYZ2QACqzZX4iIhAAAAwAEAAADAFA8SJZYAQAGaOvjyyLAAAAAGHN0dHMAAAAAAAAAAQAAAAEAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAABRzdHN6AAAAAAAAAsUAAAABAAAAFHN0Y28AAAAAAAAAAQAAADAAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjU2LjQwLjEwMQ==`;
    
    return videoData;
  };

  // Create a real download function
  const handleDownload = () => {
    if (video.status !== 'completed') {
      toast({
        title: "Video not ready",
        description: "This video is not yet processed and cannot be downloaded.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real app, this would be a link to the actual file in your storage
      const videoUrl = generateVideoUrl();
      
      // Create a download link
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = video.processedFileName || `${video.title.toLowerCase().replace(/\s+/g, '_')}.${video.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${video.title}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your video.",
        variant: "destructive"
      });
    }
  };

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
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="relative h-48 rounded-t-lg overflow-hidden group">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover"
            />
            {video.status === 'completed' && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setIsVideoPlayerOpen(true)}
              >
                <Play className="h-12 w-12 text-white" />
              </div>
            )}
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
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                      // Create a link to download subtitles
                      const link = document.createElement('a');
                      link.href = video.subtitlesUrl as string;
                      link.download = `${video.title.toLowerCase().replace(/\s+/g, '_')}.vtt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      toast({
                        title: "Subtitles downloaded",
                        description: `Subtitles for ${video.title} have been downloaded`,
                      });
                    }}>
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
          {video.status === 'completed' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setIsVideoPlayerOpen(true)}
            >
              <Play className="mr-2 h-4 w-4" />
              Play
            </Button>
          )}
          
          {video.status === 'completed' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleDownload}
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

      {isVideoPlayerOpen && (
        <VideoPlayer
          title={video.title}
          videoUrl={generateVideoUrl()}
          isOpen={isVideoPlayerOpen}
          onClose={() => setIsVideoPlayerOpen(false)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
};

export default VideoCard;
