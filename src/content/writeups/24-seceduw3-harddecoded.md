---
title: "Hard-decoded"
description: "One of ORG-C's CI units is spewing out some random data. Sometimes this happens, they tell us. Is there something malicious in here??"
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



We are given two files a `chal` and a `out.txt`, let's check out `chal`:
```bash
$ file chal                  
chal: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=cecca9e65b93f9253f837454d847dacee8be7869, for GNU/Linux 3.2.0, not stripped
```

An ELF binary, the `out.txt` is just some hexadecimal data:
```
4B 42 6 16 30 6E 47 5E 57 10 58 57 11 50 4C 1B 4F 19 4E 1 1E 4E 45 E 41 1B 1F 7 A 31 0 40 5 1C 41 1B 1D 4F B 5A 41 23 62 44 17 8 0 1A 54 54 F 7 74 57 40 E 6F 6B E 18 1F 10 46 53 1A 1A 1A 15 44 4E D 45 54 F B 0 45 54 1B 8 0 13 3 20 24 24 2C 6 16 48 57 E 0 E 1C 47 41 15 B 49 1C 1B 4F 41 53 19 E B 4C 69 54 4E 41 2A 6F 5A 44 1C 1B 1 50 46 18 6 45 3A 63 5A 7 4B 27 0 E 3 5 59 C B 14 7 43 54 1C 17 4F 17 17 1D 55 1A 7 4B 6C 26 D 15 0 23 6F 4B 42 4F 1C 46 C 16 0 C 52 15 A C 44 13 3 1B 15 53 59 13 B F 57 4 B 7 7 32 69 4F 10 7 4 55 6 4 17 14 0 1 7 1A 7 7 7 6 13 17 2D 2A 59 C 4 0 49 B D 8 41 3 54 69 54 46 10 1C 19 4F 3A 79 E C 1E 1F 7 7 53 1B D A 45 57 6F 37 A 1 4C B 18 43 47 42 8 8 2 1B E 52 3C D 18 D 9 57 5E 55 D 35 41 4F 18 5C 49 38 11 1F 4C A 1F 58 0 7 1F 34 69 45 5E 52 38 D 1F 4C 8 19 45 4B D 3 2D 69 45 5E 7F 6F 1A 7 55 0 9 F 8 13 4B 4C D 49 2D 2A 57 18 4D 53 1B 1F 46 63 3E 3A 6 17 B 7F 7 6 55 1C 3A 54 7 44 44 2A 5 7F 52 52 19 5C 2B 19 5 1E 7B 4E 7 22 37 21 59 68 2A 7D 15 B 8 5 3 11 3 15 48 49 0 49 52 16 8 C D 1 6F 35 A 4 5 B 5 1 7F 27 18 4E 9 41 2C 64 1F C 41 17 24 69 50 17 16 5C 6B A 6F 53 3 6C 6C 65 48 A 2E 64 6E 61 68 20 6F 6E 20 73 73 65 63 6F 72 70 20 61 20 67 6E 61 48 A 21 67 6E 69 6D 6F 43 A 21 79 64 61 65 72 20 73 69 20 74 73 61 66 6B 61 65 72 42 20 21 79 72 72 61 42 A 2E 65 6C 74 74 69 6C 20 61 20 70 75 20 74 69 20 65 6B 61 68 73 20 73 27 74 65 4C A 21 77 6F 6C 6C 65 79 20 64 6E 61 20 6B 63 61 6C 62 20 2C 68 6F 4F A 2E 6B 63 61 6C 62 20 2C 77 6F 6C 6C 65 59 20 2E 6B 63 61 6C 62 20 2C 77 6F 6C 6C 65 59 20 2E 6B 63 61 6C 62 20 2C 77 6F 6C 6C 65 59 20 2E 6B 63 61 6C 62 20 2C 77 6F 6C 6C 65 59 A 2E 65 6C 62 69 73 73 6F 70 6D 69 20 73 69 20 6B 6E 69 68 74 20 73 6E 61 6D 75 68 20 74 61 68 77 20 65 72 61 63 20 74 27 6E 6F 64 20 73 65 65 62 20 65 73 75 61 63 65 62 20 79 61 77 79 6E 61 20 73 65 69 6C 66 20 2C 65 73 72 75 6F 63 20 66 6F 20 2C 65 65 62 20 65 68 54 A 2E 64 6E 75 6F 72 67 20 65 68 74 20 66 66 6F 20 79 64 6F 62 20 65 6C 74 74 69 6C 20 74 61 66 20 73 74 69 20 74 65 67 20 6F 74 20 6C 6C 61 6D 73 20 6F 6F 74 20 65 72 61 20 73 67 6E 69 77 20 73 74 49 A 2E 79 6C 66 20 6F 74 20 65 6C 62 61 20 65 62 20 64 6C 75 6F 68 73 20 65 65 62 20 61 20 79 61 77 20 6F 6E 20 73 69 20 65 72 65 68 74 20 2C 6E 6F 69 74 61 69 76 61 20 66 6F 20 73 77 61 6C 20 6E 77 6F 6E 6B 20 6C 6C 61 20 6F 74 20 67 6E 69 64 72 6F 63 63 41
```

