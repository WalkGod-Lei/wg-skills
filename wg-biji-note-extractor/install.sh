#!/usr/bin/env bash
set -euo pipefail

REPO="WalkGod-Lei/wg-skills"
BRANCH="main"
SKILL_NAME="wg-biji-note-extractor"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "  wg-biji-note-extractor v2 技能安装器"
echo "=========================================="
echo ""

# 检测 Agent 目录
declare -a AGENTS=()
declare -a PATHS=()

# QoderWork CN
if [ -d "$HOME/.qoderworkcn/skills" ]; then
    AGENTS+=("QoderWork CN")
    PATHS+=("$HOME/.qoderworkcn/skills/$SKILL_NAME")
fi

# WorkBuddy
if [ -d "$HOME/.workbuddy/skills" ]; then
    AGENTS+=("WorkBuddy")
    PATHS+=("$HOME/.workbuddy/skills/$SKILL_NAME")
fi

# ProMa
if [ -d "$HOME/.proma/default-skills" ]; then
    AGENTS+=("ProMa")
    PATHS+=("$HOME/.proma/default-skills/$SKILL_NAME")
fi

if [ ${#AGENTS[@]} -eq 0 ]; then
    echo -e "${YELLOW}未检测到支持 Skill 的 Agent 目录。${NC}"
    echo ""
    echo "支持的 Agent 及目录："
    echo "  - QoderWork CN: ~/.qoderworkcn/skills/"
    echo "  - WorkBuddy:    ~/.workbuddy/skills/"
    echo "  - ProMa:        ~/.proma/default-skills/"
    echo ""
    echo "你也可以手动下载："
    echo "  git clone https://github.com/${REPO}.git"
    exit 1
fi

echo "检测到以下 Agent："
for i in "${!AGENTS[@]}"; do
    echo "  [$((i+1))] ${AGENTS[$i]} → ${PATHS[$i]}"
done
echo ""

# 下载文件
download_skill() {
    local target_dir="$1"
    local agent_name="$2"

    mkdir -p "$target_dir/references"

    echo -n "  安装到 ${agent_name}... "

    curl -fsSL "${BASE_URL}/SKILL.md" -o "$target_dir/SKILL.md"
    curl -fsSL "${BASE_URL}/references/troubleshooting.md" -o "$target_dir/references/troubleshooting.md"

    echo -e "${GREEN}OK${NC}"
}

# 逐个安装
for i in "${!AGENTS[@]}"; do
    download_skill "${PATHS[$i]}" "${AGENTS[$i]}"
done

echo ""
echo -e "${GREEN}安装完成！${NC}"
echo ""
echo "现在可以在 Agent 对话中使用以下关键词触发技能："
echo "  - \"提取 biji.com 笔记\""
echo "  - \"抓取得到大脑知识库\""
echo "  - 直接发送 biji.com/subject/... 链接"
