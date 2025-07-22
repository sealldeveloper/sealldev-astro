---
title: "infinite-loop"
description: "I found this google form but I keep getting stuck in a loop! Can you leak to me the contents of form and the message at the end so I can get credit in my class for submitting? Thank you!"
pubDate: 2024-02-19
ctf: "LACTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-lactf/icon.gif"
---

Working through the form we can see, it is indeed an infinite loop, we get stuck on this question:

![infloop-1.png](images/24-lactf/infloop-1.png)

Looking inside the source code, at the bottom, I spot something of interest in the `script` tag.

![infloop-2.png](images/24-lactf/infloop-2.png)

It seems our flag is right there in 2 parts!

Flag: `lactf{l34k1ng_4h3_f04mz_s3cr3tz}`

**Files:** [Form (Potentially Down in future)](https://docs.google.com/forms/d/e/1FAIpQLSfgUDWRzgkSC2pppOx_SVdw1E9bpVVWUkvQssmWza11pufMUQ/viewform?usp=sf_link)