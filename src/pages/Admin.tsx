
import React, { useState } from 'react';
import { useVideo } from '@/contexts/VideoContext';
import Navbar from '@/components/Navbar';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Search, Users, Video, Database, CheckCircle, Clock, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { videos, deleteVideo, reprocessVideo, isLoading } = useVideo();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate statistics
  const totalVideos = videos.length;
  const completedVideos = videos.filter(v => v.status === 'completed').length;
  const processingVideos = videos.filter(v => v.status === 'processing').length;
  const pendingVideos = videos.filter(v => v.status === 'pending').length;
  
  // Get unique user IDs
  const userIds = [...new Set(videos.map(video => video.userId))];
  const totalUsers = userIds.length;
  
  // Filter videos by search term
  const filteredVideos = searchTerm 
    ? videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.originalFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.userId.includes(searchTerm)
      )
    : videos;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, videos, and system settings
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVideos}</div>
              <p className="text-xs text-muted-foreground">
                Across all users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {processingVideos} / {pendingVideos}
              </div>
              <p className="text-xs text-muted-foreground">
                Processing / Pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedVideos}</div>
              <p className="text-xs text-muted-foreground">
                Successfully processed
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Video Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Video Management</CardTitle>
            <CardDescription>
              Manage all user videos in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search videos by title, filename, or user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Videos</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {filteredVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No videos found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onDelete={deleteVideo}
                        onReprocess={reprocessVideo}
                        isAdmin
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {filteredVideos.filter(v => v.status === 'completed').length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No completed videos found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.filter(v => v.status === 'completed').map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onDelete={deleteVideo}
                        onReprocess={reprocessVideo}
                        isAdmin
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="processing">
                {filteredVideos.filter(v => v.status === 'processing').length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No videos in processing</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.filter(v => v.status === 'processing').map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onDelete={deleteVideo}
                        onReprocess={reprocessVideo}
                        isAdmin
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending">
                {filteredVideos.filter(v => v.status === 'pending').length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No pending videos</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.filter(v => v.status === 'pending').map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onDelete={deleteVideo}
                        onReprocess={reprocessVideo}
                        isAdmin
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
