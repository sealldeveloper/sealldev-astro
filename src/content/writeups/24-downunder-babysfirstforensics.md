---
title: "Baby's First Forensics"
description: "They've been trying to breach our infrastructure all morning! They're trying to get more info on our covert kangaroos! We need your help, we've captured some traffic of them attacking us, can you tell us what tool they were using and its version?\nNOTE: Wrap your answer in the `DUCTF{}`, e.g. `DUCTF{nmap_7.25}`"
pubDate: 2024-07-10
ctf: "DownUnderCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-downunder/icon.png"
---



We are given a `.pcap` I open in Wireshark and get to work, I see HTTP traffic so start by filtering by `http` and following the HTTP stream.

We can see in the User Agent of the HTTP stream this: `Mozilla/5.00 (Nikto/2.1.6) (Evasions:None) (Test:getinfo)`

Flag: `DUCTF{Nikto_2.1.6}`