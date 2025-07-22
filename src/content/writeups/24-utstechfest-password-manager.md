---
title: "password manager"
description: "can you crack the password manager???"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This was an Android reverse engineering challenge, I load it into jadx to start with.

Reading the source, we can see the login is `try harder lmao`.

I then install the Android app, type the login `try harder lmao` and then the flag is displayed.

![password manager](images/24-utstechfest/passwordmanager.png)

Flag: `CSEC{d0n75734lmyp455w0rd5pl3453}`