I decide to open the binary in Ghidra to see what the programming is doing.
```c
undefined8 main(void)

{
  uint *puVar1;
  uint uVar2;
  long in_FS_OFFSET;
  int local_30;
  int local_2c;
  void *local_28;
  long local_20;
  
  local_20 = *(long *)(in_FS_OFFSET + 0x28);
  puts("\"Encrypting...\"\nInput: <REDACTED>");
  local_30 = 0;
  local_28 = openFile(&local_30);
  for (local_2c = 0; local_2c < local_30; local_2c = local_2c + 1) {
    puVar1 = (uint *)((long)local_2c * 4 + (long)local_28);
    uVar2 = xorFunction(*(uint *)((long)local_28 + (long)local_2c * 4),
                        *(uint *)((long)local_28 + (long)(local_30 - local_2c) * 4 + -4));
    *puVar1 = uVar2;
  }
  printArray((long)local_28,local_30);
  free(local_28);
  if (local_20 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return 0;
}
```

It does the following:
- Take an input from the contents of `source.txt` to `local_28`.
- It iterates the `local_2c` value in a loop until its hit each byte in the file.
- It then XOR's the current character against the previous `a^b` and stores it using `xorFunction()`.
- It then prints the hexadecimal output using `printArray()`.

Let's undo this process with Python:
```python
def decrypt_array(encrypted_array):
    length = len(encrypted_array)
    decrypted_array = encrypted_array.copy()
    
    for i in range(length):
        decrypted_array[i] = (encrypted_array[i]^encrypted_array[length - i - 1])
    
    return decrypted_array

def main():
    encrypted_hex = "4B 42 6 16 30 6E 47 5E 57 10 58 57 11 50 4C 1B 4F 19 4E 1 1E 4E 45 E 41 1B 1F 7 A 31 0 40 5 1C 41 1B 1D 4F B 5A 41 23 62 44 17 8 0 1A 54 54 F 7 74 57 40 E 6F 6B E 18 1F 10 46 53 1A 1A 1A 15 44 4E D 45 54 F B 0 45 54 1B 8 0 13 3 20 24 24 2C 6 16 48 57 E 0 E 1C 47 41 15 B 49 1C 1B 4F 41 53 19 E B 4C 69 54 4E 41 2A 6F 5A 44 1C 1B 1 50 46 18 6 45 3A 63 5A 7 4B 27 0 E 3 5 59 C B 14 7 43 54 1C 17 4F 17 17 1D 55 1A 7 4B 6C 26 D 15 0 23 6F 4B 42 4F 1C 46 C 16 0 C 52 15 A C 44 13 3 1B 15 53 59 13 B F 57 4 B 7 7 32 69 4F 10 7 4 55 6 4 17 14 0 1 7 1A 7 7 7 6 13 17 2D 2A 59 C 4 0 49 B D 8 41 3 54 69 54 46 10 1C 19 4F 3A 79 E C 1E 1F 7 7 53 1B D A 45 57 6F 37 A 1 4C B 18 43 47 42 8 8 2 1B E 52 3C D 18 D 9 57 5E 55 D 35 41 4F 18 5C 49 38 11 1F 4C A 1F 58 0 7 1F 34 69 45 5E 52 38 D 1F 4C 8 19 45 4B D 3 2D 69 45 5E 7F 6F 1A 7 55 0 9 F 8 13 4B 4C D 49 2D 2A 57 18 4D 53 1B 1F 46 63 3E 3A 6 17 B 7F 7 6 55 1C 3A 54 7 44 44 2A 5 7F 52 52 19 5C 2B 19 5 1E 7B 4E 7 22 37 21 59 68 2A 7D 15 B 8 5 3 11 3 15 48 49 0 49 52 16 8 C D 1 6F 35 A 4 5 B 5 1 7F 27 18 4E 9 41 2C 64 1F C 41 17 24 69 50 17 16 5C 6B A 6F 53 3 6C 6C 65 48 A 2E 64 6E 61 68 20 6F 6E 20 73 73 65 63 6F 72 70 20 61 20 67 6E 61 48 A 21 67 6E 69 6D 6F 43 A 21 79 64 61 65 72 20 73 69 20 74 73 61 66 6B 61 65 72 42 20 21 79 72 72 61 42 A 2E 65 6C 74 74 69 6C 20 61 20 70 75 20 74 69 20 65 6B 61 68 73 20 73 27 74 65 4C A 21 77 6F 6C 6C 65 79 20 64 6E 61 20 6B 63 61 6C 62 20 2C 68 6F 4F A 2E 6B 63 61 6C 62 20 2C 77 6F 6C 6C 65 59 20 2E 6B 63 61 6C 62 20 2C 77 6F 6C 6C 65 59 20 2E 6B 63 61 6C 62 20 2C 77 6F 6C 6C 65 59 20 2E 6B 63 61 6C 62 20 2C 77 6F 6C 6C 65 59 A 2E 65 6C 62 69 73 73 6F 70 6D 69 20 73 69 20 6B 6E 69 68 74 20 73 6E 61 6D 75 68 20 74 61 68 77 20 65 72 61 63 20 74 27 6E 6F 64 20 73 65 65 62 20 65 73 75 61 63 65 62 20 79 61 77 79 6E 61 20 73 65 69 6C 66 20 2C 65 73 72 75 6F 63 20 66 6F 20 2C 65 65 62 20 65 68 54 A 2E 64 6E 75 6F 72 67 20 65 68 74 20 66 66 6F 20 79 64 6F 62 20 65 6C 74 74 69 6C 20 74 61 66 20 73 74 69 20 74 65 67 20 6F 74 20 6C 6C 61 6D 73 20 6F 6F 74 20 65 72 61 20 73 67 6E 69 77 20 73 74 49 A 2E 79 6C 66 20 6F 74 20 65 6C 62 61 20 65 62 20 64 6C 75 6F 68 73 20 65 65 62 20 61 20 79 61 77 20 6F 6E 20 73 69 20 65 72 65 68 74 20 2C 6E 6F 69 74 61 69 76 61 20 66 6F 20 73 77 61 6C 20 6E 77 6F 6E 6B 20 6C 6C 61 20 6F 74 20 67 6E 69 64 72 6F 63 63 41"
    encrypted_array = [int(x, 16) for x in encrypted_hex.split()]
    decrypted_array = decrypt_array(encrypted_array)
    decrypted_text = ''.join(chr(x) for x in decrypted_array)
    print(decrypted_text)

if __name__ == "__main__":
    main()
```

