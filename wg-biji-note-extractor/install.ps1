# wg-biji-note-extractor 技能安装器 (Windows PowerShell)
$ErrorActionPreference = "Stop"

$Repo = "WalkGod-Lei/wg-skills"
$Branch = "main"
$SkillName = "wg-biji-note-extractor"
$BaseUrl = "https://raw.githubusercontent.com/$Repo/$Branch"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  wg-biji-note-extractor v2 技能安装器" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检测 Agent 目录
$Agents = @()
$Paths = @()

# QoderWork CN
$qwPath = Join-Path $env:USERPROFILE ".qoderworkcn\skills"
if (Test-Path $qwPath) {
    $Agents += "QoderWork CN"
    $Paths += Join-Path $qwPath $SkillName
}

# WorkBuddy
$wbPath = Join-Path $env:USERPROFILE ".workbuddy\skills"
if (Test-Path $wbPath) {
    $Agents += "WorkBuddy"
    $Paths += Join-Path $wbPath $SkillName
}

# ProMa
$pmPath = Join-Path $env:USERPROFILE ".proma\default-skills"
if (Test-Path $pmPath) {
    $Agents += "ProMa"
    $Paths += Join-Path $pmPath $SkillName
}

if ($Agents.Count -eq 0) {
    Write-Host "未检测到支持 Skill 的 Agent 目录。" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "支持的 Agent 及目录："
    Write-Host "  - QoderWork CN: %USERPROFILE%\.qoderworkcn\skills\"
    Write-Host "  - WorkBuddy:    %USERPROFILE%\.workbuddy\skills\"
    Write-Host "  - ProMa:        %USERPROFILE%\.proma\default-skills\"
    Write-Host ""
    Write-Host "你也可以手动下载："
    Write-Host "  git clone https://github.com/$Repo.git"
    exit 1
}

Write-Host "检测到以下 Agent："
for ($i = 0; $i -lt $Agents.Count; $i++) {
    Write-Host "  [$($i+1)] $($Agents[$i]) -> $($Paths[$i])"
}
Write-Host ""

# 下载文件
function Install-Skill {
    param([string]$TargetDir, [string]$AgentName)

    $refDir = Join-Path $TargetDir "references"
    if (-not (Test-Path $refDir)) {
        New-Item -ItemType Directory -Path $refDir -Force | Out-Null
    }

    Write-Host "  安装到 $AgentName... " -NoNewline

    Invoke-WebRequest -Uri "$BaseUrl/SKILL.md" -OutFile (Join-Path $TargetDir "SKILL.md")
    Invoke-WebRequest -Uri "$BaseUrl/references/troubleshooting.md" -OutFile (Join-Path $refDir "troubleshooting.md")

    Write-Host "OK" -ForegroundColor Green
}

# 逐个安装
for ($i = 0; $i -lt $Agents.Count; $i++) {
    Install-Skill -TargetDir $Paths[$i] -AgentName $Agents[$i]
}

Write-Host ""
Write-Host "安装完成！" -ForegroundColor Green
Write-Host ""
Write-Host "现在可以在 Agent 对话中使用以下关键词触发技能："
Write-Host "  - '提取 biji.com 笔记'"
Write-Host "  - '抓取得到大脑知识库'"
Write-Host "  - 直接发送 biji.com/subject/... 链接"
