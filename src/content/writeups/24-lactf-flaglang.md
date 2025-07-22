---
title: "flaglang"
description: "Do you speak the language of the flags?"
pubDate: 2024-02-19
ctf: "LACTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-lactf/icon.gif"
---

Looking at Flaglang it is a plain website where we can select countries and see 'Hello world' in various languages, at the very top is an interesting option, Flagistan.

![flaglang-1.png](images/24-lactf/flaglang-1.png)

Looking at the source code provided we can see that the countries are stored in YAML and the country 'Flagistan' seems to deny all country codes.

Scrolling through the YAML I notice that 'NO' for Norway is highlighted blue.

![flaglang-2.png](images/24-lactf/flaglang-2.png)

YAML seems to parse YES/NO as objects like true/false rather than strings, so we can cause the server to load an invalid object (which isn't on Flagistans deny list), allowing us to render the flag!

![flaglang-3.png](images/24-lactf/flaglang-3.png)

Bam! We can see the flag!

Flag: `lactf{n0rw3g7an_y4m7_f4ns_7n_sh4mbl3s}`