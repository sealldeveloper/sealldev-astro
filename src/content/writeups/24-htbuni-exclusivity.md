---
title: "Exclusivity"
description: "Welcome back, Space Cowboy. The Minutemen have intercepted a corrupted data stream from the Frontier Board. Hidden within the stream are critical coordinates, buried under duplicate entries caused by the Board's sabotage."
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "coding"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



We have a string of numbers seperated by spaces, we need to remove duplicated and keep the first instance, same order.

String Input: 7 3 7 9 1 3 5 9

String Expected Output: 7 3 9 1 5 

```python
# take in the number
n = input()

# calculate answer
n = n.split()

out = list()

for i in n:
    if i not in out:
        out.append(i)

# print answer
print(' '.join(out))
```

Flag: `HTB{r3m0v1ng_dup5_15_s0_345y_1F_y0u_kn0w_h0w_t0_c0d3!_39fc50047f44d15a5f103b58ea7d2056}`