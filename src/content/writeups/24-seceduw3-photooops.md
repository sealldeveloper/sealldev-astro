---
title: "Photo-oops"
description: "They've cleared out some old files from storage, as they're needing to reference some physical documents due to the partial outage. One of these photos is brought up to your team by an intreigued employee -- it belongs to a `Tanya`, but that's not a name of one of their employees. Where was this photo taken?? \bWrap the city name in`'SECEDU{}`. \bDon't forget to capitalise the city name!"
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



We are supplied this photo:
![photooops.png](images/24-secedu/photooops.png)

I immediately notice two things:

The partial phone number and car dealership ad on the right.
- `(4722) 376`
- `Genser`

The Cyrillic on the left
![cyrillic.png](images/24-secedu/cyrillic.png)

I start dorking for this dealership, I search for `"genser" "4722"` and get a hit: `@genserjlr` on Instagram!

![insta.png](images/24-secedu/insta.png)

Looks like a match!

I do some more dorking for some other results of the dealership as the website is very not alive...

I find an address on this [random car dealership site](http://avtoavto.ru/dealerinfo.mhtml?Producer_ID=53&Dealer_ID=2568) for an address in `Belgorod`!

Flag: `SECEDU{Belgorod}`