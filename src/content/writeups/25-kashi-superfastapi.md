---
title: "SuperFastAPI"
description: "Made my verty first API! However I have to still integrate it with a frontend so can't do much at this point lol."
pubDate: 2025-02-27
ctf: "KashiCTF 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-kashi/icon.png"
---



I start by using ffuf and find the `/docs` endpoint using a directory 2.3 medium list from SecLists.

After locating the `/docs` endpoint I see we can:

- Create a user
- Update a user
- Request the flag
- Get a user

If we create a user, trying to request the flag says our role is not an admin (which it isn't)

What we can do is update our user with the 'role' parameter and update our own role.

![superfast1.png](images/25-kashi/superfast1.png)

![superfast2.png](images/25-kashi/superfast2.png)

![superfast3.png](images/25-kashi/superfast3.png)

Flag: `KashiCTF{m455_4551gnm3n7_ftw_XD1FPHGGm}`
