"use client";

import Callout from "@/components/learn/Callout";
import CodeBlock from "@/components/learn/CodeBlock";
import CompareTable from "@/components/learn/CompareTable";

export default function Chapter1() {
  return (
    <>
      {/* ───────────────────────── ai-usage ───────────────────────── */}
      <section id="ai-usage">
        <h2>AI, 아직 거의 아무도 안 써요</h2>

        <p>
          &ldquo;AI 시대&rdquo;라는 말, 요즘 하루에도 몇 번씩 듣잖아요?
          뉴스에서는 매일같이 AI가 세상을 바꾼다고 떠들고, 회사에서도 &ldquo;AI
          도입&rdquo; 이야기가 나오고요. 근데 정작 주변을 둘러보면&mdash;실제로
          AI를 업무에 쓰고 있는 사람이 얼마나 될까요?
        </p>

        <CompareTable
          headers={["구분", "비율", "설명"]}
          rows={[
            ["AI 미경험", "<strong>84%</strong>", "아직 한 번도 써본 적 없음"],
            [
              "무료 챗봇 사용",
              "<strong>16%</strong>",
              "ChatGPT 무료버전 가끔 사용",
            ],
            [
              "유료 구독",
              "<strong>0.3%</strong>",
              "Pro/Plus 같은 유료 플랜 구독 중",
            ],
            [
              "코딩 활용",
              "<strong>0.04%</strong>",
              "AI로 코드를 짜서 업무에 적용",
            ],
          ]}
        />

        <p>
          숫자를 보면 알 수 있어요. 한국 직장인 대부분은 AI를 한 번도 제대로 써본 적이
          없거든요. 무료 챗봇이라도 써본 사람이 16%, 유료 구독자는 겨우 0.3%,
          코딩까지 활용하는 사람은 0.04%&mdash;2,500명 중 1명꼴이에요.
        </p>

        <Callout type="tip" title="지금 시작하면 상위 0.3%">
          <p>
            유료 AI 구독만 해도 이미 상위 0.3%예요. 여기에 에이전틱 AI(Claude
            Code)까지 활용하면? 상위 0.04%에 들어가요. 남들이 아직 시작도 안 한
            지금이 가장 큰 기회예요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── agentic-timeline ───────────────────────── */}
      <section id="agentic-timeline">
        <h2>에이전틱 AI, 시작한 지 4개월째</h2>

        <p>역사를 아주 간단하게 짚어볼게요.</p>

        <CompareTable
          headers={["시점", "사건"]}
          rows={[
            ["2022년 11월", "ChatGPT 등장 &mdash; 대화형 AI의 시작"],
            [
              "2025년 11월",
              "에이전틱 AI 본격화 &mdash; AI가 <em>직접 실행</em>하기 시작",
            ],
            ["2026년 3월 (지금)", "에이전틱 AI 시대, 아직 4개월밖에 안 됐음"],
          ]}
        />

        <p>
          2022년부터 2025년까지 약 3년간, AI는 &ldquo;채팅창 안에서 텍스트를
          주고받는 도구&rdquo;였어요. 질문하면 답해주고, 요약해주고,
          번역해주는&mdash;그 정도였죠. 근데 2025년 말부터 AI는 완전히 다른
          단계에 진입했어요. 텍스트를 넘어서 <strong>파일을 읽고</strong>,{" "}
          <strong>코드를 짜서 실행하고</strong>,{" "}
          <strong>외부 시스템에 접속하는</strong> AI가 등장한 거예요. 이것이 바로
          &ldquo;에이전틱(Agentic) AI&rdquo;예요.
        </p>

        <Callout type="info" title="2005년 인터넷 = 지금의 에이전틱 AI">
          <p>
            2005년, 한국의 인터넷 사용률은 약 16%였어요. 그때 인터넷을 일찍
            배운 사람들은 이후 20년간 엄청난 기회를 잡았죠. 지금 에이전틱 AI의
            위치가 딱 그때의 인터넷이에요. 대부분이 &ldquo;뭔지도 잘
            모르는&rdquo; 단계. 근데 3~5년 후면 &ldquo;왜 그때 안
            배웠지?&rdquo;라고 후회할 기술이에요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── world-changing ───────────────────────── */}
      <section id="world-changing">
        <h2>세상은 이미 바뀌고 있어요</h2>

        <p>
          &ldquo;에이전틱 AI? 아직 먼 미래 아니야?&rdquo;라고 생각하실 수도
          있어요. 근데 글로벌 기업들은 이미 움직이고 있거든요. 그리고 그
          결과는 꽤 충격적이에요.
        </p>

        <CompareTable
          headers={["기업", "변화", "의미"]}
          rows={[
            [
              "Chegg (교육)",
              "주가 <strong>-99%</strong>",
              "AI가 과제 도움을 대체",
            ],
            [
              "Duolingo",
              "<strong>AI First</strong> 선언",
              "계약직 번역가 대거 해고, AI로 전환",
            ],
            [
              "Salesforce",
              "<strong>신규 채용 중단</strong>",
              "AI가 엔지니어 업무 대체 가능하다고 판단",
            ],
            [
              "Klarna (핀테크)",
              "인력 <strong>-66%</strong>",
              "고객 상담 대부분을 AI로 처리",
            ],
            [
              "Shopify",
              "<strong>AI 우선</strong> 정책",
              "사람 채용 전에 AI로 할 수 있는지 먼저 검토",
            ],
            [
              "Netflix",
              "AI 기획 도입",
              "콘텐츠 기획/편집에 AI 전면 활용",
            ],
            [
              "BuzzFeed",
              "인력 <strong>-80%</strong>",
              "콘텐츠 생산 AI 자동화",
            ],
            [
              "IBM",
              "<strong>7,800명</strong> 대체 계획",
              "백오피스 업무를 AI로 전환",
            ],
          ]}
        />

        <p>
          이건 먼 나라 이야기가 아니에요. Chegg은 한때 미국 대학생이 가장 많이
          쓰던 과제 도우미 서비스였는데, ChatGPT 등장 이후 주가가 99%
          폭락했어요. Klarna는 고객 상담 인력의 2/3를 AI로 대체했고, Shopify
          CEO는 &ldquo;새로운 사람을 뽑기 전에 AI로 해결할 수 있는지 먼저
          증명하라&rdquo;는 사내 정책을 발표했고요.
        </p>

        <Callout type="warning" title="결국 핵심은요">
          <p>
            대체당하는 게 아니라, <strong>AI를 부리는 사람</strong>이 되면
            돼요. 위 사례에서 해고된 건 &ldquo;AI가 할 수 있는 일을 수작업으로
            하던 사람들&rdquo;이에요. 반대로, AI를 설계하고 관리하고 활용하는
            사람의 가치는 오히려 올라가고 있어요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── my-day ───────────────────────── */}
      <section id="my-day">
        <h2>직장인의 하루 &mdash; Before &amp; After</h2>

        <p>
          그렇다면 에이전틱 AI가 여러분의 일상을 어떻게 바꿀 수 있을까요?
          일반적인 사무직 직장인의 하루를 기준으로 비교해 볼게요.
        </p>

        <CompareTable
          headers={["업무", "현재 (Before)", "AI 도입 후 (After)", "절감"]}
          rows={[
            ["이메일 확인/답장", "2시간", "20분", "1시간 40분"],
            ["엑셀 데이터 정리", "1.5시간", "10분", "1시간 20분"],
            ["회의록 작성/정리", "1.5시간", "10분", "1시간 20분"],
            ["기타 반복 업무", "1시간", "5분", "55분"],
            [
              "<strong>합계</strong>",
              "<strong>6시간</strong>",
              "<strong>45분</strong>",
              "<strong>5시간 15분</strong>",
            ],
          ]}
        />

        <p>
          하루에 6시간 걸리던 반복 업무가 45분으로 줄어들어요. 물론 모든 업무를
          100% 자동화할 수는 없지만, AI가 초안을 만들어주고, 데이터를
          정리해주고, 반복 작업을 대신 해주면&mdash;여러분은{" "}
          <strong>남은 시간에 진짜 중요한 일</strong>에 집중할 수 있어요.
          전략을 세우고, 기획서를 다듬고, 팀원과 깊은 대화를 나누는 일 말이죠.
        </p>

        <Callout type="tip">
          <p>
            &ldquo;시간이 없어서 AI를 못 배운다&rdquo;가 아니라, &ldquo;AI를 안
            배우니까 시간이 없는&rdquo; 거예요. 세팅에 1~2시간 투자하면, 매일
            수 시간을 되찾을 수 있어요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── copy-paste ───────────────────────── */}
      <section id="copy-paste">
        <h2>아직도 복붙으로 일하고 있나요?</h2>

        <p>
          &ldquo;나는 이미 ChatGPT 쓰고 있는데?&rdquo;라고 생각하신 적 있죠? 한번
          돌아볼게요. 지금 AI를 어떻게 쓰고 계신가요?
        </p>

        <ul className="list-disc pl-6 space-y-2 text-body my-4">
          <li>
            <strong>엑셀 분석</strong>: 데이터를 복사해서 ChatGPT에 붙여넣고,
            결과를 다시 복사해서 엑셀에 붙여넣기
          </li>
          <li>
            <strong>메일 작성</strong>: 내용을 적어서 AI한테 다듬어달라고 하고,
            결과를 복사해서 메일에 붙여넣기
          </li>
          <li>
            <strong>보고서 양식</strong>: AI가 만들어준 텍스트를 일일이 워드나
            PPT에 복사해서 정리
          </li>
          <li>
            <strong>100개 반복 작업</strong>: 같은 걸 100번 복사-붙여넣기-수정
            반복
          </li>
        </ul>

        <p>
          이게 바로 &ldquo;웹 AI&rdquo;의 한계예요. 아무리 똑똑한 AI라도
          브라우저 채팅창 안에 갇혀 있으면, 결국 여러분이{" "}
          <strong>수동으로 복사-붙여넣기</strong>를 해야 하거든요. 파일 100개를
          처리해야 하면? 100번 반복해야 해요. 이건 자동화가 아니라 그냥{" "}
          <strong>&ldquo;AI 보조 수작업&rdquo;</strong>이에요.
        </p>

        <Callout type="info">
          <p>
            에이전틱 AI는 이 복사-붙여넣기의 벽을 완전히 허물어버려요. 여러분
            PC의 파일을 직접 읽고, 직접 수정하고, 직접 저장해요. 다음
            섹션에서 그 차이를 자세히 알아볼게요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── what-is-agentic ───────────────────────── */}
      <section id="what-is-agentic">
        <h2>에이전틱 AI = 직접 실행하는 AI</h2>

        <p>
          웹 AI와 에이전틱 AI의 차이를 한마디로 표현하면 이래요.
        </p>

        <CompareTable
          headers={["비교 항목", "웹 AI (ChatGPT, 웹 Claude)", "에이전틱 AI (Claude Code)"]}
          rows={[
            [
              "비유",
              "전화 상담원 &mdash; 전화로만 소통",
              "전문 비서 &mdash; 직접 와서 해줌",
            ],
            [
              "동작 환경",
              "브라우저 채팅창에 갇혀 있음",
              "<strong>내 PC</strong>에서 직접 실행",
            ],
            [
              "입출력",
              "텍스트 입력 &rarr; 텍스트 출력",
              "파일 읽기/쓰기 + <strong>코드 실행</strong>",
            ],
            [
              "작업 방식",
              "한 번에 한 질문씩",
              "여러 단계를 <strong>스스로 계획하고 실행</strong>",
            ],
          ]}
        />

        <p>
          <strong>전화 상담원</strong>을 생각해보세요. 아무리 똑똑해도, 전화로만
          소통할 수 있잖아요. &ldquo;서류 좀 정리해주세요&rdquo;라고 하면
          &ldquo;이렇게 하시면 됩니다&rdquo;라고 안내는 해주지만, 직접 와서
          서류를 정리해주지는 못하거든요.
        </p>
        <p>
          반면 <strong>전문 비서</strong>는 어떤가요? 여러분 옆에 앉아서 직접
          파일을 열고, 데이터를 정리하고, 메일을 보내고, 결과를 저장해줘요.
          에이전틱 AI가 바로 이 &ldquo;전문 비서&rdquo;예요.
        </p>

        <p>
          여기에 한 가지 더 알아두면 좋은 게 있어요. 에이전틱 AI는{" "}
          <strong>MCP(Model Context Protocol)</strong>라는 기술을 통해 외부 도구에도
          직접 연결할 수 있어요. 데이터베이스, 사내 API, 파일 시스템 같은 것들을
          Claude Code가 직접 접근하는 거예요. 마치 전문 비서가 회사의 모든 시스템에
          접근 권한을 가진 것처럼요.
        </p>
      </section>

      {/* ───────────────────────── diff-file ───────────────────────── */}
      <section id="diff-file">
        <h2>차이점 1: 파일 직접 접근</h2>

        <p>가장 체감이 큰 차이예요.</p>

        <CompareTable
          headers={["", "웹 AI", "에이전틱 AI"]}
          rows={[
            [
              "파일 처리",
              "복사-붙여넣기로 텍스트 전달",
              "폴더 내 파일 전부 자동으로 읽기",
            ],
            [
              "결과 저장",
              "화면에 텍스트로만 출력",
              "엑셀/워드/PDF 파일로 직접 저장",
            ],
            [
              "대량 처리",
              "파일 하나씩 수동으로",
              "폴더 안의 100개 파일 한 번에",
            ],
          ]}
        />

        <p>예를 들어, 이런 명령이 가능해요.</p>

        <CodeBlock title="Claude Code에 이렇게 말하면 됩니다">
{`다운로드 폴더에 있는 엑셀 파일 5개를 하나로 합치고,
요약표 만들어서 보고서.xlsx로 저장해줘`}
        </CodeBlock>

        <p>
          웹 AI에서는 절대 불가능한 작업이에요. 파일 5개를 일일이 열어서 복사해서
          붙여넣고, AI 답변을 다시 엑셀에 옮기고... 에이전틱 AI는 이 모든 걸{" "}
          <strong>한마디</strong>로 끝내요. AI가 직접 파일을 열고, 데이터를
          합치고, 새 파일을 만들어서 저장까지 해줘요.
        </p>
      </section>

      {/* ───────────────────────── diff-api ───────────────────────── */}
      <section id="diff-api">
        <h2>차이점 2: 외부 시스템 연동</h2>

        <p>
          에이전틱 AI는 파일뿐만 아니라 여러분이 매일 쓰는 업무 도구에도 직접
          접속할 수 있어요.
        </p>

        <ul className="list-disc pl-6 space-y-2 text-body my-4">
          <li>
            <strong>이메일</strong>: Gmail/Outlook에 직접 접속해서 메일을 읽고
            보내기
          </li>
          <li>
            <strong>캘린더</strong>: 일정 확인, 회의 예약, 참석자 초대
          </li>
          <li>
            <strong>메신저</strong>: Slack이나 Teams에 메시지 보내기
          </li>
          <li>
            <strong>클라우드</strong>: Google Drive, SharePoint 파일 접근
          </li>
          <li>
            <strong>MCP 서버</strong>: 데이터베이스, 사내 API, 파일 시스템 등에 직접 연결
          </li>
        </ul>

        <CodeBlock title="이런 복합 명령도 가능합니다">
{`내일 오후 2시 기획회의 참석자들에게
안건 정리 메일 보내고,
회의실 예약하고,
Teams 채널에 안내 올려줘`}
        </CodeBlock>

        <p>
          웹 AI에서는 &ldquo;이런 식으로 메일을 쓰면 됩니다&rdquo;라고{" "}
          <em>안내만</em> 해줬잖아요. 에이전틱 AI는 실제로 메일을 보내고, 캘린더에
          일정을 잡고, 메신저에 글을 올려요. 말 그대로{" "}
          <strong>대신 해주는</strong> AI예요.
        </p>
      </section>

      {/* ───────────────────────── diff-multi ───────────────────────── */}
      <section id="diff-multi">
        <h2>차이점 3: 자율 실행 &amp; 멀티스텝</h2>

        <p>
          웹 AI와 가장 근본적인 차이는 &ldquo;자율성&rdquo;이에요.
        </p>

        <CompareTable
          headers={["", "웹 AI", "에이전틱 AI"]}
          rows={[
            [
              "작업 방식",
              "한 번에 한 질문 &rarr; 한 답변",
              "한 번 지시 &rarr; 여러 단계 스스로 수행",
            ],
            [
              "에러 발생 시",
              "에러 메시지를 보여주고 멈춤",
              "에러를 <strong>스스로 분석하고 수정</strong>",
            ],
            [
              "중간 판단",
              "사용자가 매번 다음 지시",
              "AI가 <strong>스스로 판단</strong>해서 진행",
            ],
          ]}
        />

        <CodeBlock title="이 한마디면 됩니다">
{`PDF 50개에서 텍스트 추출해서
핵심 내용 요약표를 엑셀로 만들어줘`}
        </CodeBlock>

        <p>
          이 명령을 받으면 에이전틱 AI는 스스로 계획을 세워요: (1) PDF 파일
          목록 확인 (2) 하나씩 텍스트 추출 (3) 핵심 내용 요약 (4) 엑셀 파일
          생성 (5) 저장. 중간에 특정 PDF가 깨져 있으면? 에러를 확인하고, 다른
          방법으로 추출을 시도해요. 그래도 안 되면 &ldquo;이 파일은 처리가
          안 됩니다&rdquo;라고 알려주고 나머지를 계속 진행해요.
        </p>

        <Callout type="tip">
          <p>
            웹 AI에서 PDF 50개를 처리하려면? 50번 복사-붙여넣기를 해야 해요.
            에이전틱 AI는 한마디면 끝. 이게 &ldquo;안내해주는 AI&rdquo;와
            &ldquo;직접 해주는 AI&rdquo;의 차이예요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── summary-table ───────────────────────── */}
      <section id="summary-table">
        <h2>웹 AI vs 에이전틱 AI 총정리</h2>

        <p>
          지금까지 살펴본 차이점을 한 표로 정리해 볼게요.
        </p>

        <CompareTable
          headers={["비교 항목", "웹 AI (ChatGPT 등)", "에이전틱 AI (Claude Code)"]}
          rows={[
            ["비유", "전화 상담원", "전문 비서"],
            ["파일 접근", "복사-붙여넣기", "직접 읽기/쓰기"],
            ["시스템 연동", "안내만 해줌", "직접 연결해서 실행"],
            ["실행 방식", "한 질문-한 답변", "멀티스텝 자율 실행"],
            ["워크플로우", "사용자가 매번 중개", "AI가 시작부터 끝까지"],
            ["결과물", "텍스트 답변", "실제 파일 (엑셀, PDF, 코드 등)"],
          ]}
        />

        <Callout type="info">
          <p>
            웹 AI가 나쁘다는 게 아니에요. 간단한 질문이나 아이디어 브레인스토밍에는 여전히 웹 AI가 편하거든요. 근데 <strong>실제 업무 자동화</strong>&mdash;파일 처리, 데이터 분석, 반복 작업&mdash;에는 에이전틱 AI가 압도적으로 효율적이에요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── why-claude ───────────────────────── */}
      <section id="why-claude">
        <h2>왜 Claude Code인가?</h2>

        <p>
          에이전틱 AI 도구는 여러 가지가 있어요. OpenAI의 Codex, GitHub
          Copilot, Cursor 등등. 그중에서 왜 Claude Code를 추천하는 걸까요?
        </p>

        <CompareTable
          headers={["벤치마크", "Claude Code 점수", "의미"]}
          rows={[
            [
              "SWE-bench Verified",
              "<strong>81.4%</strong> (1위, Opus 4.6)",
              "실제 소프트웨어 버그를 AI가 혼자 고치는 테스트",
            ],
            [
              "Terminal-bench",
              "<strong>65.4%</strong>",
              "터미널 환경에서 복잡한 작업을 수행하는 능력",
            ],
          ]}
        />

        <p>
          SWE-bench Verified는 &ldquo;실제 오픈소스 프로젝트의 버그를 AI가
          혼자서 찾아서 고칠 수 있는가?&rdquo;를 테스트하는 업계 표준
          벤치마크예요. Claude Code(Opus 4.6 모델)가 81.4%로 1위거든요. 이건
          단순히 &ldquo;똑똑한 대화&rdquo;가 아니라{" "}
          <strong>&ldquo;실제로 일을 해내는 능력&rdquo;</strong>을 측정한
          결과예요.
        </p>

        <Callout type="tip" title="대화가 아니라 실행에 특화">
          <p>
            ChatGPT가 &ldquo;대화를 잘하는 AI&rdquo;라면, Claude Code는
            &ldquo;실행을 잘하는 AI&rdquo;예요. 우리가 원하는 건 재미있는
            대화가 아니라 <strong>업무를 대신 해주는 것</strong>이니까요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── models ───────────────────────── */}
      <section id="models">
        <h2>Claude 모델 비교</h2>

        <p>
          Claude에는 3가지 모델이 있어요. 현재 최신 버전은 <strong>Claude 4.6 패밀리</strong>고,
          각각 용도와 성능이 달라요.
        </p>

        <CompareTable
          headers={["모델", "특징", "SWE-bench", "추천 용도"]}
          rows={[
            [
              "Haiku",
              "빠르고 가벼움",
              "&mdash;",
              "간단한 분류, 빠른 응답이 필요한 작업",
            ],
            [
              "Sonnet 4.6",
              "균형잡힌 가성비",
              "79.2%",
              "일상 업무 대부분, <strong>가성비 최고</strong>",
            ],
            [
              "Opus 4.6",
              "최고 성능",
              "<strong>81.4%</strong>",
              "복잡한 분석, Claude Code 기본 모델",
            ],
          ]}
        />

        <p>
          처음 시작하시는 분들은 <strong>Sonnet</strong>과 <strong>Opus</strong>만
          기억하시면 돼요. Sonnet은 빠르고 저렴하면서도 성능이 뛰어나서 일상
          업무에 최적이에요. Opus는 정말 복잡한 작업이나 긴 코드를 다룰 때
          사용해요. Claude Code에서는 기본적으로 Opus 4.6 모델이 사용돼요.
        </p>

        <Callout type="info">
          <p>
            모델 선택은 나중에 걱정해도 돼요. Claude Code를 실행하면
            자동으로 최적의 모델이 선택되거든요. 지금은 &ldquo;Sonnet = 일상,
            Opus = 고난도&rdquo;만 기억하세요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── use-cases ───────────────────────── */}
      <section id="use-cases">
        <h2>실제 업무 활용 예시</h2>

        <p>
          이론은 충분해요. 실제로 에이전틱 AI가 어떤 업무를 해줄 수 있는지,
          구체적인 사례를 살펴볼게요. 모두 실제로 가능한 작업들이에요.
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-heading">
          1. 주간 보고서 취합
        </h3>
        <p>
          매주 금요일마다 팀원 5명의 보고서를 모아서 팀장님 보고 양식으로
          정리하느라 2시간씩 쓰고 계시다면&mdash;Claude Code에게 이렇게
          말해보세요.
        </p>
        <CodeBlock>
{`이번 주 보고서 폴더에서 팀원 보고서 5개를 읽고,
팀 주간보고서 양식에 맞춰서 취합해줘.
특이사항은 빨간색으로 표시해줘.`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-heading">
          2. 안내 메일 대량 발송
        </h3>
        <p>
          거래처 30곳에 같은 내용이지만 회사명과 담당자명만 다른 메일을
          보내야 할 때요.
        </p>
        <CodeBlock>
{`거래처 목록 엑셀을 읽어서
각 담당자 이름과 회사명을 넣어서
안내 메일을 30개 작성하고 Gmail으로 발송해줘`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-heading">
          3. 회의록 자동 정리
        </h3>
        <p>
          회의 녹음 파일에서 텍스트를 뽑고, 안건별로 정리하고, 액션 아이템을
          추출하는 작업이에요.
        </p>
        <CodeBlock>
{`회의 녹음 텍스트 파일을 읽어서
안건별로 분류하고, 결정 사항과 액션 아이템을 표로 정리해줘.
담당자와 마감일도 넣어줘.`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-heading">
          4. 시장 조사 자료 정리
        </h3>
        <p>
          경쟁사 분석 자료나 시장 보고서 PDF를 모아서 핵심만 뽑아 비교표를
          만드는 작업이에요.
        </p>
        <CodeBlock>
{`시장조사 폴더에 있는 PDF 10개를 읽어서
회사별 매출, 성장률, 주요 전략을 비교표로 정리하고
엑셀로 저장해줘`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-heading">
          5. 문서 일괄 처리
        </h3>
        <p>
          계약서, 견적서, 보고서 등 양식이 비슷한 문서 수십 개를 한 번에
          처리하는 작업이에요.
        </p>
        <CodeBlock>
{`계약서 폴더의 워드 파일 20개에서
계약금액, 계약일, 만료일을 추출해서
계약현황 엑셀 파일로 만들어줘`}
        </CodeBlock>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-heading">
          6. 아침 일정 브리핑
        </h3>
        <p>
          출근하면 오늘의 일정, 중요 메일, 해야 할 일을 한눈에 정리해주는
          브리핑이에요.
        </p>
        <CodeBlock>
{`오늘 캘린더 일정을 확인하고,
읽지 않은 중요 메일을 요약하고,
오늘 할 일 리스트를 만들어서 보여줘`}
        </CodeBlock>

        <Callout type="tip">
          <p>
            위 예시들을 보면 공통점이 있어요. 모두 <strong>&ldquo;일상 언어&rdquo;</strong>로 지시한다는 거예요. 코딩을 몰라도, 프로그래밍을 배운 적이 없어도 괜찮아요. 한국어로 하고 싶은 일을 설명하면 돼요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── vs-nocode ───────────────────────── */}
      <section id="vs-nocode">
        <h2>Make/n8n과 뭐가 다른가요?</h2>

        <p>
          업무 자동화 도구로 Make, n8n, Zapier 같은 노코드 플랫폼을 들어보신 적
          있죠? 이것들과 에이전틱 AI는 무엇이 다를까요?
        </p>

        <CompareTable
          headers={["비교 항목", "Make / n8n / Zapier", "Claude Code"]}
          rows={[
            [
              "구축 방식",
              "블록을 끌어다 연결 (GUI)",
              "한국어로 말하면 됨",
            ],
            [
              "연동 범위",
              "지원하는 서비스 안에서만",
              "어떤 시스템이든 연결 가능",
            ],
            [
              "판단 능력",
              "판단/분류/요약 <strong>못함</strong>",
              "판단/분류/요약을 <strong>같이 처리</strong>",
            ],
            [
              "예외 처리",
              "예외 발생 시 멈춤",
              "예외를 <strong>스스로 해결</strong>",
            ],
            [
              "확장성",
              "새 블록 추가 필요",
              "한마디로 확장 가능",
            ],
          ]}
        />

        <p>
          노코드 도구는 &ldquo;A가 오면 B를 해라&rdquo; 같은 단순 규칙에는
          강해요. 근데 &ldquo;이 메일이 긴급한지 판단해서, 긴급하면 즉시
          답장하고 아니면 내일 처리&rdquo; 같은 <strong>판단이 필요한 작업</strong>은
          못하거든요. Claude Code는 AI이기 때문에 판단, 분류, 요약, 창작을 모두
          처리할 수 있고, 예상치 못한 상황에도 스스로 대응해요.
        </p>

        <Callout type="info">
          <p>
            물론 Make/n8n도 좋은 도구예요. 매일 정해진 시간에 정해진 작업을
            반복하는 데는 오히려 더 적합할 수 있어요. Claude Code는 &ldquo;판단&rdquo;과
            &ldquo;유연성&rdquo;이 필요한 업무에 강하고요. 두 가지를 적재적소에
            활용하는 게 최고예요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── wow ───────────────────────── */}
      <section id="wow">
        <h2>이것까지 된다고요?</h2>

        <p>
          에이전틱 AI가 정말 놀라운 건, 일반적으로 &ldquo;이건 AI가 못하지
          않을까?&rdquo;라고 생각하는 것들도 가능하다는 거예요.
        </p>

        <ul className="space-y-4 my-6">
          <li className="bg-subtle rounded-xl p-4 border border-border-subtle">
            <strong className="text-primary">내 말투로 메일 쓰기</strong>
            <p className="text-body mt-1">
              &ldquo;지난번 보낸 메일 5개를 분석해서 내 문체를 학습하고, 앞으로
              그 스타일로 메일을 작성해줘&rdquo; &mdash; AI가 여러분의 말투,
              인사법, 문장 구조를 파악해서 마치 직접 쓴 것처럼 메일을
              작성해요.
            </p>
          </li>
          <li className="bg-subtle rounded-xl p-4 border border-border-subtle">
            <strong className="text-primary">출근하면 브리핑 도착</strong>
            <p className="text-body mt-1">
              매일 아침 8시에 자동으로 실행되게 설정하면, 출근해서 PC를 켤 때
              이미 오늘의 브리핑이 준비되어 있어요. 일정, 메일 요약, 할 일
              목록까지요.
            </p>
          </li>
          <li className="bg-subtle rounded-xl p-4 border border-border-subtle">
            <strong className="text-primary">PC 파일 자동 정리</strong>
            <p className="text-body mt-1">
              &ldquo;다운로드 폴더를 정리해줘. 문서는 문서 폴더로, 이미지는
              이미지 폴더로, 1개월 이상 된 파일은 백업으로&rdquo; &mdash; 파일
              정리 비서가 따로 없어요.
            </p>
          </li>
          <li className="bg-subtle rounded-xl p-4 border border-border-subtle">
            <strong className="text-primary">반복 업무 자동화</strong>
            <p className="text-body mt-1">
              &ldquo;매주 월요일마다 지난주 매출 데이터를 정리해서 팀장님께
              보고 메일 보내줘&rdquo; &mdash; 한 번 설정해두면 매주 알아서
              실행돼요.
            </p>
          </li>
        </ul>

        <Callout type="tip" title="핵심 포인트">
          <p>
            여러분의 업무 패턴을 텍스트로 정리해두면, AI가 여러분처럼 일할 수
            있어요. 내가 항상 하는 방식, 선호하는 양식, 자주 쓰는 표현
            &mdash; 이런 것들을 알려주면 AI는 점점 &ldquo;나만의 비서&rdquo;가
            돼요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── claude-md ───────────────────────── */}
      <section id="claude-md">
        <h2>AI에게 나를 기억시키기 &mdash; CLAUDE.md</h2>

        <p>
          Claude Code에는 아주 강력한 기능이 하나 있어요. 바로{" "}
          <strong>CLAUDE.md</strong> 파일이에요. 이 파일은 Claude Code가 실행될
          때 <strong>가장 먼저 읽는 지시서</strong>거든요. 여기에 여러분의 정보와
          업무 스타일을 적어두면, 매번 설명할 필요 없이 AI가 여러분을 기억해요.
        </p>

        <CodeBlock title="CLAUDE.md 예시">
{`# 내 정보
- 이름: 김 과장
- 직급: 과장
- 부서: 기획팀

# 보고서 스타일
- 항상 존댓말 사용
- 결론을 먼저 쓰고 근거를 나중에
- 표와 그래프를 적극 활용
- 폰트: 맑은 고딕, 크기: 11pt

# 파일 규칙
- 저장 위치: ~/Documents/업무/
- 파일명 형식: YYMMDD_프로젝트명_내용.확장자
- 예시: 260301_마케팅_주간보고서.xlsx

# 메일 스타일
- "안녕하세요, OO팀 김 과장입니다."로 시작
- 핵심 내용은 3줄 이내로 요약
- 첨부 파일이 있으면 맨 위에 안내`}
        </CodeBlock>

        <p>
          이렇게 한 번 작성해두면, 이후에 &ldquo;주간 보고서 만들어줘&rdquo;라고만
          해도 AI가 여러분의 스타일에 맞춰서 작성해요. 저장 위치도, 파일명
          규칙도, 문체도 모두 자동으로 적용돼요.
        </p>

        <Callout type="info" title="CLAUDE.md는 어디에 만드나요?">
          <p>
            CLAUDE.md는 3가지 레벨에서 사용할 수 있어요.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li>
              <strong>프로젝트 폴더</strong>: 해당 프로젝트에만 적용되는 지시서
            </li>
            <li>
              <strong>홈 디렉토리</strong> (<code>~/.claude/CLAUDE.md</code>): 모든 프로젝트에 공통으로 적용
            </li>
            <li>
              <strong>자동 메모리</strong> (<code>~/.claude/projects/.../MEMORY.md</code>): AI가 대화 중 자동으로 기억하는 정보
            </li>
          </ul>
          <p className="mt-2">
            Claude Code는 실행 시 이 파일들을 자동으로 읽어요. 세팅 가이드에서
            실제로 만들어보는 방법을 다뤄요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── time-save ───────────────────────── */}
      <section id="time-save">
        <h2>예상 시간 절감 효과</h2>

        <p>
          에이전틱 AI를 본격적으로 활용했을 때, 주간 기준으로 얼마나 시간을
          아낄 수 있는지 정리해 볼게요.
        </p>

        <CompareTable
          headers={["업무", "기존 소요 시간 (주간)", "AI 활용 후 (주간)", "절감"]}
          rows={[
            ["데이터 취합/정리", "3~4시간", "30분~1시간", "약 3시간"],
            ["정기 메일/리포트", "2~3시간", "20~40분", "약 2시간"],
            ["문서 작성", "3~5시간", "1~2시간", "약 3시간"],
            ["리서치/조사 정리", "2~4시간", "30분~1시간", "약 2시간"],
            ["반복 작업", "2~3시간", "10~20분", "약 2시간"],
            [
              "<strong>합계</strong>",
              "<strong>12~19시간</strong>",
              "<strong>2.5~5시간</strong>",
              "<strong>주당 약 5~10시간 절감</strong>",
            ],
          ]}
        />

        <Callout type="tip" title="주당 5~10시간 = 한 달에 20~40시간">
          <p>
            한 달이면 거의 일주일치 근무시간을 아낄 수 있다는 뜻이에요. 이
            시간에 전략적인 업무, 자기계발, 또는 새로운 프로젝트에 투자할 수
            있고요. AI 구독료 월 $100이 아깝다고요? 시급 3만원으로만 계산해도
            월 60~120만원의 가치예요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── limitations ───────────────────────── */}
      <section id="limitations">
        <h2>에이전틱 AI가 아직 잘 못하는 것</h2>

        <p>
          AI 능력을 과장하진 않을게요. 에이전틱 AI도 못하는 것이 있거든요.
          사실 기대치를 현실적으로 맞추는 게 오히려 더 효과적으로 활용하는 길이에요.
        </p>

        <ul className="space-y-3 my-6">
          <li className="flex items-start gap-3">
            <span className="text-accent font-bold text-lg mt-0.5">X</span>
            <div>
              <strong>예쁜 PPT 디자인</strong>
              <p className="text-body text-sm mt-1">
                AI는 PPT의 내용과 구조를 만들 수 있지만, 세련된 시각 디자인은
                아직 한계가 있어요. 내용은 AI가, 디자인은 사람이 다듬는 게
                현실적이에요.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent font-bold text-lg mt-0.5">X</span>
            <div>
              <strong>대면 소통과 협상</strong>
              <p className="text-body text-sm mt-1">
                회의에서의 분위기 파악, 거래처와의 미묘한 협상, 팀 내 갈등 조율
                &mdash; 이런 것은 사람만이 할 수 있어요.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent font-bold text-lg mt-0.5">X</span>
            <div>
              <strong>복잡한 서식의 엑셀</strong>
              <p className="text-body text-sm mt-1">
                셀 병합이 복잡하거나, 매크로가 얽혀있는 레거시 엑셀 파일은
                처리가 어려울 수 있어요. 단순 데이터 처리는 잘하지만,
                &ldquo;부장님이 10년 전에 만든 양식&rdquo;은 어려울 수 있어요.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent font-bold text-lg mt-0.5">X</span>
            <div>
              <strong>주관적 판단</strong>
              <p className="text-body text-sm mt-1">
                &ldquo;이 프로젝트를 진행할지 말지&rdquo;, &ldquo;어떤
                전략이 더 나은지&rdquo; 같은 최종 의사결정은 사람의 몫이에요.
                AI는 판단에 필요한 자료를 정리해줄 수는 있어요.
              </p>
            </div>
          </li>
        </ul>

        <Callout type="info" title="AI가 정리하면 사람이 다듬는다">
          <p>
            가장 효율적인 워크플로우는 &ldquo;AI 80% + 사람 20%&rdquo;예요.
            AI가 초안을 만들고, 데이터를 정리하고, 반복 작업을 처리하면 &mdash;
            사람은 검토하고, 판단하고, 최종 마무리를 해요. 100% AI에 맡기는 게
            아니라, <strong>AI를 도구로 활용하는</strong> 거예요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── role-change ───────────────────────── */}
      <section id="role-change">
        <h2>우리의 역할은 어떻게 바뀌나?</h2>

        <p>
          AI 시대에 직장인의 역할이 사라지는 게 아니에요.{" "}
          <strong>바뀌는</strong> 거예요.
        </p>

        <CompareTable
          headers={["줄어드는 업무", "집중하게 되는 업무"]}
          rows={[
            ["데이터 수작업 (복사, 정리, 입력)", "전략적 판단 (어떤 방향으로 갈 것인가)"],
            ["보고서 양식 맞추기", "기획의 품질 높이기"],
            ["엑셀 수식 작성", "AI 결과물 검증 (맞는지 확인)"],
            ["문서 형식 변환", "AI 활용 설계 (어떻게 쓸지 기획)"],
          ]}
        />

        <p>
          쉽게 말하면, <strong>&ldquo;손으로 하는 일&rdquo;은 줄고 &ldquo;머리로
          하는 일&rdquo;이 늘어나요</strong>. 엑셀에 숫자를 입력하는 대신
          &ldquo;이 데이터가 말하는 게 뭔지&rdquo;를 고민하고, 보고서 양식을
          맞추는 대신 &ldquo;보고서의 논리가 설득력 있는지&rdquo;를 검토하게
          돼요.
        </p>

        <Callout type="tip">
          <p>
            미래에 가장 가치 있는 직장인은 <strong>&ldquo;AI를 잘 부리는
            사람&rdquo;</strong>이에요. 어떤 업무에 AI를 쓸지 판단하고, 적절한
            지시를 내리고, 결과물을 검증하는 능력&mdash;이것이 앞으로의
            핵심 역량이에요.
          </p>
        </Callout>
      </section>

      {/* ───────────────────────── caution ───────────────────────── */}
      <section id="caution">
        <h2>현실적 고려사항</h2>

        <p>
          에이전틱 AI를 업무에 도입할 때, 반드시 기억해야 할 점들이에요.
        </p>

        <div className="space-y-4 my-6">
          <div className="bg-subtle border border-border-default rounded-xl p-5">
            <h4 className="font-semibold text-heading mb-2">
              1. 사람의 감독은 필수
            </h4>
            <p className="text-body text-sm">
              AI가 만든 결과물은 반드시 사람이 확인해야 해요. 특히 외부에
              보내는 메일, 공식 보고서, 금액이 포함된 문서는 꼭 검토하세요.
              AI는 실수를 할 수 있고, 그 실수의 책임은 사람에게 있거든요.
            </p>
          </div>

          <div className="bg-subtle border border-border-default rounded-xl p-5">
            <h4 className="font-semibold text-heading mb-2">
              2. 100% 완벽하지 않아요 (환각)
            </h4>
            <p className="text-body text-sm">
              AI는 가끔 &ldquo;환각(Hallucination)&rdquo;을 해요. 없는
              정보를 만들어내거나, 사실과 다른 내용을 자신 있게 이야기하는
              현상이에요. 특히 숫자, 날짜, 인용구 같은 사실 정보는 반드시
              교차 검증하세요.
            </p>
          </div>

          <div className="bg-subtle border border-border-default rounded-xl p-5">
            <h4 className="font-semibold text-heading mb-2">
              3. 보안과 권한 관리
            </h4>
            <p className="text-body text-sm">
              Claude Code는 여러분의 PC에서 실행되기 때문에, 접근 권한에
              주의해야 해요. 회사 기밀 문서나 개인정보가 포함된 파일을 다룰
              때는 특히 조심하세요. 민감한 데이터는 외부 API로 전송되지 않도록
              설정을 확인하세요.
            </p>
          </div>

          <div className="bg-accent-light border border-accent/30 rounded-xl p-5">
            <h4 className="font-semibold text-heading mb-2">
              4. 먼저 시작하면 더 큰 효과
            </h4>
            <p className="text-body text-sm">
              에이전틱 AI는 쓰면 쓸수록 효과가 커져요. CLAUDE.md에 업무
              패턴을 쌓아가고, 자주 쓰는 자동화를 만들어두면 시간이 갈수록
              더 많은 시간을 아끼게 돼요. 완벽하게 배우고 시작하려 하지
              마세요. <strong>일단 시작하고, 하면서 배우는</strong> 게 가장
              빨라요.
            </p>
          </div>
        </div>

        <Callout type="tip" title="다음 단계는?">
          <p>
            여기까지 읽으셨으면 에이전틱 AI가 뭔지 감이 오셨을 거예요.
            실제로 써보고 싶다면, Claude Code 설치부터 시작해보세요.
            생각보다 간단하거든요 — 터미널에서 명령어 한 줄이면 끝이에요.
          </p>
        </Callout>
      </section>
    </>
  );
}
