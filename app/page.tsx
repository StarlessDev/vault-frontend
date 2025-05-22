import FeatureSquare from "@/components/containers/feature";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="grid grid-cols-6 auto-cols-max grid-flow-col py-10">
      <main className="col-start-2 col-end-6 col-span-2 justify-items-center">
        {/* Hero container */}
        <div className="text-center tracking-tighter text-balance">
          {/* https://design2tailwind.com/blog/tailwindcss-gradient-text/ */}
          <h1 className="font-bold text-6xl p-4 mb-2 bg-gradient-to-r from-[var(--primary)] to-purple-400 inline-block text-transparent bg-clip-text">Protect Your Files with Military-Grade Encryption</h1>
          <p className="text-2xl text-gray-400">You deserve your right to privacy.
            <span className="text-[var(--primary)]"> Vault</span> encrypts your important data and hands you the key, no questions asked.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
          <Button className="rounded hover:cursor-pointer text-xl py-6 px-8 w-full md:w-auto">
            Get started
          </Button>
          <Button
            className="rounded hover:cursor-pointer text-xl py-6 px-8 w-full md:w-auto"
            variant="secondary"
            asChild
          >
            <Link href="#features">See how it works</Link>
          </Button>
        </div>

        <div className="text-center tracking-tighter mt-30">
          <h1 id="features" className="text-4xl font-bold">Features</h1>
          <p className="mt-2 text-2xl text-gray-400">
            Have an in-depth look at how Vault works:
          </p>
          <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mx-auto max-w-4xl">
            <FeatureSquare>
              <h3 className="text-2xl font-semibold mb-2">AES-256 Encryption</h3>
              <p className="text-gray-400">Your files are encrypted using a well-known and tested cipher.</p>
            </FeatureSquare>
            <FeatureSquare>
              <h3 className="text-2xl font-semibold mb-2">You own your Keys</h3>
              <p className="text-gray-400">Your link is the decryption key. Once lost even we cannot get it back!</p>
            </FeatureSquare>
            <FeatureSquare>
              <h3 className="text-2xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Optimized for speed without compromising security</p>
            </FeatureSquare>
            <FeatureSquare>
              <h3 className="text-2xl font-semibold mb-2">Simple to Use</h3>
              <p className="text-gray-400">Drag, drop, and share securely in seconds</p>
            </FeatureSquare>
          </div>
        </div>
      </main>
    </div>
  );
}