---
title: "Destination"
description: "Interesting, Layton has popped up once or twice before... Why does he have encrypted data? He seems like the kind of guy to use fairly common passwords, I'm sure he can't be too malicious. But, what could his involvement be? What secrets is he hiding? **There is no requirement to brute-force infra here, please avoid doing so** Search for the flag by decrypting the data.\n\n`http://files.secedu.site/`"
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



Looking at Layton's files, we have that `encryptedfiles.txt` to use... What's inside?

```
Dumping ./chunk_aa.enc:
00000000: 3689 0f21 6ef1 9ffc cb4d 8233 2776 c502  6..!n....M.3'v..
00000010: daaa 4ee7 c605 88bf 14fb 1a84 724d 3bbb  ..N.........rM;.
00000020: 6ec7 94fa db29 d4ae 6e89 c1c1 5aff e1d5  n....)..n...Z...
00000030: 3af0 249e 24fa 9921 082c 9bb8 6524 5569  :.$.$..!.,..e$Ui
00000040: fa97 a11c bb05 9c9e 8666 03a0 5b55 66fe  .........f..[Uf.
00000050: b29c 48bc a94c 3ae4 1558 1021 a498 69e1  ..H..L:..X.!..i.
00000060: 05f2 e676 c9ff 7bae f6e2 0705 aa64 4e8a  ...v..{......dN.
00000070: ca86 b112 71ae 90cf 4e59 8c9e 251a 64ba  ....q...NY..%.d.
00000080: fcc4 1bf6 d242 4b02 1484 b82c 18ba 30b6  .....BK....,..0.
00000090: c851 6167 6e49 1f30 98a8 6718 eb5f dee3  .QagnI.0..g.._..
000000a0: 65cc 0f96 9675 1f01 265c dc90 4a13 1d75  e....u..&\..J..u
000000b0: 74f0 c451 7812 908c f596 6f11 38b7 1cb3  t..Qx.....o.8...
000000c0: 9106 a4e6 8f6f 266c b52c 44f1 4a31 4dbc  .....o&l.,D.J1M.
...
Dumping ./chunk_be.enc:
00000000: 5de3 2376 13a9 2ae1 036e 06bf 6ed4 7494  ].#v..*..n..n.t.
00000010: a4a3 311f bc0a 95fe 5772 1022 53ae 50cb  ..1.....Wr."S.P.
00000020: 3d75 77bc dc9d 30f3 24cf 3e68 25dd e96f  =uw...0.$.>h%..o
00000030: d14e e25a 27bb a5f2 54ea 7b9c 8297 93d3  .N.Z'...T.{.....
00000040: bf2b a7b4 8317 72f5 e7cf aff6 0ad3 a9f9  .+....r.........
00000050: 2735 686d 445a cc18 cb6b c8d5 bd43 ea2c  '5hmDZ...k...C.,
00000060: ffdc 1f04 dbaf 8c73 542c 4aca 0d25 330b  .......sT,J..%3.
00000070: 93b0 46fe 53e6 0319 2d71 ff73 99a4 54fe  ..F.S...-q.s..T.
00000080: 08b5 5e6b 7848 4bca 3dce 0b73 75e7 76a0  ..^kxHK.=..su.v.
00000090: 9eb6 4510 e954 732d afde 851d 36cd 7f91  ..E..Ts-....6...
000000a0: d305 9ecb f223 b374 3ee1 a9bc b87d 9819  .....#.t>....}..
000000b0: 518a 2abb 3d22 71d3 e85c 5e14 f17e ade1  Q.*.="q..\^..~..
000000c0: c299 2282 0c7f 52e3 4acd d0da b36e 53be  .."...R.J....nS.
000000d0: 2a40 7dfe e8d8 6af1 e970 560e d34d 5306  *@}...j..pV..MS.
000000e0: e038 d620 b1c6 4943 d2ce a08e 152a 7af2  .8. ..IC.....*z.
000000f0: 2eab a868 1d8d 840f b3d2 0faf bb7e 3903  ...h.........~9.
```

Seems to be lots of... encrypted chunks! Pulling them down they seem to be encrypted with a key of some kind... Where have we seen that before...?

