"use client"

import { useAuth } from "@/app/context/AuthContext";
import Loader from "@/components/organisms/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton";
import { CircleUserRound, EllipsisVertical, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserDiv() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <Loader/>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center p-2 rounded-sm hover:cursor-pointer hover:bg-[var(--accent)]">
          <Avatar>
            <AvatarImage src={process.env.NEXT_PUBLIC_API_URL as string + "account/pfp"} alt="@shadcn" />
            <AvatarFallback>
              <Skeleton className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <p className="font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted-foregorund truncate">{user?.email}</p>
          </div>
          <div className="flex justify-end h-5 w-5">
            <EllipsisVertical />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CircleUserRound className="stroke-[var(--foreground)]"/>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => logout() }>
          <LogOut className="stroke-[var(--foreground)]"/>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>  
    </DropdownMenu>
  );
}