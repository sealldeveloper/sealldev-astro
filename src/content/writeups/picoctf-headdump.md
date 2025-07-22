---
title: "head-dump"
description: "Welcome to the challenge! In this challenge, you will explore a web application and find an endpoint that exposes a file containing a hidden flag. The application is a simple blog website where you can read articles about various topics, including an article about API Documentation. Your goal is to explore the application and find the endpoint that generates files holding the server’s memory, where a secret flag is hidden.\n\nHint: Explore backend development with us\nHint: The head was dumped."
pubDate: 2025-03-20
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
# image: "./images/picoctf/bitlocker2/icon.png"
---

We start with a web instance showing some PicoCTF promo:
![home.png](images/picoctf/headdump/home.png)

Reading through the source code, a specific segment catches my eye:
```html
...
<!-- Message -->
<div class="mb-4">
    <p class="text-gray-800">Explore backend development with us <a href="" class="text-blue-600">#nodejs</a> ,
        <a href="" class="text-blue-600">#swagger UI</a> , <a href="/api-docs" class="text-blue-600 hover:underline">#API Documentation</a> 
    </p>
</div>
...
```

There is a hidden endpoint `/api-docs`!

Visiting it is a Swagger UI:
![swagger.png](images/picoctf/headdump/swagger.png)

Inside the docs is a `/heapdump` endpoint!
![heapdump.png](images/picoctf/headdump/heapdump.png)

I then used `strings` and `grep` to look for the flag:
```bash
$ strings ~/Downloads/heapdump-1742275987463.heapsnapshot | grep 'pico'
picoCTF{Pat!3nt_15_Th3_K3y_63fa652c}
...
```

Flag: `picoCTF{Pat!3nt_15_Th3_K3y_63fa652c}`
