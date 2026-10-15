# Ghost Runner — Moss guide

## Run it
Beginner: approximately 30 minutes, then 3–5 minutes to export and submit the handoff. Intermediate: about 35–45 minutes. Advanced: about 45–60 minutes. Times are estimates; advanced students may skip directly to a level. A5 reuses A1, A4 and I2; all missions remain accessible for reference.

Use pairs: one investigator, one evidence recorder; swap halfway. Students need a browser. No accounts, installs, API keys, or paid tools. After joining with initials, verified mission progress appears on the shared leaderboard. Evidence notes stay in the browser unless students download and submit their handoff in your LMS. The leaderboard shows solved mission IDs, not written notes.

Require an evidence note for each mission (observation + reasoning). Hints do not subtract points. For a quick formative check: 1 point per recovered flag + 1 per supported explanation, 10 points per level. No live targets are scanned or attacked. Logs are fictional.

Practice progress and notes save locally when browser storage is available. Initials and solved-mission IDs also save online when the leaderboard is connected. Shared devices: export first, copy the private recovery code if needed, then use End shift on this device. Use Reset only in unsigned practice mode. The page warns if saving is unavailable. Do not treat local completion as a secure assessment: a static CTF exposes source and answer logic to inspection. This is a learning activity.

Keep this teacher folder outside the deployed public directory.

## Solutions

### B1 — Your first flag
Answer: `HACK{CLOCK_IN}`

Route: Read the dispatch below. Copy the complete flag, including HACK{ and }, into the answer box. Write a short evidence note after each solve.

Final hint: Enter HACK{CLOCK_IN}.

Learning: A flag proves you found a specific clue. In real help-desk work, your evidence and explanation matter more than a guessed answer.

### B2 — Scrambled transmission
Answer: `HACK{SIGNAL_FOUND}`

Route: Open the Caesar tool in the Field Kit. Paste the entire transmission and choose Decode with shift 3. Submit the recovered flag.

Final hint: KDFN becomes HACK. The answer is HACK{SIGNAL_FOUND}.

Learning: Encryption changes a message using a rule and key. The shift value is the key here. Caesar is easy to break and is not secure modern encryption.

### B3 — Behind the sign
Answer: `HACK{LOOK_BEHIND}`

Route: Open the maintenance sign using the evidence link. Return here and select “View supplied HTML” below to inspect its source. You may also use browser View Page Source. Find the comment containing the flag.

Final hint: The comment says HACK{LOOK_BEHIND}.

Learning: A browser receives HTML even when some parts are not displayed. Anything delivered to the browser can be inspected. HTML comments are not a safe place for passwords.

### B4 — Which door opened?
Answer: `HACK{192.168.1.37}`

Route: Read every column: time, source IP, path, status. Find the row where BOTH path is /gate/open AND status is 200. Wrap that row’s source IP in HACK{...}.

Final hint: The matching source is 192.168.1.37. Enter HACK{192.168.1.37}.

Learning: An IP address helps identify a source in this log. It does not prove who was at the keyboard or that this device was malicious. Investigations need context and corroboration.

### B5 — The poster has a secret
Answer: `HACK{GATE_ONLINE}`

Route: Look at the poster below. Open the Image Reveal tool and increase contrast. Read and submit the hidden flag.

Final hint: The poster reveals HACK{GATE_ONLINE}.

Learning: Steganography hides a message inside something else. This poster uses faint pixels; later missions hide data inside pixel bits. Encryption hides meaning, while steganography hides presence.

### I1 — The mislabeled envelope
Answer: `HACK{ENCODING_IS_NOT_ENCRYPTION}`

Route: Use the Base64 tool. Decode the supplied payload. Submit the result, then explain why Base64 is not encryption.

Final hint: Decoded: HACK{ENCODING_IS_NOT_ENCRYPTION}.

Learning: Base64 needs no secret key. Anyone with the text can reverse it. Encoding is not a way to protect a password.

### I2 — Follow the name
Answer: `HACK{8080}`

