---
title: "Anti-dcode.fr"
description: "I've heard that everyone just uses dcode.fr to solve all of their crypto problems. Shameful, really. This is really just a basic Caesar cipher, with a few extra random characters on either side of the flag. Dcode can handle that, right? >:) The '{', '}', and '_' characters aren't part of the Caesar cipher, just a-z. As a reminder, all flags start with \"utflag{\"."
pubDate: 2024-04-01
ctf: "UTCTF 2024"
category: "crypto"
author: "sealldev"
section: "CTFs"
image: "images/24-utctf/icon.png"
---

Working with the file I do the following. I put the file into CyberChef, and do a `ROT13` and then a `Find / Replace` and check for any instances of the string `utflag{`.

I roll through the rotation till I see a length drop in the output at `18`.

I delete the `Find / Replace`, and save the output.

Searching the saved output for `utflag{` I find the flag.

Flag: `utflag{rip_dcode}`