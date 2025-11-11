#!/usr/bin/env powershell

Set-Location backend
deno task build

Set-Location ../frontend
deno task build

Set-Location ..

function which {
    Get-Command -Name $args[0] -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
}

$denoPath = which deno.exe
$backendOut = ".\backend\build"
$frontendOut = ".\frontend\build"
$outDir = ".\out"
$tmpDir = "$outDir\.tmp"

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
if (Test-Path "$outDir\*") { Remove-Item "$outDir\*" -Recurse -Force }

if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir | Out-Null }
if (-not (Test-Path "$tmpDir\.backend")) { New-Item -ItemType Directory -Path "$tmpDir\.backend" | Out-Null }
if (-not (Test-Path "$tmpDir\.frontend")) { New-Item -ItemType Directory -Path "$tmpDir\.frontend" | Out-Null }

Copy-Item "$denoPath" -Destination $tmpDir -ErrorAction SilentlyContinue
Rename-Item -Path "$tmpDir\deno.exe" -NewName ".deno.exe" -ErrorAction SilentlyContinue

if (Test-Path $backendOut) {
    Copy-Item "$backendOut\*" -Destination "$tmpDir\.backend" -Recurse -ErrorAction SilentlyContinue
}
if (Test-Path $frontendOut) {
    Copy-Item "$frontendOut\*" -Destination "$tmpDir\.frontend" -Recurse -ErrorAction SilentlyContinue
}

$batContent = @'
@echo off
setlocal enabledelayedexpansion

REM GET_LOCAL_IPV4
set "local_ip=127.0.0.1"
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr "IPv4"') do (
    set "ip=%%A"
    set "ip=!ip:~1!"
    set "ip=!ip: =!"
    echo !ip! | findstr /R "^192\.168\." >nul || ^
    echo !ip! | findstr /R "^10\." >nul || ^
    echo !ip! | findstr /R "^172\.(1[6-9]|2[0-9]|3[0-1])\." >nul
    if !errorlevel! == 0 (
        set "local_ip=!ip!"
        goto :found
    )
)
:found

REM START_SERVER
start "" ".\.deno.exe" run -A .\.frontend\index.js
start "" ".\.deno.exe" run -A .\.backend\server.js

REM OPEN_EDGE
start "" "msedge.exe" --new-window --disable-extensions --guest --app="http://localhost:3000/tester#%local_ip%"
'@

$batPath = Join-Path $tmpDir "start.bat"
$batContent | Set-Content -Path $batPath -Encoding ASCII -Force

Get-ChildItem -Path "$tmpDir\.frontend" -Recurse -Include "*.js.map" | ForEach-Object {
    Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
}

Compress-Archive -Path "$tmpDir\*" -DestinationPath "$outDir\archive.zip" -Force -ErrorAction SilentlyContinue

Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue