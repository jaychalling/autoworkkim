#!/bin/bash
# =============================================================================
# Easy클코 — Claude Code Mac 환경 자동 설치
#
# 사용법:
#   bash ~/Downloads/install-mac.sh
#
# 또는 원격 실행:
#   curl -fsSL https://managerkim.com/downloads/install-mac.sh | bash
#
# 테스트 모드 (감지만, 설치 안 함):
#   bash install-mac.sh --test
#
# =============================================================================

set -e

# ---------------------------------------------------------------------------
# 실행 모드 (--test 또는 --dry-run 이면 감지만)
# ---------------------------------------------------------------------------
TEST_MODE=false
for arg in "$@"; do
    case "$arg" in
        --test|--dry-run|-t) TEST_MODE=true ;;
    esac
done

# ---------------------------------------------------------------------------
# 로그 파일
# ---------------------------------------------------------------------------
LOG_FILE="$HOME/Desktop/easy-clco-install-log.txt"
[ -d "$HOME/Desktop" ] || LOG_FILE="$HOME/easy-clco-install-log.txt"

write_log() {
    local ts
    ts=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$ts] $1" >> "$LOG_FILE"
}

write_system_info() {
    echo "============================================" > "$LOG_FILE"
    write_log "Easy클코 — 설치 로그"
    write_log "============================================"
    write_log "실행 시각: $(date '+%Y-%m-%d %H:%M:%S')"
    write_log "테스트 모드: $TEST_MODE"
    write_log "OS: $(sw_vers -productName 2>/dev/null || uname -s) $(sw_vers -productVersion 2>/dev/null || uname -r)"
    write_log "아키텍처: $(uname -m)"
    write_log "사용자: $(whoami)"
    write_log "홈 경로: $HOME"
    write_log "쉘: $SHELL ($BASH_VERSION)"
    write_log "--- PATH ---"
    echo "$PATH" | tr ':' '\n' | while read -r p; do write_log "  $p"; done
    write_log "--- END PATH ---"
    write_log ""
}

# ---------------------------------------------------------------------------
# 색상 및 유틸리티
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

ERRORS=()

step_ok()   { echo -e "  ${GREEN}✅ $1${NC}"; write_log "[OK] $1"; }
step_fail() { echo -e "  ${RED}❌ $1${NC}"; ERRORS+=("$1"); write_log "[FAIL] $1"; }
step_wait() { echo -e "  ${YELLOW}⏳ $1${NC}"; write_log "[WAIT] $1"; }
step_info() { echo -e "  ${CYAN}ℹ️  $1${NC}"; write_log "[INFO] $1"; }
step_test() { echo -e "  ${MAGENTA}🧪 $1${NC}"; write_log "[TEST] $1"; }

# ---------------------------------------------------------------------------
# 시스템 정보 기록 + 헤더
# ---------------------------------------------------------------------------
write_system_info

echo ""
echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║                                                          ║${NC}"
echo -e "${BOLD}${BLUE}║        Easy클코 — Claude Code 환경 자동 설치             ║${NC}"
echo -e "${BOLD}${BLUE}║                                                          ║${NC}"
echo -e "${BOLD}${BLUE}║   Git · Claude Code · Homebrew · Node.js                 ║${NC}"
echo -e "${BOLD}${BLUE}║                                                          ║${NC}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  로그 파일: ${CYAN}$LOG_FILE${NC}"
if [ "$TEST_MODE" = true ]; then
    echo -e "  ${MAGENTA}테스트 모드 — 감지만 수행하고 설치하지 않습니다${NC}"
fi
echo ""
echo ""

