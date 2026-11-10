#!/usr/bin/env python3
"""
verify-privacy.py — Strict Privacy Scanner for SVT Focus Tuning Repository.
Checks git-modified, staged, and untracked files (or entire repo with --all) for:
  - 17-character Ford VIN (1FAFP3...)
  - 10-digit MPVI serial numbers (excluding unix timestamps / timestamps starting with 17x)
"""

import os
import re
import sys
import subprocess

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

VIN_PATTERN = re.compile(r'\b1FAFP3[0-9A-Za-z]{11}\b', re.IGNORECASE)
SERIAL_PATTERN = re.compile(r'\b\d{10}\b')

SKIP_EXTS = {'.hpt', '.hpl', '.sqlite', '.sqlite-shm', '.sqlite-wal', '.png', '.jpg', '.ico', '.pdf', '.exe', '.dll', '.msi'}

def get_target_files(scan_all=False):
    files_to_scan = []
    if scan_all:
        for root, dirs, files in os.walk(REPO_ROOT):
            dirs[:] = [d for d in dirs if d not in {'.git', '.venv', 'node_modules', '__pycache__'}]
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext not in SKIP_EXTS:
                    files_to_scan.append(os.path.join(root, f))
    else:
        out = subprocess.run(["git", "-C", REPO_ROOT, "status", "--porcelain"], capture_output=True, text=True)
        for line in out.stdout.splitlines():
            if len(line) > 3:
                p = line[3:].strip()
                # Handle rename syntax 'from -> to'
                if " -> " in p:
                    p = p.split(" -> ")[1].strip()
                ext = os.path.splitext(p)[1].lower()
                if ext not in SKIP_EXTS:
                    full_p = os.path.join(REPO_ROOT, p)
                    if os.path.isdir(full_p):
                        for root, _, fns in os.walk(full_p):
                            for fn in fns:
                                if os.path.splitext(fn)[1].lower() not in SKIP_EXTS:
                                    files_to_scan.append(os.path.join(root, fn))
                    elif os.path.exists(full_p):
                        files_to_scan.append(full_p)
    return files_to_scan

def scan():
    scan_all = "--all" in sys.argv
    files = get_target_files(scan_all)
    violations = []
    
    for fp in files:
        if not os.path.exists(fp):
            continue
        rel = os.path.relpath(fp, REPO_ROOT)
        try:
            with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Check VIN
            for m in VIN_PATTERN.finditer(content):
                violations.append((rel, "VIN", m.group(0)))
            
            # Check Serial
            for m in SERIAL_PATTERN.finditer(content):
                val = m.group(0)
                # Ignore common 10-digit unix epoch timestamps (17x...)
                if not (val.startswith("17") or val.startswith("16") or val.startswith("18")):
                    violations.append((rel, "MPVI Serial", val))
        except Exception:
            pass

    mode_str = "entire repository" if scan_all else "git modified/staged/untracked files"
    print(f"Scanned {len(files)} files ({mode_str}).")
    if violations:
        print(f"\n[CRITICAL FAILURE] Found {len(violations)} privacy violation(s):")
        for rel, kind, val in violations:
            print(f"  {rel} -> {kind}: {val}")
        sys.exit(1)
    else:
        print("PASS: Zero privacy violations detected. 100% clean.")
        sys.exit(0)

if __name__ == "__main__":
    scan()
