---
title: "Wheel Barrow"
description: "A wheelbarrow ran over the flag. Can you fix it? Please wrap the flag in `uoftctf{}`. Please keep the $ in the flag when submitting."
pubDate: 2024-01-15
ctf: "UofTCTF 2024"
category: "crypto"
author: "sealldev"
section: "CTFs"
image: "images/24-uoftctf/icon.png"
---

We are given the following string to work with: `hc0rhh3r3ylmsrwr___lsewt_03raf_rpetouin$_3tb0_t`

I look for anything relating to a 'wheel barrow' cipher, and then search 'wheel cipher', still nothing..

'barrow cipher' gives me the following result: [Burrow's Wheeler Transform](https://www.dcode.fr/burrows-wheeler-transform) which seems to correlated with the file being called `transformed.txt`.

Upon entering the string we were given with, it decrypts to `burr0w_wh33ler_transform_is_pr3tty_c00l_eh$th3_`.

We can reorganise the string to be `th3_burr0w_wh33ler_transform_is_pr3tty_c00l_eh$` which is our flag!

Flag: `uoftctf{th3_burr0w_wh33ler_transform_is_pr3tty_c00l_eh$}`

**Files:** [transformed.txt](https://files.seall.dev/ctfs/uoftctf2024/wheel-barrow/transformed.txt)