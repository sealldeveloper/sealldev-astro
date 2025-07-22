---
title: "Collaborative Development"
description: "My team has been working very hard on new features for our flag printing program! I wonder how they'll work together? You can download the challenge files here: challenge.zip"
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

We start with a `flag.py` and a `.git` folder. Inside `flag.py` was a single line: `print("Printing the flag...")`.

I use the Extractor from GitTools to pull out any objects from the `.git` folder.
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
[+] Found commit: 0cd57e0aedc31a1a92e0b79235c818de437cde8e
[+] Found file: /.../drop-in/./0-0cd57e0aedc31a1a92e0b79235c818de437cde8e/flag.py
[+] Found commit: eb19d0e3c28278752f0735c4451b885136a24105
[+] Found file: /.../drop-in/./1-eb19d0e3c28278752f0735c4451b885136a24105/flag.py
[+] Found commit: 8395824cc0ce486d1be9ab874bfedb2cec2ea398
[+] Found file: /.../drop-in/./2-8395824cc0ce486d1be9ab874bfedb2cec2ea398/flag.py
[+] Found commit: 7064732e2fd39d2247bd6ba2ccc4cf9576974d38
[+] Found file: /.../drop-in/./3-7064732e2fd39d2247bd6ba2ccc4cf9576974d38/flag.py
```

I use `grep -R 'picoCTF{' .` to search the commits for the flag:
```
./0-0cd57e0aedc31a1a92e0b79235c818de437cde8e/flag.py:print("picoCTF{t3@mw0rk_", end='')
```

So we know a portion of our flag (`picoCTF{t3@mw0rk_`) but we need the rest, lets have a look inside `0-0cd57e0aedc31a1a92e0b79235c818de437cde8e`.

Nothing more inside the `commit-meta.txt` or the `flag.py`... Looking at the next commit (`1-eb19d0e3c28278752f0735c4451b885136a24105`) the files are even less useful. I check the 3rd one (`2-8395824cc0ce486d1be9ab874bfedb2cec2ea39`) and inside the `flag.py` was another part of the flag:
```
$ cat flag.py
print("Printing the flag...")

print("w0rk_2c91ca76}")
```

Checking the 4th commit (`3-7064732e2fd39d2247bd6ba2ccc4cf9576974d38`) the `flag.py` has the middle part of the flag:
```
$ cat flag.py
print("Printing the flag...")

print("m@k3s_th3_dr3@m_", end='')
```

Putting the flag parts together in order gives us the flag.

Flag: `picoCTF{t3@mw0rk_m@k3s_th3_dr3@m_w0rk_2c91ca76}`