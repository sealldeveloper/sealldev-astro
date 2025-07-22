---
title: "Word Wrangler"
description: "The Frontier Archives have sent an encrypted ancient text. As Space Cowboy, your task is to decode it by identifying the most frequently used word. This crucial word could unlock secrets vital to the resistance."
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "coding"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



Input:
"The quick brown fox jumps over the lazy dog. The dog barks at the fox!"

Output:
the 

Get the most common words in a string, ignore punctuation and capitalisation.

```python
# Input the text as a single string
input_text = input()  # Example: "The quick brown fox jumps over the lazy dog."

# Write your solution below and make sure to print the most common word
words = (''.join([l for l in input_text.lower() if l.islower() or l == ' '])).split(' ')

from collections import Counter
counter = Counter(words)

print(counter.most_common(1)[0][0])
```

Flag: `HTB{pfupp_wh0_m4d3_th353_345y_ch4ll3ng35_ch1ld1sh!_f6a57597470925970e2cf3eba4cf119c}`