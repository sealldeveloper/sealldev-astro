---
title: "Czech Where?"
description: "Iris visited this cool shop a while back, but forgot where it was! What street is it on?\nFYI: flag is all lowercase and _ for spaces. Please remove all accent marks if there are any. Wrap your answer in irisctf{}."
pubDate: 2024-01-08
ctf: "IrisCTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-irisctf/icon.png"
---

We start with a photo and the challenge to find what street it was on, we are given the following photo:

![Picture of storefront](images/24-irisctf/cw_1.png)

Using some searching on Google Maps, we can find a similar logo but not the same storefront.

Searching "Czech wooden products" online yields [this result](https://www.forpraguelovers.com/en/best/wood-shops-in-prague) (among others).

On this page I spot the logo again, and this time we have a website: [amadea.cz](https://www.amadea.cz/)

![Storefront on website](images/24-irisctf/cw_2.png)

I find the [list of stores](https://www.amadea.cz/en/wooden_shops/) by searching for the domains stores list.

Inside here we see the same storefront from the photo, located at `Prague Castle in Zlatá ulička (Golden Lane), No. 20.`

![The same storefront](images/24-irisctf/cw_3.png)

Looking up the address on Google Maps we are given the full street name: `Zlatá ulička u Daliborky`

There's our flag! 

Flag: `irisctf{zlata_ulicka_u_daliborky}`

**Files:** [czech-where.tar.gz](https://web.archive.org/web/20240107214111/https://cdn.2024.irisc.tf/czech-where.tar.gz)