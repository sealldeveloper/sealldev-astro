---
title: "octopus"
description: "🐙🐙🐙🐙🐙🐙"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This was a webpage, inside the source comments was a reference to `git`. Checking `/.git` is an open directory.

I use [GitTools](https://github.com/internetwache/GitTools) Dumper to pull down the files.

I then use the Extractor to extract the commits, we find one.

Reading the `commit-meta.txt` of the only commit contains a base64 string: `Q1NFQ3t5b3Utd291bGQtYmUtc3VycHJpc2VkLXRoZS1hbW91bnQtb2Ytc2VydmVycy10aGF0LWhhdmUtLmdpdC1vcGVuLXRvLXRoZS1pbnRlcm5ldC1sb2x9`.

Decoding it contains the flag.

Flag: `CSEC{you-would-be-surprised-the-amount-of-servers-that-have-.git-open-to-the-internet-lol}`