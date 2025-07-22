---
title: "APPmusement park"
description: "i think the flag is hidden somewhere here..."
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This challenge I *should* have solved but did something very silly so didn't during the CTF.

This is another APK challenge, and with a small nudge from the authors I was told to investigate the assets.

Firstly I extracted the APK with `apktool` using `apktool d ./app.apk`.

After I used `find` to look for images.

`find . -name '*.png' 2>/dev/null`... nothing of interest

`find . -name '*.svg' 2>/dev/null`... nothing of interest

`find . -name '*.jpg' 2>/dev/null`... nothing of interest

`find . -name '*.webp' 2>/dev/null`... nothing of interest

What?

I started looking for Unity assets and random stuff as I was completely lost, until I was told after the CTF.
> jpeg

I HATE JPEG I HATE JPEG I HAT-

Let's have a look for some `.jpeg`'s, only 1 result 🙃.

```
$ find . -name '*.jpeg' 2>/dev/null
./res/mipmap-hdpi/ic_launcher.jpeg
```

![ic_launcher](images/24-utstechfest/ic_launcher.jpeg)

Looking at this image I have a hunch its steganography.

I put it into AperiSolve. I download the `steghide` portion.

Flag: `CSEC{h0w_d1d_7h15_637_h3r3???}`