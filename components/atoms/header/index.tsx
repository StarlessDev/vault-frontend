import Link from "next/link";

export default function Header() {
  return (
    <div className="flex fixed w-full pt-2 pb-2 px-5 bg-[var(--background)]">
      <Link
          className="text-3xl font-bold text-[var(--primary)] tracking-tighter"
          href="/"
        >
          VAULT
        </Link>
    </div>
  );
}