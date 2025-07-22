---
title: "SAM I AM"
description: "The attacker managed to gain Domain Admin on our rebels Domain Controller! Looks like they managed to log on with an account using WMI and dumped some files. Can you reproduce how they got the Administrator's Password with the artifacts provided?\nPlace the Administrator Account's Password in `DUCTF{}`, e.g. `DUCTF{password123!}`"
pubDate: 2024-07-10
ctf: "DownUnderCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-downunder/icon.png"
---



We are given a `sam.bak` and a `system.bak` which are backups of the registry hives, we can use impacket's `secretsdump.py` to extract the passwords.

```bash
$ python3 /usr/bin/secretsdump.py -sam sam.bak -system system.bak LOCAL
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Target system bootKey: 0xa88f47504785ba029e8fa532c4c9e27b
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:476b4dddbbffde29e739b618580adb1e:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
[*] Cleaning up... 
```

We can then use the output of `Administrator` as a hash for hashcat:
```bash
$ hashcat -a 0 -m 1000 admin-hash /usr/share/seclists/Passwords/Leaked-Databases/rockyou.txt
...
476b4dddbbffde29e739b618580adb1e:!checkerboard1
```

The password is `!checkerboard1`!

Flag: `DUCTF{!checkerboard1}`