---
title: "ghost in the shell"
description: ""
pubDate: 2024-06-26
ctf: "SCONES 2024"
category: "hardware"
author: "sealldev"
section: "CTFs"
image: "images/24-scones/icon.png"
---

This challenge was, to put it lightly... *fucked* (thank you Tom). Me and boggle had to get a not-insignificant amount of help with this challenge to get it.

We can use the `flash.hex` or `0.hex.bin` inside Ghidra to reverse engineer it.

It can be loaded in with the language `avr8:LE:16:default (1.3)`. When analysing make sure to check **all experimental options**.

Inside `Tools > Search Strings...` there is a suspicious string at `code:02ad`: `9veUA2Ex6I2'HaxCa3UgP}1\na67c3b==7a*h2FaaXYa@7f2haCY6svw@jc32ax7hth#fYa_u_-7a6axan1Ars5Yf@5ax?Ax2v311}4a6{a0`.

There is some code that interacts with it at `LAB_code_0268`.

```c
    Y = &DAT_mem_855a;
    R17R16 = (byte *)0x6;
    while( true ) {
      Z = Y;
      Y = Y + 3;
      R17R16._1_1_ = *Z;
      if (R17R16._1_1_ == 0) break;
      R25R24 = (byte *)FUN_code_0100((char *)R25R24,R23R22,R21R20,R19R18);
      R25R24._0_1_ = R17R16._1_1_ ^ (byte)R17R16;
      FUN_code_010f(R25R24,R23R22,R21R20,R19R18,R17R16,R15R14);
      R23R22 = 0x46;
      R25R24 = (byte *)FUN_code_0133(0,0x46);
    }
  } while( true );
}
```

Reading this code out it does the following.
- Define `Y` as the suspicious string.
- Define `R17R16` as `6`.
- Start a new loop until a value `0` is hit.

Inside the loop:
- Define `Z` as the previous iterations `Y` value (if no previous `0`).
- Increment `Y` by 3.
- XOR the `Y`th character of the string by `R17R16` (`6`)

So, if we XOR the string by `6`, then get every 3rd character starting at 0, we should find the flag!

I do the XOR with CyberChef:
```
?pcSG4C~0O4!Ng~Eg5SaV{7Zhg01e5d;;1g,n4@gg^_gF1`4ngE_0upqFle54g~1nrn%`_gYsY+1g0g~gh7Gtu3_`F3g~9G~4p577{2g0}g6
```

I do some quick Python to get the flag:
```python
>>> chars="?pcSG4C~0O4!Ng~Eg5SaV{7Zhg01e5d;;1g,n4@gg^_gF1`4ngE_0upqFle54g~1nrn%`_gYsY+1g0g~gh7Gtu3_`F3g~9G~4p577{2g0}g6"
>>> for x in range(0,len(chars),3):
...     print(chars[x],end="")
... 
?SCONES{h1d1ng_1n_pl41n_s1ght_39472}
```

Flag: `SCONES{h1d1ng_1n_pl41n_s1ght_39472}`