"use client"

import { formatFileSize } from "@/app/utils";
import EncryptedFileIcon from "@/components/icons/encryptedfile";
import Loader from "@/components/organisms/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DownloadPage() {
  const { fileId } = useParams<{ fileId: string }>();
  const [upload, setUpload] = useState<UserUpload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpload = async () => {
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
        const response = await fetch(API_URL + "file/" + fileId, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('File not found');
        }

        const data: UserUpload = await response.json();
        setUpload(data);
      } catch (error) {
        toast('Failed to fetch file info:', {
          description: `${error}`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUpload();
  }, [fileId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!upload) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center text-red-400">
            File not found or has been removed
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleDownload = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const fileKey = window.location.hash;
    if (fileKey.startsWith("#")) {
      fetch(API_URL + "download/" + fileId, {
        method: "POST",
        body: JSON.stringify({ key: fileKey.slice(1) })
      }).then(async (response) => {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = upload.fileName;
        link.click();

        window.URL.revokeObjectURL(url);
      })
    } else {
      toast("Error", {
        description: "Invalid key!"
      })
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/20 p-2">
            <EncryptedFileIcon className="h-full w-full text-primary" />
          </div>
          <h2 className="text-2xl font-bold truncate">{upload.fileName}</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Size:</span>
            <span>{formatFileSize(upload.size)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploaded:</span>
            <span>{new Date(upload.uploadDate).toLocaleString()}</span>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full hover:cursor-pointer"
            size="lg"
            onClick={handleDownload}
            >
            Download
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}