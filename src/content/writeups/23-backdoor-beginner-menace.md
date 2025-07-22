---
title: "Beginner-menace"
description: "Go off now and enjoy the 2 days of unlimited fun."
pubDate: 2023-12-18
ctf: "BackdoorCTF 2023"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/23-backdoor/icon.png"
---

We are supplied a JPEG only, called `friend.jpeg`. My first thought is to check EXIF on the JPEG.

```
$ exiftool friend.jpeg
ExifTool Version Number         : 12.70
File Name                       : friend.jpeg
Directory                       : .
File Size                       : 6.5 kB
File Modification Date/Time     : 2023:12:16 01:26:43+11:00
File Access Date/Time           : 2023:12:16 01:26:46+11:00
File Inode Change Date/Time     : 2023:12:18 22:37:13+11:00
File Permissions                : -rw-rw-r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Exif Byte Order                 : Big-endian (Motorola, MM)
X Resolution                    : 1
Y Resolution                    : 1
Resolution Unit                 : None
Artist                          : flag{7h3_r34l_ctf_15_7h3_fr13nd5_w3_m4k3_al0ng}
Y Cb Cr Positioning             : Centered
Image Width                     : 266
Image Height                    : 190
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 266x190
Megapixels                      : 0.051
```
Looking at the EXIF, the `Artist` entry has the flag for us!

Flag: `flag{7h3_r34l_ctf_15_7h3_fr13nd5_w3_m4k3_al0ng}`

**Files:** [public.zip](https://web.archive.org/web/20231218155548/https://backdoor.infoseciitr.in/uploads?key=935d06c93ab91abc73a5937c28c1c63e61e22f25452166acb106b003806b11c2%2Fpublic.zip)