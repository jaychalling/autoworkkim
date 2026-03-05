"use client";

import Callout from "@/components/learn/Callout";
import CodeBlock from "@/components/learn/CodeBlock";
import CompareTable from "@/components/learn/CompareTable";

export default function Chapter7() {
  return (
    <>
      {/* ── 사전 준비 ── */}
      <section id="install-overview">
        <h2 className="text-2xl font-bold text-heading mb-4">
          사전 준비 &mdash; 이미 다 있습니다
        </h2>
        <p className="text-body leading-relaxed mb-4">
          밖에서도 AI를 쓰고 싶지 않나요? 출근길 지하철에서, 카페에서, 자기 전에&mdash;스마트폰 하나로
          집 PC의 Claude Code를 원격 조종할 수 있습니다. 해결책은 <strong>텔레그램 봇 연동</strong>이에요.
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="bg-subtle rounded-xl p-5">
            <p className="font-bold text-heading mb-3">✅ 이미 설치 완료</p>
            <ul className="text-body space-y-2 text-sm">
              <li>✅ Windows PC</li>
              <li>✅ Claude Code (CLI)</li>
              <li>✅ Claude Pro 구독 &amp; 로그인</li>
            </ul>
          </div>
          <div className="bg-accent-light border border-accent/30 rounded-xl p-5">
            <p className="font-bold text-heading mb-3">📋 오늘 할 것</p>
            <ul className="text-body space-y-2 text-sm">
              <li>1️⃣ 텔레그램 봇 토큰 발급</li>
              <li>2️⃣ 코깍딜 다운로드</li>
              <li>3️⃣ 봇 서버 실행 &rarr; 끝!</li>
            </ul>
          </div>
        </div>

        <Callout type="info" title="왜 텔레그램?">
          <p>
            카카오톡이나 LINE과 달리, 텔레그램은 <strong>무료 봇 API</strong>를 공식 제공합니다.
            봇을 만들고 연동하는 데 별도 비용이나 사업자 등록이 필요 없어요.
          </p>
        </Callout>
      </section>

      {/* ── STEP 1: 봇 토큰 ── */}
      <section id="step1-token" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          STEP 1: 텔레그램 봇 토큰 발급
        </h2>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-6">
          📁 작업 폴더 만들기
        </h3>
        <p className="text-body leading-relaxed mb-4">
          먼저 코깍딜 파일과 AI 대화 기록이 저장될 폴더를 하나 만드세요.
        </p>
        <div className="grid gap-3 my-6">
          {[
            { step: "1", text: "파일 탐색기에서 원하는 위치에 폴더 만들기 (예: my-ai-bot)" },
            { step: "2", text: "폴더 안에서 주소창 클릭 → powershell 입력 → Enter" },
            { step: "3", text: "열린 PowerShell에서 claude 입력 → Claude Code 시작!" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-subtle rounded-xl px-4 py-3"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </span>
              <span className="text-body">{item.text}</span>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-heading mb-3">
          📱 텔레그램 설치
        </h3>
        <ol className="list-decimal pl-5 text-body space-y-2 mb-6">
          <li>스마트폰 앱스토어에서 &quot;Telegram&quot; 설치</li>
          <li>PC: telegram.org &rarr; 데스크탑 앱 설치</li>
          <li>전화번호로 가입</li>
        </ol>

        <h3 className="text-lg font-semibold text-heading mb-3">
          🤖 봇 토큰 발급
        </h3>
        <ol className="list-decimal pl-5 text-body space-y-2 mb-6">
          <li><strong>@BotFather</strong> 검색 &rarr; START BOT</li>
          <li><code>/newbot</code> 입력</li>
          <li>봇 이름 설정 (예: 내 AI 비서)</li>
          <li>유저네임 설정 (예: myai_helper_bot) &mdash; 반드시 <code>_bot</code>으로 끝나야 함</li>
          <li>발급된 토큰을 복사해두기!</li>
        </ol>

        <Callout type="warning" title="토큰은 비밀번호입니다">
          <p>
            봇 토큰은 <code>7123456789:AAH...</code> 형식의 긴 문자열입니다.
            이 토큰을 가진 사람은 봇을 제어할 수 있으니, 절대 공개하지 마세요.
          </p>
        </Callout>
      </section>

      {/* ── STEP 2: 다운로드 ── */}
      <section id="step2-download" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          STEP 2: 코깍딜 다운로드
        </h2>
        <p className="text-body leading-relaxed mb-4">
          Claude Code에게 시키면 끝입니다. STEP 1에서 열어둔 Claude Code에
          아래 내용을 입력하세요.
        </p>

        <CodeBlock title="Claude Code에 입력">{`cokacdir를 다운로드 해줘.
https://github.com/kstost/cokacdir 여기가 공식 저장소야.
현재 폴더에 저장하고,
현재 이 경로에서 새 PowerShell 창도 열어줘.`}</CodeBlock>

        <p className="text-body leading-relaxed mt-4">
          Claude Code가 승인을 요청하면 <strong>Y</strong>만 눌러주세요.
          다운로드 + 새 PowerShell 창 열기까지 자동으로 완료됩니다.
        </p>
      </section>

      {/* ── STEP 3: 실행 ── */}
      <section id="step3-run" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          STEP 3: 봇 서버 실행
        </h2>
        <p className="text-body leading-relaxed mb-4">
          이것만 직접 실행합니다. Claude Code가 열어준 <strong>새 PowerShell 창</strong>에서 아래 명령을 입력하세요.
        </p>

        <CodeBlock title="PowerShell">{`.\\cokacdir.exe --ccserver <봇토큰붙여넣기>

# 예시:
.\\cokacdir.exe --ccserver 7123456789:AAH_abcdefg...`}</CodeBlock>

        <p className="text-body leading-relaxed mt-4 mb-4">
          처음 실행 시 &ldquo;터미널(앱)에서 열기&rdquo;를 선택하세요.
          지난 시간에 로그인한 Claude Pro 계정이 자동으로 연결됩니다.
        </p>

        <Callout type="info" title="왜 이것만 직접 실행하나요?">
          <p>
            코깍딜은 터미널 화면(TUI)을 사용하는 앱이라 Claude Code 안에서는 실행이 안 됩니다.
            별도 PowerShell 창에서 직접 실행해야 합니다.
          </p>
        </Callout>
      </section>

      {/* ── 테스트 ── */}
      <section id="test" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          테스트해보기
        </h2>
        <p className="text-body leading-relaxed mb-4">
          봇 서버가 실행되면, 텔레그램에서 아까 만든 봇에게 메시지를 보내보세요.
        </p>

        <CodeBlock title="텔레그램에서 보내볼 메시지">{`안녕! 넌 누구야?
오늘 날씨 알려줘
현재 폴더에 있는 파일 목록 보여줘`}</CodeBlock>

        <p className="text-body leading-relaxed mt-4 mb-4">
          내 PC의 Claude Code가 메시지를 받으면 웹 검색, 파일 읽기/쓰기,
          코드 실행, 보고서 생성까지 수행하고 결과를 텔레그램으로 돌려보냅니다.
        </p>
      </section>

      {/* ── 이해하기: 코깍딜이란? ── */}
      <section id="why-cokacdir" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          이해하기: 코깍딜이란?
        </h2>
        <p className="text-body leading-relaxed mb-4">
          봇이 동작하는 걸 확인했으니, 이게 어떤 원리인지 알아볼게요.
        </p>

        <p className="text-body leading-relaxed mb-4">
          코깍딜(cokacdir)은 <strong>Claude Agent SDK 기반</strong>의 텔레그램 연동 도구입니다.
          내 PC에서 내 Claude 계정으로 직접 로그인해서 사용하기 때문에 정책을 100% 준수합니다.
        </p>

        <Callout type="tip" title="핵심 원리">
          <p>
            코깍딜은 내 PC에서 내 Pro 구독으로 직접 로그인합니다.
            로그인 정보가 내 PC에만 존재하고, 제3자에게 넘기지 않습니다.
          </p>
        </Callout>

        {/* 구조 흐름 */}
        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          동작 흐름
        </h3>
        <p className="text-body leading-relaxed mb-4">
          내 Windows PC에서 바로 동작합니다. WSL 없이도 됩니다.
        </p>

        <div className="grid gap-3 my-6">
          {[
            { step: "1", icon: "📱", text: "텔레그램에서 메시지 전송" },
            { step: "2", icon: "🖥️", text: "코깍딜 서버가 메시지 수신 (내 PC의 PowerShell에서 실행 중)" },
            { step: "3", icon: "🔐", text: "Claude CLI로 AI 호출 (내 Pro 구독 로그인)" },
            { step: "4", icon: "⚙️", text: "AI가 파일 읽기 · 코드 실행 · 웹 검색 수행" },
            { step: "5", icon: "💬", text: "결과를 텔레그램으로 전송" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-accent-light border border-accent/30 rounded-xl px-4 py-3"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span className="text-body">{item.text}</span>
              </div>
            </div>
          ))}
        </div>

        <Callout type="info" title="Windows 네이티브!">
          <p>
            코깍딜은 Windows exe 파일 하나로 실행됩니다.
            WSL이나 Tailscale 같은 추가 설치가 필요 없어요.
          </p>
        </Callout>

        {/* OpenClaw 비교 */}
        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          OpenClaw vs 코깍딜
        </h3>
        <p className="text-body leading-relaxed mb-6">
          텔레그램과 Claude Code를 연결하는 방법은 크게 두 가지입니다.
        </p>

        <CompareTable
          headers={["", "🐾 OpenClaw", "🤖 코깍딜"]}
          rows={[
            ["설명", "오픈소스 메신저 AI 에이전트", "Claude Agent SDK 기반 텔레그램 연동"],
            ["인증 방식", "내 로그인 정보를 제3자에 전달", "내 PC에서 직접 로그인"],
            ["실행 위치", "제3자 서버에서 내 계정 사용", "내 PC에서 Claude CLI 직접 호출"],
            ["Anthropic 정책", "⚠️ 위반 (공식 금지)", "✅ 준수 (공식 CLI 사용)"],
            ["보안", "정보 유출 · 폭주 위험", "로그인 정보가 내 PC에만 존재"],
            ["계정 안전", "차단 가능성 있음", "안전"],
          ]}
        />

        {/* OpenClaw 위험성 */}
        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          OpenClaw의 치명적 문제
        </h3>
        <p className="text-body leading-relaxed mb-4">
          OpenClaw의 핵심 문제는 <strong>내 Claude Pro 구독 인증을 제3자 프로그램에 넘기는 것</strong>입니다.
          마치 내 신용카드를 모르는 사람에게 빌려주는 것과 같아요.
        </p>

        <div className="grid gap-3 my-6">
          {[
            { icon: "🚫", title: "계정 차단", desc: "Anthropic이 공식적으로 Free, Pro, Max 계정의 OAuth 토큰을 제3자 도구에서 사용하는 것을 금지했습니다." },
            { icon: "🔓", title: "보안 위험", desc: "타인이 내 계정으로 API를 호출할 수 있으며, 공개 Discord 서버에서 파일 시스템 탐색 사례가 보고되었습니다." },
            { icon: "💸", title: "비용 폭탄", desc: "에이전트가 폭주하여 메시지 500건 이상을 무차별 발송한 실제 사고가 발생했습니다." },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <strong className="text-heading">{item.title}</strong>
              </div>
              <p className="text-body text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <Callout type="warning" title="결론">
          <p>
            OpenClaw은 편리하지만 <strong>정책 위반</strong>으로 계정이 차단될 수 있습니다.
            이 가이드에서는 안전한 <strong>코깍딜</strong>을 사용합니다.
          </p>
        </Callout>

        {/* 인증 방식 차이 */}
        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          핵심 차이: 인증 방식
        </h3>
        <p className="text-body leading-relaxed mb-6">
          비유로 이해하면 쉽습니다.
        </p>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="font-bold text-heading mb-2">🐾 OpenClaw</p>
            <p className="text-body text-sm mb-3">
              💳 신용카드를 모르는 사람에게 빌려주고 &quot;대신 쇼핑해 주세요&quot;
            </p>
            <ul className="text-sm text-body space-y-1">
              <li>얼마를 쓸지 모름</li>
              <li>어디서 쓸지 모름</li>
              <li>내 통제 범위 밖</li>
            </ul>
          </div>
          <div className="bg-accent-light border border-accent/30 rounded-xl p-5">
            <p className="font-bold text-heading mb-2">🤖 코깍딜</p>
            <p className="text-body text-sm mb-3">
              🏠 집 안의 내 금고에서 내가 직접 꺼내 쓰고 &quot;열쇠는 내가 갖고 있다&quot;
            </p>
            <ul className="text-sm text-body space-y-1">
              <li>토큰이 내 PC에만 존재</li>
              <li>내가 완전히 통제</li>
              <li>추가 비용 없음</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 트러블슈팅: Invalid API key ── */}
      <section id="troubleshoot-apikey" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          에러: Invalid API key
        </h2>
        <p className="text-body leading-relaxed mb-4">
          <code>claude auth login</code>으로 OAuth 로그인은 성공했는데,
          코깍딜을 실행하면 이런 에러가 나오는 경우가 있습니다.
        </p>

        <CodeBlock title="에러 메시지">{`Error: Invalid API key · Fix external API key`}</CodeBlock>

        <Callout type="warning" title="원인: API 키가 OAuth보다 먼저 적용됨">
          <p>
            Claude CLI는 인증을 이 순서로 확인합니다:
          </p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li><strong>환경변수 <code>ANTHROPIC_API_KEY</code></strong> &mdash; 있으면 무조건 이걸 사용</li>
            <li><strong>OAuth 토큰</strong> (<code>.credentials.json</code>) &mdash; 환경변수가 없을 때만</li>
          </ol>
          <p className="mt-2">
            즉, 예전에 설정한 잘못된/만료된 API 키가 남아있으면 정상적인 OAuth 로그인을 덮어씌웁니다.
          </p>
        </Callout>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          해결 방법
        </h3>

        <div className="grid gap-4 my-6">
          <div className="bg-subtle rounded-xl p-5">
            <p className="font-bold text-heading mb-3">1단계: 환경변수 확인</p>
            <CodeBlock title="PowerShell">{`echo $env:ANTHROPIC_API_KEY`}</CodeBlock>
            <p className="text-body text-sm mt-2">
              값이 출력되면 &rarr; 이게 범인입니다. 아무것도 안 나오면 2단계로.
            </p>
          </div>

          <div className="bg-subtle rounded-xl p-5">
            <p className="font-bold text-heading mb-3">2단계: 환경변수 제거</p>
            <CodeBlock title="PowerShell — 현재 세션에서 제거">{`$env:ANTHROPIC_API_KEY = ""`}</CodeBlock>
            <CodeBlock title="PowerShell — 영구 제거 (시스템 전체)">{`[System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $null, "User")`}</CodeBlock>
            <p className="text-body text-sm mt-2">
              또는 <strong>시스템 속성 &rarr; 환경변수</strong>에서 직접 <code>ANTHROPIC_API_KEY</code>를 찾아 삭제하세요.
            </p>
          </div>

          <div className="bg-subtle rounded-xl p-5">
            <p className="font-bold text-heading mb-3">3단계: 확인 테스트</p>
            <CodeBlock title="PowerShell">{`claude -p "안녕"`}</CodeBlock>
            <p className="text-body text-sm mt-2">
              정상 응답이 오면 OAuth 인증이 잘 되는 것입니다. 코깍딜을 다시 실행하세요.
            </p>
          </div>
        </div>

        <Callout type="tip" title="추가 확인 포인트">
          <p>환경변수 외에도 API 키가 숨어있을 수 있는 곳:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>코깍딜 실행 BAT 파일 안에 <code>set ANTHROPIC_API_KEY=...</code> 라인</li>
            <li>작업 폴더의 <code>.env</code> 파일</li>
            <li><code>%USERPROFILE%\.claude\settings.json</code>에 apiKey 관련 설정</li>
          </ul>
          <p className="mt-2">모두 확인하고 API 키 관련 항목이 있으면 삭제하세요.</p>
        </Callout>
      </section>

      {/* ── 트러블슈팅: OS error 193 ── */}
      <section id="troubleshoot-os193" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          에러: OS error 193
        </h2>
        <p className="text-body leading-relaxed mb-4">
          코깍딜을 실행하면 이런 에러가 나오는 경우입니다.
        </p>

        <CodeBlock title="에러 메시지">{`OS error 193: %1은(는) 올바른 Win32 응용 프로그램이 아닙니다`}</CodeBlock>

        <Callout type="warning" title="원인: claude.cmd ≠ claude.exe">
          <p>
            코깍딜(Rust 바이너리)은 내부적으로 <code>claude -p &quot;메시지&quot;</code>를 실행합니다.
            그런데 Windows에서 <code>npm install -g @anthropic-ai/claude-code</code>로 설치하면,
            실제로 만들어지는 건 <code>claude.exe</code>가 아니라 <strong><code>claude.cmd</code></strong>(배치 파일)입니다.
          </p>
          <p className="mt-2">
            Rust 프로그램은 <code>.cmd</code> 파일을 직접 실행할 수 없습니다.
            마치 &ldquo;이 파일은 프로그램이 아닙니다&rdquo;라고 거부당하는 것이에요.
          </p>
        </Callout>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          구조 이해
        </h3>
        <div className="grid gap-3 my-6">
          {[
            { icon: "📦", label: "npm이 설치하는 것", text: "claude.cmd (배치 파일 — 텍스트 스크립트)" },
            { icon: "⚙️", label: "코깍딜이 찾는 것", text: "claude.exe (네이티브 실행 파일)" },
            { icon: "❌", label: "결과", text: ".cmd는 .exe가 아니므로 → OS error 193" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div>
                <span className="font-semibold text-heading text-sm">{item.label}</span>
                <span className="text-body text-sm ml-2">{item.text}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          해결 방법: EXE shim 만들기
        </h3>
        <p className="text-body leading-relaxed mb-4">
          <code>claude.cmd</code>를 대신 실행해주는 진짜 <code>.exe</code> 파일을 만들어야 합니다.
          Claude Code에게 시키면 됩니다.
        </p>

        <CodeBlock title="Claude Code에 입력">{`코깍딜이 claude를 실행할 때 "OS error 193" 에러가 나.
npm이 설치한 claude.cmd를 Rust 바이너리가 .exe로 인식 못 하는 문제야.
claude.cmd를 정상 실행할 수 있도록 해결해줘`}</CodeBlock>

        <p className="text-body leading-relaxed mt-4 mb-4">
          Claude Code가 아래와 같은 작업을 자동으로 수행합니다:
        </p>

        <div className="grid gap-3 my-6">
          {[
            { step: "1", text: "claude.cmd 위치 확인 (where claude)" },
            { step: "2", text: "Node.js로 claude.cmd를 호출하는 래퍼 스크립트 작성" },
            { step: "3", text: "래퍼를 .exe로 컴파일하거나, PATH 우선순위 조정" },
            { step: "4", text: "claude 명령이 정상 동작하는지 테스트" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-accent-light border border-accent/30 rounded-xl px-4 py-3"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </span>
              <span className="text-body">{item.text}</span>
            </div>
          ))}
        </div>

        <Callout type="tip" title="직접 수동 해결하고 싶다면">
          <p>
            <code>claude.cmd</code>가 있는 폴더를 확인하고 (보통 <code>%APPDATA%\npm\</code>),
            같은 경로에 <code>claude.cmd</code>를 <code>cmd.exe /c</code>로 실행하는 래퍼 EXE를 넣으면 됩니다.
          </p>
          <CodeBlock title="PowerShell — claude.cmd 위치 확인">{`where.exe claude`}</CodeBlock>
          <p className="mt-2">
            하지만 이건 수동 작업이 많으니, <strong>Claude Code에게 맡기는 걸 추천</strong>합니다.
            AI한테 시키면 30초면 끝나요.
          </p>
        </Callout>
      </section>

      {/* ── 자동 실행 BAT 파일 ── */}
      <section id="bat-autostart" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          자동 실행 BAT 파일 만들기
        </h2>
        <p className="text-body leading-relaxed mb-4">
          매번 PowerShell을 열고 명령어를 치는 대신,
          <strong>더블클릭 한 번</strong>으로 코깍딜을 시작하는 BAT 파일을 만들어 봅시다.
        </p>

        <CodeBlock title="start-bot.bat — 메모장에서 작성 후 저장">{`@echo off
cd /d "C:\\Users\\내유저\\my-ai-bot"
set CLAUDE_CODE_BUBBLEWRAP=1
start "MyBot" cokacdir.exe --ccserver 여기에봇토큰붙여넣기`}</CodeBlock>

        <div className="grid gap-3 my-6">
          {[
            { icon: "📁", label: "cd /d 경로", desc: "CLAUDE.md가 있는 작업 폴더. 봇의 역할/규칙이 이 파일에서 결정됩니다." },
            { icon: "🔒", label: "CLAUDE_CODE_BUBBLEWRAP=1", desc: "샌드박스 모드. 봇이 시스템을 변경하지 못하게 보호합니다." },
            { icon: "🚫", label: "ANTHROPIC_API_KEY 없음", desc: "OAuth 인증을 사용하므로 API 키를 넣지 않습니다. 넣으면 Invalid API key 에러 발생!" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-subtle rounded-xl px-4 py-3"
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-heading text-sm">{item.label}</p>
                <p className="text-body text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="info" title="Windows 시작 시 자동 실행하려면">
          <p>
            <code>Win + R</code> &rarr; <code>shell:startup</code> 입력 &rarr; 열린 폴더에
            BAT 파일의 <strong>바로가기</strong>를 넣으세요.
            PC를 켤 때마다 봇이 자동으로 시작됩니다.
          </p>
        </Callout>

        <Callout type="warning" title="그래도 안 되면 이것을 확인하세요">
          <p>아래 5가지 결과를 확인하면 대부분의 문제를 진단할 수 있습니다:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li><code>claude --version</code> &mdash; CLI 버전 확인</li>
            <li><code>echo $env:ANTHROPIC_API_KEY</code> &mdash; API 키 환경변수 확인</li>
            <li><code>where.exe claude</code> &mdash; claude 실행 파일 경로 확인</li>
            <li>실행 BAT 파일 전체 내용</li>
            <li>코깍딜 실행 시 전체 에러 로그</li>
          </ol>
        </Callout>
      </section>

      {/* ── 활용 ①: 파일 ── */}
      <section id="usecase-file" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          활용 ①: 파일 주고받기
        </h2>

        <CodeBlock title="텔레그램에서">{`[엑셀 파일 첨부]

이 매출 데이터 분석해서
월별 트렌드 차트 만들고
보고서로 보내줘`}</CodeBlock>

        <p className="text-body leading-relaxed mt-4 mb-4">
          AI가 하는 일:
        </p>
        <ol className="list-decimal pl-5 text-body space-y-1 mb-4">
          <li>첨부 파일을 내 PC에 저장</li>
          <li>Python으로 데이터 분석</li>
          <li>차트 이미지 생성</li>
          <li>보고서 파일로 정리</li>
          <li>결과 파일을 텔레그램으로 전송</li>
        </ol>

        <Callout type="tip" title="지하철에서 보고서 완성">
          <p>
            지하철에서 엑셀 보내면 &rarr; 집 PC가 분석해서 &rarr; 보고서가 텔레그램으로 도착합니다.
          </p>
        </Callout>
      </section>

      {/* ── 활용 ②: 스케줄링 ── */}
      <section id="usecase-schedule" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          활용 ②: 24시간 자동 비서
        </h2>

        <CodeBlock title="대화 예시">{`👤 "매일 아침 8시에 오늘 날씨랑 뉴스 요약 보내줘"

🤖 스케줄 등록 완료! 매일 08:00에 실행됩니다.

─────── 다음 날 아침 8:00 ───────

🤖 좋은 아침입니다!
🌤️ 서울 맑음 12°C
📰 뉴스 3건 요약 전송`}</CodeBlock>

        <p className="text-body leading-relaxed mt-4">
          PC만 켜 놓으면 내가 자고 있어도 봇이 알아서 일하고 결과를 보내줍니다.
        </p>
      </section>

      {/* ── 활용 ③: 보고서 ── */}
      <section id="usecase-report" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          활용 ③: 한 줄 지시 &rarr; 완성된 보고서
        </h2>

        <CodeBlock title="텔레그램에서">{`"2026년 AI 시장 동향 조사해서 보고서 만들어줘"

🤖 웹 검색 → 분석 → 차트 생성...

🤖 완료! 📎 AI_시장_동향_2026.html (차트 포함)`}</CodeBlock>

        <div className="grid md:grid-cols-3 gap-3 my-6">
          {[
            { icon: "🔍", title: "웹 검색", desc: "최신 데이터를 실시간으로 수집" },
            { icon: "📝", title: "분석 & 정리", desc: "AI가 핵심만 추출해서 정리" },
            { icon: "📊", title: "보고서 생성", desc: "차트 포함 완성된 파일로 전송" },
          ].map((item, i) => (
            <div key={i} className="bg-subtle rounded-xl p-4 text-center">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <p className="font-semibold text-heading text-sm">{item.title}</p>
              <p className="text-caption text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <Callout type="tip" title="실전 프롬프트: 보고서 허브">
          <p>
            &quot;보고서 아카이빙 웹페이지를 만들어줘. 현재 폴더의 .html 파일들을 스캔해서
            제목, 날짜, 카테고리를 자동 추출하고, 카테고리별 필터가 있는 카드 리스트로 만들어.
            포트 5321로 dev 서버 띄워서 같은 와이파이의 폰에서도 볼 수 있게 해줘.&quot;
            &mdash; 이렇게 길고 구체적인 지시도 한 번에 처리합니다.
          </p>
        </Callout>
      </section>

      {/* ── 활용 ④: 영수증 ── */}
      <section id="usecase-receipt" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          활용 ④: 영수증 &rarr; 자동 가계부
        </h2>

        <CodeBlock title="평소에 틈날 때마다">{`👤 [영수증 사진 📸]
🤖 저장! 스타벅스 6,500원 (카페)

👤 [영수증 사진 📸]
🤖 저장! GS25 12,300원 (편의점/식비)

👤 [카드 문자 캡처 📱]
🤖 저장! 쿠팡 45,900원 (온라인쇼핑)`}</CodeBlock>

        <CodeBlock title="월말에">{`👤 "이번 달 지출 리포트 만들어줘"

🤖 3월 지출 리포트 완성!
📎 3월_지출_리포트.html
· 총 1,842,500원
· 카테고리별 차트 포함`}</CodeBlock>

        <p className="text-body leading-relaxed mt-4">
          가계부 앱 필요 없습니다. 영수증 찍어서 텔레그램에 보내기만 하면
          AI가 누적 관리하고, 월말에 한 마디면 차트 포함 리포트가 완성됩니다.
        </p>
      </section>

      {/* ── 활용 ⑤: 멀티봇 ── */}
      <section id="usecase-multibot" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          활용 ⑤: 프로젝트별 멀티봇
        </h2>
        <p className="text-body leading-relaxed mb-4">
          BotFather에서 봇을 추가로 만들고, 코깍딜을 하나 더 실행하면 끝입니다.
          텔레그램 채팅방을 전환하듯이 목적별 AI 비서를 사용할 수 있어요.
        </p>

        <div className="grid md:grid-cols-3 gap-3 my-6">
          {[
            { icon: "💼", title: "업무 봇", items: ["보고서 작성", "이메일 초안", "데이터 분석"] },
            { icon: "📚", title: "학습 봇", items: ["영어 회화 연습", "자격증 문제 풀기", "논문 요약"] },
            { icon: "🏠", title: "생활 봇", items: ["레시피 추천", "가계부 관리", "일정 알림"] },
          ].map((item, i) => (
            <div key={i} className="bg-subtle rounded-xl p-5">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <p className="font-semibold text-heading mb-2">{item.title}</p>
              <ul className="text-body text-sm space-y-1">
                {item.items.map((t, j) => (
                  <li key={j}>· {t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Callout type="info" title="봇마다 독립된 대화 & 기억">
          <p>
            각 봇은 별도의 대화 맥락을 가집니다. 업무 봇에게 말한 내용을 학습 봇이 알지 못해요.
          </p>
        </Callout>
      </section>

      {/* ── 활용 ⑥: 기억하는 AI ── */}
      <section id="usecase-memory" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          활용 ⑥: 나를 기억하는 AI
        </h2>

        <CodeBlock title="대화 예시">{`── 3월 3일 ──

👤 "나 매운 거 못 먹어. 기억해줘"
🤖 기억했습니다! 매운 음식 제외하겠습니다.

── 일주일 후 ──

👤 "오늘 점심 뭐 먹지?"
🤖 매운 음식 빼고 추천드릴게요!
🍝 크림 파스타 — 강남역 '파스타집' (도보 5분)
🍱 연어 포케 — 역삼역 '포케샐러드' (도보 8분)`}</CodeBlock>

        <p className="text-body leading-relaxed mt-4">
          대화 내용이 내 PC에 저장됩니다. 오래 쓸수록 나를 더 잘 아는 AI가 돼요.
          ChatGPT와 달리 데이터가 클라우드가 아닌 <strong>내 컴퓨터에만 존재</strong>해서
          프라이버시도 보호됩니다.
        </p>
      </section>

      {/* ── 핵심 정리 ── */}
      <section id="summary" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          핵심 정리
        </h2>

        <div className="grid gap-3 my-6">
          {[
            "코깍딜은 내 Windows PC에서 내 Pro 구독으로 직접 실행 → 정책 준수",
            "설치는 3단계 — 봇 만들기 → 코깍딜 설치 → 실행 → 끝!",
            "OpenClaw은 편리하지만 정책 위반 → 계정 차단 위험",
            "핵심 차이는 인증 방식 — 로그인 정보를 제3자에게 vs 내 PC에서 직접",
            "텔레그램 봇 하나면 어디서든 AI 원격 조종 가능",
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-accent-light border border-accent/30 rounded-xl px-4 py-3"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-body">{text}</span>
            </div>
          ))}
        </div>

        <Callout type="tip" title="내 AI를, 안전하게, 어디서든">
          <p>
            터미널 앞에서만 쓰던 AI를 이제 주머니에서 꺼내 쓰세요.
            텔레그램 하나로 파일 분석, 자동 스케줄, 웹 리서치, 보고서 생성,
            코드 실행, 번역까지 &mdash; 모든 것이 가능합니다.
          </p>
        </Callout>
      </section>
    </>
  );
}
