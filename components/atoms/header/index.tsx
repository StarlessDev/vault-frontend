import Link from "next/link";
import HeaderLink from "../headerlink";

export default function Header() {
  return (
    <div className="flex fixed w-full pt-2 pb-2 px-5 bg-[var(--background)]">
      {/* Logo */}
      <div className="w-1/3">
        <Link
          className="text-2xl font-bold text-[var(--primary)] tracking-tighter"
          href="/"
        >
          VAULT
        </Link>
      </div>

      {/* Links */}
      <div className="w-1/3 flex justify-evenly items-center">
        <HeaderLink
          href="/"
          label="Home"
        />
        <HeaderLink
          href="https://starless.dev"
          label="Meet the team"
        />
      </div>

      {/* Perfetcly balanced, as all things should be*/}
      <div className="w-1/3" />
    </div>
  );
}