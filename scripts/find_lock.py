import os
import psutil

target = 'proposal_pengembangan_sistem_dan_rab.pdf'

found = False
for proc in psutil.process_iter(['pid', 'name']):
    try:
        files = proc.open_files()
        for f in files:
            if target in f.path.lower():
                print(f"File locked by PID {proc.pid}: {proc.name()}")
                found = True
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        pass

if not found:
    print("No open handles found via psutil. Might be Explorer preview or browser tab.")
