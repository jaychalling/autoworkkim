"use client";

import { useParams } from "next/navigation";
import { getChapter } from "@/lib/chapters";
import DocLayout from "@/components/learn/DocLayout";
import Chapter1 from "./chapters/Chapter1";
import Chapter2 from "./chapters/Chapter2";
import Chapter3 from "./chapters/Chapter3";
import Chapter4 from "./chapters/Chapter4";
import Chapter5 from "./chapters/Chapter5";
import Chapter6 from "./chapters/Chapter6";
import Chapter7 from "./chapters/Chapter7";
import Chapter8 from "./chapters/Chapter8";
import Link from "next/link";

const chapterComponents: Record<number, React.ComponentType> = {
  1: Chapter1,  // 에이전틱 AI란?
  2: Chapter2,  // 세팅
  3: Chapter8,  // Playwright 웹 자동화 (NEW)
  4: Chapter3,  // Gmail 자동화
  5: Chapter4,  // 엑셀 자동화
  6: Chapter5,  // PPT + 바이브코딩
  7: Chapter6,  // 마무리
  8: Chapter7,  // 텔레그램 연동
};

export default function ChapterPage() {
  const params = useParams();
  const stepId = parseInt(params.step as string);
  const chapter = getChapter(stepId);

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">챕터를 찾을 수 없습니다.</p>
        <Link href="/learn" className="text-primary hover:underline">
          학습 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const ChapterContent = chapterComponents[stepId];

  if (!ChapterContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">콘텐츠 준비 중입니다.</p>
        <Link href="/learn" className="text-primary hover:underline">
          학습 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <DocLayout chapter={chapter}>
      <ChapterContent />
    </DocLayout>
  );
}
