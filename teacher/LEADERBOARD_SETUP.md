# Moss — Turn on the shared leaderboard

The app is prepared for Vercel + Upstash Redis. No database has been created or connected yet. Students need only initials; Moss does the one-time hosting/database setup.

## Connect it

1. Upload the complete project to GitHub, including the root `api/`, `server/`, `public/`, and `vercel.json`. Do not upload only public: that would omit the leaderboard server.
2. Import the repository into Vercel as its own project. Root Directory is the folder containing vercel.json. Framework: Other; Output Directory: public; no build command or package installation is needed.
3. Create/connect an Upstash Redis database through Vercel Marketplace, or create it in the Upstash console and add its HTTPS REST URL and regular read/write REST token to this Vercel project’s Environment Variables. Do not use the readonly token or a Redis TCP connection string.
4. The server accepts either `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, or the Marketplace pair `KV_REST_API_URL` + `KV_REST_API_TOKEN`. Keep these only in server environment variables; never put them in public files or GitHub.
5. Set `CTF_BOARD_ID` to a short board name, for example `moss-fall-2026`. Use 1–40 letters, digits, underscores or hyphens. This separates boards within the database. Everyone visiting one deployment shares its configured board.
6. Redeploy after setting the environment variables. Open the deployed app and join using test initials. Solve B1; open a second browser or device, use different initials, and verify both rows are visible. Repeat a correct submission and confirm the score stays at one flag. Test recovery and End shift.

For separate classes, use separate Vercel projects with different CTF_BOARD_ID values, or use one combined class board. Changing CTF_BOARD_ID and redeploying starts a fresh board namespace; it does not delete the previous board.

## Student flow

- Enter 1–4 letters and select Join board. Correct practice flags already recovered on that device are verified and added.
- Their own row is highlighted, with solved B1–B5, I1–I5 and A1–A5 squares and total flags (out of 15).
- One unique correct flag = one point. Repeated submissions do not add points. Hints do not subtract points. Equal totals share a rank; there is no speed tiebreaker.
- Matching initials create separate random runner IDs (shown beside initials). Initials are a display name, not identity verification.
- The board refreshes every 45 seconds or with Refresh. Connection failures leave practice available; unsent recovered flags retry while the same shift is open.
- Copy private recovery code to restore that runner’s online flags on another device. Keep it private: anyone with it can access that runner’s flag progress. Written notes do not move between devices.
- On a shared computer, download the handoff, copy the recovery code if needed, and End shift. This removes that device’s sign-in and local notes; shared flag progress remains.

## Data and limits

Only initials, random runner IDs, and solved-mission IDs appear on the board. Written evidence notes/reflections are local and included in the student’s downloaded handoff. No school account or email is requested. No database secrets or recovery tokens are returned in the public board response. A one-way hash of the request IP is temporarily used for rate limiting.

This version supports up to 200 runners per board. Stored sessions last 90 days; the board expires after 90 days without a join/new solve. Flags are checked server-side, with atomic unique insertion to avoid duplicate points. The CTF remains a guided learning activity: its student clues and hints can reveal answers, and initials do not establish real-world identity.

## Verification status

API contract tests passed with an in-memory REST adapter: separate sessions, duplicate initials, wrong/correct flags, repeat submission, ranking, unavailable storage, origin checks and public response privacy. Simulated UI tests passed for join, practice sync, own-row highlighting, sign-out, local-note clearing, recovery and restored flags. Original 15-mission logic checks still pass.

Actual Upstash connection, Vercel function deployment, browser rendering and a two-device smoke test remain pending. No paid resource was provisioned.

References:
- https://upstash.com/docs/redis/features/restapi
- https://upstash.com/docs/redis/quickstarts/vercel-functions-app-router
- https://vercel.com/docs/redis
- https://vercel.com/docs/project-configuration/vercel-json
