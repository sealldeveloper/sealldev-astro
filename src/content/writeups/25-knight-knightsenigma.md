---
title: "Knight's Enigma"
description: "In the shadowed corridors of an ancient fortress, a legendary knight once safeguarded a secret so potent that countless contenders have vanished trying to decipher it. Now the seal has cracked, and echoes of its power seep into the present. Test your courage as you follow cryptic traces left by the knight’s hand, unraveling an enigma steeped in the mysticism of ages past. Will your wits prove enough to break the bindings and uncover the realm’s hidden legacy—or will you, too, fade into the swirling mists of history? The choice—and fate—are yours to determine."
pubDate: 2025-01-22
ctf: "KnightCTF 2025"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/25-knight/icon.png"
---



We are given another ELF called `knight_s.enigma`. Load it into Ghidra and let's have a look.

The main function of interest is again `FUN_001010a0`, and it's **huge**... 1145 lines huge...

Let's focus on the end of the code to see what it's using:

```c
      iVar150 = memcmp(local_a8,&local_158,0x22);
      if (iVar150 == 0) {
        puts("Congratulations knight!");
        goto LAB_0010114b;
      }
    }
  }
  puts("Incorrect flag!");
```

It seems to be looking at a `local_158` variable, let's find the definition for that:

```c
  local_138 = 0x1450;
  local_158 = 0xa68c507448008898;
  uStack_150 = 0x9c500604ec64bc5c;
  local_148 = 0xa6f450043cbcfc5c;
  uStack_140 = 0x4265004a6bc50c4;
  printf("Hello Knight\nEnter your secret: ");
```

Right at the start when it asks for a secret, alongside some other interesting values.

Just below that we can see it's expecting a length of `32` / `0x22` for the input:

```c
  printf("Hello Knight\nEnter your secret: ");
  fgets(__s,0x80,stdin);
  sVar43 = strlen(__s);
  if (sVar43 != 0) {
    if (acStack_129[sVar43] == '\n') {
      acStack_129[sVar43] = '\0';
      sVar43 = sVar43 - 1;
    }
    if (sVar43 == 0x22) {
```

The input (`__s`) is then used in a new variable `auVar87`:

```c
do {
        auVar87 = *(undefined (*) [16])(__s + lVar45);
```

There is also some bit masking here

```c
auVar87 = ~auVar86 & auVar87 | (auVar172 & auVar27 | ~auVar27 & auVar62) & auVar86;
```

This is doing bit manipulation with other variables (that we haven't figured out yet)...

Due to the amount of reassigning, I used an LLM to help process this part. Turns out it's a lot of fluff code and the general idea of what's happening is the following (as well as help write the Python solution):

1. It transforms the characters:

```python
if 0x41 <= shuffled <= 0x5A:
    return chr(((shuffled - 0x41 + 0x1A) % 0x1A) + 0x41)
elif 0x61 <= shuffled <= 0x7A:
    return chr(((shuffled - 0x61 + 0x1A) % 0x1A) + 0x61)
return chr(shuffled)
```

2. It does bit shuffling:

```python
def reverse_bit_shuffle(byte):
    result = 0
    result |= (byte & 0x80) >> 7
    result |= (byte & 0x40) >> 5
    result |= (byte & 0x20) >> 3
    result |= (byte & 0x10) >> 1
    result |= (byte & 0x08) << 1
    result |= (byte & 0x04) << 3
    result |= (byte & 0x02) << 5
    result |= (byte & 0x01) << 7
    return result
```

3. Does an XOR:

```python
unxored = encoded_char ^ 0xAA
```

And it is using those 4 suspicious variables at the start!

I use this script:

```python
import string
def reverse_bit_shuffle(byte):
    result = 0
    result |= (byte & 0x80) >> 7
    result |= (byte & 0x40) >> 5
    result |= (byte & 0x20) >> 3
    result |= (byte & 0x10) >> 1
    result |= (byte & 0x08) << 1
    result |= (byte & 0x04) << 3
    result |= (byte & 0x02) << 5
    result |= (byte & 0x01) << 7
    return result

def decode_char(encoded_char):
    unxored = encoded_char ^ 0xAA

    shuffled = reverse_bit_shuffle(unxored)

    if 0x41 <= shuffled <= 0x5A:
        return chr(((shuffled - 0x41 + 0x1A) % 0x1A) + 0x41)
    elif 0x61 <= shuffled <= 0x7A:
        return chr(((shuffled - 0x61 + 0x1A) % 0x1A) + 0x61)
    return chr(shuffled)

def decode_flag():
    encoded_values = [
        0xa68c507448008898,
        0x9c500604ec64bc5c,
        0xa6f450043cbcfc5c,
        0x4265004a6bc50c4
    ]

    encoded_bytes = b''
    for value in encoded_values:
        encoded_bytes += value.to_bytes(8, 'little')

    flag = ''
    for byte in encoded_bytes[:0x22]:
        flag += decode_char(byte)

    return flag

if __name__ == "__main__":
    decoded_flag = list(decode_flag())
    final = ""
    for c in decoded_flag:
        if c in string.ascii_letters:
            final+= chr(ord(c)-1)
        else:
            final+=c

    print(f"Decoded flag: {final}")
```

The LLM got it slightly wrong, so I had to fix it at the end and added the `final` section in main myself.

```bash
$ python3 solve.py
Decoded flag: KCTF{_c0ngrat5_knight_y0u_g0t_1t
```

Flag: `KCTF{_c0ngrat5_knight_y0u_g0t_1t_}` (I guessed the ending)
