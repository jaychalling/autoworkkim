"use client";

import Callout from "@/components/learn/Callout";
import CodeBlock from "@/components/learn/CodeBlock";
import CompareTable from "@/components/learn/CompareTable";
import OsTabs from "@/components/learn/OsTabs";
import ScreenshotPlaceholder from "@/components/learn/ScreenshotPlaceholder";

export default function Chapter3() {
  return (
    <>
      {/* ── 사전 준비: Google API 설정 ── */}
      <section id="google-api">
        <h2 className="text-2xl font-bold text-heading mb-4">
          사전 준비: Google Gmail API 설정
        </h2>
        <p className="text-body leading-relaxed mb-4">
          매일 아침 메일 분류에 30분씩 쓰고 계시다면, 이걸 자동화해볼게요.
          Claude Code가 Gmail에 접근하려면 &ldquo;열쇠&rdquo;가 필요해요.
          Google에서 &ldquo;이 프로그램이 내 메일에 접근해도 됩니다&rdquo;라는 허가증을 만드는 거예요.
          <strong>한 번만 설정하면 계속 사용</strong>할 수 있어요.
        </p>

        <Callout type="info" title="코딩 경험이 없어도 돼요">
          <p>
            이 실습에서 여러분이 직접 코드를 작성할 일은 없어요.
            Claude Code에게 프롬프트 하나를 입력하면, 나머지는 AI가 전부 처리해요.
            여러분은 결과를 확인하고 y/n으로 승인만 하면 돼요.
          </p>
        </Callout>

        <Callout type="info" title="API 키가 필요한가요?">
          <p>
            아니요! 많은 분이 &ldquo;API 키를 발급해야 하나?&rdquo;라고 걱정하시는데,
            <strong>API 키는 필요 없어요</strong>.
            필요한 건 <strong>OAuth 클라이언트 ID</strong>라는 것 하나뿐이에요.
            이걸 만들고 브라우저에서 Google 로그인 한 번 하면 끝이에요.
          </p>
        </Callout>

        <p className="text-body leading-relaxed mt-8 mb-4">
          방법이 두 가지 있어요. 상황에 맞는 걸 골라서 따라하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-elevated border-2 border-primary-light rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-primary">A</span>
              <h3 className="font-bold text-heading">credentials.json 방식</h3>
            </div>
            <p className="text-sm text-caption">
              기존 방식. Claude Code가 직접 Gmail API를 호출하는 Python/Node 코드를 작성해요.
              credentials.json 파일을 작업 폴더에 넣으면 돼요.
            </p>
            <span className="inline-block mt-3 text-xs font-medium bg-primary-lighter text-primary px-2 py-1 rounded-lg">
              범용 &middot; 모든 OS
            </span>
          </div>
          <div className="bg-elevated border-2 border-accent/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-accent">B</span>
              <h3 className="font-bold text-heading">GWS CLI 방식</h3>
            </div>
            <p className="text-sm text-caption">
              2025년에 Google이 출시한 공식 CLI 도구.
              터미널에서 바로{" "}
              <code className="bg-subtle px-1 py-0.5 rounded text-xs font-mono">gws gmail</code>{" "}
              명령어로 메일을 조작할 수 있어요.
            </p>
            <span className="inline-block mt-3 text-xs font-medium bg-accent-light text-accent px-2 py-1 rounded-lg">
              최신 &middot; Claude Code MCP 연동 가능
            </span>
          </div>
        </div>

        {/* ── 공통: OAuth 클라이언트 ID 만들기 ── */}
        <div className="bg-elevated border border-border-subtle rounded-2xl p-6">
          <h3 className="font-bold text-heading mb-2 text-lg">
            공통 단계: OAuth 클라이언트 ID 만들기 (1회)
          </h3>
          <p className="text-sm text-caption mb-5">
            A, B 어느 방식이든 이 과정은 동일해요. 처음 한 번만 하면 돼요.
          </p>

          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-lighter text-primary font-bold flex items-center justify-center text-sm">
                1
              </div>
              <div>
                <p className="font-medium text-heading">Google Cloud Console 접속</p>
                <p className="text-sm text-caption mt-1">
                  브라우저에서{" "}
                  <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">
                    console.cloud.google.com
                  </code>{" "}
                  에 접속하세요. Google 계정으로 로그인하세요.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-lighter text-primary font-bold flex items-center justify-center text-sm">
                2
              </div>
              <div>
                <p className="font-medium text-heading">프로젝트 생성 &rarr; Gmail API 활성화</p>
                <p className="text-sm text-caption mt-1">
                  상단에서 &ldquo;새 프로젝트&rdquo;를 만들어요 (이름은 아무거나 OK).
                  그 다음 좌측 메뉴에서 <strong>&ldquo;API 및 서비스&rdquo; &rarr; &ldquo;라이브러리&rdquo;</strong>로 가서
                  &ldquo;Gmail API&rdquo;를 검색하고 <strong>&ldquo;사용&rdquo;</strong> 버튼을 클릭하세요.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-lighter text-primary font-bold flex items-center justify-center text-sm">
                3
              </div>
              <div>
                <p className="font-medium text-heading">OAuth 동의 화면 설정 + 테스트 사용자 등록</p>
                <p className="text-sm text-caption mt-1">
                  좌측 메뉴에서 &ldquo;Google Auth Platform&rdquo; (구 OAuth 동의 화면)으로 이동해요.
                  <strong>&ldquo;Audience&rdquo;</strong> 탭에서 &ldquo;External&rdquo;을 선택하고,
                  <strong>테스트 사용자에 본인 Gmail을 추가</strong>하세요.
                  이걸 안 하면 나중에 로그인할 때 &ldquo;access_denied&rdquo; 에러가 나요.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-lighter text-primary font-bold flex items-center justify-center text-sm">
                4
              </div>
              <div>
                <p className="font-medium text-heading">OAuth 클라이언트 ID 만들기</p>
                <p className="text-sm text-caption mt-1">
                  &ldquo;Clients&rdquo; 탭 (또는 &ldquo;사용자 인증 정보&rdquo;) &rarr; &ldquo;OAuth 클라이언트 ID 만들기&rdquo;.
                  애플리케이션 유형은 <strong>&ldquo;데스크톱 앱&rdquo;</strong>으로 선택하세요.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-lighter text-primary font-bold flex items-center justify-center text-sm">
                5
              </div>
              <div>
                <p className="font-medium text-heading">JSON 다운로드</p>
                <p className="text-sm text-caption mt-1">
                  생성 완료 후 <strong>&ldquo;JSON 다운로드&rdquo;</strong> 버튼을 클릭하세요.
                  이 파일이 여러분의 &ldquo;열쇠&rdquo;예요.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ScreenshotPlaceholder
          alt="Google Cloud Console — Gmail API 활성화 화면"
          caption="Google Cloud Console에서 Gmail API를 검색하고 '사용' 버튼을 클릭하는 화면"
        />

        <ScreenshotPlaceholder
          alt="Google Cloud Console — OAuth 클라이언트 ID 생성 화면"
          caption="사용자 인증 정보에서 OAuth 클라이언트 ID를 만드는 화면"
        />

        <Callout type="tip" title="Playwright로 이 과정을 자동화할 수 있어요">
          <p>
            이전 Step에서 설치한 <strong>Playwright</strong>, 기억하시죠?
            사실 위의 Cloud Console 설정 과정도 Playwright로 자동화할 수 있어요.
            Claude Code에게 이렇게 말해보세요:
          </p>
          <p className="mt-2 font-medium text-heading">
            &ldquo;Playwright로 Google Cloud Console에 접속해서 Gmail API 활성화하고 OAuth 클라이언트 ID 만들어줘&rdquo;
          </p>
          <p className="mt-2">
            Claude Code가 브라우저를 자동으로 열고, 프로젝트 생성부터 OAuth 설정까지
            클릭 하나 없이 전부 처리해줘요.
            <strong> 여러분은 Google 로그인 비밀번호만 입력</strong>하면 돼요.
          </p>
          <p className="mt-2 text-sm text-caption">
            단, Google은 자동화 도구의 로그인을 차단할 수 있어서,
            로그인까지는 직접 하고 그 이후 단계만 자동화하는 게 더 안정적이에요.
          </p>
        </Callout>

        {/* ── 방법 A: credentials.json ── */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-heading mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center">A</span>
            credentials.json 방식
          </h3>
          <p className="text-body leading-relaxed mb-4">
            다운로드한 JSON 파일을{" "}
            <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">credentials.json</code>으로
            이름을 바꿔서 작업 폴더에 넣으세요. 끝이에요!
          </p>
          <CodeBlock title="파일 위치 (예시)">{`~/Desktop/autowork/credentials.json`}</CodeBlock>
          <p className="text-sm text-caption mt-3">
            Claude Code가 이 파일을 읽어서 Gmail API 연결 코드를 자동으로 작성해요.
            첫 실행 시 브라우저가 열리고 Google 로그인을 요청해요.
            로그인하면 토큰이 저장되고 이후엔 자동으로 연결돼요.
          </p>
        </div>

        {/* ── 방법 B: GWS CLI ── */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-heading mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-accent text-white text-sm font-bold flex items-center justify-center">B</span>
            GWS CLI 방식 (Google Workspace CLI)
          </h3>
          <p className="text-body leading-relaxed mb-4">
            2025년에 Google이 공식 출시한 CLI 도구예요.
            터미널에서 바로 Gmail, Drive, Sheets, Calendar를 조작할 수 있어요.
            심지어 <strong>MCP 서버 모드</strong>를 지원해서 Claude Code와 직접 연동도 가능해요.
          </p>

          <h4 className="font-semibold text-heading mb-3 mt-6">설치</h4>
          <OsTabs
            mac={`# Homebrew로 설치 (가장 쉬움)
brew install gws

# 또는 npm으로 설치
npm install -g @googleworkspace/cli`}
            windows={`# 1. GitHub Releases에서 gws.exe 다운로드
#    github.com/googleworkspace/google-workspace-cli/releases

# 2. 다운로드한 gws.exe를 npm 글로벌 폴더에 복사
#    보통: %APPDATA%\\npm\\gws.exe

# 3. 터미널에서 확인
gws --version`}
          />

          <Callout type="warning" title="Windows npm 설치 에러가 난다면">
            <p>
              Windows에서{" "}
              <code className="bg-subtle px-1 py-0.5 rounded text-xs font-mono">
                npm install -g @googleworkspace/cli
              </code>{" "}
              실행 시 tar 에러가 발생할 수 있어요.
              이 경우 GitHub Releases 페이지에서 <strong>gws.exe</strong>를 직접 다운로드해서
              npm 글로벌 bin 폴더에 넣으세요.
              기존 npm이 만든{" "}
              <code className="bg-subtle px-1 py-0.5 rounded text-xs font-mono">gws.cmd</code>,{" "}
              <code className="bg-subtle px-1 py-0.5 rounded text-xs font-mono">gws.ps1</code>{" "}
              파일이 있다면 삭제하세요.
            </p>
          </Callout>

          <h4 className="font-semibold text-heading mb-3 mt-6">인증 (로그인)</h4>
          <p className="text-sm text-caption mb-3">
            위에서 다운로드한 JSON 파일을{" "}
            <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">client_secret.json</code>으로
            이름을 바꿔서 GWS 설정 폴더에 넣으세요.
          </p>
          <OsTabs
            mac={`# JSON 파일을 GWS 설정 폴더에 복사
cp ~/Downloads/client_secret_XXX.json ~/.config/gws/client_secret.json

# 로그인
gws auth login`}
            windows={`# JSON 파일을 GWS 설정 폴더에 복사
# %APPDATA%\\gws\\client_secret.json

# 로그인
gws auth login`}
          />
          <p className="text-sm text-caption mt-3">
            브라우저가 열리고 Google 로그인 화면이 나와요. 로그인하면 끝!
          </p>

          <h4 className="font-semibold text-heading mb-3 mt-6">테스트</h4>
          <CodeBlock title="터미널">{`# Gmail 메일 목록 가져오기
gws gmail users messages list --user-id me`}</CodeBlock>
          <p className="text-sm text-caption mt-2">
            메일 ID 목록이 출력되면 성공이에요. 이제 Claude Code에서 GWS CLI를 활용할 수 있어요.
          </p>
        </div>

        {/* ── 트러블슈팅 ── */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-heading mb-4">
            자주 겪는 문제 & 해결법
          </h3>

          <Callout type="warning" title="access_denied 에러가 나요">
            <p>
              &ldquo;개발자가 액세스 권한을 부여하지 않았습니다&rdquo; 에러가 나면,
              <strong>테스트 사용자 등록</strong>을 빠뜨린 거예요.
              Google Cloud Console &rarr; Google Auth Platform &rarr; Audience 탭에서
              본인 Gmail을 테스트 사용자로 추가하세요.
            </p>
            <p className="mt-2 text-sm">
              &ldquo;부적격 계정&rdquo; 경고가 뜨더라도 실제로는 추가돼요. 목록에 나타나면 OK.
            </p>
          </Callout>

          <Callout type="warning" title="테스트 모드 토큰 유효기간">
            <p>
              Google OAuth &ldquo;테스트 모드&rdquo;의 토큰은 <strong>7일 후 만료</strong>돼요.
              7일이 지나면 다시 로그인해야 해요.
              프로덕션으로 전환하면 이 제한이 없어지지만, 개인 사용이라면 7일마다 재인증하는 것도 크게 불편하지 않아요.
            </p>
          </Callout>

          <Callout type="tip" title="이 과정이 복잡하게 느껴지시나요?">
            <p>
              Google Cloud Console이 처음이면 당연히 복잡하게 느껴져요.
              근데 걱정 마세요. Claude Code에게 도움을 요청할 수 있거든요!
            </p>
            <p className="mt-2">
              터미널에서 Claude Code를 실행하고 이렇게 물어보세요:
            </p>
            <p className="mt-1 font-medium text-heading">
              &ldquo;Gmail API용 OAuth 설정하는 방법을 단계별로 알려줘&rdquo;
            </p>
            <p className="mt-2">
              화면을 보면서 하나씩 따라하면 돼요. 모르는 부분은 계속 물어보세요.
            </p>
          </Callout>
        </div>
      </section>

      {/* ── 바로 실행하기 ── */}
      <section id="execute" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          바로 실행하기
        </h2>
        <p className="text-body leading-relaxed mb-4">
          credentials.json이 작업 폴더에 준비됐으면, 이제 Claude Code에게 시킬 차례예요.
          터미널에서 Claude Code를 실행하고(<code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">claude</code> 입력),
          아래 프롬프트를 그대로 입력하세요.
        </p>

        <CodeBlock title="Claude Code에 입력할 프롬프트">{`credentials.json으로
Gmail 자동화 해줘.
메일 분류하고, 뉴스레터는
읽음처리, 업무중요는 답장
초안 잡아줘. emails.json 저장.`}</CodeBlock>

        <div className="bg-gradient-to-r from-primary-lighter to-accent-light border border-primary-light rounded-2xl p-6 my-8">
          <p className="text-xl font-bold text-heading text-center mb-2">
            이게 전부예요.
          </p>
          <p className="text-body text-center">
            프롬프트 하나로 Claude가 아래 전체를 알아서 처리해요.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-heading mb-3">
          Claude가 자동으로 하는 것
        </h3>
        <div className="grid gap-3">
          {[
            { icon: "🔗", text: "Gmail API 연결 코드 작성", desc: "credentials.json을 읽어서 OAuth 인증 코드를 자동 생성" },
            { icon: "📨", text: "메일 50개 수집 + 4카테고리 분류", desc: "받은편지함에서 메일을 가져와서 업무중요/뉴스레터/알림/기타로 분류" },
            { icon: "👁️", text: "뉴스레터 & 알림 자동 읽음 처리", desc: "중요하지 않은 메일은 읽음 표시로 자동 변경" },
            { icon: "✏️", text: "업무 중요 메일마다 답장 초안 작성", desc: "메일 내용을 분석해서 적절한 답변을 AI가 작성" },
            { icon: "✅", text: "y/n 승인 후 Gmail Draft 저장", desc: "초안을 보여주고, 승인하면 Gmail 임시보관함에 저장" },
            { icon: "💾", text: "전체 결과 emails.json 저장", desc: "분류 결과와 처리 내역을 JSON 파일로 기록" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-elevated border border-border-subtle rounded-xl px-4 py-3"
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <span className="font-medium text-heading">{item.text}</span>
                <p className="text-sm text-caption mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="info" title="Claude Code 구독이 필요해요">
          <p>
            Claude Code를 사용하려면 <strong>Claude 구독</strong>이 필요해요.
            API 키 같은 복잡한 설정은 필요 없고, claude.ai에서 구독만 하면 돼요.
          </p>
          <p className="mt-2">
            추천 플랜: <strong>Claude Max ($100/월)</strong> &mdash;
            Claude Code 사용량이 넉넉해서 자동화 프로젝트를 여유 있게 진행할 수 있어요.
            Pro 플랜($20/월)으로도 시작할 수 있지만, 실습을 많이 하다 보면 사용량 제한에 걸릴 수 있어요.
          </p>
        </Callout>

        <Callout type="info" title="MCP를 사용한 Gmail 접근도 가능해요">
          <p>
            OAuth 설정이 번거로우면, <strong>Gmail MCP 서버</strong>를 사용하는 방법도 있어요.
            MCP(Model Context Protocol)는 Claude Code가 외부 서비스에 접근하는 표준 방식이에요.
            커뮤니티에서 만든 Gmail MCP 서버를 연결하면, OAuth 설정 없이도 Gmail에 접근할 수 있어요.
          </p>
          <p className="mt-2 text-sm">
            MCP에 대해 더 알고 싶다면, Claude Code 안에서 &ldquo;MCP 서버 설정 방법 알려줘&rdquo;라고 물어보세요.
          </p>
        </Callout>
      </section>

      {/* ── 실행 결과 확인 ── */}
      <section id="expected" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          실행 결과 확인
        </h2>
        <p className="text-body leading-relaxed mb-6">
          프롬프트를 입력하면 Claude Code가 코드를 작성하고 실행해요.
          터미널에 아래와 같은 결과가 나타나요.
        </p>

        <ScreenshotPlaceholder
          alt="Gmail 자동화 실행 결과 — 터미널 화면"
          caption="Claude Code가 Gmail을 분류하고 답장 초안을 작성하는 실행 화면"
        />

        <h3 className="text-lg font-semibold text-heading mb-3">
          1단계: 메일 수집 + 분류 + 자동 읽음 처리
        </h3>
        <CodeBlock title="터미널 실행 결과 (예시)">{`📧 Gmail 자동화 시작...

✅ Gmail API 연결 성공
📨 메일 50개 수집 완료

📊 분류 결과:
  업무 중요  : 8건
  뉴스레터   : 22건
  알림       : 15건
  기타       : 5건

👁️ 뉴스레터 22건 읽음 처리 완료
👁️ 알림 15건 읽음 처리 완료`}</CodeBlock>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          2단계: 답장 초안 승인 화면
        </h3>
        <CodeBlock title="터미널 실행 결과 (예시)">{`✏️ 업무 중요 메일 답장 초안 작성 중...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📩 From: 김팀장 <teamlead@company.com>
📋 제목: 3월 프로젝트 일정 확인 부탁

📝 답장 초안:
"김팀장님, 안녕하세요.
3월 프로젝트 일정 확인했습니다.
현재 진행 상황과 함께 금주 금요일까지
업데이트된 일정표 공유드리겠습니다.
감사합니다."

💾 이 초안을 Gmail Draft에 저장할까요? (y/n): y
✅ Draft 저장 완료!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📩 From: 마케팅팀 <marketing@company.com>
📋 제목: 다음 주 미팅 자료 요청

📝 답장 초안:
"안녕하세요, 마케팅팀.
요청하신 미팅 자료 준비하겠습니다.
월요일 오전까지 공유드릴 수 있을까요?
필요한 항목이 더 있으시면 알려주세요."

💾 이 초안을 Gmail Draft에 저장할까요? (y/n): y
✅ Draft 저장 완료!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 최종 결과:
  처리된 메일: 50건
  읽음 처리: 37건
  답장 초안: 8건 (승인 8건)
  저장: emails.json ✅`}</CodeBlock>

        <div className="bg-gradient-to-r from-primary-lighter to-accent-light border border-primary-light rounded-2xl p-6 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-caption mb-2">사람이 한 것</p>
              <p className="text-lg font-bold text-heading">
                프롬프트 1개 + y/n 클릭 몇 번
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-caption mb-2">AI가 한 것</p>
              <p className="text-lg font-bold text-primary">
                나머지 전부
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 이해하기: 자동화 파이프라인 ── */}
      <section id="pipeline" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          이해하기: 자동화 파이프라인 6단계
        </h2>
        <p className="text-body leading-relaxed mb-6">
          방금 실행한 자동화가 내부적으로 어떻게 동작하는지 알아볼게요.
          아래 6단계로 돌아가는 구조예요.
          복잡해 보이지만 걱정 마세요 &mdash; 여러분은 이미 프롬프트 하나로 이 전체를 실행한 거예요.
        </p>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="relative bg-elevated border-2 border-primary-light rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center text-lg">
                1
              </div>
              <div>
                <h3 className="font-bold text-heading text-lg">수집</h3>
                <p className="text-body mt-1">
                  Gmail API로 받은편지함에서 <strong>최근 메일 50개</strong>를 가져와요.
                  보낸 사람, 제목, 본문 내용을 모두 읽어와요.
                </p>
                <span className="inline-block mt-2 text-xs font-medium bg-primary-lighter text-primary px-2 py-1 rounded-lg">
                  Gmail API
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-caption">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="relative bg-elevated border-2 border-purple-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500 text-white font-bold flex items-center justify-center text-lg">
                2
              </div>
              <div>
                <h3 className="font-bold text-heading text-lg">분류</h3>
                <p className="text-body mt-1">
                  AI가 각 메일을 분석해서 <strong>4개 카테고리</strong>로 자동 분류해요.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { label: "업무 중요", color: "bg-accent-light text-accent border-accent/30" },
                    { label: "뉴스레터", color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
                    { label: "알림", color: "bg-subtle text-body border-border-subtle" },
                    { label: "기타", color: "bg-slate-50 text-slate-600 border-slate-200" },
                  ].map((cat, i) => (
                    <span key={i} className={`text-xs font-medium px-2 py-1 rounded-lg border ${cat.color}`}>
                      {cat.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-caption">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="relative bg-elevated border-2 border-yellow-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-500 text-white font-bold flex items-center justify-center text-lg">
                3
              </div>
              <div>
                <h3 className="font-bold text-heading text-lg">읽음 처리</h3>
                <p className="text-body mt-1">
                  <strong>뉴스레터</strong>와 <strong>알림</strong>으로 분류된 메일은 자동으로 읽음 표시해요.
                  더 이상 수동으로 하나씩 클릭할 필요가 없어요.
                </p>
                <span className="inline-block mt-2 text-xs font-medium bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg">
                  자동 처리 (사람 개입 없음)
                </span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-caption">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="relative bg-elevated border-2 border-accent/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent text-white font-bold flex items-center justify-center text-lg">
                4
              </div>
              <div>
                <h3 className="font-bold text-heading text-lg">답장 초안</h3>
                <p className="text-body mt-1">
                  <strong>업무 중요</strong>로 분류된 메일마다 AI가 답장 초안을 작성해요.
                  메일 내용을 분석해서 적절한 답변을 자동으로 만들어줘요.
                </p>
                <span className="inline-block mt-2 text-xs font-medium bg-accent-light text-accent px-2 py-1 rounded-lg">
                  AI 초안 생성
                </span>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-caption">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="relative bg-elevated border-2 border-accent/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent text-white font-bold flex items-center justify-center text-lg">
                5
              </div>
              <div>
                <h3 className="font-bold text-heading text-lg">승인</h3>
                <p className="text-body mt-1">
                  AI가 만든 초안은 <strong>바로 보내지 않아요</strong>.
                  터미널에 초안 내용이 표시되고, 여러분이 <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">y</code>를 눌러야
                  Gmail 임시보관함(Draft)에 저장돼요.
                </p>
                <span className="inline-block mt-2 text-xs font-medium bg-accent-light text-accent px-2 py-1 rounded-lg">
                  사람이 확인 (안전장치)
                </span>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-caption">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="relative bg-elevated border-2 border-indigo-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-500 text-white font-bold flex items-center justify-center text-lg">
                6
              </div>
              <div>
                <h3 className="font-bold text-heading text-lg">반복 실행</h3>
                <p className="text-body mt-1">
                  완성된 스크립트를 <strong>매일 아침 자동 실행</strong>되도록 스케줄에 등록해요.
                  한 번 설정하면 매일 출근 전에 메일 정리가 끝나 있어요.
                </p>
                <span className="inline-block mt-2 text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
                  cron / Task Scheduler
                </span>
              </div>
            </div>
          </div>
        </div>

        <Callout type="tip" title="핵심 포인트">
          <p>
            이 6단계를 여러분이 직접 코딩하는 게 아니에요.
            Claude Code에게 프롬프트 하나만 주면, 이 전체 파이프라인을 자동으로 만들어줘요.
          </p>
        </Callout>
      </section>

      {/* ── 프롬프트 팁 ── */}
      <section id="prompt-tips" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          좋은 프롬프트 작성법 3가지 공식
        </h2>
        <p className="text-body leading-relaxed mb-6">
          Claude Code에게 일을 시킬 때, 프롬프트를 어떻게 쓰느냐에 따라 결과가 달라져요.
          아래 3가지 공식만 기억하면 돼요.
        </p>

        {/* Formula 1 */}
        <div className="bg-elevated border-2 border-primary-light rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-primary mb-3">
            공식 1: 파일 이름을 명시하라
          </h3>
          <CompareTable
            headers={["Bad", "Good"]}
            rows={[
              [
                '<span class="text-accent">&#10060;</span> &ldquo;이 파일 분석해줘&rdquo;',
                '<span class="text-accent">&#9989;</span> &ldquo;<strong>sales.csv</strong>를 읽어서&rdquo;',
              ],
              [
                '<span class="text-accent">&#10060;</span> &ldquo;데이터 정리해줘&rdquo;',
                '<span class="text-accent">&#9989;</span> &ldquo;<strong>report.xlsx</strong> 열어서&rdquo;',
              ],
            ]}
          />
          <p className="text-sm text-caption mt-3">
            어떤 파일인지 정확히 알려줘야 AI가 바로 실행할 수 있어요.
          </p>
        </div>

        {/* Formula 2 */}
        <div className="bg-elevated border-2 border-accent/30 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-accent mb-3">
            공식 2: 결과물을 명시하라
          </h3>
          <CompareTable
            headers={["Bad", "Good"]}
            rows={[
              [
                '<span class="text-accent">&#10060;</span> &ldquo;정리해줘&rdquo;',
                '<span class="text-accent">&#9989;</span> &ldquo;<strong>요약.xlsx로 저장</strong>해줘&rdquo;',
              ],
              [
                '<span class="text-accent">&#10060;</span> &ldquo;분석해줘&rdquo;',
                '<span class="text-accent">&#9989;</span> &ldquo;<strong>차트 포함한 보고서.html</strong> 만들어줘&rdquo;',
              ],
            ]}
          />
          <p className="text-sm text-caption mt-3">
            결과물의 형식과 파일명까지 알려주면, 원하는 형태로 정확히 저장돼요.
          </p>
        </div>

        {/* Formula 3 */}
        <div className="bg-elevated border-2 border-purple-200 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-purple-600 mb-3">
            공식 3: 이어서 수정하라
          </h3>
          <p className="text-body mb-3">
            한 번에 완벽할 필요가 없어요. 결과를 보고 추가 요청하면 돼요.
          </p>
          <div className="space-y-2">
            <div className="bg-purple-50 rounded-lg px-4 py-2 text-sm">
              <span className="font-medium text-purple-700">1차:</span>{" "}
              <span className="text-body">&ldquo;sales.csv 읽어서 부서별 집계표 만들어줘&rdquo;</span>
            </div>
            <div className="bg-purple-50 rounded-lg px-4 py-2 text-sm">
              <span className="font-medium text-purple-700">2차:</span>{" "}
              <span className="text-body">&ldquo;다시 해줘, 이번엔 차트도 추가해&rdquo;</span>
            </div>
            <div className="bg-purple-50 rounded-lg px-4 py-2 text-sm">
              <span className="font-medium text-purple-700">3차:</span>{" "}
              <span className="text-body">&ldquo;차트 색상을 파란색 계열로 바꿔줘&rdquo;</span>
            </div>
          </div>
        </div>

        {/* Formula Summary */}
        <div className="bg-primary text-white rounded-2xl p-6">
          <p className="font-bold text-lg mb-3 text-center">프롬프트 공식</p>
          <p className="text-center text-green-400 font-mono text-lg">
            [파일/상황] + [원하는 처리] + [결과물 형식/파일명]
          </p>
          <p className="text-center text-caption text-sm mt-3">
            예: &ldquo;sales.csv를 읽어서 부서별 매출 집계하고 요약.xlsx로 저장해줘&rdquo;
          </p>
        </div>
      </section>

      {/* ── 직접 해보기 ── */}
      <section id="try-it" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          직접 해보기
        </h2>
        <p className="text-body leading-relaxed mb-4">
          이제 직접 실행해볼게요. 아래 단계를 따라하세요.
        </p>

        <div className="bg-elevated border-2 border-primary-light rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-heading mb-4">실행 순서</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">1</span>
              <div>
                <p className="font-medium text-heading">작업 폴더로 이동</p>
                <p className="text-sm text-caption">credentials.json이 있는 폴더로 이동하세요.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">2</span>
              <div>
                <p className="font-medium text-heading">Claude Code 실행</p>
                <CodeBlock>{`claude`}</CodeBlock>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">3</span>
              <div>
                <p className="font-medium text-heading">프롬프트 입력</p>
                <CodeBlock>{`credentials.json으로
Gmail 자동화 해줘.
메일 분류하고, 뉴스레터는
읽음처리, 업무중요는 답장
초안 잡아줘. emails.json 저장.`}</CodeBlock>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">4</span>
              <div>
                <p className="font-medium text-heading">실행 과정 지켜보기</p>
                <p className="text-sm text-caption">Claude가 코드를 작성하고 실행하는 과정을 지켜보세요.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">5</span>
              <div>
                <p className="font-medium text-heading">답장 초안 승인</p>
                <p className="text-sm text-caption">
                  초안이 표시되면 <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">y</code> 또는{" "}
                  <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">n</code>으로 응답하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Callout type="warning" title="실행 중 주의사항">
          <ul className="space-y-2 mt-1">
            <li>
              <strong>Google 로그인 창이 떠요</strong> &mdash; 처음 실행 시 브라우저에서 Google 로그인 화면이 열려요.
              &ldquo;허용&rdquo;을 클릭하세요. &ldquo;확인되지 않은 앱&rdquo; 경고가 나오면 &ldquo;고급&rdquo; &rarr; &ldquo;계속&rdquo;을 누르세요.
            </li>
            <li>
              <strong>y/n 선택은 원하는 대로</strong> &mdash; 답장 초안이 마음에 들면 y, 아니면 n을 누르세요.
              n을 눌러도 아무 문제 없어요. Draft에 저장하지 않을 뿐이에요.
            </li>
            <li>
              <strong>에러가 나도 당황하지 마세요</strong> &mdash; Claude Code는 에러가 발생하면 스스로 원인을 분석하고 수정해요.
              가만히 지켜보면 자동으로 해결하는 경우가 대부분이에요.
            </li>
          </ul>
        </Callout>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          확인 체크리스트
        </h3>
        <div className="bg-accent-light border border-accent/30 rounded-2xl p-6">
          <div className="space-y-3">
            {[
              "emails.json 파일이 작업 폴더에 생성되었다",
              "터미널에 메일 분류 결과 (업무중요/뉴스레터/알림/기타)가 출력되었다",
              "Gmail 임시보관함에 Draft가 1개 이상 저장되었다",
            ].map((item, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-accent/30 text-accent focus:ring-accent"
                />
                <span className="text-body">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <Callout type="tip" title="잘 안 되나요?">
          <p>
            가장 흔한 문제는 credentials.json 파일 위치예요.
            작업 폴더에 파일이 있는지 다시 확인해보세요.
          </p>
          <p className="mt-2">
            그래도 안 되면 Claude Code에게 이렇게 물어보세요:{" "}
            <strong>&ldquo;에러 원인을 찾아서 해결해줘&rdquo;</strong>
          </p>
        </Callout>
      </section>

      {/* ── 스케줄 등록 ── */}
      <section id="schedule" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          매일 아침 자동 실행 설정
        </h2>
        <p className="text-body leading-relaxed mb-4">
          자동화 스크립트가 완성됐으면, 매일 아침 자동으로 실행되게 만들 수 있어요.
          Claude Code가 만든 Python 스크립트를 스케줄러에 등록하면 돼요.
        </p>

        <p className="text-body leading-relaxed mb-6">
          Claude Code에게 이렇게 요청하세요:
        </p>

        <CodeBlock title="Claude Code에 입력">{`이 스크립트를 매일 아침 9시에
자동 실행되도록 등록해줘`}</CodeBlock>

        <p className="text-body leading-relaxed mt-6 mb-4">
          Claude Code가 운영체제에 맞게 자동으로 설정해줘요.
          직접 설정하고 싶다면 아래를 참고하세요.
        </p>

        <OsTabs
          title="OS별 스케줄 설정 방법"
          mac={`# crontab 편집기 열기
crontab -e

# 아래 줄을 추가 (매일 아침 9시 실행)
0 9 * * * cd ~/Desktop/autowork && python3 gmail_auto.py

# 저장하고 닫기 (:wq)
# 등록 확인
crontab -l`}
          windows={`# Windows Task Scheduler 사용
# 1. 시작 메뉴 → "작업 스케줄러" 검색 → 실행
# 2. "기본 작업 만들기" 클릭
# 3. 이름: "Gmail 자동화"
# 4. 트리거: "매일" → 오전 9:00
# 5. 동작: "프로그램 시작"
#    프로그램: python
#    인수: gmail_auto.py
#    시작 위치: C:\\Users\\PC\\Desktop\\autowork
# 6. 마침

# 또는 PowerShell로 한 번에 등록:
$action = New-ScheduledTaskAction \`
  -Execute "python" \`
  -Argument "gmail_auto.py" \`
  -WorkingDirectory "$HOME\\Desktop\\autowork"
$trigger = New-ScheduledTaskTrigger \`
  -Daily -At 9am
Register-ScheduledTask \`
  -TaskName "Gmail자동화" \`
  -Action $action \`
  -Trigger $trigger`}
        />

        <Callout type="info" title="스케줄 등록도 Claude Code에게 맡기세요">
          <p>
            위 설정이 복잡하게 느껴진다면, 그냥 Claude Code에게
            &ldquo;매일 아침 9시에 자동 실행되게 해줘&rdquo;라고 말하면 돼요.
            OS를 자동으로 감지해서 알아서 등록해줘요.
          </p>
        </Callout>
      </section>

      {/* ── 정리 ── */}
      <section id="recap" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          정리
        </h2>

        <div className="bg-elevated border border-border-subtle rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-heading mb-4">오늘 만든 Gmail 자동화 흐름</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {[
              "API 인증",
              "메일 수집",
              "AI 분류",
              "읽음 처리",
              "답장 초안",
              "승인",
              "스케줄",
            ].map((step, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                <span className="bg-primary-lighter text-primary px-3 py-1.5 rounded-lg font-medium">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-caption">&rarr;</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="border-2 border-border-subtle rounded-xl p-6 text-center my-8 bg-subtle">
          <p className="text-lg font-bold text-heading mb-1">
            사람이 한 것: 프롬프트 1개 + y/n 몇 번
          </p>
          <p className="text-lg font-bold text-primary">
            AI가 한 것: 나머지 전부
          </p>
          <p className="text-sm text-caption mt-3">
            코드를 직접 짜지 않아도, 매일 30분 걸리던 메일 정리가 자동화돼요.
          </p>
        </div>

        <Callout type="tip" title="Gmail 말고 다른 것도?">
          <p>
            같은 방식으로 <strong>엑셀 집계</strong>, <strong>PPT 생성</strong> 같은 것도 자동화할 수 있어요.
            매주 반복하는 엑셀 작업이 있다면, 그것도 프롬프트 하나로 해결 가능하거든요.
          </p>
        </Callout>
      </section>
    </>
  );
}
