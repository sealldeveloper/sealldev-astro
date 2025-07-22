---
title: "Finally, an un-strings-able problem"
description: "I inherited this really cursed disk image recently. All the files seem to be corrupted and I can't even read some of them. What the heck is going on?\n\nhttps://cdn.utctf.live/disk.img\n\nBy Sasha (@kyrili on discord)" 
pubDate: 2025-03-17
ctf: "UTCTF 2025"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/25-utctf/icon.png"
---

> This challenge was solved by `thehackerscrew` and was not solved by me, I post-solved it on my own with some information from there channels during the CTF!

We are given a `disk.img` file, I start by running `file` on it:
```bash
$ file disk.img
disk.img: Linux rev 1.0 ext4 filesystem data, UUID=981eb2d5-0400-4c7d-986e-e9c3860666d3 (extents) (64bit) (large files) (huge files)
```

As I'm solving on an M1, I spin up a Kali VM to mount this drive.

```bash
$ sudo mount disk.img /mnt
$ cd /mnt
$ ls -lha 
total 152K
drwxr-xr-x  3 root root 4.0K Mar 12 13:08 .
drwxr-xr-x 19 root root 4.0K Aug 16  2024 ..
--wx---rw-  1 root root 1.1K Mar 12 12:26 1Pe4S76zWpxA8mgI.txt
-rwxr--rwx  1 root root 1.1K Mar 12 12:51 3zkhN7A0Vqe0HgNC.txt
-rw---x-wx  1 root root 1.1K Mar 12 12:49 5UhgLeVLJWuEnc4W.txt
-rw---xr--  1 root root 1.1K Mar 12 12:36 6ReSGoJsRnFqhg7r.txt
-r--rw-r-x  1 root root 1.1K Mar 12 12:50 B7HIyq5CKwGavwaW.txt
-rwx--xr--  1 root root 1.1K Mar 12 12:40 GP4decBqHC6UL66s.txt
-rwx--xr--  1 root root 1.1K Mar 12 12:48 GeDYq3hoIx7oijhO.txt
-rw-rw---x  1 root root 1.1K Mar 12 12:53 HN5vsOJkU4004pEl.txt
-r-x---r-x  1 root root 1.1K Mar 12 12:34 HsxVbSgKw3d7tvFi.txt
--w---xr--  1 root root 1.1K Mar 12 12:52 KEY19YZmg8L92D1H.txt
--wx-wxr--  1 root root 1.1K Mar 12 12:39 LuVzAMVXkpJYAxRM.txt
-rw--w--wx  1 root root 1.1K Mar 12 12:33 OOVH70vCevC3FSZq.txt
--wxr-x-w-  1 root root 1.1K Mar 12 12:23 PtRcxoHyWhhS6z9q.txt
-r--rw--wx  1 root root 1.1K Mar 12 12:25 R6qgmnljCORHERFH.txt
-rw---x-wx  1 root root 1.1K Mar 12 12:41 S5dyoQrp6a8grHOD.txt
--wx--xr-x  1 root root 1.1K Mar 12 12:32 Uljik5BaQPOeMjfc.txt
--wxrw--w-  1 root root 1.1K Mar 12 12:47 Vp7XQiTt4ad9IDfB.txt
-r-xrwxr-x  1 root root 1.1K Mar 12 12:54 W5xw54rLYvyj7qRM.txt
-r---wx-w-  1 root root 1.1K Mar 12 12:45 Z0VC73hFMVt2AcO9.txt
---xr-xr--  1 root root 1.1K Mar 12 12:46 bG0d9OBnfwVP2NS8.txt
--wxr-----  1 root root 1.1K Mar 12 12:31 cDnYAOBE4mvBnh0C.txt
-rw--wx--x  1 root root 1.1K Mar 12 12:29 eiUFiXPDk6oee8sL.txt
-rwxr-xr--  1 root root 1.1K Mar 12 12:35 fGMkb1gANtjLb5Qz.txt
-r-xrwx---  1 root root 1.1K Mar 12 12:30 kY4FOlfPt3qGR17K.txt
----rw-r-x  1 root root 1.1K Mar 12 12:42 kcVtPjZM85b4B3V6.txt
drwx------  2 root root  16K Mar 12 13:08 lost+found
----rw--wx  1 root root 1.1K Mar 12 12:38 lysJisb6wMlPG9WX.txt
-r---wx-wx  1 root root 1.1K Mar 12 12:44 pU2aTHrPpCjthwwi.txt
-rwxr--rw-  1 root root 1.1K Mar 12 12:43 t7WeFKhvlS3e1Yet.txt
----r-xr--  1 root root 1.1K Mar 12 12:27 u70m5b8l2T3vnZHZ.txt
----rwx--x  1 root root 1.1K Mar 12 12:37 uAkL5PqfK2I7K4PE.txt
-rwx-wxrw-  1 root root 1.1K Mar 12 12:28 x9f1QlloTkYd5sfU.txt
-rwx-w---x  1 root root 1.1K Mar 12 12:24 y7Dsjz7CmkvpTA1H.txt
```

