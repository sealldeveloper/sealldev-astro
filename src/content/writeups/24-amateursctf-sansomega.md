---
title: "sansomega"
description: "Somehow I think the pico one had too many unintendeds...\nSo I left some more in :)"
pubDate: 2024-04-10
ctf: "AmateursCTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-amateursctf/icon.png"
---

We are given a `shell.py` which is the following:
```python
#!/usr/local/bin/python3
import subprocess

BANNED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\\"\'`:{}[]'


def shell():
    while True:
        cmd = input('$ ')
        if any(c in BANNED for c in cmd):
            print('Banned characters detected')
            exit(1)

        if len(cmd) >= 20:
            print('Command too long')
            exit(1)

        proc = subprocess.Popen(
            ["/bin/sh", "-c", cmd], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

        print(proc.stdout.read().decode('utf-8'), end='')

if __name__ == '__main__':
    shell()
```

Now, I'm very new to attempting a pyjail. So I approached this by, a lot of trial and error. My first thought was to utilise `*` and `./` as all of those symbols are allowed.
```
$ ./*
/bin/sh: 1: ./flag.txt: Permission denied
```

So the flag is in our directory, how to read it?

I remember from messing around with symbols previously that `.` is actually `source`, so can I read the flag with `. ./*`?

```
$ . ./*
/bin/sh: 1: ./flag.txt: amateursCTF{pic0_w45n7_g00d_n0ugh_50_i_700k_som3_cr34t1v3_l1b3rt135_ade8820e}: not found
```

Yes I can!

Flag: `amateursCTF{pic0_w45n7_g00d_n0ugh_50_i_700k_som3_cr34t1v3_l1b3rt135_ade8820e}`