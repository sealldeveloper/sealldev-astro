---
title: "Weighted Starfield"
description: "The Frontier Starfield signals are destabilized by weighted anomalies. As Space Cowboy, your mission is to restore stability by calculating the maximum stability score from the modified energy signals."
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "coding"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



Input:

signals = [1, -2, 3, -4]

weights = [2, 3, -1, 4] 

 Output:

48

Explanation:

To compute the maximum stability score, follow these steps:

    Calculate the modified signals:
        1 × 2 = 2
        -2 × 3 = -6
        3 × -1 = -3
        -4 × 4 = -16
    The modified signals are:
    [2, -6, -3, -16]
    Find the maximum product of any contiguous subarray:
        Subarray
        [2] : Product = 2
        Subarray
        [-6] : Product = -6
        Subarray
        [2, -6] : Product = -12
        Subarray
        [-3, -16] : Product = 48
    The maximum product is 48, which occurs for the subarray
    [-3, -16]


```python
# Input two arrays as strings
from json import loads
signals = loads(input())  # First input array as a string
weights = loads(input())  # Second input array as a string

# Write your solution below and make sure to print the maximum stability score
mod = []
for i in range(len(signals)):
    mod.append(signals[i] * weights[i])

max_so_far = mod[0]
max_ending_here = mod[0]
min_ending_here = mod[0]

for i in range(1, len(mod)):
    temp_max = max(mod[i], max_ending_here * mod[i], min_ending_here * mod[i])
    min_ending_here = min(mod[i], max_ending_here * mod[i], min_ending_here * mod[i])
    max_ending_here = temp_max
    
    max_so_far = max(max_so_far, max_ending_here)

print(max_so_far)
```

Flag: `HTB{m1ssi0n_c0mpl3t3d_m4x1mum_5t4b1l1ty_4ch13v3d!_33e248007c13d87012bb14a5f21957c8}`