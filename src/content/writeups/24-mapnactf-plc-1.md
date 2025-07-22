---
title: "PLC I 🤖"
description: "The MAPNA CERT team has identified an intrusion into the plant's PLCs, discovering a covert message transferred to the PLC. Can you uncover this secret message?"
pubDate: 2024-01-22
ctf: "MapnaCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-mapnactf/icon.png"
---

If we open the given PCAP we can look at it in Wireshark, looking at the packets, we can see in some of them small segments of data.

![Data](images/24-uoftctf/plc-1.png)

After looking through all the packets I see the following:

- `3:Ld_4lW4` (Packet 19)
- `5:3__PaAD` (Packet 31)
- `1:MAPNA{y` (Packet 35)
- `4:yS__CaR` (Packet 39)
- `6:d1n9!!}` (Packet 46)
- `2:0U_sHOu` (Packet 50)

Compiled together in the numerical order we get the flag.

Flag: `MAPNA{y0U_sHOuLd_4lW4yS__CaR3__PaADd1n9!!}`

**Files:** [PLC_0829b4ef9780677086043add8592e996f21e0bbe.txz](https://web.archive.org/web/20240121173821/https://mapnactf.com/tasks/PLC_0829b4ef9780677086043add8592e996f21e0bbe.txz)