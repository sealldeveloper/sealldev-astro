---
title: "Conflict Crusher"
description: "Awakened by Lena Starling, you, the legendary Space Cowboy, must assist the Minutemen in their fight against the Frontier Board. Their intercepted data streams hold vital intelligence but are riddled with conflicting keys. Use your skills to resolve these conflicts and unify the data to aid the resistance!"
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "coding"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



We need to combine two dict's, when conflicting keys occur overwrite the value in the first dict with the one from the second. We are given them in strings.

String Dict input: {'a': 1, 'b': 2, 'c': 3}, {'b': 4, 'd': 5}

Merged Output: {'a': 1, 'b': 4, 'c': 3, 'd': 5} 

```python
# Input two dictionaries as strings
dict1_str = input()
dict2_str = input()

# Write your solution below and make sure to print the dictionary
from json import loads
d1 = loads(dict1_str.replace("'", "\""))
d2 = loads(dict2_str.replace("'", "\""))
dout = d1

for k in d2.keys():
    dout[k] = d2[k]

print(dout)
```

Flag: `HTB{n0w_1m_0ff1c4lly_4_c0nfl1ct_crunch3r_y4y!_4050aff36d539d4441180a9616746b56}`