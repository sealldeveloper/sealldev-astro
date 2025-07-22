---
title: "Information"
description: "Files can always be changed in a secret way. Can you find the flag?\n\nHint: Look at the details of the file\nHint: Make sure to submit the flag as `picoCTF{XXXXX}`"
pubDate: 2025-03-13
category: "forensics"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
image: "./images/picoctf/information/cat.png"
---

We are given a `cat.jpg`, opening the file it has no flag visually (but a very nice cat).

![cat.png](images/picoctf/information/cat.png)

I start by using exiftool to extract the metadata of the file:
```bash
ExifTool Version Number         : 13.10
File Name                       : cat.jpg
Directory                       : .
File Size                       : 878 kB
File Modification Date/Time     : 2025:03:13 11:19:36+11:00
File Access Date/Time           : 2025:03:13 11:19:55+11:00
File Inode Change Date/Time     : 2025:03:13 11:19:54+11:00
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.02
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Current IPTC Digest             : 7a78f3d9cfb1ce42ab5a3aa30573d617
Copyright Notice                : PicoCTF
Application Record Version      : 4
XMP Toolkit                     : Image::ExifTool 10.80
License                         : cGljb0NURnt0aGVfbTN0YWRhdGFfMXNfbW9kaWZpZWR9
Rights                          : PicoCTF
Image Width                     : 2560
Image Height                    : 1598
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 2560x1598
Megapixels                      : 4.1
```

The `License` header has a value of interest. It looks like Base64 encoding. We can decode this with various tools (CyberChef, Dcode.fr, etc) but I use the `base64` utility on the command line:
```bash
$ echo "cGljb0NURnt0aGVfbTN0YWRhdGFfMXNfbW9kaWZpZWR9" | base64 -d
picoCTF{the_m3tadata_1s_modified}
```

Flag: `picoCTF{the_m3tadata_1s_modified}`