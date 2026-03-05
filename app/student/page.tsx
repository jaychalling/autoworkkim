"use client";

import { useState } from "react";
import { Download, Lock, Terminal, Wifi, Monitor, ArrowRight, Copy, Check } from "lucide-react";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

const PASSWORD = "2026";

function downloadBoth() {
  // First file
  const a1 = document.createElement("a");
  a1.href = "/downloads/setup-client.bat";
  a1.download = "setup-client.bat";
  a1.click();
  // Second file after short delay
  setTimeout(() => {
    const a2 = document.createElement("a");
    a2.href = "/downloads/setup-client.ps1";
    a2.download = "setup-client.ps1";
    a2.click();
  }, 500);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1 text-xs text-caption hover:text-heading transition cursor-pointer"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

/* ─── Password Gate ─── */
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <main className="min-h-screen bg-base flex items-center justify-center px-6">
      <NavBar />
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-subtle rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-heading" />
        </div>
        <h1 className="text-2xl font-extrabold text-heading tracking-heading mb-2">
          수강생 전용
        </h1>
        <p className="text-caption mb-8">
          워크샵 참가자만 접근할 수 있는 페이지예요
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoFocus
            className={`w-full px-4 py-3 rounded-md border text-center text-lg font-mono tracking-widest transition ${
              error
                ? "border-red-400 bg-red-50 animate-shake"
                : "border-border-default bg-white focus:border-accent focus:ring-1 focus:ring-accent"
            } outline-none`}
          />
          <button
            type="submit"
            className="mt-4 w-full bg-accent text-white py-3 rounded-md font-bold hover:bg-accent-dark transition cursor-pointer"
          >
            입장하기
          </button>
        </form>
      </div>
    </main>
  );
}

/* ─── Main Content ─── */
function StudentContent() {
  return (
    <main className="min-h-screen bg-base">
      <NavBar />

      {/* Hero */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-4">
            Workshop Tools
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-heading tracking-heading leading-tight mb-4">
            수강생 전용 도구
          </h1>
          <p className="text-lg text-body max-w-xl mx-auto">
            워크샵에서 사용하는 원격 설치 클라이언트입니다.
            <br />
            강사가 여러분의 PC에 필요한 프로그램을 원격으로 설치해드려요.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-subtle rounded-card p-8 mb-8">
            <h2 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
              <Wifi size={22} className="text-accent" />
              이게 뭔가요?
            </h2>
            <p className="text-body leading-relaxed mb-4">
              워크샵 진행 중 강사가 여러분의 PC에 <strong className="text-heading">원격으로 프로그램을 설치</strong>해드리는 도구예요.
              여러분은 이 프로그램만 실행하면 되고, 나머지는 강사가 알아서 진행합니다.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: Download, step: "01", title: "다운로드", desc: "아래 버튼으로 파일 받기" },
                { icon: Terminal, step: "02", title: "실행", desc: "PowerShell에서 한 줄 입력" },
                { icon: Monitor, step: "03", title: "대기", desc: "강사 지시 대기. 자동 설치됨" },
              ].map((item, i) => (
                <div key={i} className="text-center bg-white rounded-xl p-4">
                  <div className="w-10 h-10 bg-subtle rounded-lg flex items-center justify-center mx-auto mb-2">
                    <item.icon size={20} className="text-heading" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-caption">{item.step}</p>
                  <p className="font-bold text-heading text-sm">{item.title}</p>
                  <p className="text-xs text-caption">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Download */}
          <div className="bg-white rounded-card border-2 border-accent p-8 mb-8">
            <h2 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
              <Download size={22} className="text-accent" />
              다운로드
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={downloadBoth}
                className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-md text-lg font-bold hover:bg-accent-dark transition cursor-pointer"
              >
                <Download size={20} />
                다운로드 (2개 파일)
              </button>
              <span className="text-sm text-caption">Windows 전용 &middot; .bat과 .ps1 자동 다운로드</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-card border border-border-subtle p-8 mb-8">
            <h2 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
              <Terminal size={22} className="text-accent" />
              실행 방법
            </h2>

            <ol className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">1</span>
                <div className="flex-1">
                  <p className="font-semibold text-heading mb-2">다운로드된 파일 2개가 같은 폴더에 있는지 확인</p>
                  <p className="text-sm text-body">
                    <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">setup-client.bat</code>과
                    <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">setup-client.ps1</code>이
                    같은 폴더(보통 Downloads)에 있으면 됩니다.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">2</span>
                <div className="flex-1">
                  <p className="font-semibold text-heading mb-2">setup-client.bat을 더블클릭</p>
                  <p className="text-sm text-body mb-2">
                    파란 보안 경고가 뜨면 <strong>&ldquo;추가 정보&rdquo;</strong> &rarr; <strong>&ldquo;실행&rdquo;</strong>을 클릭하세요.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">3</span>
                <div className="flex-1">
                  <p className="font-semibold text-heading mb-2">이름을 입력하고 Enter</p>
                  <p className="text-sm text-body mb-2">
                    강사가 여러분을 구분할 이름을 입력하세요 (예: 김철수)
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">4</span>
                <div className="flex-1">
                  <p className="font-semibold text-heading mb-2">&ldquo;Waiting...&rdquo;이 나오면 완료</p>
                  <div className="bg-[#1a1f36] rounded-lg p-4 font-mono text-sm text-gray-300">
                    <pre className="whitespace-pre">{`---------------------------------------------
  managerkim-setup v1.0 (PowerShell)
  server: 38.45.67.130:1664/ws
  session: 김철수
  status: Waiting...
---------------------------------------------
  Ctrl+C to quit`}</pre>
                  </div>
                  <p className="text-xs text-caption mt-2">
                    이 화면이 나오면 강사의 지시를 기다리세요. 창을 닫지 마세요.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="bg-subtle rounded-card p-8">
            <h2 className="text-lg font-bold text-heading mb-4">문제가 생겼나요?</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-heading text-sm">실행 정책 오류가 나요</p>
                <p className="text-sm text-caption">
                  명령어 앞에 <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono">powershell -ExecutionPolicy Bypass -File</code>을 붙여서 실행하세요. 위 명령어를 그대로 복사하면 됩니다.
                </p>
              </div>
              <div>
                <p className="font-semibold text-heading text-sm">연결이 안 돼요</p>
                <p className="text-sm text-caption">
                  와이파이 연결을 확인하세요. 회사 VPN이 켜져 있으면 꺼보세요. 그래도 안 되면 강사에게 알려주세요.
                </p>
              </div>
              <div>
                <p className="font-semibold text-heading text-sm">빨간 글씨가 나와요</p>
                <p className="text-sm text-caption">
                  &quot;3초 후 재연결&quot; 메시지는 정상이에요. 자동으로 다시 연결을 시도합니다. 계속 반복되면 강사에게 알려주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ─── Page ─── */
export default function StudentPage() {
  const [unlocked, setUnlocked] = useState(false);

  return unlocked ? (
    <StudentContent />
  ) : (
    <PasswordGate onUnlock={() => setUnlocked(true)} />
  );
}
