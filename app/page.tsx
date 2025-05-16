// pages/index.tsx
"use client";

import { useState, useCallback, useRef, ChangeEvent } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';

interface FileWithPreview extends File {
  preview?: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files) as FileWithPreview[];
    handleFileUpload(droppedFiles);
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as FileWithPreview[];
      handleFileUpload(selectedFiles);
    }
  };

  const handleFileUpload = (uploadedFiles: FileWithPreview[]): void => {
    if (uploadedFiles.length > 0) {
      setIsUploading(true);
      
      // Simulate file processing delay
      setTimeout(() => {
        setFiles(prev => [...prev, ...uploadedFiles]);
        setIsUploading(false);
      }, 1000);
    }
  };

  const removeFile = (indexToRemove: number): void => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const openFileDialog = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>File Upload</title>
        <meta name="description" content="File upload with drag and drop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          File Upload System
        </h1>
        
        <div className="max-w-3xl mx-auto mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
              isDragging 
                ? 'border-primary bg-zinc-800/70' 
                : 'border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              multiple
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-primary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <p className="text-xl font-medium">
                Drop files here or <span className="text-primary">browse</span>
              </p>
              <p className="text-sm text-zinc-400">
                Upload any file type.
              </p>
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                <span>Uploading files...</span>
              </div>
              <div className="mt-3 w-full bg-zinc-700 rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-medium">Uploaded Files</h2>
              <span className="text-sm text-zinc-400">{files.length} file(s)</span>
            </div>
            
            <div className="bg-zinc-800 rounded-xl overflow-hidden shadow">
              <ul>
                {files.map((file, index) => (
                  <li 
                    key={index} 
                    className="border-b border-zinc-700 last:border-0"
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                          {file.type.startsWith('image/') ? (
                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          ) : file.type.startsWith('video/') ? (
                            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                          ) : file.type.startsWith('audio/') ? (
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">{file.name}</h3>
                          <p className="text-xs text-zinc-400">
                            {formatFileSize(file.size)} • {file.type || 'Unknown file   type'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="ml-2 p-2 text-zinc-400 hover:text-zinc-200 rounded-full hover:bg-zinc-700 transition"
                        aria-label="Remove file"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button>
                Process Files
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}