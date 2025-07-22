---
title: "CanYouSee"
description: "How about some hide and seek?"
pubDate: 2025-03-09
category: "forensics"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
image: "./images/picoctf/canyousee/ukn_reality.jpg"
---

We are given a `unknown.zip`, once extracted it contains a `ukn_reality.jpg`.

![ukn_reality.jpg](images/picoctf/canyousee/ukn_reality.jpg)

The image has a nice photo as contents, but no flag visible.

We can use exiftool to print metadata about the image.
```
$ exiftool ukn_reality.jpg                                                                                                                                                                                     130 ↵
ExifTool Version Number         : 13.10
File Name                       : ukn_reality.jpg
Directory                       : .
File Size                       : 2.3 MB
File Modification Date/Time     : 2024:03:12 11:05:51+11:00
File Access Date/Time           : 2025:03:06 10:12:46+11:00
File Inode Change Date/Time     : 2025:03:06 10:12:44+11:00
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : inches
X Resolution                    : 72
Y Resolution                    : 72
XMP Toolkit                     : Image::ExifTool 11.88
Attribution URL                 : cGljb0NURntNRTc0RDQ3QV9ISUREM05fM2I5MjA5YTJ9Cg==
Image Width                     : 4308
Image Height                    : 2875
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 4308x2875
Megapixels                      : 12.4
```

The `Attribution URL` contains a Base64 string, once decoded returns the flag. We can use several tools for this, but I use the command line utility `base64`.
```
$ echo "cGljb0NURntNRTc0RDQ3QV9ISUREM05fM2I5MjA5YTJ9Cg==" | base64 -d
picoCTF{ME74D47A_HIDD3N_3b9209a2}
```

Flag: `picoCTF{ME74D47A_HIDD3N_3b9209a2}`

> Note: This could also have been decoded with tools such as CyberChef and Dcode.fr instead of the `base64` utility.