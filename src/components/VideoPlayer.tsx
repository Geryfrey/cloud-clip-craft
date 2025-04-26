
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  driveLink?: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  videoUrl,
  driveLink,
  isOpen,
  onClose,
  onDownload,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset video when closed
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const handleOpenDrive = () => {
    if (driveLink) {
      window.open(driveLink, '_blank');
      toast.success("Opening Google Drive link");
    } else {
      toast.error("Google Drive link is not available");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Playback quality: {videoUrl.includes('1080p') ? '1080p' : videoUrl.includes('720p') ? '720p' : '480p'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden relative">
          {videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[60vh] bg-black"
              src={videoUrl}
              controls
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-[60vh] bg-black flex items-center justify-center text-white">
              Video preview not available
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {driveLink && (
            <Button onClick={handleOpenDrive} variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Google Drive
            </Button>
          )}
          {onDownload && (
            <Button onClick={onDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
