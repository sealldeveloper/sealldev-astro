---
title: "squid1"
description: "I automated my jenkins installation. The guide I followed was from early last year, hope the version is still secure 🙂"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This challenge linked to a Jenkins instance on version 2.441. Looking for CVE's I find [a 9.8 critical](https://nvd.nist.gov/vuln/detail/CVE-2024-23897).

I download a PoC from [Exploit-db](https://www.exploit-db.com/exploits/51993) and use it.

By reading `/proc/self/environ` I can get the environment variables which contain a password and the flag.

Flag: `CSEC{LFI_CV3_F7W_ad4c72eb}`