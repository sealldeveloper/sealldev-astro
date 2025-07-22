---
title: "Energy Crystals"
description: "The ancient Starry Spur has been recovered, but its energy matrix remains dormant. As Space Cowboy, your task is to awaken its power by calculating the combinations of energy crystals that match the required energy level."
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "coding"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



**Example 1:**

Energy Crystals: [1, 2, 3]

Target Energy: 4 

Explanation: There are 4 distinct ways to combine the crystals to reach the target energy level of 4:

    1 + 1 + 1 + 1
    1 + 1 + 2
    2 + 2
    1 + 3

**Example 2:**

Energy Crystals: [2, 5, 3, 6]

Target Energy: 10 

Explanation: There are 5 distinct ways to combine the crystals to reach the target energy level of 10:

    2 + 2 + 2 + 2 + 2
    2 + 2 + 6
    2 + 3 + 5
    2 + 2 + 3 + 3
    5 + 5

```python
# Input energy crystals and target energy as strings
from json import loads
energy_crystals = loads(input())  # Input as a string
target_energy = int(input())  # Input as a string

# Write your solution below and make sure to print the number of ways
dp = [0] * (target_energy + 1)
dp[0] = 1

for crystal in energy_crystals:
    for i in range(crystal, target_energy + 1):
        dp[i] += dp[i - crystal]

print(dp[target_energy])
```

Flag: `HTB{3n34gy_m4tr1x_act1v4t3d_w3_4r3_s4v3d!_bcfb78f9805fa846ebb6521640f079ca}`