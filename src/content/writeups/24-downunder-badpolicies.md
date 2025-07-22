---
title: "Bad Policies"
description: "Looks like the attacker managed to access the rebels Domain Controller. Can you figure out how they got access after pulling these artifacts from one of our Outpost machines?"
pubDate: 2024-07-10
ctf: "DownUnderCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-downunder/icon.png"
---



We are given a folder of artifacts which looks like policies and various other configuration files from a DC.

The one that catches my eye is the `Groups.xml`. I see a `cpassword` value and look it up. I find an article from [InfoSecWriteups](https://infosecwriteups.com/attacking-gpp-group-policy-preferences-credentials-active-directory-pentesting-16d9a65fa01a) that mentions the utility `gpp-decrypt` to decrypt the hash.

```bash
$ gpp-decrypt "B+iL/dnbBHSlVf66R8HOuAiGHAtFOVLZwXu0FYf+jQ6553UUgGNwSZucgdz98klzBuFqKtTpO1bRZIsrF8b4Hu5n6KccA7SBWlbLBWnLXAkPquHFwdC70HXBcRlz38q2"
DUCTF{D0n7_Us3_P4s5w0rds_1n_Gr0up_P0l1cy}
```

Flag: `DUCTF{D0n7_Us3_P4s5w0rds_1n_Gr0up_P0l1cy}`