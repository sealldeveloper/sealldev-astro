---
title: "time changer"
description: "you: whats the time mr wolf?..\n\nmr wolf: time to use b64 👹👹"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This is another Android reverse engineering challenge, I again load it into jadx to start with.

I look at string and find a `notasecretkey`.

The hint for this challenge points towards Base64 strings being hidden in the APK. Looking for `notasecretkey` we can find a string in `res/layout/activity_main.xml`: `Q1NFQ3t3dGYtaXMt`. This decodes to `CSEC{wtf-is-`.

Assuming the flag ends with `}`, I encode the character to base64 which is `fQ`. I search the APK for `fQ` and find `YW4tYW5kcm9pZD8/fQ==` inside `res/values/strings.xml`. Decoded this is `an-android??}`.

Flag: `CSEC{wtf-is-an-android??}`