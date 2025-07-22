---
title: "KnightCal"
description: "In the realm of ancient codes, only those who enumerate correctly can unveil the hidden flag. Craft your mathematical expressions wisely and uncover the secrets that lie within."
pubDate: 2025-01-22
ctf: "KnightCTF 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-knight/icon.png"
---



We are given a calculator webpage:
![knightcalmain.png](images/25-knight/knightcalmain.png)

Trying the example payload `0+1234` we get:
![knightcalexample.png](images/25-knight/knightcalexample.png)

Trying all digits, we want to try to reconstruct the word `flag` to read `flag.txt`. Let's try payload `0+123456789`:
![knightcalall.png](images/25-knight/knightcalall.png)

If `7=f`, `1=l`, `9=a` and `5=g` we can do `0+7195` to read the flag.

![knightcalsolve.png](images/25-knight/knightcalsolve.png)

Flag: `KCTF{_c0ngR4t5_KNIGHT_f1naLLy_Y0U_g07_tH3_r1gh7_m4tH_}`
