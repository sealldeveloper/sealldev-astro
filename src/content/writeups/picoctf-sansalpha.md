---
title: "SansAlpha"
description: "The Multiverse is within your grasp! Unfortunately, the server that contains the secrets of the multiverse is in a universe where keyboards only have numbers and (most) symbols.\n`ssh -p PORT ctf-player@mimas.picoctf.net` Use password: `83dcefb7`\n\nHint: Where can you get some letters?"
pubDate: 2025-03-14
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
image: "./images/picoctf/sansalpha/icon.png"
---

Using the `ssh` connection command given and the password, I connect to the server:
```bash
$ ssh -p 62142 ctf-player@mimas.picoctf.net
The authenticity of host '[mimas.picoctf.net]:62142 ([52.15.88.75]:62142)' can't be established.
ED25519 key fingerprint is SHA256:n/hDgUtuTTF85Id7k2fxmHvb6rrLrACHNM6xLZ46AqQ.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[mimas.picoctf.net]:62142' (ED25519) to the list of known hosts.
ctf-player@mimas.picoctf.net's password:
Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 6.5.0-1016-aws x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, you can run the 'unminimize' command.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

SansAlpha$
```

I start by trying a basic `ls`:
```
SansAlpha$ ls
SansAlpha: Unknown character detected
```

We can't seem to use characters, this is a bash jail, and we are sandboxed to only use non-alphabet characters.

We can start by looking for files like so:
```
SansAlpha$ ./*
bash: ./blargh: Is a directory
```

This selects all files in the current directory, and we can see it hits 'blargh' which is a folder.

As we know there is a folder, we can use `./*/*` to enter the folder and look for files:
```
SansAlpha$ ./*/*
bash: ./blargh/flag.txt: Permission denied
```

That's where the flag is! Now to find how to read it.

There is a [big list](https://tldp.org/LDP/abs/html/internalvariables.html) of internal bash variables but the one I find of interest is `$_`, as it contains information from the previous command.
> $_: Special variable set to final argument of previous command executed.

So if I do `./*` then do `$_`:
```
SansAlpha$ ./*
bash: ./blargh: Is a directory

SansAlpha$ $_
bash: ./on-calastran.txt: Permission denied
```

Look! A new file, and it has some interesting characters and, we can use [bash string manipulation](https://tldp.org/LDP/abs/html/string-manipulation.html) (under Substring Extraction) to get characters!

The unique characters in `./on-calastran.txt` are enough to form `cat` and read a file!

We first need to do `./*` to get it loaded into `$_`:
```
SansAlpha$ ./*
bash: ./blargh: Is a directory
```

Now, we need the characters 5-7 (starting from 0 at the `.`) then we need character 10, then we need to supply `./*/*`.

We can do bash string manipulation like so:
`${_:5:2}`

```
SansAlpha$ ${_:5:2}
bash: ca: command not found
```

Woo!, now just for `t`.
```
SansAlpha$ ./*
bash: ./blargh: Is a directory

SansAlpha$ ${_:5:2}${_:10:1} ./*/*
return 0 picoCTF{7h15_mu171v3r53_15_m4dn355_36a674c0}Alpha-9, a distinctive layer within the Calastran multiverse, stands as a
sanctuary realm offering individuals a rare opportunity for rebirth and
introspection. Positioned as a serene refuge between the higher and lower
Layers, Alpha-9 serves as a cosmic haven where beings can start anew,
unburdened by the complexities of their past lives. The realm is characterized
by ethereal landscapes and soothing energies that facilitate healing and
self-discovery. Quantum Resonance Wells, unique to Alpha-9, act as conduits for
individuals to reflect on their past experiences from a safe and contemplative
distance. Here, time flows differently, providing a respite for those seeking
solace and renewal. Residents of Alpha-9 find themselves surrounded by an
atmosphere of rejuvenation, encouraging personal growth and the exploration of
untapped potential. While the layer offers a haven for introspection, it is not
without its challenges, as individuals must confront their past and navigate
the delicate equilibrium between redemption and self-acceptance within this
tranquil cosmic retreat.
```

This get's the flag!

Flag: `picoCTF{7h15_mu171v3r53_15_m4dn355_36a674c0}`

### Another Solution
We can get the required characters used `../*`:
```
SansAlpha$ ../*
bash: ../ctf-player: Is a directory

SansAlpha$ ${_:3:1}${_:9:1}${_:4:1} ./*/*
return 0 picoCTF{7h15_mu171v3r53_15_m4dn355_36a674c0}Alpha-9, a distinctive layer within the Calastran multiverse, stands as a
...
```

