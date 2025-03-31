
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVideo, Video } from '@/contexts/VideoContext';
import Navbar from '@/components/Navbar';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Upload, Search } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { videos, deleteVideo, reprocessVideo, isLoading } = useVideo();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'processing' | 'pending'>('all');
  
  // Filter videos for the current user
  const userVideos = videos.filter(video => video.userId === user?.id);
  
  // Filter by search term
  const filteredBySearch = searchTerm 
    ? userVideos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.originalFileName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : userVideos;
  
  // Filter by status (tab)
  const getFilteredVideos = (status?: 'pending' | 'processing' | 'completed') => {
    if (!status) return filteredBySearch;
    return filteredBySearch.filter(video => video.status === status);
  };
  
  const videosByStatus = {
    all: getFilteredVideos(),
    pending: getFilteredVideos('pending'),
    processing: getFilteredVideos('processing'),
    completed: getFilteredVideos('completed'),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Videos</h1>
            <p className="text-muted-foreground">
              Manage and track your video processing
            </p>
          </div>
          <Link to="/upload">
            <Button className="bg-primary">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Video
            </Button>
          </Link>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All Videos ({videosByStatus.all.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({videosByStatus.completed.length})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({videosByStatus.processing.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({videosByStatus.pending.length})
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(videosByStatus).map(([status, vids]) => (
            <TabsContent key={status} value={status} className="mt-0">
              {vids.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No videos found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm 
                        ? "No videos match your search criteria." 
                        : status === "all" 
                          ? "You haven't uploaded any videos yet." 
                          : `You don't have any ${status} videos.`}
                    </p>
                    {status === "all" && !searchTerm && (
                      <Link to="/upload">
                        <Button className="mt-4">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Your First Video
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vids.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onDelete={deleteVideo}
                      onReprocess={reprocessVideo}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
