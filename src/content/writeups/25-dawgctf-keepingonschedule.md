---
title: "Keeping on Schedule"
description: "One of our computers on the company network had some malware on it. We think we cleared of the main payload however it came back. Can you check for any signs of persistence? We are able to provide you a copy of the registry, the sooner the better!\n\nFor any registry related challenges, make sure to not overwrite you machines used registry as it is a sensitive system." 
pubDate: 2025-04-29
ctf: "DawgCTF 2025"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/25-dawgctf/icon.png"
---

For this challenge we are given a zip file with some registry hives.

We can parse these using RegCool:
![regoolloaded.png](images/25-dawgctf/keepingonschedule/regoolloaded.png)

RegCool also has a fast search function, I do a search for 'Dawg'.
We get a match at `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\TaskCache\Tasks\{2A31AA14-DFE0-4B02-96F9-6CB9BD69A3F9}`.

We can decode the hex content with CyberChef and find the flag.
![flag.png](images/25-dawgctf/keepingonschedule/flag.png)

Flag: `DawgCTF{Fun_W1th_T4sks}`