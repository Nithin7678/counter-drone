# AEGIS // C-UAS - Local Setup Guide

## Quick Start (3 Steps)

1. Open this folder directly in VS Code (**File -> Open Folder...**).
2. Open a terminal in VS Code (**Ctrl + `** or **Terminal -> New Terminal**).
3. Run:
   ```bash
   npm install
   npm run dev
   ```

Open the URL shown in the terminal (usually `http://localhost:8080` or `http://localhost:5173`).

---

## Sign-In Credentials
- **Operator ID:** Any text of 3+ characters (e.g. `OP-77`)
- **Password:** Any text of 6+ characters (e.g. `sentinel2026`)
- **Role:** Select any role (e.g. `SENTINEL OPERATOR`)
- Click **AUTHENTICATE**

---

## Features
- **Range Display:** Selected range (e.g. `3.0 KM`) displayed at the top right of the radar.
- **Threat Levels:** Guaranteed at least 1 drone each in LOW, MEDIUM, and HIGH threat bands at all times.
- **Auto Response:** Jams drones in CRITICAL threat level and neutralizes them after RF jamming.
