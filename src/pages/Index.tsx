
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';
import { Cloud, Video, UploadCloud, Files, Shield, Database } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/20 to-background clip-path-auth py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Cloud Video Processing Made Simple
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload, process, and store your videos securely in Google Drive with our powerful cloud-based platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 md:gap-10">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full p-3 bg-primary/10">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Easy Upload</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Upload your videos through a simple, intuitive interface
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full p-3 bg-primary/10">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Advanced Processing</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Resize, convert, and compress your videos automatically
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full p-3 bg-primary/10">
                  <Cloud className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Cloud Storage</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Store and access your videos securely with Google Drive integration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-12 md:py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  How It Works
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A simple three-step process to transform your videos
                </p>
              </div>
              <div className="grid gap-10 md:grid-cols-3 md:gap-16 mt-8">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    1
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Upload</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Select your video file and choose your desired format and resolution
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    2
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Process</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Our system automatically processes your video in the background
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    3
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Download</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Access your processed video through a secure Google Drive link
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Transform Your Videos?
                </h2>
                <p className="mx-auto max-w-[600px] md:text-xl">
                  Join thousands of users who trust CloudClipCraft for their video processing needs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-background border-t py-6 md:py-10">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <Logo size="sm" />
          <p className="text-center text-sm text-gray-500 md:text-left dark:text-gray-400">
            &copy; {new Date().getFullYear()} CloudClipCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
