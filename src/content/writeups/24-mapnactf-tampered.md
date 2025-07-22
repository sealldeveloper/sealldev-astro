---
title: "Tampered"
description: "Our MAPNA flags repository was compromised, with attackers introducing one invalid flag. Can you identify the counterfeit flag?\n\nNote: Forgot the flag format in the rules pages, just find the tampered one. You are not allowed to brute-force the flag in scoreboard, this will result in your team being blocked."
pubDate: 2024-01-22
ctf: "MapnaCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-mapnactf/icon.png"
---

Looking through the given files, we are given a very long list of flags.

Basics scan show nothing out of the ordinary in flag format or length, so I look into the newlines after each flag.

I write a basic script to split all lines by the common ending `\r\r\n` and if any of the strings don't meet the expected length, to print them.

```python
with open('flags.txt','rb') as f:
    d=f.read().split(b'\r\r\n')
    for x in d:
        if x != b'':
            if len(x) != 47:
                print(x)
```

```
$ python3 check.py
b'MAPNA{Tx,D51otN\\eUf7qQ7>ToSYQ\\;5P6jTIHH#6TL+uv}\r\n\rMAPNA{R6Z@//\\>caZ%%k)=ci3$IyOkSGK%w<"V7kgesY&k}’
```

We can see one flag ends with `\r\n\r`, which is our out of place flag.

Flag: `MAPNA{Tx,D51otN\\eUf7qQ7>ToSYQ\\;5P6jTIHH#6TL+uv}`

**Files:** [tampered_6fb083f974d05371cef19c0e585ba5c59da23aa8.txz](https://web.archive.org/web/20240121174053/https://mapnactf.com/tasks/tampered_6fb083f974d05371cef19c0e585ba5c59da23aa8.txz)
