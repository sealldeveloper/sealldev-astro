---
title: "interencdec"
description: "Can you get the real meaning from this file."
pubDate: 2024-03-27
category: "crypto"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

Reading the file all we get is a Base64 string, so I decode it with CyberChef.

`YidkM0JxZGtwQlRYdHFhR3g2YUhsZmF6TnFlVGwzWVROclgyZzBOMm8yYXpZNWZRPT0nCg==` decodes to `b'd3BqdkpBTXtqaGx6aHlfazNqeTl3YTNrX2g0N2o2azY5fQ=='` which is another Base64 string.

I decode `d3BqdkpBTXtqaGx6aHlfazNqeTl3YTNrX2g0N2o2azY5fQ==` as Base64 and get `wpjvJAM{jhlzhy_k3jy9wa3k_h47j6k69}`. This visually looks like a rotation of the lettering (a Caeser Cipher), so I place the ROT13 down and go through the rotations to look for a `p` start, which is rotation `19`.

This results in the flag.

Flag: `picoCTF{caesar_d3cr9pt3d_a47c6d69}`