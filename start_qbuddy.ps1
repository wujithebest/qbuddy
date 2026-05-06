<#
.SYNOPSIS
    QBuddy 一键启动脚本
.DESCRIPTION
    自动检测 QBuddy 目录（兼容任意版本号），启动后端+前端，
    打开浏览器 http://localhost:3000/，关闭标签页后自动终止所有服务。
    双重监控（netstat + Get-NetTCPConnection），核弹级进程树终止。
.NOTES
    双击 start_qbuddy.bat 启动
#>

$Host.UI.RawUI.WindowTitle = "QBuddy - 一键启动"
$script:ErrorActionPreference = "Continue"

# ============================================================
# 1. 定位 QBuddy 目录（兼容 QBuddy_QBuddy-v* 格式）
# ============================================================
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "[INFO] 脚本目录: $ScriptDir" -ForegroundColor Cyan

$QbDirs = Get-ChildItem -Path $ScriptDir -Directory | Where-Object { $_.Name -match '^QBuddy.*v\d+' }
if (-not $QbDirs) {
    Write-Host "[ERROR] 未找到 QBuddy 目录 (期望格式: QBuddy_QBuddy-v*)" -ForegroundColor Red
    Read-Host "按回车退出"
    exit 1
}

$QbDir = $QbDirs[0].FullName
Write-Host "[INFO] 找到 QBuddy 目录: $(Split-Path -Leaf $QbDir)" -ForegroundColor Green

$BackendDir  = Join-Path $QbDir "backend"
$FrontendDir = Join-Path $QbDir "frontend"

if (-not (Test-Path $BackendDir)) {
    Write-Host "[ERROR] 未找到 backend 目录: $BackendDir" -ForegroundColor Red
    Read-Host "按回车退出"
    exit 1
}
if (-not (Test-Path $FrontendDir)) {
    Write-Host "[ERROR] 未找到 frontend 目录: $FrontendDir" -ForegroundColor Red
    Read-Host "按回车退出"
    exit 1
}

# ============================================================
# 2. 清理已占用的端口（5000 后端, 3000 前端）
# ============================================================
Write-Host "`n[STEP] 清理已占用端口..." -ForegroundColor Yellow

function Nuke-Port {
    param([int]$Port)
    # 通过 netstat 拿到端口上的所有 PID
    $lines = cmd /c "netstat -ano 2>nul" | Select-String ":$Port "
    $pids = @()
    foreach ($line in $lines) {
        $parts = $line -split '\s+'
        $portPid = $parts[-1]
        if ($portPid -match '^\d+$' -and $portPid -notin $pids) {
            $pids += $portPid
        }
    }
    foreach ($portPid in $pids) {
        Write-Host "  -> 终止端口 ${Port} 上的进程树 (PID: $portPid)" -ForegroundColor Magenta
        cmd /c "taskkill /F /T /PID $portPid >nul 2>&1"
    }
    # 兜底：直接用镜像名杀
    if ($Port -eq 3000) { cmd /c "taskkill /F /IM node.exe >nul 2>&1" }
    if ($Port -eq 5000) { cmd /c "taskkill /F /IM python.exe >nul 2>&1" }
}

Nuke-Port -Port 5000
Nuke-Port -Port 3000
Start-Sleep -Seconds 1

