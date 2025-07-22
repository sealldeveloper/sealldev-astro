---
title: "adminpanel"
description: "can you break into the admin panel? I heard that it is protecting some secrets 😉"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This challenge was a website with a basic login panel of a username and password inputs.

Via setting the username to `admin' OR 1=1;--` and the password to `a` we can get the flag.

Flag: `CSEC{1_l0v3_sql173!!!}`