<#
.SYNOPSIS
    Automatically exports HP Tuners VCM Scanner .hpl logs to .csv via UI Automation.
.DESCRIPTION
    Reuses the non-destructive Win32 / UIAutomation workflow from scg-logger:
    attaches to a running VCM Scanner instance (or launches one if closed),
    verifies no live recording or unsaved log would be disturbed, opens the
    target .hpl log, runs Log File -> Export Log File (Comma Separated Text,
    Entire Log, Interpolate Data Gaps unchecked by default), saves the .csv,
    and closes the temporary view if opened by this script.
.EXAMPLE
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\export-hpl-to-csv.ps1 -HplPath logs\Datalog-v003.hpl
.EXAMPLE
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\export-hpl-to-csv.ps1 -AllMissing
#>
[CmdletBinding()]
param(
    [string]$HplPath = '',
    [string]$CsvPath = '',
    [switch]$AllMissing,
    [switch]$Force,
    [switch]$KeepOpen,
    [switch]$Interpolate,
    [string]$ScannerExe = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
Add-Type -ReferencedAssemblies UIAutomationClient, UIAutomationTypes -TypeDefinition @'
using System;
using System.Text;
using System.Threading;
using System.Runtime.InteropServices;
using System.Windows.Automation;

public static class HplExporterNative {
    public delegate bool Callback(IntPtr h, IntPtr l);

    [DllImport("user32.dll")] public static extern IntPtr OpenWindowStation(string s, bool inherit, uint access);
    [DllImport("user32.dll")] public static extern bool SetProcessWindowStation(IntPtr h);
    [DllImport("user32.dll")] public static extern IntPtr OpenDesktop(string s, int flags, bool inherit, uint access);
    [DllImport("user32.dll")] public static extern bool SetThreadDesktop(IntPtr h);
    [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
    [DllImport("user32.dll")] public static extern bool IsWindowEnabled(IntPtr h);
    [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr h, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] static extern bool EnumWindows(Callback cb, IntPtr l);
    [DllImport("user32.dll")] static extern bool EnumDesktopWindows(IntPtr hDesk, Callback cb, IntPtr l);
    [DllImport("user32.dll")] static extern bool EnumChildWindows(IntPtr h, Callback cb, IntPtr l);
    [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, out int pid);
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll")] static extern int GetDlgCtrlID(IntPtr h);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetClassName(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] static extern bool PostMessage(IntPtr h, uint m, IntPtr w, IntPtr l);
    [DllImport("user32.dll", EntryPoint = "SendMessageTimeoutW")] static extern IntPtr SendTimeout(IntPtr h, uint m, IntPtr w, IntPtr l, uint flags, uint timeout, out IntPtr result);

    private static IntPtr _hDesk = IntPtr.Zero;

    public static void BindInteractiveDesktop() {
        IntPtr hw = OpenWindowStation("WinSta0", false, 0x037F);
        if (hw != IntPtr.Zero) SetProcessWindowStation(hw);
        IntPtr hd = OpenDesktop("default", 0, false, 0x01FF);
        if (hd != IntPtr.Zero) {
            _hDesk = hd;
            SetThreadDesktop(hd);
        }
    }

    private static void EnumTopLevel(Callback cb) {
        if (_hDesk != IntPtr.Zero) EnumDesktopWindows(_hDesk, cb, IntPtr.Zero);
        else EnumWindows(cb, IntPtr.Zero);
    }

    public static void InvokeAsync(AutomationElement element) {
        var thread = new Thread(() => {
            try { ((InvokePattern)element.GetCurrentPattern(InvokePattern.Pattern)).Invoke(); } catch {}
        });
        thread.IsBackground = true;
        thread.Start();
    }

    public static string Title(IntPtr h) {
        var sb = new StringBuilder(512);
        GetWindowText(h, sb, sb.Capacity);
        return sb.ToString();
    }

    public static IntPtr FindDialog(int pid, string titleContains, string cls) {
        IntPtr found = IntPtr.Zero;
        int count = 0;
        EnumTopLevel((h, l) => {
            int p; GetWindowThreadProcessId(h, out p);
            if (p != pid || !IsWindowVisible(h)) return true;
            var t = new StringBuilder(512); var c = new StringBuilder(128);
            GetWindowText(h, t, t.Capacity); GetClassName(h, c, c.Capacity);
            bool titleOk = String.IsNullOrEmpty(titleContains) || t.ToString().IndexOf(titleContains, StringComparison.OrdinalIgnoreCase) >= 0;
            bool clsOk = String.IsNullOrEmpty(cls) || c.ToString() == cls;
            if (titleOk && clsOk) { found = h; count++; }
            return true;
        });
        return count == 1 ? found : IntPtr.Zero;
    }

    public static IntPtr MainWindow(int pid) {
        IntPtr found = IntPtr.Zero;
        int count = 0;
        EnumTopLevel((h, l) => {
            int p; GetWindowThreadProcessId(h, out p);
            if (p != pid || !IsWindowVisible(h)) return true;
            var t = new StringBuilder(512); var c = new StringBuilder(128);
            GetWindowText(h, t, t.Capacity); GetClassName(h, c, c.Capacity);
            if (t.ToString().StartsWith("VCM Scanner") && c.ToString().StartsWith("WindowsForms10.Window")) {
                found = h; count++;
            }
            return true;
        });
        return count == 1 ? found : IntPtr.Zero;
    }

    public static bool FillFileDialog(IntPtr dialog, string path) {
        IntPtr edit = IntPtr.Zero, button = IntPtr.Zero;
        EnumChildWindows(dialog, (h, l) => {
            if (!IsWindowVisible(h)) return true;
            var c = new StringBuilder(128);
            GetClassName(h, c, c.Capacity);
            int id = GetDlgCtrlID(h);
            if (c.ToString() == "Edit" && (id == 1001 || id == 1148)) edit = h;
            if (c.ToString() == "Button" && id == 1) button = h;
            return true;
        }, IntPtr.Zero);
        if (edit == IntPtr.Zero || button == IntPtr.Zero) return false;
        SetForegroundWindow(dialog);
        Thread.Sleep(80);
        // WM_CHAR triggers modern common-dialog edit state changes reliably.
        PostMessage(edit, 0x00B1, IntPtr.Zero, (IntPtr)(-1)); // EM_SETSEL
        Thread.Sleep(40);
        foreach (char ch in path) {
            PostMessage(edit, 0x0102, (IntPtr)(int)ch, (IntPtr)1); // WM_CHAR
            Thread.Sleep(4);
        }
        Thread.Sleep(150);
        PostMessage(button, 0x00F5, IntPtr.Zero, IntPtr.Zero); // BM_CLICK
        return true;
    }

    public static bool SetExportOptions(IntPtr exporter, bool wantInterpolate) {
        IntPtr csv = IntPtr.Zero, entire = IntPtr.Zero, export = IntPtr.Zero, interpolate = IntPtr.Zero;
        EnumChildWindows(exporter, (h, l) => {
            var s = new StringBuilder(256);
            GetWindowText(h, s, s.Capacity);
            string txt = s.ToString();
            if (txt == "Comma Separated Text (.csv)") csv = h;
            if (txt == "Entire Log") entire = h;
            if (txt == "Export") export = h;
            if (txt == "Interpolate Data Gaps") interpolate = h;
            return true;
        }, IntPtr.Zero);
        if (csv == IntPtr.Zero || entire == IntPtr.Zero || export == IntPtr.Zero || interpolate == IntPtr.Zero) {
            return false;
        }
        PostMessage(csv, 0x00F5, IntPtr.Zero, IntPtr.Zero);
        PostMessage(entire, 0x00F5, IntPtr.Zero, IntPtr.Zero);
        IntPtr check;
        if (SendTimeout(interpolate, 0x00F0, IntPtr.Zero, IntPtr.Zero, 2, 2000, out check) == IntPtr.Zero) {
            throw new Exception("VCM Scanner interpolation checkbox timed out.");
        }
        bool isChecked = (check != IntPtr.Zero);
        if (isChecked != wantInterpolate) {
            PostMessage(interpolate, 0x00F5, IntPtr.Zero, IntPtr.Zero);
            Thread.Sleep(60);
        }
        PostMessage(export, 0x00F5, IntPtr.Zero, IntPtr.Zero);
        return true;
    }
}
'@

# Bind WinSta0\default before initializing any UIAutomation elements.
[HplExporterNative]::BindInteractiveDesktop()

$repoRoot = Split-Path -Parent $PSScriptRoot
$logsDir = Join-Path $repoRoot 'logs'

function Resolve-DefaultCsvPath([string]$FullHplPath) {
    $dir = Split-Path -Parent $FullHplPath
    $stem = [System.IO.Path]::GetFileNameWithoutExtension($FullHplPath)
    if ($stem -match '^Datalog-(.+)$') {
        $stem = $Matches[1]
    }
    return (Join-Path $dir ($stem + '.csv'))
}

function Find-Control($Root, [string]$Name) {
    $cond = New-Object System.Windows.Automation.PropertyCondition (
        [System.Windows.Automation.AutomationElement]::NameProperty, $Name
    )
    return $Root.FindFirst([System.Windows.Automation.TreeScope]::Descendants, $cond)
}

function Wait-For([scriptblock]$Test, [string]$Description, [int]$TimeoutSeconds = 90) {
    $deadline = [DateTime]::UtcNow.AddSeconds($TimeoutSeconds)
    do {
        $res = & $Test
        if ($res) { return $res }
        Start-Sleep -Milliseconds 100
    } while ([DateTime]::UtcNow -lt $deadline)
    throw "Timed out waiting for $Description."
}

function Expand-ScannerMenu([IntPtr]$Hwnd, [string]$MenuName) {
    return Wait-For {
        try {
            $root = [System.Windows.Automation.AutomationElement]::FromHandle($Hwnd)
            $menu = Find-Control $root $MenuName
            if (!$menu) { return }
            $menu.GetCurrentPattern([System.Windows.Automation.ExpandCollapsePattern]::Pattern).Expand()
            return @{ root = $root; menu = $menu }
        } catch {
            return
        }
    } "Scanner menu '$MenuName'"
}

function Collapse-ScannerMenu($MenuInfo) {
    try {
        $MenuInfo.menu.GetCurrentPattern([System.Windows.Automation.ExpandCollapsePattern]::Pattern).Collapse()
    } catch {}
}

function Get-ScannerInstance {
    $procs = @(Get-Process -Name 'VCM Scanner' -ErrorAction SilentlyContinue)
    $launched = $false
    if ($procs.Count -gt 1) {
        throw 'Multiple VCM Scanner windows are open; close extras so one instance remains.'
    }
    if ($procs.Count -eq 0) {
        $exe = $ScannerExe
        if (!$exe) {
            foreach ($cand in @(
                'C:\Program Files\HP Tuners\VCM Suite (Beta)\VCM Scanner.exe',
                'C:\Program Files\HP Tuners\VCM Suite\VCM Scanner.exe'
            )) {
                if (Test-Path -LiteralPath $cand) { $exe = $cand; break }
            }
        }
        if (!$exe -or !(Test-Path -LiteralPath $exe)) {
            throw 'VCM Scanner.exe not found; open VCM Scanner or pass -ScannerExe.'
        }
        $p = Start-Process -FilePath $exe -PassThru
        $launched = $true
        $procs = @($p)
    }
    $proc = $procs[0]
    $hwnd = Wait-For {
        $h = [HplExporterNative]::MainWindow($proc.Id)
        if ($h -ne [IntPtr]::Zero) { $h }
    } 'VCM Scanner main window'
    if ([HplExporterNative]::IsIconic($hwnd)) {
        [void][HplExporterNative]::ShowWindowAsync($hwnd, 9)
        Start-Sleep -Milliseconds 200
    }
    if (![HplExporterNative]::IsWindowEnabled($hwnd)) {
        throw 'Close the open dialog in VCM Scanner first, then re-run.'
    }
    return @{ process = $proc; hwnd = $hwnd; launched = $launched }
}

function Assert-ScannerIdle($Scanner) {
    $m = Expand-ScannerMenu $Scanner.hwnd 'Vehicle'
    $stop = Find-Control $m.root 'Stop Scanning'
    $isRecording = ($stop -and $stop.Current.IsEnabled)
    Collapse-ScannerMenu $m
    if ($isRecording) {
        throw 'VCM Scanner is currently recording; stop scanning before exporting.'
    }
}

function Export-SingleHpl($Scanner, [string]$InputHpl, [string]$OutputCsv, [bool]$OverwriteCsv, [bool]$LeaveOpen, [bool]$WantInterpolate) {
    $hplFull = (Resolve-Path -LiteralPath $InputHpl).Path
    $csvFull = [System.IO.Path]::GetFullPath($OutputCsv)
    $hplLeaf = Split-Path -Leaf $hplFull

    if ((Test-Path -LiteralPath $csvFull) -and (Get-Item -LiteralPath $csvFull).Length -gt 0) {
        if (!$OverwriteCsv) {
            return [ordered]@{ hpl = $hplFull; csv = $csvFull; status = 'skipped_exists'; bytes = (Get-Item -LiteralPath $csvFull).Length }
        }
        Remove-Item -LiteralPath $csvFull -Force
    }

    Assert-ScannerIdle $Scanner

    $openedHere = $false
    $curTitle = [HplExporterNative]::Title($Scanner.hwnd)
    if ($curTitle.IndexOf($hplLeaf, [System.StringComparison]::OrdinalIgnoreCase) -lt 0) {
        $mLog = Expand-ScannerMenu $Scanner.hwnd 'Log File'
        $closeItem = Find-Control $mLog.root 'Close Log File'
        $saveItem = Find-Control $mLog.root 'Save Log File'
        $hasOpenLog = ($closeItem -and $closeItem.Current.IsEnabled)
        $hasUnsaved = ($saveItem -and $saveItem.Current.IsEnabled)
        if ($hasOpenLog -and $hasUnsaved) {
            Collapse-ScannerMenu $mLog
            throw 'VCM Scanner has an unsaved log open. Save or close it first so nothing is lost.'
        }
        if ($hasOpenLog) {
            [HplExporterNative]::InvokeAsync($closeItem)
            [void](Wait-For {
                $m2 = Expand-ScannerMenu $Scanner.hwnd 'Log File'
                $c2 = Find-Control $m2.root 'Close Log File'
                $closed = !($c2 -and $c2.Current.IsEnabled)
                Collapse-ScannerMenu $m2
                if ($closed) { $true }
            } 'previous log to close')
            $mLog = Expand-ScannerMenu $Scanner.hwnd 'Log File'
        }
        $openItem = Find-Control $mLog.root 'Open Log File'
        if (!$openItem -or !$openItem.Current.IsEnabled) {
            Collapse-ScannerMenu $mLog
            throw 'Log File -> Open Log File is unavailable.'
        }
        [HplExporterNative]::InvokeAsync($openItem)
        $openDlg = Wait-For {
            $h = [HplExporterNative]::FindDialog($Scanner.process.Id, 'Open', '#32770')
            if ($h -ne [IntPtr]::Zero) { $h }
        } 'Open Log File dialog'
        [void](Wait-For { [HplExporterNative]::FillFileDialog($openDlg, $hplFull) } 'Open Log File filename controls')
        [void](Wait-For {
            if ([HplExporterNative]::FindDialog($Scanner.process.Id, $null, '#32770') -eq [IntPtr]::Zero -and
                [HplExporterNative]::IsWindowEnabled($Scanner.hwnd)) {
                $mChk = Expand-ScannerMenu $Scanner.hwnd 'Log File'
                $exp = Find-Control $mChk.root 'Export Log File'
                $ready = ($exp -and $exp.Current.IsEnabled)
                Collapse-ScannerMenu $mChk
                if ($ready) { $true }
            }
        } "VCM Scanner to finish loading $hplLeaf")
        $openedHere = $true
    }

    $mExp = Expand-ScannerMenu $Scanner.hwnd 'Log File'
    $exportItem = Find-Control $mExp.root 'Export Log File'
    if (!$exportItem -or !$exportItem.Current.IsEnabled) {
        Collapse-ScannerMenu $mExp
        throw 'Log File -> Export Log File is unavailable.'
    }
    [HplExporterNative]::InvokeAsync($exportItem)

    $exporter = Wait-For {
        $h = [HplExporterNative]::FindDialog($Scanner.process.Id, 'File Exporter', $null)
        if ($h -ne [IntPtr]::Zero) { $h }
    } 'File Exporter window'
    [void](Wait-For { [HplExporterNative]::SetExportOptions($exporter, $WantInterpolate) } 'File Exporter controls')

    $saveDlg = Wait-For {
        $h = [HplExporterNative]::FindDialog($Scanner.process.Id, 'Save', '#32770')
        if ($h -ne [IntPtr]::Zero) { $h }
    } 'Save As CSV dialog'
    [void](Wait-For { [HplExporterNative]::FillFileDialog($saveDlg, $csvFull) } 'Save As filename controls')

    [void](Wait-For {
        if ((Test-Path -LiteralPath $csvFull) -and
            (Get-Item -LiteralPath $csvFull).Length -gt 0 -and
            [HplExporterNative]::FindDialog($Scanner.process.Id, $null, '#32770') -eq [IntPtr]::Zero -and
            [HplExporterNative]::FindDialog($Scanner.process.Id, 'File Exporter', $null) -eq [IntPtr]::Zero) {
            $true
        }
    } "CSV export completion for $csvFull")

    # Wait briefly until file size finishes flushing.
    $prevLen = -1
    for ($i = 0; $i -lt 20; $i++) {
        $curLen = (Get-Item -LiteralPath $csvFull).Length
        if ($curLen -gt 0 -and $curLen -eq $prevLen) { break }
        $prevLen = $curLen
        Start-Sleep -Milliseconds 150
    }

    if ($openedHere -and !$LeaveOpen) {
        $mClose = Expand-ScannerMenu $Scanner.hwnd 'Log File'
        $closeItem = Find-Control $mClose.root 'Close Log File'
        if ($closeItem -and $closeItem.Current.IsEnabled) {
            [HplExporterNative]::InvokeAsync($closeItem)
            Start-Sleep -Milliseconds 300
        } else {
            Collapse-ScannerMenu $mClose
        }
    }

    return [ordered]@{
        hpl    = $hplFull
        csv    = $csvFull
        status = 'exported'
        bytes  = (Get-Item -LiteralPath $csvFull).Length
    }
}

$targets = @()
if ($AllMissing) {
    foreach ($f in (Get-ChildItem -LiteralPath $logsDir -Filter '*.hpl' | Sort-Object LastWriteTime)) {
        $outCsv = Resolve-DefaultCsvPath $f.FullName
        if ($Force -or !(Test-Path -LiteralPath $outCsv) -or (Get-Item -LiteralPath $outCsv).Length -eq 0) {
            $targets += @{ hpl = $f.FullName; csv = $outCsv }
        }
    }
} elseif ($HplPath) {
    $resolvedHpl = if ([System.IO.Path]::IsPathRooted($HplPath)) {
        $HplPath
    } elseif (Test-Path -LiteralPath (Join-Path (Get-Location).Path $HplPath)) {
        Join-Path (Get-Location).Path $HplPath
    } else {
        Join-Path $repoRoot $HplPath
    }
    if (!(Test-Path -LiteralPath $resolvedHpl)) {
        throw "Input .hpl file not found: $resolvedHpl"
    }
    $resolvedCsv = if ($CsvPath) {
        if ([System.IO.Path]::IsPathRooted($CsvPath)) { $CsvPath } else { Join-Path (Get-Location).Path $CsvPath }
    } else {
        Resolve-DefaultCsvPath $resolvedHpl
    }
    $targets += @{ hpl = $resolvedHpl; csv = $resolvedCsv }
} else {
    $pending = @(Get-ChildItem -LiteralPath $logsDir -Filter '*.hpl' | Sort-Object LastWriteTime -Descending | Where-Object {
        $c = Resolve-DefaultCsvPath $_.FullName
        !(Test-Path -LiteralPath $c) -or (Get-Item -LiteralPath $c).Length -eq 0
    })
    if ($pending.Count -gt 0) {
        $f = $pending[0]
        $targets += @{ hpl = $f.FullName; csv = (Resolve-DefaultCsvPath $f.FullName) }
    }
}

if ($targets.Count -eq 0) {
    @{ ok = $true; exported = @(); message = 'No pending .hpl logs need CSV export.' } | ConvertTo-Json -Depth 4 -Compress
    exit 0
}

$scanner = Get-ScannerInstance
$results = @()
foreach ($t in $targets) {
    $results += Export-SingleHpl -Scanner $scanner -InputHpl $t.hpl -OutputCsv $t.csv -OverwriteCsv:$Force -LeaveOpen:$KeepOpen -WantInterpolate:$Interpolate
}

if ($scanner.launched -and !$KeepOpen) {
    Stop-Process -Id $scanner.process.Id -ErrorAction SilentlyContinue
}

@{ ok = $true; results = $results } | ConvertTo-Json -Depth 4 -Compress
