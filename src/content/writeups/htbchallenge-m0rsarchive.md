---
title: "M0rsarchive"
description: "Just unzip the archive ... several times ..."
pubDate: 2024-03-06
author: "sealldev"
section: "HackTheBox"
tags: ["easy", "hackthebox-challenge"]
---

**Challenge created by:** [lebik](https://app.hackthebox.com/users/22280)

After opening the ZIP, we are immediately given two files:
```
$ ls
flag_999.zip pwd.png
```

We can assume that the password is visually stored in `pwd.png`, so looking at the file we can see the following:

![pwd.png](images/htb/challenges/m0rsarchive/pwd.png)

Looking at the dots and dashes, morse code is the first thing in my mind, this decodes to `9` which is the correct password, in the next `pwd.png` we can see it can have multiple rows.

![pwd2.png](images/htb/challenges/m0rsarchive/pwd2.png)

Time to start writing a script, so the actions we need to do in order are:
1. Check the next ZIP file exists (eg. `flag_987.zip`).
2. Read the new `pwd.png`.
3. Parse the image into morse code, then into text.
4. Use the morse code as a password for the new zip.
5. Repeat until fails.

After a bit of crafting, I made this script:

```py
import os
import zipfile
from cv2 import imread
from morse3 import Morse

def parseMorse(name):
    im=imread(name)
    w,h,ch=im.shape
    pword=""
    for x in range(w):
        m=""
        for y in range(h):
            if im[x][y][0] != im[0][0][0]:
                m+="1"
            else: m+="0"
        if '1' in m:
            m=m.replace('111','-').replace('1','.').replace('0','')
            pword+=Morse(m).morseToString()
    return pword

def zipOpen(name,pword):
    with zipfile.ZipFile(name,'r') as f:
        f.extractall(path="../",pwd=pword.encode('utf-8'))
        f.close()


newZip=True   
os.chdir('flag')
cur_int=999   
while newZip:
    cur_f=f'flag_{cur_int}.zip'
    if os.path.isfile(cur_f):
        print(f'Doing {cur_f}...')
        pword=parseMorse('pwd.png')
        print(pword)
        zipOpen(cur_f,pword)
        cur_int-=1
    else: newZip=False
```

I start running the script:
```
$ python3 main.py
Doing flag_999.zip...
9
Doing flag_998.zip...
08
Doing flag_997.zip...
376
...
```

Wait about 5 minutes...

```
Doing flag_3.zip...
e5ikp56dxhypoznwlq5ts1c7a6
Doing flag_2.zip...
278er7uxqo17ge0rp89827brp2
Doing flag_1.zip...
pp4ij1o3vhv1688hjuc0z2soyt
Doing flag_0.zip...
7920
```

Once complete we see a `flag` file, which contains the flag.

```
$ cd flag
$ cat flag
HTB{D0_y0u_L1k3_m0r53??}
```

Flag: `HTB{D0_y0u_L1k3_m0r53??}`

![Success](images/htb/challenges/m0rsarchive/submitted.png)