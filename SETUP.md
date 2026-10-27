# AEGIS // C-UAS - Local Setup Guide

## Run locally

1. Open the repository folder in VS Code (**File → Open Folder**).
2. Open the terminal (**Terminal → New Terminal**).
3. Run these commands from the folder containing `package.json`:

   ```powershell
   npm install
   npm run dev
   ```

4. Open the local URL printed in the terminal.

If the app does not start, copy the full terminal error and check that Node.js and npm are installed with `node -v` and `npm -v`.

## Demo sign-in

This is a **demo-only sign-in screen**, not real account authentication.

- **Operator ID:** any text with at least 3 characters (example: `OP-77`)
- **Password:** any text with at least 6 characters (example: `sentinel2026`)
- **Role:** select a demonstration role
- Click **AUTHENTICATE**

Do not use a real or reused password.

## Simulation features

- Global alert: green **NORMAL** when there are no CRITICAL simulated targets; red **CRITICAL** when at least one CRITICAL target is active.
- Different simulated targets appear at example locations around the world.
- Select a target to view its model, location, altitude, speed, current threat, and prior alert count.
- **JAM RF**, **NEUTRALIZE**, and **FRIENDLY** are demonstration actions that update simulated display state only.
- JAM RF and NEUTRALIZE acknowledgements temporarily change the selected target's simulated threat status before it returns to MEDIUM.
- FRIENDLY marks the selected target as friendly.

## Important academic prototype disclaimer

All locations, target records, and threat states are simulated display data. They are **not live sensor readings and do not track real drones**. Action buttons only record simulated acknowledgements in the page; they do not transmit RF signals, jam, intercept, or control any physical equipment. The demo sign-in does not provide security or access control for a deployed system.
