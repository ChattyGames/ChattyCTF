# Three review passes — Ghost Runner

## Pass 1 — Beginner clarity and learning value
Reviewed every briefing, term, numbered step, hint and debrief. Beginner introduces flags before cryptography, provides supplied webpage source, explains the log columns and HTTP statuses, then introduces image steganography. Ethical hacking is framed as authorized problem-solving that helps protect people and repair weaknesses. No terminal is required; the only illustrated commands are explained individually with Windows equivalents.

Changes: corrected the faint-image reveal algorithm so the background remains dark while the message becomes readable; validated saved state fields; corrected the entry button wording for returning students.

## Pass 2 — Challenge accuracy and interaction logic
Verified all 15 mission render paths, wrong-answer feedback, normalized correct-answer checks, evidence-note saving, hints and handoff readiness in a simulated DOM (60 mission-flow assertions). Independently exercised Caesar, Base64, hexadecimal, SHA-256, both real PNG red-channel LSB extractions, final layered clue, image-reveal data, source retrieval and download creation. Reconciled DNS/flow, subnet, HTTP and NAT answers against the supplied tables. Checked JavaScript syntax.

Changes: confirmed exact UTF-8/no-newline instructions for the hash comparison and clear distinction between encoding, encryption, hiding data and integrity. Teacher instructions identify A5’s earlier-mission dependencies and realistic level durations. No challenge relies on an external student tool.

## Pass 3 — Visual hierarchy, accessibility and handoff
Reviewed layout rules for desktop/tablet/mobile, focus outlines, labels, readable colors, touch controls, reduced motion and horizontal evidence scrolling. Rasterized and visually inspected the original SVG city illustration. The illustration is original geometric line art, not a generated stock image. Checked all referenced local assets and the static deployment configuration against Vercel documentation.

Changes: reduced headings to fit narrow screens and fallback fonts, enlarged touch targets, clarified the last-hint label, strengthened the city illustration’s overlay contrast, and added optional in-app real-life reflections that save and export with the handoff. Reran logic checks after these edits.

## Verification limits
No full browser-rendering environment was available for this run. The three passes include source/content review, DOM simulation, image inspection and actual data decoding; they are not three browser playthroughs. Before class, test the deployed page on a student device/network, especially image tools, narrow-screen layout, local saving, clipboard permissions and handoff download. Vercel deployment and GitHub upload are pending the next session.

Vercel configuration reference: https://vercel.com/docs/project-configuration/vercel-json

## Leaderboard addition
Shared initials-based progress, per-mission status squares, tied ranks, unique-flag server checks, recovery and shared-device sign-out added. See LEADERBOARD_SETUP.md for additional test results and remaining live integration checks.
