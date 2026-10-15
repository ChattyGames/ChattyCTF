# Ghost Runner — Crack the Canal Gate

A no-login, browser-only cybersecurity CTF for Moss’s Chatty Hackville. Fifteen missions across Beginner, Intermediate and Advanced. No package install, AI service or school account. The shared leaderboard uses a Vercel function and Upstash Redis; students join with initials. No external fonts, CDNs or analytics. Built-in tools, real PNG steganography, evidence notes, progressive hints and downloadable text handoff.

## Add to GitHub, then Vercel

1. Unzip this package. Put the contents of `ghost-runner/` into a new GitHub repository (or a dedicated project folder). Keep the `public` folder structure intact.
2. In Vercel, import that repository as a **separate project** so it doesn’t replace the existing Escape Hackville map.
3. Set the Vercel Root Directory to the folder containing `vercel.json`. Framework: **Other**. No install or build command is required. Output Directory: **public**. The included configuration declares that output directory.
4. Deploy. Test Beginner B1–B5 and download a handoff on the student device/network.
5. Add the deployed URL as the Ghost Runner CTF link on the Escape Hackville map.

Vercel account setup and repository connection are teacher tasks; students use the deployed site without an app login. If deployment protection is enabled for the URL you share, adjust it so students can reach that URL. No deployment was performed as part of this package.

## Preview locally

Run `python3 -m http.server 8000 --directory public` from this folder. Open http://localhost:8000 in a browser. Use a local HTTP server, rather than double-clicking index.html: source inspection uses fetch and the pixel reader loads PNG assets.

## Connect the shared leaderboard

Read `teacher/LEADERBOARD_SETUP.md` before deploying this version. Keep `api/` and `server/` alongside `public/` in the repository; Vercel deploys the API separately from static assets. The CTF works in local practice mode without the database.

## Class use

Start with Beginner, approximately 30 minutes plus a short handoff. Intermediate and Advanced are extensions/repeat visits, not three levels students must finish in 30 minutes. Advanced A5 reuses I2, A1 and A4; all are accessible for reference. Every level remains selectable. No hints subtract points.

Students read a brief, use the numbered directions and Field Kit, recover a flag, then document evidence. All cases are fictional, and no live target is scanned. The opening explains how ethical hacking supports safer systems and useful troubleshooting skills.

Practice progress and evidence notes are saved in this browser’s localStorage. Joining the shared leaderboard also stores initials, a random runner ID, and verified solved-mission IDs online. Written evidence notes are not uploaded. Students download a .txt handoff and submit through the LMS or as directed. Shared device: export, copy the private recovery code if needed, then choose End shift on this device. A warning appears if localStorage is blocked.

## Teacher material

`teacher/MOSS_ANSWER_GUIDE.md` contains all solutions. Keep teacher files outside `public/`. `teacher/REVIEW_LOG.md` documents three review passes and verification limits.

The app is for guided learning, not a secure assessment: client-side challenge data includes answer checks and can be inspected. Browser source inspection is itself a learning goal.

## Files

- `public/index.html` — app and original SVG city illustration
- `public/styles.css` — responsive visual system
- `public/app.js` — interaction, tools, storage, export
- `public/board.js` — initials, shared leaderboard, recovery, sync
- `api/board.js` — server-side session and unique-flag verification
- `server/answers.json` — server validation data, outside public output
- `public/missions.js` — 15 missions and explanations
- `public/evidence/` — supplied webpage, faint-text poster, two real red-LSB PNGs
- `build_content.py` — optional evidence/content regeneration; requires Pillow only if regenerating
- `vercel.json` — static deployment configuration

To edit missions, update build_content.py and run it, or edit missions.js directly. The checked-in evidence assets are ready to use; Vercel does not run the Python generator.

Configuration reference: https://vercel.com/docs/project-configuration/vercel-json
