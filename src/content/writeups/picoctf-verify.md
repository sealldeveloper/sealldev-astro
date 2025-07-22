---
title: "Verify"
description: "People keep trying to trick my players with imitation flags. I want to make sure they get the real thing! I'm going to provide the SHA-256 hash and a decrypt script to help you know that my flags are legitimate. You can download the challenge files here: challenge.zip.\nThe same files are accessible via SSH here: ssh ... Using the password .... Accept the fingerprint with yes, and ls once connected to begin. Remember, in a shell, passwords are hidden!\nChecksum: fba9f49bf22aa7188a155768ab0dfdc1f9b86c47976cd0f7c9003af2e20598f7\nTo decrypt the file once you've verified the hash, run ./decrypt.sh files/[file]."
pubDate: 2024-03-27
category: "forensics"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

Looking locally at the files, there is a `checksum.txt`, a `decrypt.sh` and a folder of semeingly encrypted files in `files/`.

Reading `decrypt.sh` we would have to manually execute it on each file to get the output:
```bash
#!/bin/bash

# Check if the user provided a file name as an argument
if [ $# -eq 0 ]; then
    echo "Expected usage: decrypt.sh <filename>"
    exit 1
fi

# Store the provided filename in a variable
file_name="$1"

# Check if the provided argument is a file and not a folder
if [ ! -f "/home/ctf-player/drop-in/$file_name" ]; then
    echo "Error: '$file_name' is not a valid file. Look inside the 'files' folder with 'ls -R'!"
    exit 1
fi

# If there's an error reading the file, print an error message
if ! openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -salt -in "/home/ctf-player/drop-in/$file_name" -k picoCTF; then
    echo "Error: Failed to decrypt '$file_name'. This flag is fake! Keep looking!"
fi
```

Let's modify this script to recursively check each file.
```bash
#!/bin/bash

for i in files/*
do
# If there's an error reading the file, print an error message
if openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -salt -in "$i" -k picoCTF 2>/dev/null; then
    echo "$i"
fi
done
```

I added the `2>/dev/null` to shutup the continous flood of `bad magic number` errors that is sent for invalid files.

Running the script we get this!
```
$ ./decrypt.sh
picoCTF{trust_but_verify_87590c24}
files/87590c24
```

Flag: `picoCTF{trust_but_verify_87590c24}`