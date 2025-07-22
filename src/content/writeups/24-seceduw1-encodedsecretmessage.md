---
title: "Encoded, secret message?"
description: "While inspecting logs, we found a message being sent across our internal network. What could this be???"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "cryptography"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



This challenge we were given a string of characters: `籜籎籌籎籍籞粄籮籷籬簹籭籲籷籰籨籶簽籼籽簼类籨簹类籨籼簹籶簼籽籱簺籷籰粆`.

Plugging this into CyberChef, I remember generally that **ROT8000** converts to these kinds of characters. I am correct and it decodes to the flag.

[DCode's Cipher Detection](https://www.dcode.fr/cipher-identifier) also picks it up as ROT8000.

Flag: `SECEDU{enc0ding_m4st3r_0r_s0m3th1ng}`