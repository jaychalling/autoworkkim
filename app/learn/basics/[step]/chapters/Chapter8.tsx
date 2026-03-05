"use client";

import Callout from "@/components/learn/Callout";
import CodeBlock from "@/components/learn/CodeBlock";
import CompareTable from "@/components/learn/CompareTable";
import OsTabs from "@/components/learn/OsTabs";

export default function Chapter8() {
  return (
    <>
      {/* ── 설치 ── */}
      <section id="install">
        <h2>Playwright 설치하기</h2>

        <p>
          Claude Code는 터미널에서 동작하기 때문에 기본적으로 브라우저가 없어요.
          <strong>Playwright</strong>를 설치하면 AI가 웹 브라우저를 직접 조종할 수 있게 돼요.
          설치는 한마디면 충분해요.
        </p>

        <CodeBlock title="Claude Code에 이렇게 말하세요">
{`Playwright를 설치해줘`}
        </CodeBlock>

        <p>
          이 한마디면 Claude Code가 알아서 해요:
        </p>

        <div className="grid gap-3 my-6">
          {[
            { icon: "1", text: "npm install playwright 실행", desc: "Playwright 패키지 설치" },
            { icon: "2", text: "npx playwright install 실행", desc: "Chromium, Firefox, WebKit 브라우저 다운로드" },
            { icon: "3", text: "설치 확인", desc: "정상 설치 여부 테스트" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-accent-light border border-accent/30 rounded-xl px-4 py-3"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center">
                {item.icon}
              </span>
              <div>
                <span className="font-medium text-heading">{item.text}</span>
                <p className="text-sm text-caption mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p>
          수동으로 하고 싶다면, 터미널에서 직접 실행할 수도 있어요.
        </p>

        <OsTabs
          windows={`npm install playwright\nnpx playwright install chromium`}
          mac={`npm install playwright\nnpx playwright install chromium`}
        />

        <Callout type="info" title="Chromium만 설치해도 돼요">
          <p>
            Playwright는 Chromium, Firefox, WebKit 세 가지 브라우저를 지원해요.
            대부분의 웹 자동화에는 Chromium(크롬 기반)만 있으면 충분해요.
            전부 설치하면 용량이 크니까, Chromium만 설치하는 것을 권장해요.
          </p>
        </Callout>
      </section>

      {/* ── 첫 실행 ── */}
      <section id="first-run">
        <h2>첫 실행: 스크린샷 찍어보기</h2>

        <p>
          설치가 끝났으면 바로 테스트해봐요.
          Claude Code에게 이렇게 말해보세요.
        </p>

        <CodeBlock title="Claude Code에 이렇게 말하세요">
{`Playwright로 네이버 메인 페이지를 열어서
스크린샷을 찍어줘`}
        </CodeBlock>

        <p>
          Claude Code가 Playwright 코드를 작성하고 실행해서,
          네이버 메인 페이지의 스크린샷을 저장해줄 거예요.
          파일이 생성되면 직접 열어서 확인해보세요.
        </p>

        <p>
          이게 바로 &ldquo;AI가 브라우저를 조종한다&rdquo;는 거예요.
          사람이 크롬을 열고, 주소를 입력하고, 스크린샷을 찍는 과정을
          AI가 대신 해준 거거든요.
        </p>

        <Callout type="tip" title="안 되면 이렇게">
          <p>
            혹시 에러가 나면 Claude Code에게 &ldquo;에러가 났어, 해결해줘&rdquo;라고 하세요.
            에이전틱 AI의 장점이 바로 이거예요 &mdash; 에러를 스스로 분석하고 수정해요.
          </p>
        </Callout>
      </section>

      {/* ── 이해하기: Playwright란? ── */}
      <section id="what-is-playwright">
        <h2>이해하기: Playwright란?</h2>

        <p>
          방금 스크린샷이 찍혔죠? 그 과정에서 무슨 일이 있었는지 알아볼게요.
        </p>

        <p>
          Playwright는 Microsoft가 만든 <strong>브라우저 자동화 도구</strong>예요.
          쉽게 말하면, 사람이 브라우저에서 하는 모든 동작 &mdash;
          클릭, 타이핑, 스크롤, 스크린샷 &mdash; 을 코드로 대신 해주는 로봇이에요.
        </p>

        <CompareTable
          headers={["비교", "사람이 직접", "Playwright"]}
          rows={[
            ["브라우저 열기", "더블클릭으로 크롬 실행", "코드 한 줄로 자동 실행"],
            ["로그인", "아이디/비밀번호 직접 입력", "저장된 정보로 자동 입력"],
            ["데이터 복사", "눈으로 찾아서 Ctrl+C", "CSS 선택자로 정확히 추출"],
            ["스크린샷", "캡처 프로그램 실행", "원하는 시점에 자동 저장"],
            ["반복 작업", "매일 수동으로 반복", "한 번 만들면 자동 반복"],
          ]}
        />

        <p>
          핵심은 이거예요 &mdash; <strong>여러분이 코드를 짤 필요가 없어요</strong>.
          Claude Code에게 &ldquo;네이버 뉴스 열어서 헤드라인 10개 가져와줘&rdquo;라고 하면,
          Claude가 알아서 Playwright 코드를 짜서 실행해요.
          여러분은 결과만 받으면 돼요.
        </p>

        <Callout type="tip">
          <p>
            Playwright를 설치한다는 건, Claude Code에게 &ldquo;눈&rdquo;을 달아주는 거예요.
            파일만 다루던 AI가 이제 웹 세상도 볼 수 있게 되는 거죠.
          </p>
        </Callout>

        <Callout type="info" title="다음 Step과의 연결">
          <p>
            다음 Step에서 Gmail 자동화를 할 때 Google 인증이 필요해요.
            Playwright가 있으면 이 인증을 브라우저에서 자동으로 처리할 수 있거든요.
            그래서 Playwright를 먼저 설치해둔 거예요.
          </p>
        </Callout>
      </section>

      {/* ── Google 인증 ── */}
      <section id="google-auth">
        <h2>Google 인증 쉽게 하기</h2>

        <p>
          Gmail 자동화, Google Drive 연동 등을 하려면
          Google 계정 인증이 필요해요.
          보통은 OAuth 토큰을 발급받는 복잡한 과정을 거쳐야 하는데,
          Playwright가 있으면 훨씬 쉬워져요.
        </p>

        <CompareTable
          headers={["방법", "Playwright 없이", "Playwright 있을 때"]}
          rows={[
            [
              "인증 방식",
              "터미널에서 URL 복사 &rarr; 브라우저에 붙여넣기 &rarr; 로그인 &rarr; 코드 복사 &rarr; 터미널에 붙여넣기",
              "Claude Code가 브라우저를 열어서 자동으로 로그인 처리",
            ],
            ["소요 시간", "3~5분 (수동)", "30초 (자동)"],
            ["난이도", "초보자에게 어려움", "한마디면 끝"],
          ]}
        />

        <CodeBlock title="Claude Code에 이렇게 말하세요">
{`Google OAuth 인증을 Playwright로 처리해줘.
브라우저를 열어서 내가 직접 로그인할 수 있게 해줘.`}
        </CodeBlock>

        <p>
          Claude Code가 Playwright로 브라우저를 열면, 여러분이 직접 Google 계정에 로그인하면 돼요.
          로그인이 완료되면 Claude Code가 인증 토큰을 자동으로 저장해요.
          다음부터는 이 토큰을 재사용하니까 다시 로그인할 필요가 없어요.
        </p>

        <Callout type="warning" title="비밀번호는 안전해요">
          <p>
            Playwright가 브라우저를 열어주지만, 로그인은 여러분이 직접 해요.
            비밀번호가 Claude Code에게 전달되거나 외부로 전송되지 않아요.
            일반적인 브라우저 로그인과 동일한 과정이에요.
          </p>
        </Callout>
      </section>

      {/* ── 실전 예제 ── */}
      <section id="real-example">
        <h2>실전: 웹에서 데이터 수집</h2>

        <p>
          이제 실제로 유용한 작업을 해봐요.
          웹 페이지에서 데이터를 자동으로 수집하는 거예요.
        </p>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          예시 1: 뉴스 헤드라인 수집
        </h3>

        <CodeBlock title="Claude Code에 이렇게 말하세요">
{`네이버 뉴스에서 오늘의 주요 헤드라인 10개를
제목과 링크를 포함해서 엑셀로 저장해줘`}
        </CodeBlock>

        <p>
          Claude Code가 Playwright로 네이버 뉴스 페이지를 열고,
          헤드라인을 자동으로 추출해서 엑셀 파일로 저장해줘요.
          매일 아침 이 명령 하나면 뉴스 클리핑이 끝나요.
        </p>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          예시 2: 경쟁사 가격 모니터링
        </h3>

        <CodeBlock title="Claude Code에 이렇게 말하세요">
{`쿠팡에서 "무선 키보드" 검색해서
상위 10개 상품의 이름, 가격, 평점을
비교표로 정리해줘`}
        </CodeBlock>

        <p>
          사람이 하면 30분 걸릴 작업을, AI가 2분 안에 끝내요.
          매주 가격 변동을 추적한다면? 엄청난 시간 절약이에요.
        </p>

        <Callout type="info">
          <p>
            웹 스크래핑은 사이트의 이용 약관을 확인하고 진행하세요.
            개인적인 데이터 수집은 대부분 괜찮지만,
            대량의 상업적 수집은 주의가 필요해요.
          </p>
        </Callout>
      </section>

      {/* ── 활용 사례 ── */}
      <section id="use-cases">
        <h2>이런 것도 가능해요</h2>

        <p>
          Playwright를 설치하면 Claude Code가 할 수 있는 일이 크게 늘어나요.
        </p>

        <ul className="space-y-4 my-6">
          <li className="bg-subtle rounded-xl p-4 border border-border-subtle">
            <strong className="text-primary">웹 폼 자동 작성</strong>
            <p className="text-body mt-1">
              반복적으로 작성해야 하는 웹 양식 &mdash; 출장 보고, 경비 청구,
              설문 응답 등을 자동으로 채워줘요.
            </p>
          </li>
          <li className="bg-subtle rounded-xl p-4 border border-border-subtle">
            <strong className="text-primary">PDF 다운로드 자동화</strong>
            <p className="text-body mt-1">
              사내 시스템에서 매월 발행되는 리포트나 세금계산서를
              자동으로 다운로드해서 정리해줘요.
            </p>
          </li>
          <li className="bg-subtle rounded-xl p-4 border border-border-subtle">
            <strong className="text-primary">웹 페이지 모니터링</strong>
            <p className="text-body mt-1">
              특정 페이지의 내용이 변경되면 알려줘요.
              채용 공고, 입찰 공고, 세일 정보 등을 자동으로 감시할 수 있어요.
            </p>
          </li>
          <li className="bg-subtle rounded-xl p-4 border border-border-subtle">
            <strong className="text-primary">스크린샷 보고서</strong>
            <p className="text-body mt-1">
              여러 웹 페이지의 스크린샷을 자동으로 찍어서 비교 보고서를 만들어요.
              UI 변경 추적이나 경쟁사 분석에 유용해요.
            </p>
          </li>
        </ul>

        <Callout type="tip" title="핵심 포인트">
          <p>
            Playwright는 &ldquo;도구&rdquo;이고, Claude Code는 &ldquo;조종사&rdquo;예요.
            도구를 설치해두면 조종사가 알아서 필요할 때 꺼내 써요.
            &ldquo;Playwright로 해줘&rdquo;라고 명시하지 않아도,
            웹 작업이 필요하면 Claude Code가 자동으로 Playwright를 사용해요.
          </p>
        </Callout>
      </section>

      {/* ── 직접 해보기 ── */}
      <section id="try-it">
        <h2>직접 해보기</h2>

        <p>
          아래 프롬프트 중 하나를 골라서 Claude Code에 입력해보세요.
        </p>

        <div className="space-y-4 my-6">
          <div className="bg-subtle border border-border-default rounded-xl p-5">
            <h4 className="font-semibold text-heading mb-2">
              도전 1: 날씨 확인
            </h4>
            <CodeBlock>
{`기상청 사이트에서 오늘 서울 날씨를 확인해서 알려줘`}
            </CodeBlock>
          </div>

          <div className="bg-subtle border border-border-default rounded-xl p-5">
            <h4 className="font-semibold text-heading mb-2">
              도전 2: 환율 조회
            </h4>
            <CodeBlock>
{`네이버에서 현재 달러-원 환율을 확인해서 알려줘`}
            </CodeBlock>
          </div>

          <div className="bg-subtle border border-border-default rounded-xl p-5">
            <h4 className="font-semibold text-heading mb-2">
              도전 3: 내가 원하는 사이트
            </h4>
            <CodeBlock>
{`[원하는 사이트 URL]에 들어가서
[원하는 정보]를 가져와줘`}
            </CodeBlock>
          </div>
        </div>

        <Callout type="tip">
          <p>
            에러가 나도 괜찮아요. Claude Code에게 &ldquo;에러 해결해줘&rdquo;라고 하면
            알아서 다른 방법을 시도해요. 이게 에이전틱 AI의 힘이에요.
          </p>
        </Callout>
      </section>

      {/* ── 정리 ── */}
      <section id="recap">
        <h2>정리</h2>

        <CompareTable
          headers={["항목", "내용"]}
          rows={[
            ["Playwright란?", "브라우저를 코드로 조종하는 자동화 도구"],
            ["왜 필요해?", "Claude Code에게 &ldquo;눈&rdquo;을 달아줌 &mdash; 웹 작업 가능"],
            ["설치 방법", "Claude Code에게 &ldquo;Playwright 설치해줘&rdquo; 한마디"],
            ["Google 인증", "Playwright 덕분에 브라우저에서 쉽게 인증 처리"],
            ["활용 범위", "데이터 수집, 폼 작성, 모니터링, 스크린샷 등"],
          ]}
        />

        <Callout type="tip" title="다음 Step에서는?">
          <p>
            Playwright가 준비됐으니, 다음 Step에서 본격적으로 Gmail 자동화에 들어가요.
            Google 인증도 Playwright로 쉽게 처리할 수 있어서, 훨씬 수월할 거예요.
          </p>
        </Callout>
      </section>
    </>
  );
}
