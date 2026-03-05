import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-6 px-6 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-caption text-xs">
          © 2026 ManagerKim. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs text-caption">
          <Link href="/learn" className="hover:text-heading transition">학습</Link>
          <Link href="/docs" className="hover:text-heading transition">가이드</Link>
          <Link href="/tools" className="hover:text-heading transition">도구</Link>
          <Link href="/setup" className="hover:text-heading transition">Easy클코</Link>
        </div>
      </div>
    </footer>
  );
}