Lot's of text files, with strange perms, let's read some for some sample data:
```
$ cat 1Pe4S76zWpxA8mgI.txt 
XGOCyaINZ3GEm2m1oDIJliWfZS6BaG4xzJEN6biTXO3WRHD93HlElIEm6ClOKSOrUJHIxgSFzZxIz6HjYy3WfvAGlBB9dAgE5RhlQedyicbncGgPOoPJ90HoG95gRviWbe3Ta2Ywv6sPokYqnLYQjO2Nd0bvf32SCgw0VKoPaGMMk8ylZxZlDhxmviDQxmnUHO0kShvTYXvHrgwImI6aCjOTvPecgAq2JqmL4OcVQ4ZFWc0ujdBkX7g3QuRT5YrD4a86B1YwZORhzawWvUCoN3iicvkTRvvmRPkFQEeBs28T2tfgtkOKghaGM68SXetizU3yQLc16nQdHvy7w3rY9LyVIBBDx66IkUTQvbuknuzAsVnd1RuvBEZxLyHxxh6d4uoYiV5nFw5rVlC9PKOApaaenWxRa52zzWEEfs3lbhp9ZFDyaAjHp4fqXaKP4PDC1ZHywRFXHdULQjKCzNNe2pN63tpOLnwsesRYhn1gvQvg0pfpdTQbl1FJ1VD3CecO2ihYSeBiHVBZ0BiR621sTN5DIyR3fOZcLO4cqw2on3LxbpaKZJBF0QJJg1QTSDgi2ReFjKhq6HfAN2n1uvitFjt7R2Ud0g1I1G4hStiRPbwoqimaEIwaHyzlFAQjLyjoeK6tU07R1OqVtHiIm6GwgYHxcwFiNbwjlzSJoq6Sc35U4O1iBzVJVoap1xK3vDNuEPBcNhegDwnBV0QJrpBbRjFM5gLTiha5fbcYOReRPbgo0CFforrABHHP5g5eipt3qBzZ04cZL5eHgDaMe4RaxLf2BS956auJuOdkEZU0iiHu97lzJ6VSuwhyFk3JwXA01TRhHuVsYYUrskpjf7iyL3qr11ScdBV79vqzsASfVYLmLYTQWyZKk4oKBlKi316MnX6SsAwdlfsRgEXDnd7DyEU2NRMvstnUt35DpZmPQ67326xQrLZjN4zP8PYuN18HKDYkJLfnngTYD2tJZUcSqF9GWaEvuaCpkgLWj8n3aG8lxwzmYrlPYKak5wFiccBP
```

Looks like some kind of Base64?

All the other files contain similar content.

Checking `lost+found`:
```
# cd lost+found
# ls -lha
total 20K
drwx------ 2 root root  16K Mar 12 13:08 .
drwxr-xr-x 3 root root 4.0K Mar 12 13:08 ..
```

Nada, alrighty!

I spent a decent amount of time confused here, I even loaded the image in Autopsy to see if I was missing anything. Nothing...

