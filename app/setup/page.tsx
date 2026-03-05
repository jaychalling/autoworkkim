"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  ArrowRight,
  Check,
  GitBranch,
  Terminal,
  Box,
  FolderOpen,
  ShieldCheck,
  Clock,
  Sparkles,
  Monitor,
  Apple,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import SectionBadge from "@/components/ui/SectionBadge";

/* ─── Fade-in observer hook ─── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`fade-in-section ${className}`}>
      {children}
    </div>
  );
}

/* ─── OS Detection ─── */
function useDetectedOS(): "windows" | "mac" | null {
  const [os, setOs] = useState<"windows" | "mac" | null>(null);
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("mac")) setOs("mac");
    else setOs("windows");
  }, []);
  return os;
}

/* ─── Install Items ─── */
const installItems = [
  {
    icon: GitBranch,
    name: "Git",
    desc: "Claude Code 필수 의존성. 버전 관리 도구",
  },
  {
    icon: Terminal,
    name: "Claude Code",
    desc: "Anthropic AI 코딩 에이전트. 네이티브 설치",
  },
  {
    icon: Box,
    name: "Node.js",
    desc: "JavaScript 런타임. 자동화 스크립트 실행 환경",
  },
  {
    icon: Monitor,
    name: "WezTerm",
    desc: "모던 터미널. Claude Code 최적 환경 (Windows)",
    note: "Windows 전용",
  },
  {
    icon: FolderOpen,
    name: "Workshop 폴더",
    desc: "~/workshop 실습 디렉토리 자동 생성",
  },
  {
    icon: ShieldCheck,
    name: "환경 검증",
    desc: "설치 완료 후 모든 도구 정상 작동 자동 확인",
  },
];

/* ─── FAQ Data ─── */
const faqItems = [
  {
    question: "관리자 권한이 필요한가요?",
    answer:
      "Windows에서는 관리자 권한을 권장합니다. 일부 프로그램(Git, WezTerm) 설치 시 필요할 수 있습니다. Mac에서는 일반 권한으로 충분합니다.",
  },
  {
    question: "이미 설치된 프로그램이 있으면 어떻게 되나요?",
    answer:
      "이미 설치된 프로그램은 자동으로 감지하고 건너뜁니다. 기존 환경을 덮어쓰지 않으니 안심하세요.",
  },
  {
    question: "설치에 얼마나 걸리나요?",
    answer:
      "인터넷 속도에 따라 다르지만, 보통 5~10분이면 모든 설치가 완료됩니다.",
  },
  {
    question: "설치 중 오류가 나면 어떻게 하나요?",
    answer:
      "바탕화면에 생성되는 workshop-install-log.txt 파일에 상세 로그가 기록됩니다. 이 파일을 강사에게 보내주시면 바로 도움드립니다.",
  },
  {
    question: "다시 실행해도 괜찮나요?",
    answer:
      "네, 몇 번이든 다시 실행할 수 있습니다. 이미 설치된 항목은 건너뛰고, 빠진 것만 설치합니다.",
  },
  {
    question: "테스트 모드가 있나요?",
    answer:
      "네, --test 플래그를 붙이면 실제 설치 없이 현재 환경만 감지합니다. 미리 확인하고 싶을 때 유용합니다.",
  },
];

