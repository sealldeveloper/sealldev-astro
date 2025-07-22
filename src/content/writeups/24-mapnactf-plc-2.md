---
title: "PLC II 🤖"
description: "After extensive investigations, the MAPNA forensics team discovered that the attackers attempted to manipulate the PLC time. Please identify the precise time in the following format: `year:month:day:hour:minute:second:millisecond`. The flag is `MAPNA{sha256(datetime)}`."
pubDate: 2024-01-22
ctf: "MapnaCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-mapnactf/icon.png"
---

Looking into the data inside the packets, we see that the first two packets start with `03000016`. I looked this up on GitHub and found some [scripts](https://github.com/tijldeneut/ICSSecurityScripts/blob/03cf22205e11629cdee661d87d969176b409abc6/SiemensScan.py#L562).

This lead me down to [S7comm](https://wiki.wireshark.org/S7comm) and in the examples section was [example time setting traffic](https://wiki.wireshark.org/uploads/__moin_import__/attachments/SampleCaptures/s7comm_reading_setting_plc_time.pcap).

I compare the raw TCP of the example traffic to the given traffic and only 1 line isn't similar.

The portion of the example data that was different (`00191408201159330400`) is a date as parsed in Wiresharks S7comm parsing. 

![PLC2](images/24-mapnactf/plc-2.png)

Looking at our file we see `00202309211959299490` which can be parsed to `2023:09:21:19:59:29:949`.

SHA256 sum of that gives us our flag.

Flag: `MAPNA{9effd248efdf066cf432a21a34d87db56d0d0a7e4fe9bb3af6ef6f125fc36cfa}`

**Files:** [PLC_0829b4ef9780677086043add8592e996f21e0bbe.txz](https://web.archive.org/web/20240121173821/https://mapnactf.com/tasks/PLC_0829b4ef9780677086043add8592e996f21e0bbe.txz)