The only thing that stood out were the perms?
```bash
$ ls -lha *.txt
--wx---rw- 1 root root 1.1K Mar 12 12:26 1Pe4S76zWpxA8mgI.txt
-rwxr--rwx 1 root root 1.1K Mar 12 12:51 3zkhN7A0Vqe0HgNC.txt
-rw---x-wx 1 root root 1.1K Mar 12 12:49 5UhgLeVLJWuEnc4W.txt
-rw---xr-- 1 root root 1.1K Mar 12 12:36 6ReSGoJsRnFqhg7r.txt
-r--rw-r-x 1 root root 1.1K Mar 12 12:50 B7HIyq5CKwGavwaW.txt
-rwx--xr-- 1 root root 1.1K Mar 12 12:40 GP4decBqHC6UL66s.txt
-rwx--xr-- 1 root root 1.1K Mar 12 12:48 GeDYq3hoIx7oijhO.txt
-rw-rw---x 1 root root 1.1K Mar 12 12:53 HN5vsOJkU4004pEl.txt
-r-x---r-x 1 root root 1.1K Mar 12 12:34 HsxVbSgKw3d7tvFi.txt
--w---xr-- 1 root root 1.1K Mar 12 12:52 KEY19YZmg8L92D1H.txt
--wx-wxr-- 1 root root 1.1K Mar 12 12:39 LuVzAMVXkpJYAxRM.txt
-rw--w--wx 1 root root 1.1K Mar 12 12:33 OOVH70vCevC3FSZq.txt
--wxr-x-w- 1 root root 1.1K Mar 12 12:23 PtRcxoHyWhhS6z9q.txt
-r--rw--wx 1 root root 1.1K Mar 12 12:25 R6qgmnljCORHERFH.txt
-rw---x-wx 1 root root 1.1K Mar 12 12:41 S5dyoQrp6a8grHOD.txt
--wx--xr-x 1 root root 1.1K Mar 12 12:32 Uljik5BaQPOeMjfc.txt
--wxrw--w- 1 root root 1.1K Mar 12 12:47 Vp7XQiTt4ad9IDfB.txt
-r-xrwxr-x 1 root root 1.1K Mar 12 12:54 W5xw54rLYvyj7qRM.txt
-r---wx-w- 1 root root 1.1K Mar 12 12:45 Z0VC73hFMVt2AcO9.txt
---xr-xr-- 1 root root 1.1K Mar 12 12:46 bG0d9OBnfwVP2NS8.txt
--wxr----- 1 root root 1.1K Mar 12 12:31 cDnYAOBE4mvBnh0C.txt
-rw--wx--x 1 root root 1.1K Mar 12 12:29 eiUFiXPDk6oee8sL.txt
-rwxr-xr-- 1 root root 1.1K Mar 12 12:35 fGMkb1gANtjLb5Qz.txt
-r-xrwx--- 1 root root 1.1K Mar 12 12:30 kY4FOlfPt3qGR17K.txt
----rw-r-x 1 root root 1.1K Mar 12 12:42 kcVtPjZM85b4B3V6.txt
----rw--wx 1 root root 1.1K Mar 12 12:38 lysJisb6wMlPG9WX.txt
-r---wx-wx 1 root root 1.1K Mar 12 12:44 pU2aTHrPpCjthwwi.txt
-rwxr--rw- 1 root root 1.1K Mar 12 12:43 t7WeFKhvlS3e1Yet.txt
----r-xr-- 1 root root 1.1K Mar 12 12:27 u70m5b8l2T3vnZHZ.txt
----rwx--x 1 root root 1.1K Mar 12 12:37 uAkL5PqfK2I7K4PE.txt
-rwx-wxrw- 1 root root 1.1K Mar 12 12:28 x9f1QlloTkYd5sfU.txt
-rwx-w---x 1 root root 1.1K Mar 12 12:24 y7Dsjz7CmkvpTA1H.txt
```

This is when I got stuck and had to read a bit of my teams chat... Where I found this:
> sort by time then convert the perms to binary

...

The files are made every minute, sort them by the time and them use their permissions as binary. Let's script this:
```python
#!/usr/bin/env python3
import sys

def perm_to_binary(perm_str):
    """Convert a permission string (like 'rwx--xr--') to binary."""
    binary = ""
    # Process 9 characters (skip the first dash which indicates file type)
    for char in perm_str[1:]:
        if char == 'r':
            binary += "1"
        elif char == 'w':
            binary += "1"
        elif char == 'x':
            binary += "1"
        else:
            binary += "0"
    return binary

def get_permission_binary(ls_output):
    """Extract permissions from ls -l output, sort by time, and return binary string."""
    files = []
    
    for line in ls_output.strip().split('\n'):
        if not line.strip():
            continue
            
        parts = line.split()
        if len(parts) < 9:
            continue
            
        # Extract time (format: HH:MM)
        time_str = parts[7]
        
        # Extract permissions
        perm_str = parts[0]
        
        # Extract filename
        filename = parts[8]
        
        # Store as tuple for sorting
        files.append((time_str, perm_str, filename))
    
    # Sort by time
    files.sort(key=lambda x: x[0])
    
    # Print sorted files with binary permissions for verification
    print("Sorted files with binary permissions:", file=sys.stderr)
    for time_str, perm_str, filename in files:
        binary = perm_to_binary(perm_str)
        print(f"{time_str} {perm_str} {filename} {binary}", file=sys.stderr)
    
    # Create binary string from sorted permissions
    binary_key = ""
    for _, perm_str, _ in files:
        binary_key += perm_to_binary(perm_str)
    
    return binary_key

def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <ls_output_file>", file=sys.stderr)
        sys.exit(1)
    
    ls_file = sys.argv[1]
    
    try:
        # Read ls output
        with open(ls_file, 'r') as f:
            ls_output = f.read()
        
        # Get binary string from permissions
        binary_flag = get_permission_binary(ls_output)
        
        # Print the binary flag
        print(f"\nBinary Flag: {binary_flag}")
        
        # Convert binary to ASCII if possible
        try:
            # Pad binary to make length divisible by 8
            padded_binary = binary_flag
            while len(padded_binary) % 8 != 0:
                padded_binary += '0'
                
            # Convert binary to ASCII
            ascii_flag = ""
            for i in range(0, len(padded_binary), 8):
                binary_byte = padded_binary[i:i+8]
                ascii_char = chr(int(binary_byte, 2))
                ascii_flag += ascii_char
                
            print(f"\nPossible ASCII interpretation: {ascii_flag}")
        except Exception as e:
            print(f"\nCould not convert to ASCII: {e}", file=sys.stderr)
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```

