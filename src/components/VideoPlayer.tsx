
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  videoUrl,
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
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[60vh] bg-black"
            src={videoUrl}
            controls
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
        {onDownload && (
          <div className="flex justify-end mt-4">
            <Button onClick={onDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
