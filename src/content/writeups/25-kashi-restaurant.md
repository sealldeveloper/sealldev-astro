---
title: "Restaurant"
description: "I just asked for my favourite pasta and they gave me this. Are these guys STUPID? Maybe in the end they may give me something real. (Wrap the text in `KashiCTF{}`)"
pubDate: 2025-02-27
ctf: "KashiCTF 2025"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/25-kashi/icon.png"
---



We are given a `pasta.jpg`:
![pasta.jpg](images/25-kashi/pasta.jpg)

At the end of the image file is a sequence of a/b's (when viewed with `xxd` or a hex editor).

```
baabaaabbbaabaababbababaaaabaabaaaaaabaabaaaaaabaaaaaaaababaababaababaababababbaaaabaabbababbababaababaaaabbaaaabba
```

Using [Dcode.fr's Cipher Identifier](https://www.dcode.fr/cipher-identifier) it identifies it as a Bacon Cipher.

Decoding returns the flag: `THEYWEREREALLLLYCOOKING`

Flag: `KashiCTF{THEYWEREREALLLLYCOOKING}`