```bash
$ ls -lha *.txt > ls_output.txt
$ python3 script.py ls_output.txt
Sorted files with binary permissions:
12:23 --wxr-x-w- PtRcxoHyWhhS6z9q.txt 011101010
12:24 -rwx-w---x y7Dsjz7CmkvpTA1H.txt 111010001
12:25 -r--rw--wx R6qgmnljCORHERFH.txt 100110011
12:26 --wx---rw- 1Pe4S76zWpxA8mgI.txt 011000110
12:27 ----r-xr-- u70m5b8l2T3vnZHZ.txt 000101100
12:28 -rwx-wxrw- x9f1QlloTkYd5sfU.txt 111011110
12:29 -rw--wx--x eiUFiXPDk6oee8sL.txt 110011001
12:30 -r-xrwx--- kY4FOlfPt3qGR17K.txt 101111000
12:31 --wxr----- cDnYAOBE4mvBnh0C.txt 011100000
12:32 --wx--xr-x Uljik5BaQPOeMjfc.txt 011001101
12:33 -rw--w--wx OOVH70vCevC3FSZq.txt 110010011
12:34 -r-x---r-x HsxVbSgKw3d7tvFi.txt 101000101
12:35 -rwxr-xr-- fGMkb1gANtjLb5Qz.txt 111101100
12:36 -rw---xr-- 6ReSGoJsRnFqhg7r.txt 110001100
12:37 ----rwx--x uAkL5PqfK2I7K4PE.txt 000111001
12:38 ----rw--wx lysJisb6wMlPG9WX.txt 000110011
12:39 --wx-wxr-- LuVzAMVXkpJYAxRM.txt 011011100
12:40 -rwx--xr-- GP4decBqHC6UL66s.txt 111001100
12:41 -rw---x-wx S5dyoQrp6a8grHOD.txt 110001011
12:42 ----rw-r-x kcVtPjZM85b4B3V6.txt 000110101
12:43 -rwxr--rw- t7WeFKhvlS3e1Yet.txt 111100110
12:44 -r---wx-wx pU2aTHrPpCjthwwi.txt 100011011
12:45 -r---wx-w- Z0VC73hFMVt2AcO9.txt 100011010
12:46 ---xr-xr-- bG0d9OBnfwVP2NS8.txt 001101100
12:47 --wxrw--w- Vp7XQiTt4ad9IDfB.txt 011110010
12:48 -rwx--xr-- GeDYq3hoIx7oijhO.txt 111001100
12:49 -rw---x-wx 5UhgLeVLJWuEnc4W.txt 110001011
12:50 -r--rw-r-x B7HIyq5CKwGavwaW.txt 100110101
12:51 -rwxr--rwx 3zkhN7A0Vqe0HgNC.txt 111100111
12:52 --w---xr-- KEY19YZmg8L92D1H.txt 010001100
12:53 -rw-rw---x HN5vsOJkU4004pEl.txt 110110001
12:54 -r-xrwxr-x W5xw54rLYvyj7qRM.txt 101111101

Binary Flag: 011101010111010001100110011011000110000101100111011110110011001101111000011100000011001101110010011101000101111101100110001100000111001000110011011011100111001100110001011000110101111100110100011011100011010001101100011110010111001100110001011100110101111100111010001100110110001101111101

Possible ASCII interpretation: utflag{3xp3rt_f0r3ns1c_4n4lys1s_:3c}
```

Flag: `utflag{3xp3rt_f0r3ns1c_4n4lys1s_:3c}`