<# :
@echo off
copy/b "%~f0" "%temp%\%~n0.ps1" >nul
powershell -ExecutionPolicy bypass -noprofile -file "%temp%\%~n0.ps1" "%cd% " "%~1"
del "%temp%\%~n0.ps1"
pause
exit /b
#>
param([string]$cwd='.', [string]$dll)

function main {
    "Chrome 'developer mode extensions' warning disabler v1.0.5 20160820`n"
    if ($dll -and (gi -literal $dll)) {
        doPatch "DRAG'n'DROPPED" ((gi -literal $dll).directoryName + '\')
        exit
    }
    doPatch CURRENT ((gi -literal $cwd).fullName + '\')
    ('HKLM', 'HKCU') | %{ $hive = $_
        ('', '\Wow6432Node') | %{
            $key = "${hive}:\SOFTWARE$_\Google\Update\Clients"
            gci -ea silentlycontinue $key -r | gp | ?{ $_.CommandLine } | %{
                $path = $_.CommandLine -replace '"(.+?\\\d+\.\d+\.\d+\.\d+\\).+', '$1'
                doPatch REGISTRY $path
            }
        }
    }
}

function doPatch([string]$pathLabel, [string]$path) {
    $dll = $path + "chrome.dll"
    if (!(test-path -literal $dll)) {
        return
    }
    "======================="
    "$pathLabel PATH $((gi -literal $dll).DirectoryName)"
    "`tREADING Chrome.dll..."
    $bytes = [IO.File]::ReadAllBytes($dll)

    # process PE headers
    $BC = [BitConverter]
    $coff = $BC::ToUInt32($bytes,0x3C) + 4
    $is64 = $BC::ToUInt16($bytes,$coff) -eq 0x8664
    $opthdr = $coff+20
    $codesize = $BC::ToUInt32($bytes,$opthdr+4)
    if (!$is64) { $imagebase = $BC::ToUInt32($bytes,$opthdr+28) }

    # patch the flag in data section
    $data = $BC::ToString($bytes,$codesize)
    $flag = "ExtensionDeveloperModeWarning"
    $stroffs = $data.IndexOf($BC::ToString($flag[1..99]))/3 - 1
    if ($stroffs -lt 0) {
        write-host -f red "`t$flag not found"
        return
    }
    $stroffs += $codesize
    if ($bytes[$stroffs] -eq 0) {
        write-host -f green "`tALREADY PATCHED"
        return
    }
    $bytes[$stroffs] = 0
    "`tPATCHED $flag flag"

    # patch the channel restriction code for stable/beta
    $code = $BC::ToString($bytes,0,$codesize)
    $codepattern = "83-F8-03-7D-.{1,100}"
    $chanpos = 0
    try {
        if ($is64) {
            $pos = 0
            $rx = [regex] "$codepattern-48-8D"
            do {
                $m = $rx.match($code,$pos)
                if (!$m.success) { break }
                $chanpos = $m.index/3 + 2
                $pos = $m.index + $m.length + 1
                $offs = $BC::ToUInt32($bytes,$pos/3+1)
                $diff = $pos/3+5+$offs - $stroffs
            } until ($diff -ge 0 -and $diff -le 4096 -and $diff % 256 -eq 0)
            if (!$m.success) {
                $rx = [regex]'84-C0.{18,48}83-F8-03-7D-.{30,60}84-C0'
                $m = $rx.matches($code)
                if ($m.count -ne 1) { throw }
                $chanpos = ([regex]'83-F8-03-7D').match($code, $m.index).index/3 + 2
            }
        } else {
            $flagOffsStr = $BC::ToString($BC::GetBytes([uint32]$stroffs+[uint32]$imagebase))
            $variants = "($codepattern)-68-`$1",
                        '68-$1.{300,500}E8.{12,32}(83-F8-03-7D)',
                        'E8.{12,32}(83-F8-03-7D).{300,500}68-$1'
            forEach ($variant in $variants) {
                $pattern = $flagOffsStr -replace '^(..-)..(.+)', $variant
                "`tLooking for $pattern..."
                $m = [regex]::matches($code, $pattern)
                if ($m.count -eq 1) {
                    $chanpos = $m.groups[1].index/3 + 2
                    break
                }
            }
            if (!$chanpos) { throw }
        }
    } catch {
        write-host -f red "`tUnable to find the channel code, try updating me"
        return
    }
    $bytes[$chanpos] = 9
    "`tPATCHED Chrome release channel restriction"

    "`tWriting to a temporary dll..."
    [IO.File]::WriteAllBytes("$dll.new",$bytes)

    "`tBacking up the original dll..."
    move -literal $dll "$dll.bak" -force

    "`tRenaming the temporary dll as the original dll..."
    move -literal "$dll.new" $dll -force

    "DONE.`n"
}

main