Output:
```bash
$ python3 solve.py

!eyB
.000,811 wor ni eb ll'eW !su ot evaW
!em s'tahT !wO
.zzuf ruoy no tnil tog uoY
.ereh gniog gniht a tog I !aM
.duorp yreV
.s'B lla ,drac troper tcefrep A
.nos ,uoy fo duorp yrev er'eW
.etaudarg eht s'ereH
.deticxe m'I .yrroS
.esoht rof yenom doog diap rehtaf ruoY ,sriats eht esU
.prahs gnikooL
.pu uoy kcip ll'I
.}!?thgir_r0x_tn4w_tn0d_u_3ru5_mi{UDECES I
?gnineppah si siht eveileb uoy naMDo~.tA�#7x3Kb=gBf--fBg=bK3x7#�At.~oDMan you believe this is happening?
I SECEDU{im_5ur3_u_d0nt_w4nt_x0r_right?!}.
I'll pick you up.
Looking sharp.
Use the stairs, Your father paid good money for those.
Sorry. I'm excited.
Here's the graduate.
We're very proud of you, son.
A perfect report card, all B's.
Very proud.
Ma! I got a thing going here.
You got lint on your fuzz.
Ow! That's me!
Wave to us! We'll be in row 118,000.
Bye!
```

Flag: `SECEDU{im_5ur3_u_d0nt_w4nt_x0r_right?!}`