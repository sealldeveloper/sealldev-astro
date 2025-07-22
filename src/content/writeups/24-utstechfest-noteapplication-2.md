---
title: "noteapplication 2"
description: "I hope my notes are protected..."
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

> Note: This is a part 2 to [noteapplication 1](/writeups/24-utstechfest-noteapplication-1)

This is the same application as `noteapplication 1` but with a new security protection. Now when I go to `/note/1` I'm told my permissions are denied.

Checking my cookies, there is a cookie `admin` set to `False`, changing it to `True` then reloading gives us the flag.

Flag: `CSEC{c00k135_4r3n7_s3cur3}`