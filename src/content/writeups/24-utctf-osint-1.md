---
title: "OSINT 1"
description: "It seems like companies have document leaks all the time nowadays. I wonder if this company has any."
pubDate: 2024-04-01
ctf: "UTCTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-utctf/icon.png"
---

We start with a fairly standard corporate website.

![osint1.png](images/24-utctf/osint1.png)

Looking through the only part of particular interest seems to be the employees list. The user that catches my eye the most is a 'Cole Minerton' due to the little blurb under him being the most expansive and also a mention of 'social media presence'.

At the top of the results is a [Twitter account](https://twitter.com/coleminerton) which has a [linktr.ee](https://linktr.ee/coleminerton) attached!

Browsing his social media I can see that he has a [YouTube channel](https://www.youtube.com/channel/UCkdrU8xdCgL0oasGsZAlUpw) which I saw below the Twitter in the search results so I go to it first.

Looking at the channel description there is a [Discord invite](https://discord.gg/re9ez8ey) which contains a conversation between Cole and his friends. Reading the conversation there is a file posted, a `trustly-contract.pdf`.

Downloading the file and reading it contains the flag.

Flag: `utflag{discord_is_my_favorite_document_leaking_service}`