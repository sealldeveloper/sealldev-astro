---
title: "Cookie Monster Secret Recipe"
description: "Cookie Monster has hidden his top-secret cookie recipe somewhere on his website. As an aspiring cookie detective, your mission is to uncover this delectable secret. Can you outsmart Cookie Monster and find the hidden recipe? You can access the Cookie Monster here and good luck\n\nHint: Sometimes, the most important information is hidden in plain sight. Have you checked all parts of the webpage?\nHint: Cookies aren't just for eating - they're also used in web technologies!\nHint: Web browsers often have tools that can help you inspect various aspects of a webpage, including things you can't see directly."
pubDate: 2025-03-20
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
image: "./images/picoctf/cookiemonstersecretrecipe/icon.png"
---

We start with a plain login page:
![home.png](images/picoctf/cookiemonstersecretrecipe/home.png)

I try with some default credentials `admin:admin`, and get an error:
![loginerror.png](images/picoctf/cookiemonstersecretrecipe/loginerror.png)

With the hint to check my cookies, I use EditThisCookie2 and see a Cookie called `secret_recipe` (You can also view your cookies with a web proxy like Burp Suite, in browser storage, etc):
```
cGljb0NURntjMDBrMWVfbTBuc3Rlcl9sMHZlc19jMDBraWVzXzk2RjU4REFCfQ%3D%3D
```

This is URL encoded (can be seen by the `%3D` which is equal to `=`) and this also looks like Base64!

I do this in CyberChef to decode it. I use URL Decode then From Base64:
![flag.png](images/picoctf/cookiemonstersecretrecipe/flag.png)

Flag: `picoCTF{c00k1e_m0nster_l0ves_c00kies_96F58DAB}`
