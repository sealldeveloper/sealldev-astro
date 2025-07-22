---
title: "Corporate Life 2"
description: "The disgruntled employee also stashed some company secrets deep within the database, can you find them out?"
pubDate: 2025-02-27
ctf: "KashiCTF 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-kashi/icon.png"
---



Same process as [Corporate Life 1](25-kashi-corporatelife1) getting to `/v2-testing` but the SQLi requires UNION injection to view the contents of another table.

We can try and list the tables (I did this on the [Corporate Life 1](25-kashi-corporatelife1) instance assuming the flag was stored on both), I identified it was SQLite using a payload from PayloadAllTheThings for [DBMS Identification](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection#dbms-identification).

![corplife2-1.png](images/25-kashi/corplife2-1.png)

Now that we know the table is called `flags` and has columns `request_id` and `secret_flag`, we can dump the contents.

![corplife2-2.png](images/25-kashi/corplife2-2.png)

Flag: `KashiCTF{b0r1ng_old_c0rp0_l1f3_am_1_r1gh7_FbU5cNXH}`
