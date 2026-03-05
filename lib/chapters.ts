export interface Chapter {
  id: number;
  slug: string;
  title: string;
  description: string;
  emoji: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
}

export const chapters: Chapter[] = [
  {
    id: 1,
    slug: "basics",
    title: "에이전틱 AI란?",
    description: "왜 지금 시작해야 하는가",
    emoji: "🤖",
    sections: [
      { id: "ai-usage", title: "AI, 아직 거의 아무도 안 씁니다" },
      { id: "agentic-timeline", title: "에이전틱 AI, 시작한 지 4개월째" },
      { id: "world-changing", title: "세상은 이미 바뀌고 있습니다" },
      { id: "my-day", title: "직장인의 하루 — Before & After" },
      { id: "copy-paste", title: "아직도 복붙으로 일하고 있나요?" },
      { id: "what-is-agentic", title: "에이전틱 AI = 직접 실행하는 AI" },
      { id: "diff-file", title: "차이점 1: 파일 직접 접근" },
      { id: "diff-api", title: "차이점 2: 외부 시스템 연동" },
      { id: "diff-multi", title: "차이점 3: 자율 실행 & 멀티스텝" },
      { id: "summary-table", title: "웹 AI vs 에이전틱 AI 총정리" },
      { id: "why-claude", title: "왜 Claude Code인가?" },
      { id: "models", title: "Claude 모델 비교" },
      { id: "use-cases", title: "실제 업무 활용 예시" },
      { id: "vs-nocode", title: "Make/n8n과 뭐가 다른가요?" },
      { id: "wow", title: "이것까지 된다고요?" },
      { id: "claude-md", title: "AI에게 나를 기억시키기 — CLAUDE.md" },
      { id: "time-save", title: "예상 시간 절감 효과" },
      { id: "limitations", title: "에이전틱 AI가 아직 잘 못하는 것" },
      { id: "role-change", title: "우리의 역할은 어떻게 바뀌나?" },
      { id: "caution", title: "현실적 고려사항" },
    ],
  },
  {
    id: 2,
    slug: "setup",
    title: "세팅",
    description: "Claude Code 설치하기",
    emoji: "🛠️",
    sections: [
      { id: "what-is-claude-code", title: "Claude Code가 뭔가요?" },
      { id: "requirements", title: "내 노트북으로 되나요?" },
      { id: "terminal", title: "터미널이란?" },
      { id: "pricing", title: "요금제 — 어떤 걸 구독할까?" },
      { id: "subscribe", title: "Claude 구독하기" },
      { id: "prereqs", title: "사전 준비 (Node.js, Git)" },
      { id: "install", title: "Claude Code 설치" },
      { id: "first-run", title: "첫 실행" },
      { id: "login", title: "로그인 방법" },
      { id: "hello", title: "첫 대화: 안녕!" },
      { id: "modes", title: "실행 모드 이해하기" },
      { id: "checkpoint", title: "체크포인트" },
    ],
  },
  {
    id: 3,
    slug: "playwright",
    title: "실습 1: 웹 자동화 (Playwright)",
    description: "브라우저를 AI가 직접 조종 + Google 인증",
    emoji: "🌐",
    sections: [
      { id: "situation", title: "매일 반복하는 웹 작업들" },
      { id: "what-is-playwright", title: "Playwright란?" },
      { id: "install", title: "Playwright 설치하기" },
      { id: "first-run", title: "첫 실행: 웹 페이지 열어보기" },
      { id: "google-auth", title: "Google 인증 쉽게 하기" },
      { id: "real-example", title: "실전: 웹에서 데이터 수집" },
      { id: "use-cases", title: "이런 것도 가능해요" },
      { id: "try-it", title: "직접 해보기" },
      { id: "recap", title: "정리" },
    ],
  },
  {
    id: 4,
    slug: "gmail",
    title: "실습 2: Gmail 자동화",
    description: "메일 분류 + 자동 읽음처리 + 답장 초안",
    emoji: "📧",
    sections: [
      { id: "situation", title: "상황: 아침마다 메일함과 씨름" },
      { id: "pipeline", title: "만들 자동화 파이프라인" },
      { id: "google-api", title: "Google API 준비 (2가지 방법)" },
      { id: "prompt", title: "프롬프트 작성" },
      { id: "expected", title: "단계별 실행 화면" },
      { id: "prompt-tips", title: "프롬프트 잘 쓰는 3가지 공식" },
      { id: "try-it", title: "직접 해보기" },
      { id: "schedule", title: "매일 자동 실행 설정" },
      { id: "recap", title: "Gmail 자동화 정리" },
    ],
  },
  {
    id: 5,
    slug: "excel",
    title: "실습 3: 엑셀 자동화",
    description: "데이터 집계 + 요약표 + 차트 자동 생성",
    emoji: "📊",
    sections: [
      { id: "situation", title: "상황: 매주 반복되는 엑셀 집계" },
      { id: "demo", title: "시연: 한마디로 끝내기" },
      { id: "try-it", title: "직접 해보기" },
      { id: "tips", title: "엑셀 자동화 팁" },
    ],
  },
  {
    id: 6,
    slug: "ppt",
    title: "실습 4: PPT 자동화 + 바이브코딩",
    description: "슬라이드 자동 구성 + 말로 만드는 프로그래밍",
    emoji: "🎤",
    sections: [
      { id: "situation", title: "상황: 보고서 쓰고 또 PPT 만들기" },
      { id: "demo", title: "시연: 한마디로 PPT 생성" },
      { id: "try-it", title: "직접 해보기" },
      { id: "vibe-coding", title: "바이브코딩이란?" },
      { id: "free-experiment", title: "자유 실험 아이디어" },
    ],
  },
  {
    id: 7,
    slug: "next",
    title: "마무리",
    description: "요금제 비교 + 다음 스텝",
    emoji: "🎯",
    sections: [
      { id: "today-summary", title: "오늘 배운 것 정리" },
      { id: "pricing-compare", title: "요금제 비교 — 어떤 걸 골라야 할까?" },
      { id: "max-recommend", title: "Max를 추천하는 이유" },
      { id: "week-plan", title: "이번 주부터 바로 해보세요" },
      { id: "markdown", title: "AI와 소통하기 좋은 자료 형식" },
      { id: "whats-next", title: "다음 코스 예고" },
    ],
  },
  {
    id: 8,
    slug: "telegram",
    title: "텔레그램 연동",
    description: "코깍딜로 어디서든 AI 원격 조종",
    emoji: "💬",
    sections: [
      { id: "why-remote", title: "밖에서도 AI를 쓰고 싶다" },
      { id: "openclaw-vs-cokacdir", title: "OpenClaw vs 코깍딜" },
      { id: "openclaw-danger", title: "OpenClaw의 치명적 문제" },
      { id: "what-is-cokacdir", title: "코깍딜이란?" },
      { id: "auth-diff", title: "핵심 차이: 인증 방식" },
      { id: "architecture", title: "코깍딜 구조 이해하기" },
      { id: "install-overview", title: "설치 준비 — 이미 다 있습니다" },
      { id: "step0-folder", title: "STEP 0: 작업 폴더 만들기" },
      { id: "step1-token", title: "STEP 1: 텔레그램 봇 토큰 발급" },
      { id: "step2-download", title: "STEP 2: 코깍딜 다운로드" },
      { id: "step3-run", title: "STEP 3: 봇 서버 실행" },
      { id: "test", title: "테스트해보기" },
      { id: "troubleshoot-apikey", title: "에러: Invalid API key" },
      { id: "troubleshoot-os193", title: "에러: OS error 193" },
      { id: "bat-autostart", title: "자동 실행 BAT 파일 만들기" },
      { id: "usecase-file", title: "활용 ①: 파일 주고받기" },
      { id: "usecase-schedule", title: "활용 ②: 24시간 자동 비서" },
      { id: "usecase-report", title: "활용 ③: 한 줄 지시 → 보고서" },
      { id: "usecase-receipt", title: "활용 ④: 영수증 → 자동 가계부" },
      { id: "usecase-multibot", title: "활용 ⑤: 프로젝트별 멀티봇" },
      { id: "usecase-memory", title: "활용 ⑥: 나를 기억하는 AI" },
      { id: "summary", title: "핵심 정리" },
    ],
  },
];

export function getChapter(id: number): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}
