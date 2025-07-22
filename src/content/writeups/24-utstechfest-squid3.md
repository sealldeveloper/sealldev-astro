---
title: "squid3"
description: "I automated my jenkins installation. The guide I followed was from early last year, hope the version is still secure 🙂"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

> Note: This is a part 3 to [squid1](/writeups/24-utstechfest-squid1) and [squid2](/writeups/24-utstechfest-squid2)

The intended route for this was to trigger a reverse shell from the `/script` panel and then use `su root` to read the flag in the `/root` folder, but the connections never worked, so I reached out to the admin.

I was told a reverse shell was the correct process, but was broken. They gave me the flag as I had 'solved' the challenge.

Flag: `CSEC{J3nkin3_un4u7h3d_70_r007}`