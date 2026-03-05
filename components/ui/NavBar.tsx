"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/learn", label: "무료 학습" },
  { href: "/docs", label: "가이드" },
  { href: "/tools", label: "도구" },
  { href: "/setup", label: "Easy클코" },
  { href: "/student", label: "수강생" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-border-subtle z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-heading flex-shrink-0">
          김과장
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition whitespace-nowrap tracking-wide ${
                  isActive
                    ? "text-heading"
                    : "text-caption hover:text-heading"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
