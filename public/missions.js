const MISSIONS = [
  {
    "id": "b1",
    "level": "beginner",
    "title": "Your first flag",
    "kind": "Orientation",
    "minutes": 3,
    "brief": "Rogue 9 has sealed the canal gate. Moss needs a technician who can follow evidence. A flag is the answer token you recover in a CTF (Capture the Flag).",
    "steps": [
      "Read the dispatch below.",
      "Copy the complete flag, including HACK{ and }, into the answer box.",
      "Write a short evidence note after each solve."
    ],
    "evidence": "DISPATCH / MOSS\nTraining token: HACK{CLOCK_IN}\nFlags use braces { } and underscores _ instead of spaces.",
    "answer": "HACK{CLOCK_IN}",
    "hints": [
      "Look for HACK followed by braces.",
      "The training token is printed in the dispatch.",
      "Enter HACK{CLOCK_IN}."
    ],
    "explain": "A flag proves you found a specific clue. In real help-desk work, your evidence and explanation matter more than a guessed answer.",
    "tool": null,
    "asset": null
  },
  {
    "id": "b2",
    "level": "beginner",
    "title": "Scrambled transmission",
    "kind": "Cryptography",
    "minutes": 6,
    "brief": "A message was shifted three letters forward: A became D. Reverse that shift to recover it. This is a Caesar cipher, a simple form of encryption.",
    "steps": [
      "Open the Caesar tool in the Field Kit.",
      "Paste the entire transmission and choose Decode with shift 3.",
      "Submit the recovered flag."
    ],
    "evidence": "KDFN{VLJQDO_IRXQG}",
    "answer": "HACK{SIGNAL_FOUND}",
    "hints": [
      "Decode moves letters backward. Braces and underscores do not move.",
      "Set shift to 3 and select Decode.",
      "KDFN becomes HACK. The answer is HACK{SIGNAL_FOUND}."
    ],
    "explain": "Encryption changes a message using a rule and key. The shift value is the key here. Caesar is easy to break and is not secure modern encryption.",
    "tool": "caesar",
    "asset": null
  },
  {
    "id": "b3",
    "level": "beginner",
    "title": "Behind the sign",
    "kind": "Web investigation",
    "minutes": 6,
    "brief": "A maintenance sign looks ordinary. Its HTML source contains a comment left by a technician. HTML describes a webpage; comments are notes that are not displayed.",
    "steps": [
      "Open the maintenance sign using the evidence link.",
      "Return here and select \u201cView supplied HTML\u201d below to inspect its source. You may also use browser View Page Source.",
      "Find the comment containing the flag."
    ],
    "evidence": null,
    "answer": "HACK{LOOK_BEHIND}",
    "hints": [
      "HTML comments begin with <!-- and end with -->.",
      "Search the supplied HTML for \u201ctechnician\u201d.",
      "The comment says HACK{LOOK_BEHIND}."
    ],
    "explain": "A browser receives HTML even when some parts are not displayed. Anything delivered to the browser can be inspected. HTML comments are not a safe place for passwords.",
    "tool": null,
    "asset": "maintenance.html"
  },
  {
    "id": "b4",
    "level": "beginner",
    "title": "Which door opened?",
    "kind": "Network evidence",
    "minutes": 7,
    "brief": "A fictional gate log records device addresses and requests. HTTP status 403 means refused; 200 means the request succeeded. Find the source IP of the successful /gate/open request.",
    "steps": [
      "Read every column: time, source IP, path, status.",
      "Find the row where BOTH path is /gate/open AND status is 200.",
      "Wrap that row\u2019s source IP in HACK{...}."
    ],
    "evidence": "TIME      SOURCE IP       PATH           STATUS\n09:10:01  192.168.1.21    /status        200\n09:10:05  192.168.2.44    /gate/open     403\n09:10:09  192.168.1.37    /gate/open     200\n09:10:12  192.168.1.21    /help          200",
    "answer": "HACK{192.168.1.37}",
    "hints": [
      "A successful /status request is not a successful gate opening.",
      "Match the /gate/open path and 200 status on the same row.",
      "The matching source is 192.168.1.37. Enter HACK{192.168.1.37}."
    ],
    "explain": "An IP address helps identify a source in this log. It does not prove who was at the keyboard or that this device was malicious. Investigations need context and corroboration.",
    "tool": null,
    "asset": null
  },
  {
    "id": "b5",
    "level": "beginner",
    "title": "The poster has a secret",
    "kind": "Steganography",
    "minutes": 8,
    "brief": "The gate poster contains text with almost the same color as its background. Steganography hides the existence of a message. Reveal the faint text.",
    "steps": [
      "Look at the poster below.",
      "Open the Image Reveal tool and increase contrast.",
      "Read and submit the hidden flag."
    ],
    "evidence": null,
    "answer": "HACK{GATE_ONLINE}",
    "hints": [
      "The message is near the bottom of the poster.",
      "Increase contrast to its highest setting.",
      "The poster reveals HACK{GATE_ONLINE}."
    ],
    "explain": "Steganography hides a message inside something else. This poster uses faint pixels; later missions hide data inside pixel bits. Encryption hides meaning, while steganography hides presence.",
    "tool": "reveal",
    "asset": "poster.png"
  },
  {
    "id": "i1",
    "level": "intermediate",
    "title": "The mislabeled envelope",
    "kind": "Encoding",
    "minutes": 6,
    "brief": "An intercepted envelope says \u201cencrypted.\u201d The payload is actually Base64, an encoding used to represent bytes as printable text. Decode it.",
    "steps": [
      "Use the Base64 tool.",
      "Decode the supplied payload.",
      "Submit the result, then explain why Base64 is not encryption."
    ],
    "evidence": "SEFDS3tFTkNPRElOR19JU19OT1RfRU5DUllQVElPTn0=",
    "answer": "HACK{ENCODING_IS_NOT_ENCRYPTION}",
    "hints": [
      "Base64 often contains uppercase/lowercase letters, digits, +, /, and = padding.",
      "Choose Base64 \u2192 Decode.",
      "Decoded: HACK{ENCODING_IS_NOT_ENCRYPTION}."
    ],
    "explain": "Base64 needs no secret key. Anyone with the text can reverse it. Encoding is not a way to protect a password.",
    "tool": "base64",
    "asset": null
  },
  {
    "id": "i2",
    "level": "intermediate",
    "title": "Follow the name",
    "kind": "DNS + addressing",
    "minutes": 7,
    "brief": "DNS maps names to records, including IPv4 addresses (A records). Find canal.hackville.test, then identify that address in the traffic table. All names and logs are fictional.",
    "steps": [
      "Resolve the exact hostname using the DNS table.",
      "Match that IP to a destination in the flow table.",
      "Use the matching flow\u2019s destination port as HACK{PORT_NUMBER}."
    ],
    "evidence": "DNS RECORDS\ncanal.hackville.test   A  192.168.1.80\narchive.hackville.test A  192.168.1.81\n\nFLOWS (destination port identifies the service endpoint)\nSOURCE         DESTINATION    DEST PORT  SERVICE\n192.168.1.22   192.168.1.81   443        HTTPS\n192.168.1.22   192.168.1.80   8080       Gate web app\n192.168.1.23   192.168.1.53   53         DNS",
    "answer": "HACK{8080}",
    "hints": [
      "Use canal, not archive.",
      "canal resolves to .80. Find the flow to .80.",
      "The destination port is 8080. Enter HACK{8080}."
    ],
    "explain": "DNS answers a name-to-record question. An IP selects an address; a transport port identifies an endpoint for a service. A port alone does not prove the actual application.",
    "tool": null,
    "asset": null
  },
  {
    "id": "i3",
    "level": "intermediate",
    "title": "Bytes from the console",
    "kind": "Hex + commands",
    "minutes": 6,
    "brief": "A simulated console printed hexadecimal bytes. Hexadecimal is base 16; two hex digits represent one byte. Use the Hex tool to recover the text.",
    "steps": [
      "Read the command guide below. No real terminal is needed.",
      "Copy only the hex bytes into the Hex tool.",
      "Decode and submit the recovered flag."
    ],
    "evidence": "SIMULATED CONSOLE\n$ cat clue.hex\n48 41 43 4b 7b 42 59 54 45 53 5f 54 45 4c 4c 5f 53 54 4f 52 49 45 53 7d\n\nCOMMAND GUIDE\n$ = a prompt marker; do not type it.\nLinux/macOS: cat clue.hex prints the file contents.\nWindows PowerShell: Get-Content clue.hex prints the file contents.\nclue.hex = the filename, not a command.",
    "answer": "HACK{BYTES_TELL_STORIES}",
    "hints": [
      "Copy the line beginning 48 41.",
      "48 is H, 41 is A, 43 is C, 4b is K.",
      "Decoded: HACK{BYTES_TELL_STORIES}."
    ],
    "explain": "Hex is a readable representation of bytes, not encryption. cat and Get-Content display a file; they do not automatically decode its hexadecimal contents.",
    "tool": "hex",
    "asset": null
  },
  {
    "id": "i4",
    "level": "intermediate",
    "title": "A bit beneath the surface",
    "kind": "Pixel steganography",
    "minutes": 9,
    "brief": "This PNG looks like a normal signal badge. A message was hidden in the least significant bit (LSB) of each red pixel channel, starting at the top-left and moving across each row.",
    "steps": [
      "Open the Pixel Reader tool.",
      "Choose \u201cRead signal badge\u201d. It reads the red LSBs in groups of eight bits until a zero byte.",
      "Record what changed compared with the faint-text poster; submit the flag."
    ],
    "evidence": null,
    "answer": "HACK{PIXELS_HAVE_LAYERS}",
    "hints": [
      "Each color channel is a number from 0 to 255. Its last binary bit can store one hidden bit.",
      "Use the Pixel Reader, not the contrast slider.",
      "The extracted message is HACK{PIXELS_HAVE_LAYERS}."
    ],
    "explain": "A one-step change in a red value is difficult to see. Eight hidden bits form one byte. Our reader is designed for this exact format; it is not a universal steganography detector.",
    "tool": "pixels",
    "asset": "signal.png"
  },
  {
    "id": "i5",
    "level": "intermediate",
    "title": "Evidence before accusation",
    "kind": "Incident correlation",
    "minutes": 8,
    "brief": "A gate token was fetched, then used. Identify the source IP that performed BOTH requests with the same request ID. A successful page view alone is not enough.",
    "steps": [
      "Match request ID G7 across both tables.",
      "Check source IP and status.",
      "Submit the correlated source address."
    ],
    "evidence": "TOKEN LOG\nTIME     SOURCE IP       REQUEST ID  ACTION       STATUS\n10:00:01 192.168.1.18    B2          fetch-token  200\n10:00:04 192.168.2.44    G7          fetch-token  200\n10:00:05 192.168.1.18    C3          fetch-token  403\n\nGATE LOG\nTIME     SOURCE IP       REQUEST ID  ACTION       STATUS\n10:00:10 192.168.1.18    B2          open-gate    403\n10:00:11 192.168.2.44    G7          open-gate    200\n10:00:12 192.168.1.99    Z9          view-home    200",
    "answer": "HACK{192.168.2.44}",
    "hints": [
      "Correlate using the request ID, not just the order of events.",
      "G7 appears with two successful actions.",
      "Both G7 records use 192.168.2.44. Enter HACK{192.168.2.44}."
    ],
    "explain": "Correlating identifiers and timestamps creates a stronger explanation than selecting an unusual IP. This is the observed source in the supplied evidence, not proof of a person\u2019s identity.",
    "tool": null,
    "asset": null
  },
  {
    "id": "a1",
    "level": "advanced",
    "title": "Two wrappers",
    "kind": "Layered decoding",
    "minutes": 8,
    "brief": "Rogue 9 nested a Caesar-shifted flag inside Base64. Reverse the outer encoding first, then reverse the inner cipher. The shift key is the number of bits in one byte.",
    "steps": [
      "Determine the key from the byte clue.",
      "Decode Base64, then Caesar-decode the result with that key.",
      "Save the exact recovered flag; you will reuse its inner word in the final mission."
    ],
    "evidence": "UElLU3tWUU9QQkFQUU5CfQ==",
    "answer": "HACK{NIGHTSHIFT}",
    "hints": [
      "There are 8 bits in a byte.",
      "First Base64-decode; then Caesar-decode by 8.",
      "The recovered flag is HACK{NIGHTSHIFT}."
    ],
    "explain": "Order matters when transformations are layered. These reversible toy transformations teach process; layering weak methods does not make them secure.",
    "tool": "base64",
    "asset": null
  },
  {
    "id": "a2",
    "level": "advanced",
    "title": "Find the crossed wire",
    "kind": "Subnet reasoning",
    "minutes": 8,
    "brief": "Use the supplied /24 rule to audit three endpoint settings. With a /24 mask (255.255.255.0), devices on the same local IPv4 subnet share the first three octets. Find the device whose configured gateway is outside its subnet.",
    "steps": [
      "Apply the /24 rule to each device and gateway.",
      "Select the one misconfigured endpoint.",
      "Submit its device name inside HACK{...}."
    ],
    "evidence": "ALL ENDPOINTS USE /24\nDEVICE    IP ADDRESS       DEFAULT GATEWAY\nRELAY_A   192.168.1.40     192.168.1.1\nRELAY_B   192.168.2.41     192.168.1.1\nRELAY_C   192.168.2.42     192.168.2.1\n\nAn octet is one of the four dot-separated numbers.\nThe default gateway is the router an endpoint normally uses to reach other networks.",
    "answer": "HACK{RELAY_B}",
    "hints": [
      "Compare each IP\u2019s first three numbers with its gateway\u2019s first three numbers.",
      "RELAY_B is on 192.168.2.0/24, but its gateway is on 192.168.1.0/24.",
      "Enter HACK{RELAY_B}."
    ],
    "explain": "With these ordinary /24 endpoint settings, the gateway must be reachable on the local subnet. This conclusion applies to the supplied configuration, not to every possible routing design.",
    "tool": null,
    "asset": null
  },
  {
    "id": "a3",
    "level": "advanced",
    "title": "Trust the fingerprint",
    "kind": "File integrity",
    "minutes": 8,
    "brief": "Only one candidate exactly matches the trusted SHA-256 digest. A cryptographic hash maps input bytes to a fixed-length fingerprint. Compare the candidates; punctuation and spaces matter.",
    "steps": [
      "Copy one candidate at a time into the SHA-256 tool, without its label.",
      "Match the output to the trusted digest. Do not add a newline.",
      "Submit HACK{A}, HACK{B}, or HACK{C}."
    ],
    "evidence": "TRUSTED SHA-256\n103132fe743328b4c620fde50418e17f42ce1d86ee692b5a84ae239040271524\n\nA: MOSS: KEEP THE CANAL CLOSED\nB: MOSS: KEEP THE CANAL OPEN\nC: MOSS: KEEP THE CANAL OPEN!",
    "answer": "HACK{B}",
    "hints": [
      "Hash only the sentence after the label and space.",
      "Candidate B has no final punctuation.",
      "The trusted digest matches candidate B. Enter HACK{B}."
    ],
    "explain": "A matching trusted hash supports integrity: these bytes match the reference. A hash alone does not identify an author or guarantee safety. The reference itself must come from a trusted source.",
    "tool": "hash",
    "asset": null
  },
  {
    "id": "a4",
    "level": "advanced",
    "title": "Rebuild the timeline",
    "kind": "Network + HTTP",
    "minutes": 10,
    "brief": "The public IP in an alert is a shared NAT address. Identify the internal device using a source-port mapping AND the matching HTTP request. NAT lets multiple internal devices share one public address.",
    "steps": [
      "Match the alert\u2019s public source port and timestamp to the NAT table.",
      "Check the corresponding internal device in the request table.",
      "Submit the internal IP supported by both records."
    ],
    "evidence": "ALERT\n11:04:12 source 203.0.113.8:51002 \u2192 198.51.100.20:443\nrequest ID R42; path /gate/override; status 200\n\nNAT TABLE (active at 11:04:12)\nINTERNAL SOURCE        PUBLIC SOURCE\n192.168.1.18:60100     203.0.113.8:51001\n192.168.2.44:60200     203.0.113.8:51002\n192.168.2.45:60300     203.0.113.8:51003\n\nHTTP REQUEST LOG\nTIME     INTERNAL IP     ID   PATH            STATUS\n11:04:12 192.168.2.44    R42  /gate/override  200\n11:04:12 192.168.2.45    R43  /gate/override  403\n11:04:13 192.168.1.18    R44  /status         200\n\naddress:port = an IP address followed by a transport port.",
    "answer": "HACK{192.168.2.44}",
    "hints": [
      "All devices share the public IP; the translated source port distinguishes the mappings.",
      "Public source port 51002 maps to 192.168.2.44:60200.",
      "R42 confirms 192.168.2.44. Enter HACK{192.168.2.44}."
    ],
    "explain": "A shared public IP is not enough to attribute traffic to a device. Timestamped NAT mappings plus request evidence support a more precise conclusion. Attribution to a human still needs more evidence.",
    "tool": null,
    "asset": null
  },
  {
    "id": "a5",
    "level": "advanced",
    "title": "The final handoff",
    "kind": "Combined investigation",
    "minutes": 10,
    "brief": "The final badge stores a Base64 payload in red-channel LSBs. Decode it to reveal the assembly rule. Recover the earlier word, internal IP, and service port, then assemble the final flag.",
    "steps": [
      "Use Pixel Reader \u2192 Read final badge.",
      "Base64-decode the extracted text to reveal the assembly rule.",
      "Use your earlier case records. Submit the complete assembled flag and export your handoff."
    ],
    "evidence": null,
    "answer": "HACK{NIGHTSHIFT_192.168.2.44_8080}",
    "hints": [
      "Pixel extraction gives Base64 text. Decode that text before assembling anything.",
      "Use A1\u2019s inner word, A4\u2019s internal IP, and I2\u2019s destination port, in that order.",
      "Enter HACK{NIGHTSHIFT_192.168.2.44_8080}."
    ],
    "explain": "You combined hidden bytes, encoding, cryptography, and network evidence. The final product is a defensible handoff: what you observed, how you interpreted it, and which evidence supports your conclusion.",
    "tool": "pixels",
    "asset": "final.png"
  }
];
