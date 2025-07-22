---
title: "Game 1 - Untitled Game"
description: "We made a game."
pubDate: 2025-02-27
ctf: "KashiCTF 2025"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/25-kashi/icon.png"
---



I read the files properties (also with exiftool) and saw it had Godot copyright.

I know Godot is a game engine, and looked for a decompiler and found https://github.com/GDRETools/gdsdecomp.

Using this tool I can extract the project and inside the 'Scripts/player.gd' is the flag on line 8

`var flag = "KashiCTF{N07_1N_7H3_G4M3}"  # Get the footstep audio`

Flag: `KashiCTF{N07_1N_7H3_G4M3}`
