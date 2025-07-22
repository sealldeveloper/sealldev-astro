---
title: "hidden in plain sight"
description: "Have a closer look at your nametag.\n\n**Note**: Your answer should be a set of lowercase words separated by spaces, you do not need to wrap your answer with `SCONES{}`. For example, if you think the set of words is `correct horse battery staple`, then supply `correct horse battery staple` as the flag."
pubDate: 2024-06-26
ctf: "SCONES 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-scones/icon.png"
---

This one took a while for me...

Looking at the name tag do you see anything of interest, I'll give you the change to try catch it (Thanks Tom for the clearer badge photo).

![name badge](images/24-scones/namebadge.png)

If you didn't thats OK, it is these little `L`s and `l`s around the edges.

![name badge annotated](images/24-scones/namebadgeannotated.png)

So, what are they? Due to only seeing two kinds of symbols two codes immediately come to mind:
- Binary
- Morse

It's too short for binary (I think) so I try morse.

Transcripted from left to right I get `. -- -. .- ... . --- .-- . .-. . ....` (The `L`s being dots, the `l`s being dashes).

This is decoded to: `EMNASEOWEREH`... Hm, wait is that backwards? Let's try right to left (`.... . .-. . --. --- . ... -. .- -- .`).

Outputted as: `HEREGOESNAME`, woo!

Not the flag... how about `name goes here`?

Flag:`name goes here`