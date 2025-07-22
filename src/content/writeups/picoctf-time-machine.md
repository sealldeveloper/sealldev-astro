---
title: "Time Machine"
description: "What was I last working on? I remember writing a note to help me remember... You can download the challenge files here: challenge.zip"
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

This, again contains a `message.txt` and a folder called `.git`, so I utilise the Extractor from GitTools once more to pull out the files.

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
[+] Found commit: 89d296ef533525a1378529be66b22d6a2c01e530
[+] Found file: /.../drop-in/./0-89d296ef533525a1378529be66b22d6a2c01e530/message.txt
```

Reading the `commit-meta.txt` inside `0-89d296ef533525a1378529be66b22d6a2c01e530` has the flag as the commit message.

Flag: `picoCTF{t1m3m@ch1n3_186cd7d7}`