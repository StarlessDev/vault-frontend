"use client"

import { useAuth } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVertical } from "lucide-react";

export default function UserDiv() {
  const { user } = useAuth();

  return (
    <div className="flex items-center p-2 rounded-sm hover:cursor-pointer hover:bg-[var(--accent)]">
      <Avatar>
        <AvatarImage src={process.env.NEXT_PUBLIC_API_URL as string + "account/pfp"} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1">
        <p className="font-medium truncate">{user?.username}</p>
        <p className="text-xs text-muted-foregorund truncate">{user?.email}</p>
      </div>
      <div className="flex justify-end h-5 w-5">
        <EllipsisVertical />
      </div>
    </div>
  );
}