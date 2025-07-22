---
title: "Super SSH"
description: "Using a Secure Shell (SSH) is going to be pretty important. Can you ssh as ctf-player to titan.picoctf.net at port 63095 to get the flag? You'll also need the password f3b61b38. If asked, accept the fingerprint with yes. If your device doesn't have a shell, you can use: https://webshell.picoctf.org If you're not sure what a shell is, check out our Primer: https://primer.picoctf.com/#_the_shell"
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

Run `ssh ctf-player@titan.picoctf.net -p 63095`. Accept the fingerprint and enter the password as `f3b61b38`.

```
$ ssh ctf-player@titan.picoctf.net -p 63095
ctf-player@titan.picoctf.net's password:
Welcome ctf-player, here's your flag: picoCTF{s3cur3_c0nn3ct10n_3e293eea}
Connection to titan.picoctf.net closed.
```

Flag: `picoCTF{s3cur3_c0nn3ct10n_3e293eea}`