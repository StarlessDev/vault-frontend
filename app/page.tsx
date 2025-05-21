"use client";

import { useState, useCallback, useRef, ChangeEvent } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"


import ImageIcon from './components/icons/image';
import VideoIcon from './components/icons/video';
import AudioIcon from './components/icons/audio';
import FileIcon from './components/icons/file';
import BinIcon from './components/icons/bin';
import UploadIcon from './components/icons/upload';
import EncryptedFileIcon from './components/icons/encryptedfile';

import { Loader2 } from 'lucide-react';
import CopyIcon from './components/icons/copy';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IndexedFile extends File {
  index: number;
}

interface UploadedFile {
  index: number;
  name: string;
  id: string;
  url: string;
}

export default function Home() {
  // File states
  const [fileQueue, setFileQueue] = useState<IndexedFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag & Drop logic
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    handleFileUpload(droppedFiles);
  }, []);

  // File choice logic
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as File[];
      handleFileUpload(selectedFiles);
    }
  };

  const handleFileUpload = (uploadedFiles: File[]): void => {
    if (uploadedFiles.length > 0) {
      const indexedFiles: IndexedFile[] = uploadedFiles.map((file, idx) => {
        const idxFile: IndexedFile = file as IndexedFile
        idxFile.index = Math.random() * 1000
        return idxFile
      })
      setFileQueue(prev => [...prev, ...indexedFiles]);
    }
  };

  const removeFile = (indexToRemove: number): void => {
    setFileQueue(fileQueue.filter((_, index) => index !== indexToRemove));
  };

  const openFileDialog = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Uploaded files logic
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleButtonPress = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (uploading) return;
    e.preventDefault();
    setUploading(true);

    const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;
    const UPLOAD_URL: string = API_BASE_URL + "upload";
    const uploads: Promise<UploadedFile | null>[] = fileQueue.map(queuedFile => {
      const fetchBody = new FormData();
      fetchBody.append('file', queuedFile, queuedFile.name);

      return fetch(UPLOAD_URL, {
        method: 'POST',
        body: fetchBody,
        credentials: 'include',
        mode: 'cors'
      }).then(async (response) => {
        if (response.ok) {
          const processedFiles: UploadedFile[] = await response.json();
          if (processedFiles.length === 0) return null;

          const uploadedFile: UploadedFile = processedFiles[0];
          uploadedFile.index = queuedFile.index;
          return uploadedFile;
        }
        throw new Error('Upload failed');
      });
    });

    // Handle all uploads
    Promise.all(uploads)
      .then(results => {
        results.forEach(result => {
          if (result) {
            setUploadedFiles(prev => [...prev, result]);
            setFileQueue(prev => prev.filter(f => f.index !== result.index));
          }
        });
      })
      .catch(_ => {
        toast("Error", {
          description: "The upload failed!"
        });
      })
      .finally(() => {
        setUploading(false);
      });
  }

  // Adapted from https://stackoverflow.com/a/20732091
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Copy download url logic
  const copyUrl = async (file: UploadedFile): Promise<void> => {
    await navigator.clipboard.writeText(file.url);
    toast("URL copied to clipboard!", {
      description: "It won't be show again. Keep it safe!"
    })
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>File Upload</title>
        <meta name="description" content="File upload with drag and drop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragging
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
                <UploadIcon className="w-8 h-8 text-primary" />
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

        {fileQueue.length > 0 && (
          <div className="max-w-3xl mx-auto mb-8 border-[var(--color-foreground)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-medium">File Queue</h2>
              <span className="text-sm text-zinc-400">{fileQueue.length} file(s)</span>
            </div>

            <div className="flex flex-col gap-4 overflow-hidden shadow">
              {fileQueue.map((file, index) => (
                // Outer square
                <div key={index} className="flex items-center justify-between bg-[var(--sidebar)] rounded-xl border border-solid border-[var(--color-foregound)]/0.1 p-4">
                  <div className="flex items-center space-x-3">
                    {/* Icon square, selected by file type */}
                    <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="w-9 h-9 text-indigo-400" />
                      ) : file.type.startsWith('video/') ? (
                        <VideoIcon className="w-9 h-9 text-pink-400" />
                      ) : file.type.startsWith('audio/') ? (
                        <AudioIcon className="w-9 h-9 text-emerald-400" />
                      ) : (
                        <FileIcon className="w-9 h-9 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{file.name}</h3>
                      <p className="text-xs text-zinc-400">
                        {formatFileSize(file.size)} • {file.type || 'Data'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 p-2 text-zinc-400 hover:text-zinc-200 rounded-full hover:bg-zinc-700 transition"
                  >
                    <BinIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            { /* Button loader logic to avoid spam uploads */}
            <div className="mt-6 flex justify-end">
              {uploading
                ? (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button onClick={handleButtonPress}>
                    Upload
                  </Button>
                )
              }
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="max-w-3xl mx-auto ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-medium">Uploaded files</h2>
              <span className="text-sm text-zinc-400">{uploadedFiles.length} file(s) ({fileQueue.length} remaining)</span>
            </div>
            <div className="flex flex-col gap-4 overflow-hidden shadow">
              {/* Loop over the already uploaded files */}
              {uploadedFiles.map((file, index) => (
                // Outer square
                <div key={index} className="flex items-center justify-between bg-[var(--sidebar)] rounded-xl border-solid border border-[var(--color-foregound)]/0.1 p-4">
                  <div className="flex items-center space-x-3">
                    {/* Icon square */}
                    <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                      <EncryptedFileIcon className="stroke-red-400" />
                    </div>
                    {/** File name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{file.name}</h3>
                    </div>
                  </div>

                  {/* Add the tooltip to the button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => copyUrl(file)}
                          className="ml-2 p-2 text-zinc-400 hover:text-zinc-200 rounded-full hover:bg-zinc-700 transition"
                          aria-label="Remove file"
                        >
                          <CopyIcon className="w-7 h-7" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="mb-1">Copy link</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}