We have an SSH key from [last weeks challenge `Vaulting`](24-seceduweek2-vaulting), but it's protected by a password, after a lot of searching we found that neither johntheripper nor hashcat can crack this, it's just not supported (yet).

My teammate (the goat) found a tool to try to crack the PEM, [crackpkcs8](https://github.com/chipx0r/crackpkcs8).

I compile this on Linux and execute it against the key with the `rockyou.txt` wordlist and the key pops with the password... `password`...
```bash
$ gcc crackpkcs8.c -o crackpkcs8 -lssl -lcrypto -lpthread
$ ./crackpkcs8 -d .../SecLists/Passwords/Leaked-Databases/rockyou.txt key

Dictionary attack - Starting 16 threads

*********************************************************
Dictionary attack - Thread 4 - Password found: password
*********************************************************
```

Great, well that took forever to figure out... Let's extract it!

```bash
$ openssl pkcs8 -in key -out key.out
Enter Password: password
```

We now have our extracted `key.out`!

Let's try decrypt these chunks.

I make a Python script to do this process for me, essentially just grabbing the chunk out, saving it then decrypting them all.

```python
import re
import os
import subprocess

def hex_to_bin(input_file):
    name=''
    with open(input_file, 'r') as infile:
        lines = infile.readlines()
        binary_data = bytearray()
        for line in lines:
            if 'Dumping ./' in line:
                if name == '':
                    name=line.split('./')[1].split(':')[0]
                else:
                    with open(name, 'wb') as outfile:
                        outfile.write(binary_data)
                        outfile.close()
                    binary_data=bytearray()
                    print(f"Combined binary written to {name}")
                    name=line.split('./')[1].split(':')[0]
                continue
            hex_values = re.findall(r'\b[0-9a-fA-F]{4}\b', line)
            binary_data.extend(bytes.fromhex(' '.join(hex_values)))
        with open(name, 'wb') as outfile:
            outfile.write(binary_data)
            outfile.close()
        print(f"Combined binary written to {name}")

def decrypt_chunks():
    for chunk in os.listdir('.'):
        if chunk.endswith('.enc'):
            decrypted_file = f'decrypted_{chunk[:-4]}.bin'
            try:
                subprocess.run(['openssl', 'pkeyutl', '-decrypt', '-inkey', 'key.out', '-in', chunk, '-out', decrypted_file], check=True)
                print(f"Decrypted {chunk} to {decrypted_file}")
            except subprocess.CalledProcessError as e:
                print(f"Error decrypting {chunk}: {e}")

if __name__ == "__main__":
    input_filename = 'chunks.txt'
    hex_to_bin(input_filename)
    decrypt_chunks()
```

Let's read them!
```bash
$ cat decrypted_chunk_*.bin 
Spectr4l, Cipher.

I have left behind a backdoor. You should be able to ssh into it and begin to
extract information from it. I'm probably going to split after this.
We will need to give this data to Encryptor and Maven to see what they can do
with it.

Know any high profile targets that we can target with this??
Wouldn't it be awesome to sell off information of high-value targets to the 
highest bidder. I know of a few intelligence services that would be interested.

Some useful information you might also enjoy is attached below.


Thanks,
XYZ



<<LAYTON PAYDEN COPY>>
FA-A3310 Facial Detection Device

Technical Datasheet Summary
1.0 Device Overview

...

Security is a primary concern for the FA-A3310, especially given its
use in public transportation systems. SECEDU{public_tr4nsp0rt_pwn'd??}
The device employs a variety of hardware and software features to ensure data
integrity and prevent unauthorized access.

Key security features include:

    AES-256 encryption: Secures all communications between the FA-A3310
    and external systems.
    Tamper-resistant hardware: Physical protections are built into
    the device to prevent unauthorized access to internal components.
    Trusted boot process: The device employs a secure boot process
    to ensure that only trusted firmware is executed.
    Firmware integrity checks: Ensures that any updates applied
    to the device are genuine and uncorrupted.
    Secure key storage: Cryptographic keys are stored in a secure
    hardware module, preventing unauthorized access.

8.0 Connectivity and Interfaces

The FA-A3310 features robust networking capabilities, allowing it to
communicate with both loc%   
```

Looking closely you can spot the flag.

Flag: `SECEDU{public_tr4nsp0rt_pwn'd??}`