# ---------------------------------------------------------------------------
# 셸 프로파일 소스 — 이미 설치된 도구가 PATH에 잡히도록
# ---------------------------------------------------------------------------
reload_shell() {
    if [ -f /opt/homebrew/bin/brew ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [ -f /usr/local/bin/brew ]; then
        eval "$(/usr/local/bin/brew shellenv)"
    fi

    for f in "$HOME/.zprofile" "$HOME/.zshrc" "$HOME/.bash_profile" "$HOME/.bashrc" "$HOME/.profile"; do
        [ -f "$f" ] && source "$f" 2>/dev/null || true
    done

    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh" 2>/dev/null || true

    # Claude Code 네이티브 경로
    [ -d "$HOME/.local/bin" ] && export PATH="$HOME/.local/bin:$PATH"

    if command -v npm &>/dev/null; then
        export PATH="$(npm prefix -g 2>/dev/null)/bin:$PATH"
    fi
}

reload_shell

# ===========================================================================
# 환경 사전 분석 — 설치 전 현재 상태를 보여줌
# ===========================================================================
echo -e "${BOLD}  시스템을 분석하고 있습니다...${NC}"
echo ""
echo -e "  --- 환경 분석 -------------------------------------------"
echo ""

TO_INSTALL=()
WORKSPACE_DIR="$HOME/claude-workspace"

# Git
printf "    %-18s" "Git"
sleep 0.3
if command -v git &>/dev/null; then
    echo -e "${GREEN}OK  $(git --version)${NC}"
else
    echo -e "${RED}X   미설치 -> 설치 예정${NC}"
    TO_INSTALL+=("Git")
fi

# Claude Code
printf "    %-18s" "Claude Code"
sleep 0.3
if command -v claude &>/dev/null || [ -f "$HOME/.local/bin/claude" ]; then
    VER=$(claude --version 2>/dev/null || echo "설치됨")
    echo -e "${GREEN}OK  ${VER}${NC}"
else
    echo -e "${RED}X   미설치 -> 설치 예정${NC}"
    TO_INSTALL+=("Claude Code")
fi

# Homebrew
printf "    %-18s" "Homebrew"
sleep 0.3
if command -v brew &>/dev/null; then
    echo -e "${GREEN}OK  $(brew --version 2>/dev/null | head -1)${NC}"
else
    echo -e "${RED}X   미설치 -> 설치 예정${NC}"
    TO_INSTALL+=("Homebrew")
fi

# Node.js
printf "    %-18s" "Node.js"
sleep 0.3
if command -v node &>/dev/null; then
    echo -e "${GREEN}OK  $(node --version)${NC}"
else
    echo -e "${RED}X   미설치 -> 설치 예정${NC}"
    TO_INSTALL+=("Node.js")
fi

# 작업 폴더
printf "    %-18s" "작업 폴더"
sleep 0.3
if [ -d "$WORKSPACE_DIR" ]; then
    echo -e "${GREEN}OK  $WORKSPACE_DIR${NC}"
else
    echo -e "${RED}X   없음 -> 생성 예정${NC}"
    TO_INSTALL+=("작업 폴더")
fi

echo ""
echo -e "  ---------------------------------------------------------"

SCAN_FOUND=$((5 - ${#TO_INSTALL[@]}))
SCAN_MISSING=${#TO_INSTALL[@]}

if [ "$SCAN_MISSING" -eq 0 ]; then
    echo ""
    echo -e "  ${GREEN}${BOLD}모든 도구가 이미 설치되어 있습니다! 검증만 진행합니다.${NC}"
    echo ""
else
    echo ""
    echo -e "    ${SCAN_FOUND}개 감지됨  /  ${SCAN_MISSING}개 설치 필요"
    echo -e "    ${YELLOW}설치 예정: $(IFS=', '; echo "${TO_INSTALL[*]}")${NC}"
    echo ""

    if [ "$TEST_MODE" = false ]; then
        for i in 3 2 1; do
            printf "\r    ${YELLOW}${i}초 후 설치를 시작합니다...  ${NC}"
            sleep 1
        done
        printf "\r    ${GREEN}설치를 시작합니다!                       ${NC}\n"
        echo ""
    fi
fi

echo ""

# ===========================================================================
# 1단계: Git (Claude Code 필수 의존성)
# ===========================================================================
echo -e "${BOLD}[1/7] Git 확인 (Claude Code 필수)${NC}"

if command -v git &>/dev/null; then
    step_ok "Git 이미 설치되어 있습니다 ($(git --version))"
elif [ "$TEST_MODE" = true ]; then
    step_test "[테스트 모드] Git 미설치 — 설치를 건너뜁니다"
    step_test "[테스트 모드] xcode-select 상태: $(xcode-select -p 2>/dev/null || echo '미설치')"
else
    step_wait "Git이 없습니다. Xcode Command Line Tools 설치를 시도합니다..."
    step_info "시스템 팝업이 뜨면 '설치' 를 눌러주세요."
    if xcode-select --install 2>/dev/null; then
        echo ""
        step_info "Xcode CLI Tools 설치가 진행 중입니다."
        step_info "설치 완료 후 이 스크립트를 다시 실행해 주세요."
        echo ""
    else
        if command -v git &>/dev/null; then
            step_ok "Git 설치 완료 ($(git --version))"
        else
            step_fail "Git 설치 실패 — Xcode CLI Tools 설치 후 스크립트를 다시 실행해 주세요"
        fi
    fi
fi
echo ""

# ===========================================================================
# 2단계: Claude Code (네이티브 인스톨러 우선)
# ===========================================================================
echo -e "${BOLD}[2/7] Claude Code 설치 (네이티브 인스톨러)${NC}"

CLAUDE_INSTALLED=false

if command -v claude &>/dev/null; then
    CLAUDE_VER=$(claude --version 2>/dev/null || echo '버전 확인 불가')
    step_ok "Claude Code 이미 설치되어 있습니다 ($CLAUDE_VER)"
    CLAUDE_INSTALLED=true

    # 설치 방식 감지
    CLAUDE_PATH=$(command -v claude)
    if [[ "$CLAUDE_PATH" == *".local/bin"* ]]; then
        step_info "설치 방식: 네이티브 (자동 업데이트)"
    elif [[ "$CLAUDE_PATH" == *"npm"* ]] || [[ "$CLAUDE_PATH" == *"node_modules"* ]]; then
        step_info "설치 방식: npm (deprecated — 네이티브로 전환 권장)"
        step_info "전환 방법: claude install 또는 curl -fsSL https://claude.ai/install.sh | bash"
    fi
elif [ -f "$HOME/.local/bin/claude" ]; then
    # PATH에 없지만 설치되어 있는 경우
    export PATH="$HOME/.local/bin:$PATH"
    CLAUDE_VER=$(claude --version 2>/dev/null || echo '버전 확인 불가')
    step_ok "Claude Code 발견 (PATH 미등록): $HOME/.local/bin/claude"
    step_info "PATH에 추가합니다."
    CLAUDE_INSTALLED=true
elif [ "$TEST_MODE" = true ]; then
    step_test "[테스트 모드] Claude Code 미설치 — 설치를 건너뜁니다"
    step_test "[테스트 모드] 네이티브 경로 ($HOME/.local/bin/claude): 없음"
    step_test "[테스트 모드] brew 사용 가능: $(command -v brew &>/dev/null && echo 'Yes' || echo 'No')"
    step_test "[테스트 모드] npm 사용 가능: $(command -v npm &>/dev/null && echo "Yes ($(npm --version))" || echo 'No')"
else
    # --- 방법 1: 공식 네이티브 인스톨러 (권장) ---
    step_wait "공식 네이티브 인스톨러로 설치 중... (Node.js 불필요)"
    if curl -fsSL https://claude.ai/install.sh | bash 2>/dev/null; then
        reload_shell
        [ -d "$HOME/.local/bin" ] && export PATH="$HOME/.local/bin:$PATH"
        if command -v claude &>/dev/null; then
            step_ok "Claude Code 설치 완료 (네이티브 — 자동 업데이트)"
            CLAUDE_INSTALLED=true
        fi
    else
        step_info "네이티브 인스톨러 실패"
    fi

    # --- 방법 2: Homebrew Cask ---
    if [ "$CLAUDE_INSTALLED" = false ] && command -v brew &>/dev/null; then
        step_wait "Homebrew Cask로 설치 시도..."
        if brew install --cask claude-code 2>/dev/null; then
            reload_shell
            if command -v claude &>/dev/null; then
                step_ok "Claude Code 설치 완료 (Homebrew — 수동 업데이트: brew upgrade claude-code)"
                CLAUDE_INSTALLED=true
            fi
        else
            step_info "Homebrew 설치 실패"
        fi
    fi

    # --- 방법 3: npm (레거시 — Node.js 필요) ---
    if [ "$CLAUDE_INSTALLED" = false ] && command -v npm &>/dev/null; then
        step_wait "npm으로 설치 시도 (레거시)..."
        if npm install -g @anthropic-ai/claude-code 2>/dev/null; then
            reload_shell
            if command -v claude &>/dev/null; then
                step_ok "Claude Code 설치 완료 (npm — 네이티브 전환 권장)"
                CLAUDE_INSTALLED=true
            fi
        else
            step_info "npm 설치 실패"
        fi
    fi

    if [ "$CLAUDE_INSTALLED" = false ]; then
        step_fail "Claude Code 설치 실패 — 수동 설치: curl -fsSL https://claude.ai/install.sh | bash"
    fi
fi
echo ""

# ===========================================================================
# 3단계: Homebrew (패키지 관리)
# ===========================================================================
echo -e "${BOLD}[3/7] Homebrew 확인 (패키지 관리)${NC}"

if command -v brew &>/dev/null; then
    step_ok "Homebrew 이미 설치되어 있습니다 ($(brew --version | head -1))"
elif [ "$TEST_MODE" = true ]; then
    step_test "[테스트 모드] Homebrew 미설치 — 설치를 건너뜁니다"
else
    step_wait "Homebrew 설치 중..."
    if /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
        reload_shell
        if command -v brew &>/dev/null; then
            step_ok "Homebrew 설치 완료"
        else
            step_fail "Homebrew 설치 후 PATH에서 찾을 수 없습니다"
        fi
    else
        step_fail "Homebrew 설치 실패 — https://brew.sh 에서 수동 설치해 주세요"
    fi
fi
echo ""

# ===========================================================================
# 4단계: Node.js (선택)
# ===========================================================================
echo -e "${BOLD}[4/7] Node.js 확인 (선택)${NC}"

if command -v node &>/dev/null; then
    NODE_VER=$(node --version)
    NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v\([0-9]*\).*/\1/')
    if [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
        step_ok "Node.js 이미 설치되어 있습니다 ($NODE_VER)"
    else
        step_ok "Node.js $NODE_VER 설치됨 — 18+ 권장 (현재 $NODE_MAJOR)"
    fi
elif [ "$TEST_MODE" = true ]; then
    step_test "[테스트 모드] Node.js 미설치 — 설치를 건너뜁니다"
    step_test "[테스트 모드] brew 사용 가능: $(command -v brew &>/dev/null && echo 'Yes' || echo 'No')"
else
    step_info "Node.js가 없습니다. (Claude Code에는 불필요, 일부 프로젝트에 필요)"
    step_wait "Node.js 설치 중... (brew install node)"
    if command -v brew &>/dev/null; then
        if brew install node; then
            reload_shell
            if command -v node &>/dev/null; then
                step_ok "Node.js 설치 완료 ($(node --version))"
            else
                step_fail "Node.js 설치 후 확인 실패"
            fi
        else
            step_fail "Node.js 설치 실패 — 'brew install node' 를 수동 실행해 주세요"
        fi
    else
        step_fail "Homebrew가 없어서 Node.js를 설치할 수 없습니다"
    fi
fi

if command -v npm &>/dev/null; then
    step_ok "npm 사용 가능 ($(npm --version))"
fi
echo ""

# ===========================================================================
# 5단계: 터미널 안내
# ===========================================================================
echo -e "${BOLD}[5/7] 터미널 확인${NC}"
step_ok "Mac 기본 터미널(Terminal.app)을 사용하시면 됩니다."
step_info "더 나은 환경을 원하시면 iTerm2 추천: https://iterm2.com"
echo ""

# ===========================================================================
# 6단계: 작업 폴더 생성
# ===========================================================================
echo -e "${BOLD}[6/7] 작업 폴더 생성${NC}"

WORKSPACE_DIR="$HOME/claude-workspace"

if [ -d "$WORKSPACE_DIR" ]; then
    step_ok "작업 폴더가 이미 존재합니다 ($WORKSPACE_DIR)"
else
    if mkdir -p "$WORKSPACE_DIR"; then
        step_ok "작업 폴더 생성 완료 ($WORKSPACE_DIR)"
    else
        step_fail "작업 폴더 생성 실패"
    fi
fi
echo ""

# ===========================================================================
# 7단계: PATH 환경변수 영구 설정
# ===========================================================================
echo -e "${BOLD}[7/7] PATH 환경변수 확인 및 설정${NC}"
write_log ""
write_log "========== [7/7] PATH 환경변수 확인 및 설정 =========="

# 사용자 쉘 설정 파일 결정
SHELL_RC=""
if [ -n "$ZSH_VERSION" ] || [ "$SHELL" = "/bin/zsh" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ] || [ "$SHELL" = "/bin/bash" ]; then
    SHELL_RC="$HOME/.bash_profile"
fi
[ -z "$SHELL_RC" ] && SHELL_RC="$HOME/.zshrc"

step_info "쉘 설정 파일: $SHELL_RC"

MARKER="# [EASY-CLCO-PATH-SETUP]"
PATHS_ADDED=0

# 이전 마커도 확인 (기존 설치 호환)
OLD_MARKER="# [WORKSHOP-PATH-SETUP]"

if grep -q "$MARKER" "$SHELL_RC" 2>/dev/null || grep -q "$OLD_MARKER" "$SHELL_RC" 2>/dev/null; then
    step_ok "PATH 설정이 이미 추가되어 있습니다 ($SHELL_RC)"
else
    PATH_BLOCK=""

    # Claude Code 네이티브 경로 (~/.local/bin)
    if [ -d "$HOME/.local/bin" ]; then
        if ! grep -q '\.local/bin' "$SHELL_RC" 2>/dev/null; then
            PATH_BLOCK="${PATH_BLOCK}export PATH=\"\$HOME/.local/bin:\$PATH\"\n"
            step_info "Claude Code 네이티브 경로 추가: ~/.local/bin"
            PATHS_ADDED=$((PATHS_ADDED + 1))
        else
            step_ok "Claude Code 네이티브 경로 OK: ~/.local/bin"
        fi
    fi

    # Homebrew (Apple Silicon / Intel)
    if [ -f /opt/homebrew/bin/brew ]; then
        if ! grep -q '/opt/homebrew/bin/brew shellenv' "$SHELL_RC" 2>/dev/null; then
            PATH_BLOCK="${PATH_BLOCK}eval \"\$(/opt/homebrew/bin/brew shellenv)\"\n"
            step_info "Homebrew 경로 추가 (Apple Silicon)"
            PATHS_ADDED=$((PATHS_ADDED + 1))
        else
            step_ok "Homebrew 경로 OK"
        fi
    elif [ -f /usr/local/bin/brew ]; then
        if ! grep -q '/usr/local/bin/brew shellenv' "$SHELL_RC" 2>/dev/null; then
            PATH_BLOCK="${PATH_BLOCK}eval \"\$(/usr/local/bin/brew shellenv)\"\n"
            step_info "Homebrew 경로 추가 (Intel)"
            PATHS_ADDED=$((PATHS_ADDED + 1))
        else
            step_ok "Homebrew 경로 OK"
        fi
    fi

    # npm global bin
    if command -v npm &>/dev/null; then
        NPM_PREFIX="$(npm prefix -g 2>/dev/null)/bin"
        if [ -d "$NPM_PREFIX" ]; then
            if ! grep -q "$NPM_PREFIX" "$SHELL_RC" 2>/dev/null; then
                PATH_BLOCK="${PATH_BLOCK}export PATH=\"${NPM_PREFIX}:\$PATH\"\n"
                step_info "npm global 경로 추가: $NPM_PREFIX"
                PATHS_ADDED=$((PATHS_ADDED + 1))
            else
                step_ok "npm global 경로 OK: $NPM_PREFIX"
            fi
        fi
    fi

    if [ "$PATHS_ADDED" -eq 0 ]; then
        step_ok "모든 PATH가 정상입니다. 추가할 항목 없음."
    elif [ "$TEST_MODE" = true ]; then
        step_test "[테스트 모드] ${PATHS_ADDED}개 경로를 $SHELL_RC에 추가해야 합니다"
        echo -e "$PATH_BLOCK" | while read -r line; do
            [ -n "$line" ] && step_test "  → $line"
        done
    else
        {
            echo ""
            echo "$MARKER"
            echo "# Easy클코 — 자동 추가된 PATH 설정"
            echo -e "$PATH_BLOCK"
        } >> "$SHELL_RC"

        step_ok "${PATHS_ADDED}개 경로를 $SHELL_RC에 추가 완료"
        step_info "새 터미널에서 적용됩니다. (또는: source $SHELL_RC)"
        write_log "PATH 추가 내용:"
        echo -e "$PATH_BLOCK" | while read -r line; do
            [ -n "$line" ] && write_log "  $line"
        done
    fi
fi
echo ""

# ===========================================================================
# claude doctor 검증
# ===========================================================================
if command -v claude &>/dev/null; then
    echo -e "${BOLD}설치 검증 (claude doctor)${NC}"
    write_log ""
    write_log "========== claude doctor =========="
    DOCTOR_OUTPUT=$(claude doctor 2>&1 || true)
    echo "$DOCTOR_OUTPUT" | head -20
    write_log "$DOCTOR_OUTPUT"
    echo ""
fi

# ===========================================================================
# 최종 요약
# ===========================================================================
echo -e "${BOLD}${BLUE}══════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  설치 결과 요약${NC}"
echo -e "${BOLD}${BLUE}══════════════════════════════════════════════════════════${NC}"
echo ""

check_tool() {
    local name="$1"
    local cmd="$2"
    if command -v "$cmd" &>/dev/null; then
        echo -e "  ${GREEN}✅ ${name}${NC} — $(command -v "$cmd")"
    else
        echo -e "  ${RED}❌ ${name}${NC} — 설치되지 않음"
    fi
}

check_tool "Git"         "git"
check_tool "Claude Code" "claude"
check_tool "Homebrew"    "brew"
check_tool "Node.js"     "node"
check_tool "npm"         "npm"

echo ""

# 결과를 로그에 기록
write_log ""
write_log "========== 최종 결과 =========="
for tool_name in "git" "claude" "brew" "node" "npm"; do
    if command -v "$tool_name" &>/dev/null; then
        write_log "  $tool_name: OK ($(command -v "$tool_name"))"
    else
        write_log "  $tool_name: 미설치"
    fi
done
write_log "에러 수: ${#ERRORS[@]}"
write_log "로그 종료: $(date '+%Y-%m-%d %H:%M:%S')"

# 에러 요약
if [ ${#ERRORS[@]} -gt 0 ]; then
    echo -e "${RED}${BOLD}⚠️  일부 항목에서 문제가 발생했습니다:${NC}"
    for err in "${ERRORS[@]}"; do
        echo -e "  ${RED}• $err${NC}"
    done
    echo ""
    echo -e "${YELLOW}위 문제를 해결한 뒤 스크립트를 다시 실행해 주세요.${NC}"
    echo ""
    echo -e "  전체 로그: ${CYAN}$LOG_FILE${NC}"
    echo ""
else
    echo -e "${GREEN}${BOLD}모든 설치가 완료되었습니다!${NC}"
    echo ""
    echo -e "${BOLD}  다음 명령어로 Claude Code를 시작하세요:${NC}"
    echo ""
    echo -e "    ${CYAN}cd ~/claude-workspace && claude${NC}"
    echo ""
    echo -e "  전체 로그: ${CYAN}$LOG_FILE${NC}"
    echo ""

    # Claude Code 자동 실행
    if [ "$CLAUDE_INSTALLED" = true ]; then
        echo -e "${BOLD}지금 바로 Claude Code를 실행할까요? (Y/n)${NC}"
        read -r -t 10 REPLY || REPLY="n"
        echo ""
        if [[ "$REPLY" =~ ^[Yy]?$ ]]; then
            cd "$WORKSPACE_DIR"
            exec claude
        else
            echo -e "${CYAN}나중에 실행하려면:  cd ~/claude-workspace && claude${NC}"
            echo ""
        fi
    fi
fi
