"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { chapters } from "@/lib/chapters";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import SectionBadge from "@/components/ui/SectionBadge";

export default function LearnPage() {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("progress-guide");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const percent = Math.round((completed.length / chapters.length) * 100);

  return (
    <main className="min-h-screen bg-base">
      <NavBar />

      {/* Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionBadge>Step-by-Step Guide</SectionBadge>

          <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mt-4 mb-2">
            Step by Step, AI 시대가 원하는 인재로
          </h1>
          <p className="text-body text-lg">
            모든 Step을 따라가면 AI 시대에 딱 맞는 인재가 될 수 있어요.
            코딩 경험 없이, 하나씩 따라오세요.
          </p>

          {/* Overall progress */}
          {completed.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-caption mb-2">
                <span>전체 진행률</span>
                <span>
                  {completed.length}/{chapters.length} Steps 완료
                </span>
              </div>
              <div className="h-2 bg-border-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chapter List */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {chapters.map((ch) => {
              const isComplete = completed.includes(ch.id);

              return (
                <Link
                  key={ch.id}
                  href={`/learn/basics/${ch.id}`}
                  className="flex items-center gap-5 p-5 rounded-card bg-elevated border border-border-subtle hover:shadow-md transition group"
                >
                  {/* Number / Check */}
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <div className="w-12 h-10 rounded-md bg-accent-light flex items-center justify-center">
                        <CheckCircle2 size={22} className="text-accent" />
                      </div>
                    ) : (
                      <div className="w-12 h-10 rounded-md bg-subtle flex items-center justify-center transition">
                        <span className="text-xs font-bold text-caption group-hover:text-heading transition">
                          Step {ch.id}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-heading group-hover:text-accent transition">
                      {ch.emoji} {ch.title}
                    </h2>
                    <p className="text-sm text-caption mt-0.5">
                      {ch.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={20}
                    className="text-border-default group-hover:text-heading transition flex-shrink-0"
                  />
                </Link>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center">
            <p className="text-caption text-sm">
              새로운 Step이 계속 추가될 예정이에요
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
