---
title: "Commitment Issues"
description: "I accidentally wrote the flag down. Good thing I deleted it!"
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

Downloading the zip I see a `message.txt` and a folder called `.git`. I use a `grep -R 'pico' .` to look for the flag inside the files and I get some hits:

```
./.git/logs/HEAD:0000000000000000000000000000000000000000 87b85d7dfb839b077678611280fa023d76e017b8 picoCTF <ops@picoctf.com> 1710201977 +0000	commit (initial): create flag
./.git/logs/HEAD:87b85d7dfb839b077678611280fa023d76e017b8 8dc51806c760dfdbb34b33a2008926d3d8e8ad49 picoCTF <ops@picoctf.com> 1710201977 +0000	commit: remove sensitive info
./.git/logs/refs/heads/master:0000000000000000000000000000000000000000 87b85d7dfb839b077678611280fa023d76e017b8 picoCTF <ops@picoctf.com> 1710201977 +0000	commit (initial): create flag
./.git/logs/refs/heads/master:87b85d7dfb839b077678611280fa023d76e017b8 8dc51806c760dfdbb34b33a2008926d3d8e8ad49 picoCTF <ops@picoctf.com> 1710201977 +0000	commit: remove sensitive info
```

These logs don't show the flag but commits for the flag, so I can utilise the [Extractor from GitTools](https://github.com/internetwache/GitTools) to pull out the files.

```
$ ~/.../GitTools/Extractor/extractor.sh . .
###########
# Extractor is part of https://github.com/internetwache/GitTools
#
# Developed and maintained by @gehaxelt from @internetwache
#
# Use at your own risk. Usage might be illegal in certain circumstances.
# Only for educational purposes!
###########
[+] Found commit: 87b85d7dfb839b077678611280fa023d76e017b8
[+] Found file: /.../drop-in/./0-87b85d7dfb839b077678611280fa023d76e017b8/message.txt
[+] Found commit: 8dc51806c760dfdbb34b33a2008926d3d8e8ad49
[+] Found file: /.../drop-in/./1-8dc51806c760dfdbb34b33a2008926d3d8e8ad49/message.txt
```

Looking at the first commit folder `0-87b85d7dfb839b077678611280fa023d76e017b8` and reading `message.txt` contains our flag. This fits with the `commit-meta.txt` containing the commit message: `create flag`.

Flag: `picoCTF{s@n1t1z3_ea83ff2a}`