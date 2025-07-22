---
title: "Avatar"
description: "We've now found a link to a \"Leet Hacker\" that has probed ORG-B systems a bit. Can you find their alias?\n\n`http://ec2-54-79-58-135.ap-southeast-2.compute.amazonaws.com`"
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



![website.png](images/24-secedu/website.png)

This website has a Gravatar URL for the person's profile picture: `https://2.gravatar.com/avatar/127a564647a8981b658a36e3cc9da08ec5d3f8437c3e4e336e2f43dcb862d7f0?s=9999`

![c1pherpfp.png](images/24-secedu/c1pherpfp.png)

We can visit the persons Gravatar profile from that hash: `https://gravatar.com/127a564647a8981b658a36e3cc9da08ec5d3f8437c3e4e336e2f43dcb862d7f0`.

It redirects to: `https://gravatar.com/casuallydd31f0971a`

![gravatarprof.png](images/24-secedu/gravatarprof.png)

We can see their username just below their 'name'.

Flag: `SECEDU{Br0kenC1ph3r23}`