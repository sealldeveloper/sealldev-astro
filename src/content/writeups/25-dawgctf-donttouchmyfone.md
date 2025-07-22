---
title: "Don't Touch My Fone"
description: "Looks like someone's dialing a phone number, see if you can figure out what it is! The flag format is the decoded phone number wrapped in DawgCTF{} with no formatting, so if the number is 123-456-7890, then the flag is DawgCTF{1234567890}." 
pubDate: 2025-04-29
ctf: "DawgCTF 2025"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/25-dawgctf/icon.png"
---

We are given an audio file that recognisably sound like the button presses on a payphone.

This is called Dual-Tone Multi Frequency a.k.a. DTMF.

This used to be communicated from the phone box to the switching centre, the switching centre then knows where to route your call based on the tones.

There is an online tool to [Detect DTMF Tones](http://dialabc.com/sound/detect/index.html) which we can use the .wav on:
![dtmf.png](images/25-dawgctf/dtmf.png)

Flag: `DawgCTF{4104553500}`