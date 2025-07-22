---
title: "Scan Surprise"
description: "I've gotten bored of handing out flags as text. Wouldn't it be cool if they were an image instead?"
pubDate: 2025-03-09
category: "forensics"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
image: "./images/picoctf/scansurprise/qr.png"
---

We are given a `challenge.zip` that has a directory `home` with the following directory tree:
```
$ tree -a .
.
└── ctf-player
    └── drop-in
        └── flag.png

3 directories, 1 file
```

Viewing `flag.png` is a QR code image.

![qr.png](images/picoctf/scansurprise/qr.png)

I use the `zbarimg` tool, used to read QR codes from images. I use it in my terminal and get the flag:
```
$ zbarimg ctf-player/drop-in/flag.png
QR-Code:picoCTF{p33k_@_b00_3f7cf1ae}
scanned 1 barcode symbols from 1 images in 0.01 seconds
```

Flag: `picoCTF{p33k_@_b00_3f7cf1ae}`

> Note: This could also be solved scanning manually with a mobile device or using an online website to do so!
