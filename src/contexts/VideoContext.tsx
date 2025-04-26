import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';

// Video types and interfaces
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type VideoFormat = 'mp4' | 'avi' | 'mkv';
export type VideoResolution = '720p' | '1080p' | '480p';

// New processing options
export interface ProcessingOptions {
  compression: boolean;       // Lossless compression
  noiseReduction: boolean;    // Remove noise
  subtitles: boolean;         // Generate subtitles
  thumbnails: boolean;        // Generate video thumbnails
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  originalFileName: string;
  processedFileName?: string;
  thumbnail?: string;
  thumbnails?: string[];      // Array of generated thumbnail URLs
  status: ProcessingStatus;
  format: VideoFormat;
  resolution: VideoResolution;
  size: string;
  duration: string;
  uploadDate: string;
  processedDate?: string;
  driveLink?: string;
  subtitlesUrl?: string;      // URL to the generated subtitles file
  processingOptions?: ProcessingOptions;
}

interface VideoContextType {
  videos: Video[];
  isLoading: boolean;
  uploadVideo: (
    file: File, 
    format: VideoFormat, 
    resolution: VideoResolution, 
    options?: ProcessingOptions
  ) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  reprocessVideo: (
    id: string, 
    format: VideoFormat, 
    resolution: VideoResolution, 
    options?: ProcessingOptions
  ) => Promise<void>;
  getAllVideos: () => Video[]; // Admin function
}

