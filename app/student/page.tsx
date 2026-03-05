"use client";

import { useState } from "react";
import { Download, Lock, Terminal, Wifi, Monitor, ArrowRight, Copy, Check, MousePointer } from "lucide-react";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

const PASSWORD = "2026";
const EASYCC_URL = "/download/easycc";

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
              워크샵 진행 중 김과장님이 여러분의 PC에 <strong className="text-heading">원격으로 프로그램을 설치</strong>해드리는 도구예요.
              여러분은 이 프로그램만 실행하면 되고, 나머지는 김과장님이 알아서 진행합니다.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { icon: Download, step: "01", title: "다운로드", desc: "아래 버튼으로 EasyCC 받기" },
                { icon: MousePointer, step: "02", title: "실행", desc: "EasyCC.exe 더블클릭" },
                { icon: Monitor, step: "03", title: "연결", desc: "이름 입력 → 연결. 자동 설치됨" },
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

          {/* EasyCC Download */}
          <div className="bg-white rounded-card border-2 border-accent p-8 mb-8">
            <h2 className="text-xl font-bold text-heading mb-2 flex items-center gap-2">
              <Download size={22} className="text-accent" />
              EasyCC 다운로드
            </h2>
            <p className="text-sm text-caption mb-6">김과장님이 원격으로 도와주는 귀여운 도우미 프로그램</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <a
                href={EASYCC_URL}
                className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-md text-lg font-bold hover:bg-accent-dark transition"
              >
                <Download size={20} />
                EasyCC 다운로드
              </a>
              <span className="text-sm text-caption">Windows 전용 &middot; 실행 파일 (약 72MB)</span>
            </div>
          </div>

          {/* EasyCC Instructions */}
          <div className="bg-white rounded-card border border-border-subtle p-8 mb-8">
            <h2 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
              <Terminal size={22} className="text-accent" />
              실행 방법
            </h2>

            <ol className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">1</span>
                <div className="flex-1">
                  <p className="font-semibold text-heading mb-2">다운로드된 EasyCC.exe 더블클릭</p>
                  <p className="text-sm text-body mb-2">
                    파란 보안 경고가 뜨면 <strong>&ldquo;추가 정보&rdquo;</strong> &rarr; <strong>&ldquo;실행&rdquo;</strong>을 클릭하세요.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">2</span>
                <div className="flex-1">
                  <p className="font-semibold text-heading mb-2">이름 입력 후 &ldquo;연결&rdquo; 클릭</p>
                  <p className="text-sm text-body mb-2">
                    김과장님이 여러분을 구분할 이름을 입력하세요 (예: 김철수).
                    연결되면 화면에 <strong className="text-green-600">&ldquo;연결 완료!&rdquo;</strong>가 표시됩니다.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="w-7 h-7 bg-accent text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">3</span>
                <div className="flex-1">
                  <p className="font-semibold text-heading mb-2">창을 닫지 마세요!</p>
                  <p className="text-sm text-body">
                    EasyCC 창이 열려 있어야 김과장님이 원격으로 설정을 도와줄 수 있어요.
                    진행 상황이 로그에 표시됩니다.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Legacy PS client (collapsed) */}
          <details className="bg-subtle rounded-card p-6 mb-8">
            <summary className="font-bold text-heading cursor-pointer flex items-center gap-2">
              <Terminal size={18} className="text-caption" />
              PowerShell 클라이언트 (대안)
            </summary>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-caption">
                EasyCC가 실행되지 않을 때 사용하는 대안입니다. 아래 파일 2개를 다운로드하고 .bat 파일을 더블클릭하세요.
              </p>
              <button
                onClick={downloadBoth}
                className="inline-flex items-center gap-2 bg-white border border-border-default text-heading px-4 py-2 rounded-md text-sm font-semibold hover:bg-subtle transition cursor-pointer"
              >
                <Download size={16} />
                PS 클라이언트 다운로드 (2개 파일)
              </button>
            </div>
          </details>

          {/* Troubleshooting */}
          <div className="bg-subtle rounded-card p-8">
            <h2 className="text-lg font-bold text-heading mb-4">문제가 생겼나요?</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-heading text-sm">보안 경고가 뜨면서 실행이 안 돼요</p>
                <p className="text-sm text-caption">
                  &ldquo;Windows의 PC 보호&rdquo; 창에서 <strong>&ldquo;추가 정보&rdquo;</strong>를 클릭하면 &ldquo;실행&rdquo; 버튼이 나타납니다.
                </p>
              </div>
              <div>
                <p className="font-semibold text-heading text-sm">연결이 안 돼요</p>
                <p className="text-sm text-caption">
                  와이파이 연결을 확인하세요. 회사 VPN이 켜져 있으면 꺼보세요. 그래도 안 되면 김과장님에게 알려주세요.
                </p>
              </div>
              <div>
                <p className="font-semibold text-heading text-sm">&ldquo;연결이 끊어졌어요&rdquo;가 반복돼요</p>
                <p className="text-sm text-caption">
                  자동으로 다시 연결을 시도합니다. 계속 반복되면 김과장님에게 알려주세요.
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
