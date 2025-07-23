---
draft: true
title: "godot"
description: "Vladimir and Estragon converse on various topics while they wait for a man named Godot. While they wait, Pozzo is on his way to the market to sell his slave, Lucky." 
pubDate: 2025-07-24
ctf: "DownUnderCTF 2025"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/25-ductf/icon.png"
---

> This is the first writeup I'm trying to write in only vim, it's probably going to take a while but I'll figure it out.

## What are we given?

We are given 2 files from a `godot.tar.gz`:
```bash
$ file *
ductf_2025_godot_encrypted.exe: PE32+ executable (GUI) x86-64 (stripped to external PDB), for MS Windows
ductf_2025_godot_encrypted.pck: data
```

As is visible in the file name, these are encrypted!

To progress we likely want to being with decrypting these godot files, but how do we start?

## Godot Decryption

> During the CTF this [YouTube Video](https://youtu.be/fWjuFmYGoSY) by Giffi was what helped me decrypt this, this next section will mostly just be a written summary of what is done in the video. If you see this Giffi, thank you!

If the binary is encrypted, to execute we must decrypt the contents to run it at some point. So it's very likely the EXE contains the decryption key somewhere. Luckily godot is open source!