// Sample video data
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    userId: '2',
    title: 'Product Demo',
    originalFileName: 'product_demo.mp4',
    processedFileName: 'product_demo_720p.mp4',
    thumbnail: 'https://placehold.co/600x400/667eea/ffffff?text=Product+Demo',
    status: 'completed',
    format: 'mp4',
    resolution: '720p',
    size: '24.5 MB',
    duration: '2:45',
    uploadDate: '2023-10-15T10:30:00Z',
    processedDate: '2023-10-15T10:35:00Z',
    driveLink: 'https://drive.google.com/mock-link-1',
  },
  {
    id: '2',
    userId: '2',
    title: 'Training Session',
    originalFileName: 'training.mp4',
    thumbnail: 'https://placehold.co/600x400/f6ad55/ffffff?text=Training+Session',
    status: 'processing',
    format: 'mp4',
    resolution: '1080p',
    size: '155.2 MB',
    duration: '18:22',
    uploadDate: '2023-10-16T14:20:00Z',
  },
  {
    id: '3',
    userId: '1',
    title: 'Company Presentation',
    originalFileName: 'presentation.avi',
    processedFileName: 'presentation_720p.mp4',
    thumbnail: 'https://placehold.co/600x400/9f7aea/ffffff?text=Company+Presentation',
    status: 'completed',
    format: 'mp4',
    resolution: '720p',
    size: '85.7 MB',
    duration: '10:15',
    uploadDate: '2023-10-14T09:15:00Z',
    processedDate: '2023-10-14T09:25:00Z',
    driveLink: 'https://drive.google.com/mock-link-2',
  },
  {
    id: '4',
    userId: '1',
    title: 'Customer Testimonial',
    originalFileName: 'testimonial.mkv',
    processedFileName: 'testimonial_480p.mp4',
    thumbnail: 'https://placehold.co/600x400/4299e1/ffffff?text=Customer+Testimonial',
    status: 'completed',
    format: 'mp4',
    resolution: '480p',
    size: '18.3 MB',
    duration: '3:45',
    uploadDate: '2023-10-13T16:40:00Z',
    processedDate: '2023-10-13T16:45:00Z',
    driveLink: 'https://drive.google.com/mock-link-3',
  },
  {
    id: '5',
    userId: '2',
    title: 'Project Overview',
    originalFileName: 'project.mp4',
    thumbnail: 'https://placehold.co/600x400/ed8936/ffffff?text=Project+Overview',
    status: 'pending',
    format: 'mp4',
    resolution: '1080p',
    size: '210.6 MB',
    duration: '25:18',
    uploadDate: '2023-10-17T11:10:00Z',
  },
];

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load videos from localStorage or use mock data
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    } else {
      setVideos(MOCK_VIDEOS);
      localStorage.setItem('videos', JSON.stringify(MOCK_VIDEOS));
    }
    setIsLoading(false);
  }, []);

  // Save videos to localStorage whenever they change
  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('videos', JSON.stringify(videos));
    }
  }, [videos]);

  const uploadVideo = async (
    file: File, 
    format: VideoFormat, 
    resolution: VideoResolution, 
    options?: ProcessingOptions
  ) => {
    if (!user) {
      toast.error("You must be logged in to upload videos");
      throw new Error("Not authenticated");
    }

    setIsLoading(true);
    try {
      // Create a placeholder thumbnail URL
      const textForThumbnail = file.name.split('.')[0].replace(/[_-]/g, '+');
      const colorHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      const thumbnail = `https://placehold.co/600x400/${colorHex}/ffffff?text=${textForThumbnail}`;
      
      // Simulate uploading delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newVideo: Video = {
        id: Math.random().toString(36).substring(2, 9),
        userId: user.id,
        title: file.name.split('.')[0].replace(/[_-]/g, ' '),
        originalFileName: file.name,
        thumbnail,
        status: 'pending',
        format,
        resolution,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        duration: '00:00', // We'd calculate this from the actual file
        uploadDate: new Date().toISOString(),
        processingOptions: options,
      };
      
      setVideos(prev => [newVideo, ...prev]);
      toast.success("Video uploaded successfully and queued for processing");
      
      // Simulate processing delay (3-8 seconds)
      const processingTime = Math.floor(Math.random() * 5000) + 3000;
      
      // Update status to processing
      setTimeout(() => {
        setVideos(prev => 
          prev.map(v => v.id === newVideo.id ? { ...v, status: 'processing' } : v)
        );
        toast.info(`Processing started for "${newVideo.title}"`);
        
        // After processing, update to completed
        setTimeout(() => {
          const processedFileName = `${newVideo.title.toLowerCase().replace(/\s+/g, '_')}_${resolution}.${format}`;
          
          // Generate mock data for the new features if enabled
          const thumbnails = options?.thumbnails 
            ? [
                `https://placehold.co/600x400/${colorHex}/ffffff?text=Thumbnail+1`,
                `https://placehold.co/600x400/${colorHex}/ffffff?text=Thumbnail+2`,
                `https://placehold.co/600x400/${colorHex}/ffffff?text=Thumbnail+3`,
              ] 
            : undefined;
          
          const subtitlesUrl = options?.subtitles 
            ? `https://example.com/subtitles/${newVideo.id}.vtt` 
            : undefined;
          
          // Calculate a slightly smaller file size if compression was applied
          const compressedSize = options?.compression 
            ? `${(file.size / (1024 * 1024) * 0.7).toFixed(1)} MB` // 30% size reduction  
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
          
          // Generate a Google Drive link for the processed video
          const driveLink = `https://drive.google.com/file/d/${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}/view`;
          
          setVideos(prev => 
            prev.map(v => v.id === newVideo.id ? { 
              ...v, 
              status: 'completed',
              processedFileName,
              processedDate: new Date().toISOString(),
              driveLink,
              thumbnails,
              subtitlesUrl,
              size: options?.compression ? compressedSize : v.size
            } : v)
          );
          
          const featuresApplied = [];
          if (options?.compression) featuresApplied.push("compression");
          if (options?.noiseReduction) featuresApplied.push("noise reduction");
          if (options?.subtitles) featuresApplied.push("subtitle generation");
          if (options?.thumbnails) featuresApplied.push("thumbnail generation");
          
          const featuresMessage = featuresApplied.length > 0 
            ? ` with ${featuresApplied.join(", ")}`
            : "";
            
          toast.success(`Processing completed for "${newVideo.title}"${featuresMessage}`);
        }, 5000);
      }, processingTime);
      
    } catch (error) {
      toast.error("Failed to upload video");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVideos(prev => prev.filter(video => video.id !== id));
      toast.success("Video deleted successfully");
    } catch (error) {
      toast.error("Failed to delete video");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const reprocessVideo = async (
    id: string, 
    format: VideoFormat, 
    resolution: VideoResolution, 
    options?: ProcessingOptions
  ) => {
    setIsLoading(true);
    try {
      // Find the video
      const video = videos.find(v => v.id === id);
      if (!video) {
        throw new Error("Video not found");
      }
      
      // Update status to processing
      setVideos(prev => 
        prev.map(v => v.id === id ? { 
          ...v, 
          status: 'processing', 
          format, 
          resolution, 
          processingOptions: options 
        } : v)
      );
      
      toast.info(`Reprocessing started for "${video.title}"`);
      
      // Simulate processing delay (3-5 seconds)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 3000));
      
      // Generate random color for thumbnails
      const colorHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      
      // Generate mock data for the new features if enabled
      const thumbnails = options?.thumbnails 
        ? [
            `https://placehold.co/600x400/${colorHex}/ffffff?text=Thumbnail+1`,
            `https://placehold.co/600x400/${colorHex}/ffffff?text=Thumbnail+2`,
            `https://placehold.co/600x400/${colorHex}/ffffff?text=Thumbnail+3`,
          ] 
        : undefined;
      
      const subtitlesUrl = options?.subtitles 
        ? `https://example.com/subtitles/${video.id}.vtt` 
        : undefined;
      
      // Calculate a slightly smaller file size if compression was applied
      const originalSizeNum = parseFloat(video.size.split(' ')[0]);
      const compressedSize = options?.compression 
        ? `${(originalSizeNum * 0.7).toFixed(1)} MB` // 30% size reduction 
        : video.size;
      
      // Update to completed with new format, resolution and processing options
      const processedFileName = `${video.title.toLowerCase().replace(/\s+/g, '_')}_${resolution}.${format}`;
      setVideos(prev => 
        prev.map(v => v.id === id ? { 
          ...v, 
          status: 'completed',
          format,
          resolution,
          processedFileName,
          processedDate: new Date().toISOString(),
          driveLink: `https://drive.google.com/file/d/${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}/view`,
          thumbnails,
          subtitlesUrl,
          size: options?.compression ? compressedSize : v.size,
          processingOptions: options
        } : v)
      );
      
      const featuresApplied = [];
      if (options?.compression) featuresApplied.push("compression");
      if (options?.noiseReduction) featuresApplied.push("noise reduction");
      if (options?.subtitles) featuresApplied.push("subtitle generation");
      if (options?.thumbnails) featuresApplied.push("thumbnail generation");
      
      const featuresMessage = featuresApplied.length > 0 
        ? ` with ${featuresApplied.join(", ")}`
        : "";
        
      toast.success(`Reprocessing completed for "${video.title}"${featuresMessage}`);
    } catch (error) {
      toast.error("Failed to reprocess video");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllVideos = () => {
    // Admin-only function to get all videos
    return videos;
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        isLoading,
        uploadVideo,
        deleteVideo,
        reprocessVideo,
        getAllVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