Route: Resolve the exact hostname using the DNS table. Match that IP to a destination in the flow table. Use the matching flow’s destination port as HACK{PORT_NUMBER}.

Final hint: The destination port is 8080. Enter HACK{8080}.

Learning: DNS answers a name-to-record question. An IP selects an address; a transport port identifies an endpoint for a service. A port alone does not prove the actual application.

### I3 — Bytes from the console
Answer: `HACK{BYTES_TELL_STORIES}`

Route: Read the command guide below. No real terminal is needed. Copy only the hex bytes into the Hex tool. Decode and submit the recovered flag.

Final hint: Decoded: HACK{BYTES_TELL_STORIES}.

Learning: Hex is a readable representation of bytes, not encryption. cat and Get-Content display a file; they do not automatically decode its hexadecimal contents.

### I4 — A bit beneath the surface
Answer: `HACK{PIXELS_HAVE_LAYERS}`

Route: Open the Pixel Reader tool. Choose “Read signal badge”. It reads the red LSBs in groups of eight bits until a zero byte. Record what changed compared with the faint-text poster; submit the flag.

Final hint: The extracted message is HACK{PIXELS_HAVE_LAYERS}.

Learning: A one-step change in a red value is difficult to see. Eight hidden bits form one byte. Our reader is designed for this exact format; it is not a universal steganography detector.

### I5 — Evidence before accusation
Answer: `HACK{192.168.2.44}`

Route: Match request ID G7 across both tables. Check source IP and status. Submit the correlated source address.

Final hint: Both G7 records use 192.168.2.44. Enter HACK{192.168.2.44}.

Learning: Correlating identifiers and timestamps creates a stronger explanation than selecting an unusual IP. This is the observed source in the supplied evidence, not proof of a person’s identity.

### A1 — Two wrappers
Answer: `HACK{NIGHTSHIFT}`

Route: Determine the key from the byte clue. Decode Base64, then Caesar-decode the result with that key. Save the exact recovered flag; you will reuse its inner word in the final mission.

Final hint: The recovered flag is HACK{NIGHTSHIFT}.

Learning: Order matters when transformations are layered. These reversible toy transformations teach process; layering weak methods does not make them secure.

### A2 — Find the crossed wire
Answer: `HACK{RELAY_B}`

Route: Apply the /24 rule to each device and gateway. Select the one misconfigured endpoint. Submit its device name inside HACK{...}.

Final hint: Enter HACK{RELAY_B}.

Learning: With these ordinary /24 endpoint settings, the gateway must be reachable on the local subnet. This conclusion applies to the supplied configuration, not to every possible routing design.

### A3 — Trust the fingerprint
Answer: `HACK{B}`

Route: Copy one candidate at a time into the SHA-256 tool, without its label. Match the output to the trusted digest. Do not add a newline. Submit HACK{A}, HACK{B}, or HACK{C}.

Final hint: The trusted digest matches candidate B. Enter HACK{B}.

Learning: A matching trusted hash supports integrity: these bytes match the reference. A hash alone does not identify an author or guarantee safety. The reference itself must come from a trusted source.

### A4 — Rebuild the timeline
Answer: `HACK{192.168.2.44}`

Route: Match the alert’s public source port and timestamp to the NAT table. Check the corresponding internal device in the request table. Submit the internal IP supported by both records.

Final hint: R42 confirms 192.168.2.44. Enter HACK{192.168.2.44}.

Learning: A shared public IP is not enough to attribute traffic to a device. Timestamped NAT mappings plus request evidence support a more precise conclusion. Attribution to a human still needs more evidence.

### A5 — The final handoff
Answer: `HACK{NIGHTSHIFT_192.168.2.44_8080}`

Route: Use Pixel Reader → Read final badge. Base64-decode the extracted text to reveal the assembly rule. Use your earlier case records. Submit the complete assembled flag and export your handoff.

Final hint: Enter HACK{NIGHTSHIFT_192.168.2.44_8080}.

Learning: You combined hidden bytes, encoding, cryptography, and network evidence. The final product is a defensible handoff: what you observed, how you interpreted it, and which evidence supports your conclusion.
