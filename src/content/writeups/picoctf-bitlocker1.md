---
title: "Bitlocker-1"
description: "Jacky is not very knowledgable about the best security passwords and used a simple password to encrypt their BitLocker drive. See if you can break through the encryption! Download the disk image here\n\nHint: Hash cracking"
pubDate: 2025-03-18
category: "forensics"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
image: "./images/picoctf/bitlocker2/icon.png"
---

We start with a `bitlocker-1.dd`, running file on it, we are told the following:
```bash
$ file bitlocker-1.dd
bitlocker-1.dd: DOS/MBR boot sector, code offset 0x58+2, OEM-ID "-FVE-FS-", sectors/cluster 8, reserved sectors 0, Media descriptor 0xf8, sectors/track 63, heads 255, hidden sectors 124499968, FAT (32 bit), sectors/FAT 8160, serial number 0, unlabeled; NTFS, sectors/track 63, physical drive 0x1fe0, $MFT start cluster 393217, serial number 02020454d414e204f, checksum 0x41462020
```

It's a Windows DOS mount, specifically a few sectors include an NTFS and a FAT32 partition.

Trying to mount it won't work as indicated by the challenge name and description, it's encrypted with bitlocker!

Doing some research on hacking Bitlocker, a mentioned tool is [BitCracker](https://github.com/e-ago/bitcracker). The hash cracker I can't get to compile, but the hash extraction works well!

After compiling with the given steps (ignoring errors for the cracker) we can use `bitcracker-hash` to get the hashes!
```bash
$ ./bitcracker_hash -i bitlocker-1.dd

---------> BitCracker Hash Extractor <---------
Encrypted device ../../../bitlocker-1.dd opened, size  100.00 MB

************ Signature #1 found at 0x3 ************
Version: 8
Invalid version, looking for a signature with valid version...

************ Signature #2 found at 0x2195000 ************
Version: 2 (Windows 7 or later)

=====> VMK entry found at 0x21950c5
Encrypted with Recovery Password (0x21950e6)
Searching for AES-CCM (0x2195102)...
        Offset 0x2195195.... found! :)
======== RP VMK #0 ========
RP Salt: 2b71884a0ef66f0b9de049a82a39d15b
RP Nonce: 00be8a46ead6da0106000000
RP MAC: a28f1a60db3e3fe4049a821c3aea5e4b
RP VMK: a1957baea68cd29488c0f3f6efcd4689e43f8ba3120a33048b2ef2c9702e298e4c260743126ec8bd29bc6d58

=====> VMK entry found at 0x2195241
Encrypted with User Password (0x2195262)
VMK encrypted with AES-CCM
======== UP VMK ========
UP Salt: cb4809fe9628471a411f8380e0f668db
UP Nonce: d04d9c58eed6da010a000000
UP MAC: 68156e51e53f0a01c076a32ba2b2999a
UP VMK: fffce8530fbe5d84b4c19ac71f6c79375b87d40c2d871ed2b7b5559d71ba31b6779c6f41412fd6869442d66d

************ Signature #3 found at 0x2c1d000 ************
Version: 2 (Windows 7 or later)

=====> VMK entry found at 0x2c1d0c5
Encrypted with Recovery Password (0x2c1d0e6)
Searching for AES-CCM (0x2c1d102)...
        Offset 0x2c1d195.... found! :)

This VMK has been already stored...quitting to avoid infinite loop!

User Password hash:
$bitlocker$0$16$cb4809fe9628471a411f8380e0f668db$1048576$12$d04d9c58eed6da010a000000$60$68156e51e53f0a01c076a32ba2b2999afffce8530fbe5d84b4c19ac71f6c79375b87d40c2d871ed2b7b5559d71ba31b6779c6f41412fd6869442d66d

Recovery Key hash #0:
$bitlocker$2$16$2b71884a0ef66f0b9de049a82a39d15b$1048576$12$00be8a46ead6da0106000000$60$a28f1a60db3e3fe4049a821c3aea5e4ba1957baea68cd29488c0f3f6efcd4689e43f8ba3120a33048b2ef2c9702e298e4c260743126ec8bd29bc6d58

Output file for user password attack: "hash_user_pass.txt"

Output file for recovery password attack: "hash_recv_pass.txt"
```

We can now try to crack the User Password hash with JohnTheRipper!
```bash
 john --wordlist=/Users/noahcooper/Documents/Wordlists/SecLists/Passwords/Leaked-Databases/rockyou.txt hash_user_pass.txt
Warning: detected hash type "BitLocker", but the string is also recognized as "BitLocker-opencl"
Use the "--format=BitLocker-opencl" option to force loading these as that type instead
Using default input encoding: UTF-8
Loaded 1 password hash (BitLocker, BitLocker [SHA-256 AES 32/64])
Cost 1 (iteration count) is 1048576 for all loaded hashes
Note: This format may emit false positives, so it will keep trying even after
finding a possible candidate.
Press 'q' or Ctrl-C to abort, almost any other key for status
jacqueline       (?)
...
Session completed
```

We get a potential password `jacqueline`, and we now need to try to decrypt it with that password.

Using `dislocker` we can extract the files!
```bash
$ dislocker -ujacqueline bitlocker-1.dd ./mnt
$ ls ./mnt
dislocker-file
$ file mnt/dislocker-file
mnt/dislocker-file: DOS/MBR boot sector, code offset 0x52+2, OEM-ID "NTFS    ", sectors/cluster 8, Media descriptor 0xf8, sectors/track 63, heads 255, hidden sectors 124499968, dos < 4.0 BootSector (0x80), FAT (1Y bit by descriptor); NTFS, sectors/track 63, sectors 204799, $MFT start cluster 8533, $MFTMirror start cluster 2, bytes/RecordSegment 2^(-1*246), clusters/index block 1, serial number 0804e24974e2487cc; contains bootstrap BOOTMGR
```

Looks like a working drive! I now put this drive onto a Windows VM to mount with Autopsy.

Inside the root of the drive is a `flag.txt` containing the flag!

Flag: `picoCTF{us3_b3tt3r_p4ssw0rd5_pl5!_3242adb1}`