---
title: "Self Destruct"
description: "Explore the virtual machine and you might just find the flag. Or a surprise. Maybe...."
pubDate: 2025-02-27
ctf: "KashiCTF 2025"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/25-kashi/icon.png"
---



The description says:

> The attachment is a VirtualBox image. Do not run it outside VirtualBox. It is recommended to backup the .vdi file before launching the VM.

I downloaded the `.vdi` and then extracted it with 7Zip to a `.img` as I find working with disk images in Autopsy far easier than running the image called 'Self Destruct'.

Once loaded in Autopsy, I exported all the files to `Export`.

I manually found 2 flag parts in `/img_0.img/home/kashictf/.sush_history` and `/img_0.img/home/kashictf/.bash_history`:

```
ls
echo "fLaG Part 3: 'eserve_roo'"
exit
```

and

```
ls
echo "fLaG Part 5: 'ht??_No_Er'"
exit
```

after noticing the trend, I used powershell with a recursive search to locate the remaining parts:

```powershell
kashiselfdestruct\Export> Get-ChildItem -Recurse | Select-String -Pattern "fLaG Part" -CaseSensitive:$false
25-etc\hosts.allow:7:# fLaG Part 1: 'KashiCTF{r'
25-etc\kernel-img.conf:1:# Kernel image management overrides fLaG Part 4: 't_Am_1_Rig'
25-etc\sudo.conf:35:# fLaG Part 6: 'r0rs_4ll0w'
4-home\kashictf\.bash_history:2:echo "fLaG Part 5: 'ht??_No_Er'"
4-home\kashictf\.sush_history:2:echo "fLaG Part 3: 'eserve_roo'"
7083-usr\bin\sush:34:lsdirvdirgrepfgrepegreprgrepfLaG Part 7: 'ed_Th0}'
7083-usr\bin\sush:36:fLaG Part 2: 'm_rf_no_pr'sush: tokenization buffer allocation errorsush: cd: no such file o
```

Flag: `KashiCTF{rm_rf_no_preserve_root_Am_1_Right??_No_Err0rs_4ll0wed_Th0}`
