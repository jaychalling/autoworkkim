"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { chapters, type Chapter } from "@/lib/chapters";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  CheckCircle2,
} from "lucide-react";

export default function DocLayout({
  chapter,
  children,
}: {
  chapter: Chapter;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const prev = chapters.find((c) => c.id === chapter.id - 1);
  const next = chapters.find((c) => c.id === chapter.id + 1);

  useEffect(() => {
    const saved = localStorage.getItem("progress-guide");
    if (saved) setCompletedChapters(JSON.parse(saved));
  }, []);

  const markComplete = useCallback(() => {
    setCompletedChapters((prev) => {
      if (prev.includes(chapter.id)) return prev;
      const updated = [...prev, chapter.id];
      localStorage.setItem("progress-guide", JSON.stringify(updated));
      return updated;
    });
  }, [chapter.id]);

  // Intersection observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Mark complete when scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY + window.innerHeight;
      if (scrollTop >= scrollHeight - 200) {
        markComplete();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [markComplete]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-base">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-elevated/95 backdrop-blur-md border-b border-border-subtle z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-caption hover:text-heading cursor-pointer"
            aria-label="메뉴 열기"
          >
            <Menu size={22} />
          </button>
          <span className="text-sm font-medium text-heading truncate mx-4">
            {chapter.emoji} {chapter.title}
          </span>
          <Link href="/learn" className="p-2 -mr-2 text-caption hover:text-primary">
            <Home size={20} />
          </Link>
        </div>
      </header>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-elevated border-r border-border-subtle z-50 overflow-y-auto transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <Link
              href="/learn"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
            >
              <Home size={14} />
              학습 가이드
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-caption hover:text-heading cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="p-3">
          {/* Chapter list */}
          {chapters.map((ch) => {
            const isCurrent = ch.id === chapter.id;
            const isComplete = completedChapters.includes(ch.id);

            return (
              <div key={ch.id} className="mb-1">
                <Link
                  href={`/learn/basics/${ch.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
                    isCurrent
                      ? "bg-primary-lighter text-primary font-semibold"
                      : "text-caption hover:bg-subtle hover:text-heading"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {isComplete ? (
                    <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                  ) : (
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        isCurrent
                          ? "border-primary bg-primary/20"
                          : "border-border-default"
                      }`}
                    />
                  )}
                  <span className="truncate">
                    {ch.id}. {ch.title}
                  </span>
                </Link>

                {/* Section TOC for current chapter */}
                {isCurrent && (
                  <div className="ml-9 mt-1 mb-2 border-l-2 border-border-subtle">
                    {ch.sections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className={`block w-full text-left px-3 py-1.5 text-xs transition cursor-pointer ${
                          activeSection === s.id
                            ? "text-primary font-medium border-l-2 -ml-[2px] border-primary"
                            : "text-caption hover:text-body"
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72">
        <div className="max-w-3xl mx-auto px-5 md:px-8 pt-20 lg:pt-12 pb-32">
          {/* Chapter header */}
          <div className="mb-10">
            <p className="text-sm font-medium text-primary mb-2">
              Step {chapter.id} / {chapters.length}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mb-2">
              {chapter.emoji} {chapter.title}
            </h1>
            <p className="text-lg text-caption">{chapter.description}</p>
          </div>

          {/* Chapter content */}
          <article className="prose-custom">{children}</article>

          {/* Prev / Next navigation */}
          <div className="mt-16 pt-8 border-t border-border-subtle flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/learn/basics/${prev.id}`}
                className="flex items-center gap-2 px-5 py-3 rounded-card-sm border border-border-subtle text-caption hover:border-primary-light hover:text-primary transition group"
              >
                <ChevronLeft
                  size={18}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
                <div className="text-left">
                  <p className="text-xs text-caption">이전</p>
                  <p className="text-sm font-medium">{prev.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/learn/basics/${next.id}`}
                className="flex items-center gap-2 px-5 py-3 rounded-card-sm border border-border-subtle text-caption hover:border-primary-light hover:text-primary transition group text-right"
              >
                <div>
                  <p className="text-xs text-caption">다음</p>
                  <p className="text-sm font-medium">{next.title}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
