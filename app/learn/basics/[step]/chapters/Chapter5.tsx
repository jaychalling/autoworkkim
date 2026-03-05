"use client";

import Callout from "@/components/learn/Callout";
import CodeBlock from "@/components/learn/CodeBlock";
import CompareTable from "@/components/learn/CompareTable";

export default function Chapter5() {
  return (
    <>
      {/* ───────────────── 바로 실행하기 ───────────────── */}
      <section id="execute">
        <h2>바로 실행하기</h2>

        <p>
          보고서 내용을 PPT에 또 옮기는 작업, 프롬프트 하나면 끝이에요.
          Claude Code에게 바로 시켜볼게요.
        </p>

        <h3>프롬프트</h3>
        <CodeBlock title="Claude Code에 입력">
{`"AI 업무 자동화 도입 제안" 주제로 발표자료 만들어줘.
5장, 차트 포함, python-pptx로 제안서.pptx 만들어줘.`}
        </CodeBlock>

        <h3>Claude가 하는 일</h3>
        <p>
          이 한마디를 받으면 Claude Code는 다음을 <strong>스스로 판단하고 실행</strong>해요.
        </p>
        <ol>
          <li><strong>python-pptx 설치</strong> &mdash; 필요한 라이브러리를 자동 설치</li>
          <li><strong>슬라이드 구성 + 본문 작성</strong> &mdash; 주제에 맞게 5장 구성, 각 슬라이드에 제목과 본문 배치</li>
          <li><strong>차트/도표 자동 삽입</strong> &mdash; 데이터를 생성하고 차트를 슬라이드에 삽입</li>
          <li><strong>색상 테마 + 레이아웃 적용</strong> &mdash; 일관된 디자인으로 프로페셔널한 외관</li>
          <li><strong>제안서.pptx 파일 저장</strong> &mdash; 바로 열어볼 수 있는 .pptx 파일 생성</li>
        </ol>

        <Callout type="tip" title="왜 python-pptx인가요?">
          <p>
            python-pptx는 Python으로 PowerPoint 파일을 만드는 라이브러리예요.
            Claude Code가 Python 코드를 작성 &rarr; 실행 &rarr; .pptx 파일을 생성하는 방식이에요.
            <br />
            근데 여러분이 Python을 몰라도 전혀 상관없어요. Claude가 다 해주거든요.
          </p>
        </Callout>
      </section>

      {/* ───────────────── 실행 결과 확인 ───────────────── */}
      <section id="result">
        <h2>실행 결과 확인</h2>

        <p>
          실행이 끝나면 작업 폴더에 <strong>제안서.pptx</strong> 파일이 생겨요.
          열어보면 이런 구성이에요.
        </p>

        <CompareTable
          headers={["슬라이드", "내용"]}
          rows={[
            ["1번 &mdash; 표지", "AI 업무 자동화 도입 제안 + 발표자/날짜"],
            ["2번 &mdash; 현황", "업무 시간 분석 차트 (반복 업무 비율)"],
            ["3번 &mdash; 문제점", "수작업의 비효율 포인트 정리"],
            ["4번 &mdash; 해결방안", "AI 자동화 도입 효과 비교 차트"],
            ["5번 &mdash; 기대효과", "시간 절감 + ROI 수치 요약"],
          ]}
        />

        <Callout type="info" title="PowerPoint 안에서 Claude 쓰기">
          <p>
            Claude Pro 이상 구독자는 <strong>PowerPoint 안에서 직접 Claude를 사용</strong>할 수도 있어요.
            슬라이드를 선택하고 AI에게 수정을 요청하면, PPT를 떠나지 않고 바로 편집할 수 있어요.
            python-pptx 방식과 PowerPoint 내 Claude &mdash; 상황에 맞게 선택하면 돼요.
          </p>
        </Callout>

        <Callout type="warning" title="파일이 안 열리나요?">
          <p>
            PowerPoint가 설치되어 있지 않으면 .pptx 파일을 열 수 없어요.
            <br />
            Google Slides에서 열기: Google Drive에 업로드 &rarr; 우클릭 &rarr; &ldquo;Google 프레젠테이션으로 열기&rdquo;
            <br />
            또는 무료 LibreOffice Impress를 사용할 수 있어요.
          </p>
        </Callout>
      </section>

      {/* ───────────────── 내 주제로 해보기 ───────────────── */}
      <section id="try-it">
        <h2>내 주제로 해보기</h2>

        <p>이번엔 자신의 업무에 맞는 주제로 바꿔서 해보세요.</p>

        <CodeBlock title="Claude Code에 입력">
{`"AI 업무 자동화 도입 제안" 주제로 PPT 만들어줘.
현황, 문제점, 해결방안, 기대효과, 일정 순서로.
python-pptx로 .pptx 저장.`}
        </CodeBlock>

        <Callout type="info" title="프롬프트 변형 아이디어">
          <p>자신의 업무에 맞게 주제를 바꿔보세요.</p>
          <ul className="mt-2 space-y-1">
            <li>&bull; &ldquo;2025년 마케팅 성과 보고&rdquo;</li>
            <li>&bull; &ldquo;신규 프로젝트 킥오프 발표&rdquo;</li>
            <li>&bull; &ldquo;팀 주간 업무 보고&rdquo;</li>
            <li>&bull; &ldquo;고객 만족도 분석 결과&rdquo;</li>
          </ul>
        </Callout>

        <h3>체크리스트</h3>
        <ul>
          <li>
            <strong>.pptx 파일 생성 확인</strong> &mdash; 작업 폴더에 파일이 생겼나요?
          </li>
          <li>
            <strong>슬라이드 5장 이상</strong> &mdash; 요청한 구성대로 만들어졌나요?
          </li>
          <li>
            <strong>파일 열어서 확인</strong> &mdash; 더블클릭으로 PowerPoint에서 열어보세요
          </li>
        </ul>

        <h3>결과가 마음에 안 들면?</h3>
        <p>
          걱정 마세요. 그냥 <strong>말로 수정 요청</strong>하면 돼요.
          사실 이게 바로 다음에 나오는 &ldquo;바이브코딩&rdquo;이에요.
        </p>
      </section>

      {/* ───────────────── 이해하기: 바이브코딩 ───────────────── */}
      <section id="vibe-coding">
        <h2>이해하기: 바이브코딩</h2>

        <p>
          방금 PPT를 말로 만들었죠? 사실 이게 요즘 가장 핫한 키워드인{" "}
          <strong>바이브코딩(Vibe Coding)</strong>이에요.
        </p>

        <p>
          코드를 직접 쓰지 않고, 원하는 결과를 자연어로 설명하면
          AI가 코드를 작성하고 실행해요.
          2025년 AI 업계에서 가장 핫한 키워드 중 하나죠.
        </p>

        <Callout type="tip" title="사실, 지금 하고 있는 게 바이브코딩이에요">
          <p>
            여러분이 방금 &ldquo;PPT 만들어줘&rdquo;라고 했을 때,
            Claude Code가 python-pptx 코드를 짜서 실행했잖아요?
            <br />
            <strong>그게 바이브코딩이에요.</strong> 이미 하고 계셨어요!
          </p>
        </Callout>

        <h3>결과물 업그레이드 예시</h3>
        <p>
          바이브코딩의 핵심은 <strong>대화를 이어가며 결과물을 발전시키는 거</strong>예요.
          한 번에 완벽할 필요 없어요. 수정 요청을 반복하면 돼요.
        </p>

        <CompareTable
          headers={["수정 요청 (프롬프트)", "Claude가 하는 일"]}
          rows={[
            ["&ldquo;PPT에 회사 로고 넣어줘&rdquo;", "이미지 파일을 찾아 슬라이드에 삽입"],
            ["&ldquo;엑셀에 월별 추이 차트 추가해줘&rdquo;", "데이터 분석 후 차트 생성 + 삽입"],
            ["&ldquo;3번 슬라이드 내용 좀 더 구체적으로 바꿔줘&rdquo;", "해당 슬라이드 본문을 보강"],
            ["&ldquo;요약 시트를 맨 앞에 추가해줘&rdquo;", "새 슬라이드를 1번 위치에 삽입"],
          ]}
        />

        <h3>바이브코딩의 실제 활용 사례</h3>
        <p>
          바이브코딩으로 이런 것들을 만들 수 있어요. 전부 코딩 지식 없이요.
        </p>
        <ul>
          <li><strong>개인 웹사이트</strong> &mdash; &ldquo;내 포트폴리오 사이트 만들어줘&rdquo;</li>
          <li><strong>업무 도구</strong> &mdash; &ldquo;팀 일정 관리 웹앱 만들어줘&rdquo;</li>
          <li><strong>데이터 대시보드</strong> &mdash; &ldquo;매출 데이터를 차트로 보여주는 HTML 페이지 만들어줘&rdquo;</li>
          <li><strong>자동화 스크립트</strong> &mdash; &ldquo;매주 금요일마다 보고서를 자동 생성하는 프로그램 만들어줘&rdquo;</li>
        </ul>

        <Callout type="info" title="바이브코딩의 한계도 알아두세요">
          <p>
            바이브코딩으로 간단한 도구나 프로토타입을 빠르게 만들 수 있지만,
            대규모 시스템이나 보안이 중요한 서비스는 전문 개발자의 검토가 필요해요.
            &ldquo;80%는 AI가, 20%는 사람이&rdquo; 원칙이 여기서도 적용돼요.
          </p>
        </Callout>

        <h3>코딩 몰라도 돼요</h3>
        <p>
          바이브코딩의 가장 큰 장점은{" "}
          <strong>프로그래밍 지식이 전혀 필요 없다</strong>는 거예요.
        </p>
        <ul>
          <li>코드를 읽을 줄 몰라도 돼요</li>
          <li>문법을 알 필요 없어요</li>
          <li>에러가 나면 &ldquo;에러 났어, 고쳐줘&rdquo;라고 하면 돼요</li>
          <li><strong>원하는 걸 말하면, AI가 만들어요</strong> &mdash; 이게 전부예요</li>
        </ul>

        <Callout type="info" title="바이브코딩 = 새로운 업무 스킬">
          <p>
            코딩은 개발자의 영역이었지만, 바이브코딩은 <strong>누구나</strong> 할 수 있어요.
            <br />
            엑셀을 다루듯이, AI에게 말하는 것도 하나의 업무 스킬이 되는 거예요.
            <br />
            이 스킬을 먼저 익히는 사람이 앞서가요.
          </p>
        </Callout>
      </section>

      {/* ───────────────── 자유 실험 아이디어 ───────────────── */}
      <section id="free-experiment">
        <h2>자유 실험 아이디어</h2>

        <p>
          이제 기본기를 배웠으니, <strong>자유롭게 실험</strong>해 볼 시간이에요.
          아래 아이디어 중 하나를 골라서 Claude Code에게 시켜보세요.
        </p>

        <h3>문서/데이터 처리</h3>
        <CompareTable
          headers={["시도해볼 것", "프롬프트 예시"]}
          rows={[
            ["중복 데이터 찾기", "&ldquo;이 엑셀에서 중복된 이름을 찾아서 표시해줘&rdquo;"],
            ["PDF 요약표 만들기", "&ldquo;이 PDF 내용을 읽고 핵심만 표로 정리해줘&rdquo;"],
            ["보고서 초안 작성", "&ldquo;이 데이터로 월간 보고서 초안 만들어줘&rdquo;"],
            ["여러 파일 합치기", "&ldquo;이 폴더에 있는 엑셀 파일들 하나로 합쳐줘&rdquo;"],
          ]}
        />

        <h3>커뮤니케이션 정리</h3>
        <CompareTable
          headers={["시도해볼 것", "프롬프트 예시"]}
          rows={[
            ["보고 메일 작성", "&ldquo;이 내용으로 팀장님께 보고 메일 작성해줘&rdquo;"],
            ["영문 자료 번역", "&ldquo;이 영문 보고서를 한국어로 번역하고 요약해줘&rdquo;"],
            ["할 일 목록 정리", "&ldquo;이 회의록에서 액션아이템만 뽑아서 정리해줘&rdquo;"],
            ["고객 피드백 분류", "&ldquo;이 피드백 목록을 긍정/부정/개선요청으로 분류해줘&rdquo;"],
          ]}
        />

        <Callout type="tip" title="실험할 때 기억하세요">
          <p>
            <strong>안 되는 것도 있고, 놀라운 것도 있을 거예요.</strong>
            <br /><br />
            실패해도 괜찮아요. 오히려 실패하면서 AI의 한계와 강점을 파악하게 되거든요.
            중요한 건 <strong>직접 시도해보는 거</strong>예요.
          </p>
        </Callout>

        <h3>자유 실험 팁</h3>
        <ul>
          <li>
            <strong>작은 것부터 시작</strong> &mdash; 파일 하나, 작업 하나로 시작하세요
          </li>
          <li>
            <strong>구체적으로 말하기</strong> &mdash; &ldquo;잘 만들어줘&rdquo;보다 &ldquo;표 형태로 정리해줘&rdquo;가 나아요
          </li>
          <li>
            <strong>실패하면 다시 말하기</strong> &mdash; &ldquo;아니야, 이렇게 바꿔줘&rdquo;라고 하면 돼요
          </li>
          <li>
            <strong>결과 저장하기</strong> &mdash; 좋은 프롬프트는 메모해두세요. 다음에 또 쓸 수 있어요
          </li>
        </ul>
      </section>
    </>
  );
}
