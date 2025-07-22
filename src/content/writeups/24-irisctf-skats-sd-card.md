---
title: "skat's SD card"
description: "\"Do I love being manager? I love my kids. I love real estate. I love ceramics. I love chocolate. I love computers. I love trains.\""
pubDate: 2024-01-08
ctf: "IrisCTF 2024"
category: "networks"
author: "sealldev"
section: "CTFs"
image: "images/24-irisctf/icon.png"
---

Looking through the file we are given its an image of a linux file system.

Once mounted with fuse (mac moment) we see a linux file system and checking the `/home` folder I see a `skat` user directory.

Looking around the directory few things catch my eye:

```
.bash_history
.mozilla/
.ssh/
```

`.mozilla` has some history and not alot more. There is a visitng of a pastebin URL but it does not lead to anything.

Reading `.bash_history` there is some information of interest.

- `git clone git@github.com:IrisSec/skats-interesting-things.git`. This command is [cloning a repository from GitHub using an SSH Repo URL](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-ssh-urls) which requires authentication with an SSH key and a password typically as pointed out online.
- `cat article6.txt`. Maybe once cloned this file could be interesting?

Let's check if the repo is online:

```
$ git clone git@github.com:IrisSec/skats-interesting-things.git
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

So we lack access rights, maybe we can find some?

Looking in `.ssh/` we can see `id_rsa`, it's likely that these SSH creds authorise us to clone that repo.

The SSH has a password so we can crack the password with JohnTheRipper and `ssh2john`.

**Note for M1 users:** I personally experienced a heap of trouble cracking this on M1 due to JohnTheRipper being heavily unmaintained and some odd bugs with the format. My solution was having to contact organisers but this can be cracked with latest JohnTheRipper on arm with anything but MacOS or on x64 perfectly fine. There is now a [Gist](https://gist.github.com/securisec/c332939963438b41b392669b8901232b) to help install john appropriately with source if needed, which works perfectly (thank you securisec).

```
$ ssh2john id_rsa > id_rsa.hash
$ john id_rsa --wordlist=rockyou.txt
password
```

Well, thats a secure password lmao.

I copy the `id_rsa` and `known_hosts` to my `~/.ssh` folder to be used for authorisation.

I then clone the repo doing the following:

```
$ git clone git@github.com:IrisSec/skats-interesting-things.git
Cloning into 'skats-interesting-things'...
..., done.
$ ls skats-interesting-things
README.md     article1.txt  article3.txt  article5.txt  article7.txt
article0.txt  article2.txt  article4.txt  article6.txt
```

Looking at the contents none of the files jump out at me, `article6.txt` was nothing and it ended up being mostly just txt files of documentation and a very useless README. 

I decide to explore the `.git` folder, and after some searching are some pack files in `.git/objects/pack/`. Using [`packfile_reader`](https://github.com/robisonsantos/packfile_reader) we can extract the data to some text files.

```
$ packfile_reader -e -o . pack-7359dfb3974f6464a5b192bba2d05f89f0b3aa4a.pack
```

Then using `grep -r ‘{‘ .` I searched for the flag.

Found it! 

Flag: `irisctf{0h_cr4p_ive_left_my_k3ys_out_4nd_ab0ut}`

**Files:** [skats-sd-card.tar.gz](https://web.archive.org/web/20240107230452/https://cdn.2024.irisc.tf/skats-sd-card.tar.gz)