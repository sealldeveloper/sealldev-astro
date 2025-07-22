---
title: "IStG"
description: "The calendar invite has an interesting zip file attached. They very clearly don't want us to see it... What could be inside?"
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



In the [`Secret Meeting?`](24-seceduw2-secretmeeting) we were also given a URL to a ZIP archive: `https://drive.google.com/open?id=1bFNeI2dirzdU6RjFDPo-IGFmR6dtSv-v`

Trying to extract the ZIP, we are asked for a password. After a few various attempts, I find the password from `PSW` to be correct: `0ld-Fa1thful-P@ssw0rd`.

Reading the file from the ZIP, `secret_message.txt` contains a Google Drive URL: `https://drive.google.com/file/d/1Zr1-qoIiNVlG6rfbMptEu5t69vJedgVh/view?usp=drive_link`

Inside that is a `Cat_Message.avi` file with a lot of various coloured pixels.

I use `ffmpeg` to try and extract the frames.

```bash
$ mkdir Cat_Message_frames
$ ffmpeg -i Cat_Message.avi Cat_Message_frames/frame%06d.png
```

After extracting the frames I use a Python script to pull out the relevant data.

```python
import os
from PIL import Image
import numpy as np

def read_image_sequence(directory):
    images = []
    for filename in sorted(os.listdir(directory)):
        if filename.endswith('.png'):
            img = Image.open(os.path.join(directory, filename))
            images.append(np.array(img, dtype=np.uint8))
    return images

def extract_frame_data(images, output_file):
    with open(output_file, 'wb') as f:
        for img in images:
            f.write(img.tobytes())

def main():
    directory = '.'
    output_file = 'out.bin'
    images = read_image_sequence(directory)
    print(f"Total frames: {len(images)}")
    print(f"Image dimensions: {images[0].shape}")
    extract_frame_data(images, output_file)
    print(f"Extracted file size: {os.path.getsize(output_file)} bytes")

if __name__ == "__main__":
    main()
```

I then use `binwalk -e out.bin` to extract the data, which has the following:
```bash
$ ls
 1B000.zip  'Cat Message'
```

Inside is a lot of cat pictures ending with `.png`, I start by searching for other file extensions that are not `.png`.

```bash
$ find . | grep -vE '\.png$'

.
./.cat_0.png.swp
./cat_24213.png_original
```

I check out the `cat_24213.png_original` compared to the `cat_24213.png`.

```
$ exiftool cat_24213.png_original 
ExifTool Version Number         : 12.70
File Name                       : cat_24213.png_original
Directory                       : .
File Size                       : 8.6 kB
File Modification Date/Time     : 2024:08:29 00:00:00+10:00
File Access Date/Time           : 2024:10:01 00:41:24+10:00
File Inode Change Date/Time     : 2024:10:01 00:41:24+10:00
File Permissions                : -rw-r--r--
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 64
Image Height                    : 64
Bit Depth                       : 8
Color Type                      : RGB
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Image Size                      : 64x64
Megapixels                      : 0.004

$ exiftool cat_24213.png  
ExifTool Version Number         : 12.70
File Name                       : cat_24213.png
Directory                       : .
File Size                       : 8.7 kB
File Modification Date/Time     : 2024:08:29 00:00:00+10:00
File Access Date/Time           : 2024:10:01 00:41:24+10:00
File Inode Change Date/Time     : 2024:10:01 00:41:24+10:00
File Permissions                : -rw-r--r--
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 64
Image Height                    : 64
Bit Depth                       : 8
Color Type                      : RGB
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
Author                          : YzR0YTV0cjBwMyEK
Image Size                      : 64x64
Megapixels                      : 0.004
```

The `.png_original` has an interesting `Author` header that looks like Base64: `YzR0YTV0cjBwMyEK`.

Decoded we get `c4ta5tr0p3!`

Flag: `SECEDU{c4ta5tr0p3!}`