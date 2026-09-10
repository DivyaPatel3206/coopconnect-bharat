"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/programmes", label: "Programmes" },
  { href: "/courses", label: "Learning" },
  { href: "/jobs", label: "Jobs" },
  { href: "/certificates/verify", label: "Verify Certificate" },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-black/10 bg-coop-paper/90 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-indigo tracking-tight">
          CoopConnect <span className="text-coop-saffron">Bharat</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-coop-slate">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-indigo transition-colors focus-ring">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-indigo hover:underline focus-ring"
              >
                {user.name.split(" ")[0]}'s dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-md border border-black/15 text-coop-slate hover:bg-black/5 focus-ring"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-indigo hover:underline focus-ring">
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 rounded-md bg-indigo text-white hover:bg-indigo-dark transition-colors focus-ring"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
