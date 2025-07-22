---
title: "Minotaurs Guest"
description: "No one has escaped Minotaur's labyrinth yet. Maybe you will be the first one to do it? Minecraft version 1.20.4 Server address: %ip%"
pubDate: 2024-05-21
ctf: "SASCTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-sasctf/icon.png"
---

This challenge placed us on a Minecraft server in a giant labryinth on Minecraft version 1.20.4. 

When loaded into the server a sign exists directing us to get to `198 101 198`.

My solution is to download and install a mod for Minecraft with Fabric called Baritone, which is used for its pathfinding abilities.

After installing it, I first use `#set allowBreak false` so the bot doesnt try to go through the walls. I then use `#goto 198 101 198` and I wait.

Once I arrive I go up a ladder and over some pressure plates.

![minecraftchat](images/24-sasctf/minecraftchat.png)

Flag: `SAS{f1nally_reun1t3d_8fe629ad}`