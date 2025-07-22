---
title: "Corruption"
description: "Can't seem to open the file. The file was corrupted with operations used through this application: (Link to cyberchef download)."
pubDate: 2024-04-08
ctf: "TamuCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-tamuctf/icon.png"
---

This challenge was a fair bit guessy in my opinion but the solution in the end was found.

We start with a 'corrupted' file which was modified using CyberChef (attached via a download).

I load the file into CyberChef and begin going through the options sequentially (as there was no other indicator of what to do :/ ), until I see an interesting result on 'Rotate right'.

```
...00 F7 FA 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 80 0A 28 A2 ...
```

It seems we have some hex data!

I take out the hex data seperately and decode it and I save the bytes output to a file.

Now, this file is a JPEG and I know JPEGs can be rendered with only partial file content, so I think if I override the 'hex' data with the data we decoded and fixed the magic bytes, we might get a working file.

I open the file in a hex editor and override the bytes with the new ones. I find the JPEG magic bytes online are `FFD8FFE0 00104A46 49460001`, which lines up with the final `01` in the file.

Upon saving we get a working JPEG with the flag inside.

![flag.jpg](images/24-tamuctf/flag.jpg)

Flag: `gigem{uncorrupting_image_files_90812}`