/* ─── FAQ Accordion ─── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
      >
        <span className="font-semibold text-heading pr-4">{question}</span>
        {open ? (
          <ChevronUp size={20} className="text-caption flex-shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-caption flex-shrink-0" />
        )}
      </button>
      {open && (
        <p className="pb-5 text-body leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function SetupPage() {
  const detectedOS = useDetectedOS();

  const downloadUrl =
    detectedOS === "mac"
      ? "/downloads/install-mac.sh"
      : "/downloads/install-windows.ps1";

  const downloadLabel =
    detectedOS === "mac" ? "Mac용 다운로드" : "Windows용 다운로드";

  const altUrl =
    detectedOS === "mac"
      ? "/downloads/install-windows.ps1"
      : "/downloads/install-mac.sh";

  const altLabel =
    detectedOS === "mac" ? "Windows용 다운로드" : "Mac용 다운로드";

  return (
    <main className="min-h-screen bg-base">
      <NavBar />

      {/* ═══ Hero ═══ */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionBadge>Easy Setup</SectionBadge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-heading tracking-heading leading-tight mt-6 mb-6">
            클릭 한 번으로
            <br />
            <span className="text-accent">Claude Code</span> 설치
          </h1>
          <p className="text-lg md:text-xl text-body leading-relaxed mb-10 max-w-xl mx-auto">
            Git, Node.js, Claude Code, 터미널까지
            <br />
            필요한 모든 도구를 <strong className="text-heading">자동으로 설치</strong>합니다
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-3 bg-accent text-white px-10 py-5 rounded-md text-lg font-bold hover:bg-accent-dark transition"
            >
              <Download size={22} />
              {downloadLabel}
            </a>
            <a
              href={altUrl}
              download
              className="inline-flex items-center gap-2 border border-border-default text-caption px-6 py-4 rounded-md text-sm font-medium hover:border-heading hover:text-heading transition"
            >
              {altLabel}
            </a>
          </div>

          <p className="mt-6 text-sm text-caption">
            {detectedOS === "mac" ? (
              <>
                <Apple size={14} className="inline -mt-0.5 mr-1" />
                macOS가 감지되었습니다
              </>
            ) : (
              <>
                <Monitor size={14} className="inline -mt-0.5 mr-1" />
                Windows가 감지되었습니다
              </>
            )}
          </p>
        </div>
      </section>

      {/* ═══ What Gets Installed ═══ */}
      <section className="py-20 px-6 bg-subtle">
        <FadeSection>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionBadge>설치 항목</SectionBadge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mt-4 mb-2">
                이 모든 걸 자동으로 설치합니다
              </h2>
              <p className="text-caption">
                하나하나 찾아서 설치할 필요 없습니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {installItems.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-white p-6 rounded-card"
                >
                  <div className="w-12 h-12 bg-subtle rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon size={24} className="text-heading" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-heading">
                        {item.name}
                      </h3>
                      {item.note && (
                        <span className="text-[10px] font-medium text-caption bg-subtle px-2 py-0.5 rounded">
                          {item.note}
                        </span>
                      )}
                    </div>
                    <p className="text-caption text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ═══ Before / After ═══ */}
      <section className="py-20 px-6">
        <FadeSection>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionBadge>비교</SectionBadge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mt-4">
                왜 Easy클코인가?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="bg-subtle rounded-card p-8">
                <h3 className="text-lg font-bold text-caption mb-6">직접 설치하면</h3>
                <ul className="space-y-4">
                  {[
                    "Git 공식 사이트 찾아서 다운로드",
                    "Node.js 버전 뭘 받아야 하지?",
                    "Claude Code 설치 명령어가...",
                    "PATH 환경변수 설정 오류",
                    "터미널은 뭘 써야 하나",
                    "설치 후 제대로 된 건지 확인 불가",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <AlertCircle
                        size={16}
                        className="text-red-400 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-caption">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className="bg-white rounded-card p-8 border-2 border-accent">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-bold text-heading">Easy클코 쓰면</h3>
                  <span className="text-[10px] font-bold text-white bg-accent px-2 py-0.5 rounded">
                    추천
                  </span>
                </div>
                <ul className="space-y-4">
                  {[
                    "다운로드 → 실행, 끝",
                    "필요한 도구 7가지 자동 설치",
                    "이미 있는 프로그램은 자동 건너뜀",
                    "환경변수, 경로 설정 자동 처리",
                    "최적의 터미널 자동 설치",
                    "설치 완료 후 자동 검증 리포트",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check
                        size={16}
                        className="text-accent flex-shrink-0 mt-0.5"
                      />
                      <span className="text-body">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="py-20 px-6 bg-subtle">
        <FadeSection>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <SectionBadge>사용 방법</SectionBadge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mt-4">
                3단계면 끝납니다
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Download size={32} />,
                  step: "01",
                  title: "다운로드",
                  desc: "위 버튼을 눌러 내 OS에 맞는 설치 파일을 받습니다",
                },
                {
                  icon: <Sparkles size={32} />,
                  step: "02",
                  title: "실행",
                  desc: "다운로드된 파일을 실행하면 자동으로 모든 설치가 진행됩니다",
                },
                {
                  icon: <Check size={32} />,
                  step: "03",
                  title: "완료",
                  desc: "설치 결과 리포트를 확인하고 바로 학습을 시작하세요",
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-heading">
                    {item.icon}
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-caption mb-2">
                    {item.step}
                  </p>
                  <h3 className="text-2xl font-bold text-heading mb-2">
                    {item.title}
                  </h3>
                  <p className="text-caption">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ═══ OS별 실행 안내 ═══ */}
      <section className="py-20 px-6">
        <FadeSection>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionBadge>실행 가이드</SectionBadge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mt-4 mb-2">
                다운로드 후 이렇게 실행하세요
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Windows */}
              <div className="bg-white rounded-card p-8 border border-border-subtle">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-subtle rounded-lg flex items-center justify-center">
                    <Monitor size={20} className="text-heading" />
                  </div>
                  <h3 className="text-xl font-bold text-heading">Windows</h3>
                </div>
                <ol className="space-y-4">
                  {[
                    "다운로드된 install-windows.ps1 파일을 찾습니다",
                    "파일을 마우스 오른쪽 클릭합니다",
                    "\"PowerShell에서 실행\"을 선택합니다",
                    "설치가 자동으로 진행됩니다",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-body mt-0.5">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Mac */}
              <div className="bg-white rounded-card p-8 border border-border-subtle">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-subtle rounded-lg flex items-center justify-center">
                    <Apple size={20} className="text-heading" />
                  </div>
                  <h3 className="text-xl font-bold text-heading">Mac</h3>
                </div>
                <ol className="space-y-4">
                  {[
                    "다운로드된 install-mac.sh 파일을 찾습니다",
                    "터미널(Terminal) 앱을 엽니다",
                    "bash ~/Downloads/install-mac.sh 를 입력합니다",
                    "설치가 자동으로 진행됩니다",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-body mt-0.5">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ═══ Features ═══ */}
      <section className="py-20 px-6 bg-subtle">
        <FadeSection>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionBadge>특징</SectionBadge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mt-4">
                안심하고 사용하세요
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "안전한 설치",
                  desc: "공식 소스에서만 다운로드. 기존 환경을 건드리지 않습니다",
                },
                {
                  icon: RefreshCw,
                  title: "재실행 가능",
                  desc: "몇 번이든 다시 실행 가능. 설치된 항목은 자동 건너뜀",
                },
                {
                  icon: Clock,
                  title: "5~10분 완료",
                  desc: "인터넷 연결만 되면 빠르게 모든 설치가 끝납니다",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-card p-6 text-center">
                  <div className="w-14 h-14 bg-subtle rounded-lg flex items-center justify-center mx-auto mb-4">
                    <item.icon size={28} className="text-heading" />
                  </div>
                  <h3 className="font-bold text-heading mb-2">{item.title}</h3>
                  <p className="text-sm text-caption">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 px-6">
        <FadeSection>
          <div className="max-w-3xl mx-auto">
            <SectionBadge>FAQ</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mt-4 mb-10">
              자주 묻는 질문
            </h2>
            <div>
              {faqItems.map((item, i) => (
                <FaqItem key={i} {...item} />
              ))}
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ═══ Final CTA ═══ */}
      <section className="py-24 px-6 bg-subtle">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-heading tracking-heading mb-4">
            준비 완료까지 클릭 한 번
          </h2>
          <p className="text-lg text-caption mb-10">
            Easy클코로 환경 설정을 끝내고, 바로 학습을 시작하세요
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-3 bg-accent text-white px-10 py-5 rounded-md text-lg font-bold hover:bg-accent-dark transition"
            >
              <Download size={22} />
              {downloadLabel}
            </a>
            <Link
              href="/learn/basics/1"
              className="inline-flex items-center gap-2 border border-heading text-heading px-8 py-4 rounded-md text-lg font-medium hover:bg-heading hover:text-white transition"
            >
              학습 시작하기
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
