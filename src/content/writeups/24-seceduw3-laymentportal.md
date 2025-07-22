---
title: "Layment Portal"
description: "There is something else they want to quickly test -- a portal where the employees enter their hours. They're worried that Layton may have also tricked the system somehow, and recieved more pay than they had wanted to give out. Automation for this company is a bane..\n\n`nc chals.secedu.site 5005`\nHint: Who might have access to this employee portal?"
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



When connecting to the instance, we are given this:
```bash
$ nc chals.secedu.site 5005
New session started
LOGIN >
```

Thinking of some usernames from earlier, I think of **Layton**! We try:
```
layton
Layton
laypay
lpayden
laytonpayden
layton_payden
LaytonPayden
LPayden
```
But, its `LAYTON` that opens the puzzle, great...

```bash
$ nc chals.secedu.site 5005
New session started
LOGIN > LAYTON
Welcome. You may "add" hours to your worksheet here
```

We can `add` hours, ok!

```bash
> add
You have added an hour. You are now on 4 hours.
```

If we keep entering `add` we hit the following: `Too many hours entered (35 is the max). Resetting to zero.`

OK, let's open two instances and try to exploit a potential race-condition, we work it up to 35 and then enter two `add`'s:
```bash
> add
You have added an hour. You are now on 37 hours.
SECEDU{st0l3n_funds_h3r3}
```

Flag: `SECEDU{st0l3n_funds_h3r3}`