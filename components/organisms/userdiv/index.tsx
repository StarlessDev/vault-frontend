"use client"

import { useAuth } from "@/app/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleUserRound, EllipsisVertical, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function UserDiv() {
  const { state } = useSidebar();
  const { user, refresh, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // API url
  const BASE_API: string = process.env.NEXT_PUBLIC_API_URL as string;
  // The avatar url for the user is always the same
  // so we need to change the key property to make
  // React re-render the image.
  // Dirty workaround, but it works!
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number>(Date.now());
  // Username field in the profile editor
  const [username, setUsername] = useState<string>(user?.username || "");
  // Avatar file in the profile editor
  const [tempAvatar, setTempAvatar] = useState<File | undefined>(undefined);

  // Listen for user updates
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setLastAvatarUpdate(Date.now());
      setTempAvatar(undefined);
    }
  }, [user])

  // Logout logic
  const onLogout = () => {
    logout();
    router.push("/auth");
  }

  // Reset state values when
  // the profile popup opens
  const onProfileOpen = () => {
    setUsername(user?.username || "");
  }

  const getAvatarTempURL = () => {
    if (tempAvatar) {
      return URL.createObjectURL(tempAvatar);
    } else {
      return BASE_API + "account/avatar";
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setTempAvatar(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const updatePreferences = async () => {
    // Send username update
    if (user?.username !== username) {
      const response: Response = await fetch(BASE_API + "account/username", {
        method: "POST",
        body: JSON.stringify({ "username": username }),
        credentials: "include",
        mode: "cors"
      });
      if (!response.ok) {
        const body = await response.json();
        toast("Could not update profile!", {
          description: body["message"]
        })
      }
    }

    // Send avatar update
    if (tempAvatar) {
      const formData: FormData = new FormData();
      formData.append("image", tempAvatar, "avatar.png");
      await fetch(BASE_API + "account/avatar", {
        method: "POST",
        body: formData,
        credentials: "include",
        mode: "cors"
      })
    }

    // Refresh user data
    await refresh();
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={"flex items-center rounded-sm hover:cursor-pointer hover:bg-[var(--accent)] "
            + (state === "collapsed" ? "" : "p-2")
          }>
            <Avatar>
              <AvatarImage key={lastAvatarUpdate} src={BASE_API + "account/avatar"} />
              <AvatarFallback>{user?.username.slice(-1).toUpperCase()}</AvatarFallback>
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
          <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={onProfileOpen}>
              <CircleUserRound className="stroke-[var(--foreground)]" />
              Profile
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem variant="destructive" onClick={onLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Make any changes you want and then click save!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              defaultValue={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="avatar">Avatar</Label>
            <p className="text-muted-foreground text-sm">Click on the image below to upload another one!</p>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Avatar
              className="border size-24 hover:cursor-pointer"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={getAvatarTempURL()} alt="@shadcn" />
              <AvatarFallback>
                <Skeleton className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <DialogClose asChild>
          <Button
            className="hover:cursor-pointer"
            type="button"
            onClick={updatePreferences}>
            Save changes
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}