"use client"

import { formatFileSize } from "@/app/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartColumn, FolderKey, HardDriveUpload, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
      const response: Response = await fetch(BASE_URL + "stats", {
        credentials: "include"
      });

      if (response.ok) {
        const data: Stats = await response.json();
        setStats(data);
      } else {
        toast("Error", {
          description: "Could not fetch latest stats!"
        })
      }
    }

    fetchStatistics();
  }, []);

  if (!stats) {
    return <></>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-[var(--primary)] transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Files Served
            </CardTitle>
            <ChartColumn />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFilesServed}</div>
            <p className="text-xs text-muted-foreground">
              at the moment
            </p>
          </CardContent>
        </Card>
        <Card className="hover:border-[var(--primary)] transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Space Used
            </CardTitle>
            <Server />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalFileSize)}</div>
            <p className="text-xs text-muted-foreground">
              across every user
            </p>
          </CardContent>
        </Card>
        <Card className="hover:border-[var(--primary)] transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              You are using
            </CardTitle>
            <FolderKey />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.userUploadsSize)}</div>
            <p className="text-xs text-muted-foreground">
              { ((stats.userUploadsSize / stats.totalFileSize) * 100).toFixed(2) }% of the total
            </p>
          </CardContent>
        </Card>
        <Card className="hover:border-[var(--primary)] transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              You uploaded
            </CardTitle>
            <HardDriveUpload />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userUploadsNumber} File(s)</div>
            <p className="text-xs text-muted-foreground">
              { ((stats.userUploadsNumber / stats.totalFilesServed) * 100).toFixed(2) }% of the total number of files
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}