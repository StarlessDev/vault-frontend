"use client"

import { Input } from "@/components/ui/input";
import { useAuth } from "../../context/AuthContext";
import EncryptedFileIcon from "@/components/icons/encryptedfile";
import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [nameFilter, setNameFilter] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <></>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value.trim());
  };

  const uploads = user?.uploads;
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">YOUR VAULT</h1>
          <Input
            type="text"
            placeholder="Search"
            onChange={handleInputChange}
          />
        </div>
        <div className="p-4 space-y-2">
          {uploads === undefined ? <></> : uploads.filter((upload) => {
            if (nameFilter) {
              return upload.fileName.includes(nameFilter);
            }
            return true;
          }).map((upload, idx) => {
            return <UploadSquare key={idx} upload={upload} />
          })}
        </div>
      </div>
    </div>
  )
}

interface UploadSquare {
  upload: UserUpload;
}

function UploadSquare({ upload }: UploadSquare) {
  const { refresh } = useAuth();

  const handleDeleteButton = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
    const response: Response = await fetch(API_BASE_URL + "delete/" + upload.fileId, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const description = response.status == 404
        ? "The file was not found on the server"
        : "Something bad happened. Try again later."

      toast("Error", { description })
    }
    await refresh();
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex sm:w-sm md:w-xl items-center justify-between bg-[var(--sidebar)] rounded-xl border-solid border border-[var(--color-foregound)]/0.1 p-4 hover:border-[var(--primary)] transition">
            <div className="flex items-center space-x-3">
              {/* Icon square */}
              <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                <EncryptedFileIcon className="stroke-red-400" />
              </div>
              {/** File name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{upload.fileName}</h3>
                <p className="text-xs text-zinc-400">
                  {"▪ Uploaded at " + new Date(upload.uploadDate).toLocaleString()}
                </p>
                <p className="text-xs text-zinc-400">
                  {"▪ Downloaded " + upload.totalDownloads + " times"}
                </p>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem variant="destructive" onClick={handleDeleteButton} asChild>
            <div>
              <Trash2 />
              <p>Delete</p>
            </div>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}