---
title: "Vobla Trails"
description: "Got this one on my email today. Seems like fishing or whatever you professionals call it... Can you help?"
pubDate: 2024-05-21
ctf: "SASCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-sasctf/icon.png"
---

We are given a PDF `vobla_tales.pdf`, and I notice something when downloading the PDF.

![pdf title](images/24-sasctf/pdftitle.png)

The PDF title says `Custom Font Example`, so I go to investigate the font using FontForge.

I go to FontForge and use the 'Extact from PDF' option to import the font.

![glyphs](images/24-sasctf/glyphs.png)

I see one of interest, and looking at the name `FLAG IN HOLE` I investigate.

![flagglyph](images/24-sasctf/flagglyph.png)

I zoom in, and...

![voblaflag.](images/24-sasctf/voblaflag.png)

Flag: `SAS{tru3_typ3_i5_n0t_s0_tru3}`