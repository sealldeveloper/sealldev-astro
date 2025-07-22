---
title: "gravedigger"
description: "Hidden on this website lies a place no robot could ever access."
pubDate: 2024-06-26
ctf: "SCONES 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-scones/icon.png"
---

I immediately head stright to the [robots.txt file](https://web.archive.org/web/20240625132238/https://scones.secso.cc/robots.txt).

```
User-Agent: *
Allow: /
Disallow: /jenga
```

I go to [/jenga](https://web.archive.org/web/20240625132331/https://scones.secso.cc/jenga) and there is a recreation of a game of Jenga, cool!

Underneath the map when we zoom out is the flag.

![jenga flag](images/24-scones/jengaflag.png)

Flag: `BEGINNER{H1DD3N_1N_P141N_516H7}`