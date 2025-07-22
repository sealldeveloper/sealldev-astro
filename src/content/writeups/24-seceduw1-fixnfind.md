---
title: "Fin 'n' find"
description: "One of the employees, Layton, has taken you aside, and is wondering if you can help fix a zip file that they broke. There seems to be some sensitive information hidden inside of it, we might as well have a look at this too (it's within scope) ;)"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "forensics"
author: "sealldev & finnersio"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



We are given a zip `files.zip`.

I extract the zip's data with `7z`:
```bash
$ 7z x files.zip
7-Zip [64] 16.02 : Copyright (c) 1999-2016 Igor Pavlov : 2016-05-21
...

Scanning the drive for archives:
1 file, 258185 bytes (253 KiB)

Extracting archive: files.zip
WARNING:
files.zip
The archive is open with offset

--
Path = files.zip
Warning: The archive is open with offset
Type = zip
Physical Size = 258185

ERROR: Headers Error : random_files
                   
Sub items Errors: 1

Archives with Errors: 1

Sub items Errors: 1
```

It extracts to a `random_files` folder, with some errors.

I then run a basic `grep -iR` to recursively search all the files for the flag.

```bash
$ grep -iR 'SECEDU' .           
be32dd5e3b6c8748.txt:SECEDU{w04h!_th4t_w45_c0mpre55ing}
```

Well, all done!

Flag: `SECEDU{w04h!_th4t_w45_c0mpre55ing}`