# ============================================================
# 3. 安装依赖
# ============================================================
Write-Host "`n[STEP] 安装后端依赖..." -ForegroundColor Yellow
Push-Location $BackendDir
try {
    python -m pip install flask flask-cors python-dotenv openai -q *>$null
    Write-Host "  -> 后端依赖安装完成" -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host "`n[STEP] 安装前端依赖..." -ForegroundColor Yellow
Push-Location $FrontendDir
try {
    if (-not (Test-Path "node_modules")) {
        npm install *>$null
        Write-Host "  -> 前端依赖安装完成" -ForegroundColor Green
    } else {
        Write-Host "  -> node_modules 已存在，跳过安装" -ForegroundColor Green
    }
} finally {
    Pop-Location
}

# ============================================================
# 4. 启动后端 (Flask, 端口 5000)
# ============================================================
Write-Host "`n[STEP] 启动后端 (Flask :5000)..." -ForegroundColor Yellow

$BackendProcess = Start-Process -FilePath "python" `
    -ArgumentList "app.py" `
    -WorkingDirectory $BackendDir `
    -WindowStyle Hidden `
    -PassThru

Write-Host "  -> 后端 PID: $($BackendProcess.Id)" -ForegroundColor Green

# ============================================================
# 5. 启动前端 (Vite, 端口 3000)
# ============================================================
Write-Host "`n[STEP] 启动前端 (Vite :3000)..." -ForegroundColor Yellow

$FrontendProcess = Start-Process -FilePath "cmd" `
    -ArgumentList "/c npm run dev" `
    -WorkingDirectory $FrontendDir `
    -WindowStyle Hidden `
    -PassThru

Write-Host "  -> 前端启动器 PID: $($FrontendProcess.Id)" -ForegroundColor Green

# ============================================================
# 6. 等待前端就绪
# ============================================================
Write-Host "`n[STEP] 等待前端服务就绪..." -ForegroundColor Yellow
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $req = [System.Net.HttpWebRequest]::Create("http://localhost:3000/")
        $req.Timeout = 2000
        $resp = $req.GetResponse()
        $resp.Close()
        $ready = $true
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

if (-not $ready) {
    Write-Host "[ERROR] 前端服务启动超时" -ForegroundColor Red
    Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue
    Nuke-Port -Port 5000
    Nuke-Port -Port 3000
    Read-Host "按回车退出"
    exit 1
}
Write-Host "  -> 前端服务已就绪!" -ForegroundColor Green

# ============================================================
# 7. 打开浏览器
# ============================================================
Write-Host "`n[STEP] 打开浏览器 http://localhost:3000/ ..." -ForegroundColor Yellow
Start-Process "http://localhost:3000/"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  QBuddy 启动成功!" -ForegroundColor Green
Write-Host "  地址: http://localhost:3000/" -ForegroundColor White
Write-Host "  密码: qbuddy2026" -ForegroundColor White
Write-Host "  关闭浏览器标签页后自动停止 | 或按 Ctrl+C 手动停止" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# ============================================================
# 8. 监控浏览器连接 — 标签页关闭后自动终止
# ============================================================
Write-Host "`n[INFO] 正在监控连接状态 (每2秒检测)..." -ForegroundColor DarkGray

$disconnectCount = 0
$maxDisconnectCount = 5   # 连续 5 次 (~10秒) 无连接则认为标签页关闭
$elapsedSeconds = 0
$statusInterval = 15      # 每 15 秒输出一次状态

while ($true) {
    # 支持 Ctrl+C 打断
    if ([Console]::KeyAvailable) {
        $key = [Console]::ReadKey($true)
        if ($key.Key -eq 'Q' -or $key.Key -eq 'q') {
            Write-Host "`n[INFO] 手动停止..." -ForegroundColor Yellow
            break
        }
    }

    Start-Sleep -Seconds 2
    $elapsedSeconds += 2

    # 检查进程是否意外退出
    $backendAlive = -not $BackendProcess.HasExited
    $frontendAlive = -not $FrontendProcess.HasExited

    if (-not $backendAlive -and -not $frontendAlive) {
        Write-Host "`n[WARN] 前后端进程均已退出" -ForegroundColor Yellow
        break
    }

    # 双重检测：netstat + Get-NetTCPConnection（任一方法检测到连接就算有）
    $hasConnection = $false

    # 方法1: netstat（最可靠）
    $netstatResult = cmd /c "netstat -ano 2>nul" | Select-String ":3000 " | Select-String "ESTABLISHED"
    if ($netstatResult) { $hasConnection = $true }

    # 方法2: Get-NetTCPConnection（更精确）
    try {
        $tcpConn = Get-NetTCPConnection -LocalPort 3000 -State Established -ErrorAction Stop
        if ($tcpConn) { $hasConnection = $true }
    } catch { }

    if (-not $hasConnection) {
        $disconnectCount++
        if ($disconnectCount -ge $maxDisconnectCount) {
            Write-Host "`n[INFO] 连续 ${disconnectCount} 次未检测到浏览器连接，正在停止服务..." -ForegroundColor Yellow
            break
        }
    } else {
        $disconnectCount = 0  # 重置计数器
    }

    # 定期输出状态
    if ($elapsedSeconds % $statusInterval -le 2) {
        $status = if ($hasConnection) { "已连接" } else { "无连接 ($disconnectCount/$maxDisconnectCount)" }
        Write-Host "  [监控] 运行 ${elapsedSeconds}s | 状态: $status | 后端: $(if($backendAlive){'存活'}else{'退出'}) 前端: $(if($frontendAlive){'存活'}else{'退出'})" -ForegroundColor DarkGray
    }

    # 安全超时：2 小时后自动退出
    if ($elapsedSeconds -gt 7200) {
        Write-Host "`n[INFO] 运行超过 2 小时，自动停止" -ForegroundColor Yellow
        break
    }
}

# ============================================================
# 9. 清理进程 — 核弹级终止
# ============================================================
Write-Host "`n[STEP] 正在停止服务..." -ForegroundColor Yellow

Nuke-Port -Port 5000
Nuke-Port -Port 3000
Start-Sleep -Seconds 2

# 验证清理结果
$leftover5000 = cmd /c "netstat -ano 2>nul" | Select-String ":5000 " | Select-String "LISTENING"
$leftover3000 = cmd /c "netstat -ano 2>nul" | Select-String ":3000 " | Select-String "LISTENING"

if ($leftover5000) {
    Write-Host "  [WARN] 端口 5000 仍被占用，使用最终手段..." -ForegroundColor Red
    cmd /c "taskkill /F /IM python.exe >nul 2>&1"
    cmd /c "taskkill /F /IM python3.exe >nul 2>&1"
}
if ($leftover3000) {
    Write-Host "  [WARN] 端口 3000 仍被占用，使用最终手段..." -ForegroundColor Red
    cmd /c "taskkill /F /IM node.exe >nul 2>&1"
    cmd /c "taskkill /F /IM npm.exe >nul 2>&1"
}

Write-Host "`n[INFO] 所有服务已停止。" -ForegroundColor Green
Write-Host "[INFO] 现在可以安全删除 QBuddy 文件夹。" -ForegroundColor Green
Start-Sleep -Seconds 1
