#!/usr/bin/env powershell

function GetLocalIP {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 |
        Where-Object {
            $_.IPAddress -notlike "*:*" -and
            $_.PrefixOrigin -eq "Dhcp" -and
            $_.InterfaceAlias -ne "Loopback Pseudo-Interface 1"
        }).IPAddress
    return $ip
}

Start-Process powershell.exe -ArgumentList "-NoProfile -Command `"Set-Location 'backend'; deno task dev`"" 
# -WindowStyle Minimized
Start-Process powershell.exe -ArgumentList "-NoProfile -Command `"Set-Location 'frontend'; deno task dev --host 0.0.0.0`"" 
# -WindowStyle Minimized


$localIP = GetLocalIP

$msedgeArgs = @(
    "--new-window",
    "--app=`"http://localhost:3000/tester#$localIP`"",
    "--disable-extensions",
    "--guest"
)

Start-Process "msedge.exe" -ArgumentList $msedgeArgs 

$msedgeArgs = @(
    "--new-window",
    "--app=`"http://localhost:3000/testee#1`"",
    "--disable-extensions",
    "--guest"
)

Start-Process "msedge.exe" -ArgumentList $msedgeArgs