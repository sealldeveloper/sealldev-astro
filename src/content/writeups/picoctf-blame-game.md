---
title: "Blame Game"
description: "Someone's commits seems to be preventing the program from working. Who is it? You can download the challenge files here: challenge.zip"
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

This challenge *again* contains a `.git`, but also a `message.py`, reading it has the following contents:
```
print("Hello, World!"
```

Let's use the Extractor from GitTools again to see what's inside.
```
$ ~/Documents/Hacking/Tools/GitTools/Extractor/extractor.sh . .
###########
# Extractor is part of https://github.com/internetwache/GitTools
#
# Developed and maintained by @gehaxelt from @internetwache
#
# Use at your own risk. Usage might be illegal in certain circumstances.
# Only for educational purposes!
###########
[+] Found commit: 61273a764174ec148e9f2bc6eecac42d849ee7e2
[+] Found file: /.../drop-in/./0-61273a764174ec148e9f2bc6eecac42d849ee7e2/message.py
...
[+] Found commit: 255a8bf698b075f245f31a85222e2dd063f1bfa9
[+] Found file: /.../drop-in/./501-255a8bf698b075f245f31a85222e2dd063f1bfa9/message.py
```

That is **alot** of commits! Let's use `grep -R 'picoCTF{' .` to search the file contents for any instances of the word `picoCTF{`.
```
./29-0351e0474493168ca76441c24630c17554fd09ca/commit-meta.txt:author picoCTF{@sk_th3_1nt3rn_d2d29f22} <ops@picoctf.com> 1710202021 +0000
./29-0351e0474493168ca76441c24630c17554fd09ca/commit-meta.txt:committer picoCTF{@sk_th3_1nt3rn_d2d29f22} <ops@picoctf.com> 1710202021 +0000
./.git/logs/HEAD:c9e851509190f5887e91339ee18087e3e77ebfda 0351e0474493168ca76441c24630c17554fd09ca picoCTF{@sk_th3_1nt3rn_d2d29f22} <ops@picoctf.com> 1710202021 +0000	commit: optimize file size of prod code
./.git/logs/refs/heads/master:c9e851509190f5887e91339ee18087e3e77ebfda 0351e0474493168ca76441c24630c17554fd09ca picoCTF{@sk_th3_1nt3rn_d2d29f22} <ops@picoctf.com> 1710202021 +0000	commit: optimize file size of prod code
```

We didn't actually need the extractor for this challenge as it was visible in the logs but, we can see our flag in a few places!

Flag: `picoCTF{@sk_th3_1nt3rn_d2d29f22}`