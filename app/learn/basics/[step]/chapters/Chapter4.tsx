"use client";

import Callout from "@/components/learn/Callout";
import CodeBlock from "@/components/learn/CodeBlock";
import CompareTable from "@/components/learn/CompareTable";

export default function Chapter4() {
  return (
    <>
      {/* ── 바로 실행하기 ── */}
      <section id="execute">
        <h2 className="text-2xl font-bold text-heading mb-4">
          바로 실행하기
        </h2>
        <p className="text-body leading-relaxed mb-4">
          매주 같은 엑셀 작업을 반복하고 계시다면, 프롬프트 하나면 끝이에요.
          아래 프롬프트를 Claude Code에 그대로 입력해보세요.
        </p>

        <CodeBlock title="Claude Code에 입력">{`sales_data.xlsx 읽어서
부서별 매출 집계하고,
요약표에 SUM 수식 넣어서
결과.xlsx로 저장해줘.
원본은 건드리지 마.`}</CodeBlock>

        <Callout type="tip" title="프롬프트 분석">
          <p>이 프롬프트에는 좋은 프롬프트의 3가지 공식이 모두 들어있어요:</p>
          <ul className="mt-2 space-y-1">
            <li><strong>파일 명시</strong>: &quot;sales_data.xlsx 읽어서&quot;</li>
            <li><strong>처리 내용</strong>: &quot;부서별 매출 집계하고, SUM 수식 넣어서&quot;</li>
            <li><strong>결과물 명시</strong>: &quot;결과.xlsx로 저장해줘&quot;</li>
          </ul>
          <p className="mt-2">추가로 &quot;원본은 건드리지 마&quot;까지 명시했거든요. 완벽한 프롬프트예요!</p>
        </Callout>

        <p className="text-body leading-relaxed mt-6 mb-4">
          이 프롬프트를 입력하면 Claude Code가 파이썬 코드를 자동으로 작성하고 실행해요.
          엑셀을 읽고, 분석하고, 집계하고, 새 파일로 저장하는 것까지 전부 알아서 해줘요.
        </p>
      </section>

      {/* ── 실행 결과 확인 ── */}
      <section id="result" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          실행 결과 확인
        </h2>
        <p className="text-body leading-relaxed mb-4">
          프롬프트를 입력하면 터미널에 아래와 같은 결과가 나와요.
        </p>

        <CodeBlock title="터미널 실행 결과 (예시)">{`📊 엑셀 자동화 시작...

✅ sales_data.xlsx 읽기 완료
  - 시트: 1개
  - 행: 1,247개
  - 열: 날짜, 부서, 품목, 금액, 담당자

🔍 데이터 정제 중...
  - 빈 칸 3개 → 0으로 채움
  - 날짜 형식 통일 완료

📈 부서별 집계 결과:
┌──────────┬───────────┬───────────┐
│ 부서     │ 총 매출   │ 건수      │
├──────────┼───────────┼───────────┤
│ 영업1팀  │ 45,200만  │ 312건     │
│ 영업2팀  │ 38,700만  │ 287건     │
│ 마케팅   │ 22,100만  │ 198건     │
│ 기획팀   │ 18,300만  │ 156건     │
│ 해외사업 │ 31,500만  │ 294건     │
├──────────┼───────────┼───────────┤
│ 합계     │ 155,800만 │ 1,247건   │
└──────────┴───────────┴───────────┘

✅ 요약표에 SUM/AVERAGE 수식 삽입 완료
💾 결과.xlsx 저장 완료
📁 원본 sales_data.xlsx → 변경 없음`}</CodeBlock>

        <div className="bg-gradient-to-r from-primary-lighter to-accent-light border border-primary-light rounded-2xl p-6 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-caption mb-2">수동으로 하면</p>
              <p className="text-lg font-bold text-accent">
                30분 ~ 2시간
              </p>
              <p className="text-sm text-caption">복사, 분류, 수식, 서식...</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-caption mb-2">Claude Code로 하면</p>
              <p className="text-lg font-bold text-primary">
                프롬프트 1개, 30초
              </p>
              <p className="text-sm text-caption">나머지는 AI가 전부 처리</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 이해하기: Claude가 하는 일 ── */}
      <section id="understand" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          이해하기: Claude가 하는 일
        </h2>
        <p className="text-body leading-relaxed mb-4">
          방금 프롬프트 하나로 엑셀이 정리됐죠?
          그 과정에서 Claude Code가 뭘 했는지 알아볼게요.
        </p>

        <div className="space-y-3">
          {[
            {
              icon: "1",
              title: "파이썬 라이브러리 설치 & 파일 읽기",
              desc: "openpyxl, pandas 라이브러리를 자동 설치하고 엑셀 파일을 읽어와요. 시트가 여러 개여도 전부 분석해요.",
              color: "bg-primary",
            },
            {
              icon: "2",
              title: "데이터 정제 + 결측값 처리",
              desc: "빈 칸, 잘못된 형식, 중복 데이터를 자동으로 정리해요. 수동으로 하면 가장 시간 많이 걸리는 부분이잖아요.",
              color: "bg-purple-500",
            },
            {
              icon: "3",
              title: "부서별 / 월별 피벗 집계",
              desc: "부서별, 월별로 데이터를 그룹화하고 합계, 평균 등을 계산해요. 피벗 테이블을 직접 만드는 것과 같은 결과예요.",
              color: "bg-accent",
            },
            {
              icon: "4",
              title: "엑셀 수식 (SUM / AVERAGE) 삽입",
              desc: "단순히 값을 넣는 게 아니라, 실제 엑셀 수식(=SUM, =AVERAGE)을 셀에 삽입해요. 나중에 데이터가 바뀌어도 자동 계산돼요.",
              color: "bg-accent",
            },
            {
              icon: "5",
              title: "새 파일 저장 (원본 보존)",
              desc: "결과를 '결과.xlsx'로 저장해요. 원본 파일은 절대 수정하지 않아요.",
              color: "bg-accent",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-elevated border border-border-subtle rounded-xl p-4"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${item.color} text-white font-bold flex items-center justify-center text-sm`}>
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-heading">{item.title}</p>
                <p className="text-sm text-caption mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="info" title="openpyxl과 pandas가 뭔가요?">
          <p>
            Claude Code가 엑셀을 처리할 때 주로 사용하는 Python 라이브러리예요.
            <strong>openpyxl</strong>은 엑셀 파일(.xlsx)을 직접 읽고 쓰는 라이브러리이고,
            <strong>pandas</strong>는 데이터를 분석하고 가공하는 라이브러리예요.
            여러분이 이 라이브러리를 알 필요는 없어요 &mdash; Claude Code가 알아서 설치하고 사용하거든요.
          </p>
        </Callout>
      </section>

      {/* ── 직접 해보기 ── */}
      <section id="try-it" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          직접 해보기
        </h2>
        <p className="text-body leading-relaxed mb-4">
          실습용 엑셀 파일이 없어도 괜찮아요. Claude Code가 샘플 데이터부터 만들어주거든요.
          아래 프롬프트를 그대로 입력해보세요.
        </p>

        <Callout type="info" title="엑셀이 없어도 돼요">
          <p>
            실습용 엑셀 파일이 없어도 걱정하지 마세요.
            Claude Code에게 &quot;샘플 매출 데이터 만들어줘&quot;라고 하면 연습용 파일을 자동으로 생성해줘요.
            실제 업무 파일이 있다면 그걸 써도 돼요.
          </p>
        </Callout>

        <CodeBlock title="Claude Code에 입력">{`샘플 매출 데이터 엑셀 파일 만들어줘.
그다음 부서별로 집계해서
SUM 수식 넣은 요약표 포함한
결과.xlsx 만들어줘.
원본은 보존.`}</CodeBlock>

        <p className="text-body leading-relaxed mt-6 mb-4">
          이 프롬프트 하나로 Claude Code가 아래를 전부 처리해요:
        </p>

        <div className="grid gap-2 mb-6">
          {[
            "부서별 매출이 담긴 샘플 엑셀 파일(sales_data.xlsx)을 자동 생성",
            "데이터를 부서별, 월별로 분류하고 집계",
            "SUM, AVERAGE 등 실제 엑셀 수식을 포함한 요약 시트 생성",
            "결과.xlsx로 저장 (원본 보존)",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-accent font-bold flex-shrink-0">&#10003;</span>
              <span className="text-body">{text}</span>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-heading mb-3 mt-8">
          확인 체크리스트
        </h3>
        <div className="bg-accent-light border border-accent/30 rounded-2xl p-6">
          <div className="space-y-3">
            {[
              "샘플 엑셀 파일(sales_data.xlsx)이 생성되었다",
              "터미널에 부서별 집계 결과가 출력되었다",
              "결과.xlsx 파일이 저장되었다",
              "결과.xlsx를 열어보니 SUM 수식이 들어있다",
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

        <Callout type="info" title="실제 업무 파일이 있다면">
          <p>
            실습용 샘플 대신 본인의 실제 엑셀 파일을 사용해도 돼요.
            파일을 작업 폴더에 넣고, 프롬프트에서 파일명만 바꾸세요.
          </p>
          <p className="mt-2 font-medium">
            예: &quot;2월_매출현황.xlsx 읽어서 부서별 집계하고 요약표 만들어줘&quot;
          </p>
        </Callout>

        <Callout type="tip" title="결과 파일 확인 방법">
          <p>
            작업 폴더에서 결과.xlsx를 더블클릭하면 엑셀(또는 Google Sheets)로 열려요.
            요약 시트의 합계 셀을 클릭해보면, 단순 숫자가 아니라{" "}
            <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">=SUM(B2:B6)</code>{" "}
            같은 실제 수식이 들어있는 걸 확인할 수 있어요.
          </p>
        </Callout>

        <Callout type="tip" title="Excel 안에서 Claude를 쓸 수도 있어요">
          <p>
            Claude Pro 이상 구독자는 <strong>Excel 안에서 직접 Claude를 사용</strong>할 수 있어요.
            Microsoft 365의 Copilot과 비슷하지만, Claude의 강력한 분석 능력을 엑셀에서 바로 쓸 수 있는 거예요.
            셀을 선택하고 Claude에게 분석을 요청하면, 엑셀을 떠나지 않고도 AI 도움을 받을 수 있어요.
          </p>
        </Callout>
      </section>

      {/* ── 엑셀 자동화 팁 ── */}
      <section id="tips" className="mt-16">
        <h2 className="text-2xl font-bold text-heading mb-4">
          엑셀 자동화 꿀팁 4가지
        </h2>
        <p className="text-body leading-relaxed mb-6">
          Claude Code로 엑셀 작업할 때 알아두면 좋은 팁들이에요.
          이 팁들을 활용하면 더 정확하고 원하는 결과를 얻을 수 있어요.
        </p>

        {/* Tip 1 */}
        <div className="bg-elevated border-2 border-primary-light rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-white font-bold flex items-center justify-center">
              1
            </span>
            <div>
              <h3 className="font-bold text-heading text-lg">원본 파일은 항상 보존 지시</h3>
              <p className="text-body mt-2">
                프롬프트에 반드시 <strong>&quot;원본은 건드리지 마&quot;</strong> 또는
                <strong>&quot;원본은 보존&quot;</strong>을 넣으세요.
                Claude Code는 기본적으로 원본을 보존하지만, 명시적으로 말해주면 더 확실해요.
              </p>
              <CompareTable
                headers={["이렇게 하지 마세요", "이렇게 하세요"]}
                rows={[
                  [
                    "&quot;data.xlsx 정리해줘&quot;",
                    "&quot;data.xlsx 정리해서 <strong>새 파일</strong>로 저장해줘. <strong>원본 보존</strong>.&quot;",
                  ],
                ]}
              />
            </div>
          </div>
        </div>

        {/* Tip 2 */}
        <div className="bg-elevated border-2 border-accent/30 rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent text-white font-bold flex items-center justify-center">
              2
            </span>
            <div>
              <h3 className="font-bold text-heading text-lg">&quot;수식으로 넣어줘&quot;를 명시</h3>
              <p className="text-body mt-2">
                사실 기본적으로 Claude Code는 계산된 값(숫자)을 셀에 넣거든요.
                <strong>&quot;수식으로 넣어줘&quot;</strong>라고 명시하면, 실제 엑셀 수식(=SUM, =AVERAGE 등)을 삽입해요.
                나중에 원본 데이터가 바뀌어도 자동으로 재계산돼요.
              </p>
              <CompareTable
                headers={["결과", "프롬프트 차이"]}
                rows={[
                  [
                    "셀에 <strong>1,500,000</strong> (고정값)",
                    "&quot;합계를 계산해줘&quot;",
                  ],
                  [
                    "셀에 <strong>=SUM(B2:B10)</strong> (수식)",
                    "&quot;합계를 <strong>SUM 수식으로</strong> 넣어줘&quot;",
                  ],
                ]}
              />
            </div>
          </div>
        </div>

        {/* Tip 3 */}
        <div className="bg-elevated border-2 border-purple-200 rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500 text-white font-bold flex items-center justify-center">
              3
            </span>
            <div>
              <h3 className="font-bold text-heading text-lg">차트 종류를 구체적으로</h3>
              <p className="text-body mt-2">
                &quot;차트 만들어줘&quot;라고만 하면 Claude가 적당한 걸 골라줘요.
                근데 원하는 차트가 있다면 구체적으로 말하는 게 좋아요.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                {[
                  { name: "막대 차트", desc: "비교에 적합", icon: "📊" },
                  { name: "선 차트", desc: "추이/변화에 적합", icon: "📈" },
                  { name: "파이 차트", desc: "비율에 적합", icon: "🥧" },
                  { name: "꺾은선+막대", desc: "복합 비교", icon: "📉" },
                ].map((chart, i) => (
                  <div key={i} className="bg-purple-50 rounded-xl p-3 text-center">
                    <span className="text-2xl">{chart.icon}</span>
                    <p className="font-medium text-heading text-sm mt-1">{chart.name}</p>
                    <p className="text-xs text-caption">{chart.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-caption mt-3">
                예: &quot;부서별 매출을 <strong>막대 차트</strong>로 만들어줘&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Tip 4 */}
        <div className="bg-elevated border-2 border-border-default rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent text-white font-bold flex items-center justify-center">
              4
            </span>
            <div>
              <h3 className="font-bold text-heading text-lg">여러 파일 한 번에 처리</h3>
              <p className="text-body mt-2">
                엑셀 파일이 여러 개라면? <strong>&quot;폴더 내 모든 xlsx를&quot;</strong> 패턴을 사용하세요.
                Claude Code가 폴더에 있는 모든 엑셀 파일을 한꺼번에 읽어서 처리해요.
              </p>
              <CodeBlock title="예시 프롬프트">{`data 폴더 안에 있는 모든 xlsx 파일을
읽어서 하나로 합치고,
부서별 집계표 만들어서
통합보고서.xlsx로 저장해줘.`}</CodeBlock>
            </div>
          </div>
        </div>

        {/* 응용 아이디어 */}
        <Callout type="tip" title="이런 것도 가능해요 - 응용 아이디어">
          <p className="mb-3">
            엑셀 자동화는 매출 집계뿐만이 아니에요.
            아래와 같은 업무도 같은 방식으로 자동화할 수 있어요:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>주간 보고서 자동 생성</strong> &mdash;
              이번 주 데이터를 모아서 보고서 양식으로 정리
            </li>
            <li>
              <strong>회의록 정리</strong> &mdash;
              회의록 텍스트를 읽어서 액션 아이템별로 엑셀 정리
            </li>
            <li>
              <strong>매출 분석 대시보드</strong> &mdash;
              매출 데이터를 분석해서 차트 포함 HTML 보고서 생성
            </li>
            <li>
              <strong>프로젝트 현황 추적</strong> &mdash;
              여러 시트의 진행률을 하나의 현황표로 통합
            </li>
          </ul>
          <p className="mt-3 font-medium text-heading">
            공통점: 프롬프트 하나면 돼요. 핵심은 &quot;무엇을&quot;, &quot;어떻게&quot;, &quot;어디에 저장&quot;할지 명확히 말하는 거예요!
          </p>
        </Callout>

        <Callout type="info" title="Claude Code 구독 안내">
          <p>
            이 실습에는 <strong>Claude 구독</strong>이 필요해요.
            API 키는 필요 없고, claude.ai에서 구독만 하면 바로 사용할 수 있어요.
          </p>
          <p className="mt-2">
            <strong>Claude Max 플랜 ($100/월)</strong>을 추천해요.
            엑셀 자동화처럼 반복적으로 Claude Code를 사용하는 업무에는 넉넉한 사용량이 필요하거든요.
            Pro 플랜($20/월)으로 시작한 후, 사용량이 부족하면 업그레이드하는 것도 좋은 방법이에요.
          </p>
        </Callout>

        {/* 마무리 */}
        <div className="border-2 border-border-subtle rounded-xl p-6 text-center my-8 bg-subtle">
          <p className="text-lg font-bold text-heading mb-1">
            매주 2시간 걸리던 엑셀 작업 &rarr; 프롬프트 1개, 30초
          </p>
          <p className="text-sm text-caption mt-2">
            코딩 경험이 없어도, 엑셀 고수가 아니어도 Claude Code가 대신 해줘요.
          </p>
        </div>
      </section>
    </>
  );
}
