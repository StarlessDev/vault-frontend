import Link from "next/link";
import { cn } from "@/lib/utils"

export default function Header({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex fixed w-full pt-2 pb-2 px-5 bg-[var(--background)]", className)}
      {...props}
    >
      <Link
        className="text-3xl font-bold text-[var(--primary)] tracking-tighter"
        href="/"
      >
        VAULT
      </Link>
    </div>
  );
}