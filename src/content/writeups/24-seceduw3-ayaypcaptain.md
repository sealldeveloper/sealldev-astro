---
title: "Ay ay, CAPtain"
description: "They've seen how eaisily we decoded their captured message in week 1, and now they've turned up the heat with some random data. Find what they're sending over our network."
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "forensics"
author: "finnersio"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



Only Elite hackers know strings...

```bash
$ strings cap.pcapng | grep 'SEC'
|dar me, to bid you SECEDU{r34ding_pi3c3_by_pi3c3} stay your anger. Juno has sent me, who cares for both of you alike. Cease, then, this brawling, and do not draw your sword; rail at him if you will, and your railing will not be vain, for I tell you- and it shall surely be- that you shall hereafter receive gifts three times as splendid by reason of this present insult. Hold, therefore, and obey."
```

Flag: `SECEDU{r34ding_pi3c3_by_pi3c3}`