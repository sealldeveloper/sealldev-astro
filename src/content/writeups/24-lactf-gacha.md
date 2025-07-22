---
title: "gacha"
description: "All my friends have been getting into genshin and honkai recently and keep sending me pictures. However, they keep hiding their favorite characters, demanding for more money for their gacha pulls. Can you free zhongli my waifu???"
pubDate: 2024-02-19
ctf: "LACTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-lactf/icon.gif"
---

Firstly, the `package.sh` supplied shows that the images were given (`owo.png` and `uwu.png` of particular interest), are both 'enciphered' with the same key, and we can see they write the flag to the image `uwu.png`.

```sh
...
magick img/uwu.png \
    -weight 50000 -fill red -pointsize 96 \
    -draw "text 50,540 '`cat flag.txt`'" \
    PNG24:flag.png

magick img/owo.png -encipher secret.key chall/owo.png
magick flag.png -encipher secret.key chall/uwu.png
...
```

Looking online for security issues with encoding two images with the same key, I come across a [discussion on StackExchange](https://crypto.stackexchange.com/questions/88430/how-to-decrypt-two-images-encrypted-using-xor-with-the-same-key) and in a reply to the question is a [PasteBin with some python code](https://pastebin.com/CWkGcRjw) which should do what were asking.

I utilise this code with our two images and it works perfectly, giving us our new and improved, readable image!

![gacha-1.png](images/24-lactf/gacha-1.png)

Flag: `lactf{zh0ng_17_x_ch7ld3_b4t_w7th_x0r}`