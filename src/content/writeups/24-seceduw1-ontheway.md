---
title: "On the way!"
description: "On our way to the main office, one of the employees sent us this photo, telling us that we needed to stop by on our way down. But unfortunately, they forgot to tell us where this was. Nice. Where abouts was this photo taken? Wrap in `SECEDU{}`. If it's a city with one or more words, space with \"_\". \nHint: Don't forget to capitalise the city name"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev & tulip"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



We are supplied a `photo.jpg`.

We can run exiftool on this picture to extract out any EXIF data.

```
$ exiftool photo.jpg
ExifTool Version Number         : 12.70
File Name                       : photo.jpg
Directory                       : /home/n/Downloads
File Size                       : 1836 kB
File Modification Date/Time     : 2024:09:12 23:07:47+10:00
File Access Date/Time           : 2024:09:12 23:07:47+10:00
File Inode Change Date/Time     : 2024:09:12 23:07:49+10:00
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
Exif Byte Order                 : Little-endian (Intel, II)
Make                            : Google
Camera Model Name               : Pixel 6
Orientation                     : Horizontal (normal)
...
GPS Date/Time                   : 2024:08:28 06:01:53Z
GPS Latitude                    : 31 deg 25' 44.58" S
GPS Longitude                   : 152 deg 54' 30.37" E
...
GPS Position                    : 31 deg 25' 44.58" S, 152 deg 54' 30.37" E
...
```

Reading the headers, the `GPS` headers are storing the position of the photo being taken.

This can be converted to a [Google Maps URL](https://www.google.com/maps/place/-31.42905,152.90843
), which showcases its **Port Macquarie**.

Flag: `SECEDU{Port_Macquarie}`