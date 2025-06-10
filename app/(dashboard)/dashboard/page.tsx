"use client"

import { Input } from "@/components/ui/input";
import { useAuth } from "../../context/AuthContext";
import EncryptedFileIcon from "@/components/icons/encryptedfile";
import React, { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UserUpload[]>(user?.uploads ?? []);
  const [nameFilter, setNameFilter] = useState<string | null>(null);

  const [page, setPage] = useState<number>(0);
  const pageSize: number = 5;

  useEffect(() => {
    if (!user) return;
    setUploads(user.uploads);
  }, [user])

  const filteredUploads = uploads.filter((upload) => {
    if (nameFilter) {
      return upload.fileName.toLowerCase().includes(nameFilter.toLowerCase());
    }
    return true;
  });

  // The total pages must be at least 1
  const totalPages = Math.max(1, Math.ceil(filteredUploads.length / pageSize));
  const baseIndex = page * pageSize;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value.trim());
    // We have no guarantee that there will be more than one page.
    setPage(0);
  };

  // Used to shift by 1 the pages
  // when the next/previous buttons are clicked
  const handlePageShift = (next: boolean) => {
    if (!uploads) return;

    let nextIdx;
    if (next) {
      nextIdx = Math.min(totalPages - 1, page + 1);
    } else {
      nextIdx = Math.max(0, page - 1);
    }
    setPage(nextIdx);
  }

  // Called when a page number is clicked
  const handlePageSet = (idx: number) => {
    if (idx < 0) {
      idx = 0;
    } else if (idx >= totalPages) {
      idx = totalPages - 1;
    }
    setPage(idx);
  }

  // Used to return the number of the pages
  // to display in the pagination footer. 
  function getPaginationNumbers(): number[] {
    if (page === totalPages - 1) {
      return [page];
    }

    // Otherwise show current and next page
    return [page, page + 1];
  }

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
          { filteredUploads.length === 0 ? <></> : filteredUploads
            .slice(baseIndex, Math.min(filteredUploads.length, baseIndex + pageSize))
            .map((upload, idx) => {
              return <UploadSquare key={idx} upload={upload} />
            }) }
        </div>
        {uploads.length === 0 ? <></> : <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="hover:cursor-pointer"
                onClick={() => handlePageShift(false)}
              />
            </PaginationItem>
            {page !== 0 ? <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem> : <></>}
            {getPaginationNumbers().map(idx => {
              return <PaginationItem
                key={idx}
                className="hover:cursor-pointer"
                onClick={() => handlePageSet(idx)}
              >
                <PaginationLink>{idx + 1}</PaginationLink>
              </PaginationItem>
            })}
            {page !== totalPages - 1 ? <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem> : <></>}
            <PaginationItem>
              <PaginationNext
                className="hover:cursor-pointer"
                onClick={() => handlePageShift(true)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>}
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
                  {"▪ Downloaded " + (upload.totalDownloads ?? 0) + " times"}
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