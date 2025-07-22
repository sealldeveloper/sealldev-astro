---
title: "noteapplication 1"
description: "I hope my notes are protected..."
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This was a notes application where when viewing the note, the URL was similar to the following: `/note/3`.

By changing the parameter to `/note/1` and doing an IDOR we can get the flag.

Flag: `CSEC{n00_my_53cr37_n0tes!}`