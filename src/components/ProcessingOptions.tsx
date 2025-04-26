
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export interface ProcessingOptionsProps {
  compression: boolean;
  setCompression: (value: boolean) => void;
  noiseReduction: boolean;
  setNoiseReduction: (value: boolean) => void;
  subtitles: boolean;
  setSubtitles: (value: boolean) => void;
  thumbnails: boolean;
  setThumbnails: (value: boolean) => void;
}

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  compression,
  setCompression,
  noiseReduction,
  setNoiseReduction,
  subtitles,
  setSubtitles,
  thumbnails,
  setThumbnails
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Advanced Processing Options</h3>
      <Separator className="my-2" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="compression" className="text-sm font-medium">Lossless Compression</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Reduce file size without losing quality using advanced algorithms</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="compression"
            checked={compression}
            onCheckedChange={setCompression}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="noiseReduction" className="text-sm font-medium">Noise Reduction</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Clean up audio and video noise for clearer playback</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="noiseReduction"
            checked={noiseReduction}
            onCheckedChange={setNoiseReduction}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="subtitles" className="text-sm font-medium">Generate Subtitles</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Automatically generate and embed subtitles using AI speech recognition</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="subtitles"
            checked={subtitles}
            onCheckedChange={setSubtitles}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="thumbnails" className="text-sm font-medium">Generate Thumbnails</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Automatically extract multiple thumbnails at key moments in the video</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="thumbnails"
            checked={thumbnails}
            onCheckedChange={setThumbnails}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingOptions;
