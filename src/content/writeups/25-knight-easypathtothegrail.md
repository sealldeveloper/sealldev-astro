---
title: "Easy Path to the Grail"
description: "Brave knight, your quest is simple yet essential—unlock the secrets hidden in this binary challenge and tread the path to the grail. The journey will test your wits as you reverse the provided binary, uncovering the treasure within."
pubDate: 2025-01-22
ctf: "KnightCTF 2025"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/25-knight/icon.png"
---



We are given a `grail.knight` which is an ELF binary again:

We have a few functions and of interest are `main`, `transform_input` and `do_fight`.

The snippet of `main` doing the flag check is:

```c
    transform_input(local_198,local_118);
    iVar1 = strcmp(local_118,"D2C22A62DEA62CCE9EFA0ECC86CE9AFA4ECC6EFAC6162C3636CC76E6A6BE");
    if (iVar1 == 0) {
      printf("Correct! The flag is %s\n",(char *)local_198);
    }
    else {
      puts("Wrong password!");
    }
```

`local_198` is the user input so we need to look at what `transform_input` is doing with `local_118`.

```c
void transform_input(byte *param_1,char *param_2)

{
  byte bVar1;
  char *local_28;
  byte *local_20;

  local_28 = param_2;
  for (local_20 = param_1; *local_20 != 0; local_20 = local_20 + 1) {
    bVar1 = do_fight(*local_20);
    sprintf(local_28,"%02X",(uint)bVar1);
    local_28 = local_28 + 2;
  }
  *local_28 = '\0';
  return;
}
```

This (in essence) is hex encoding a string byte by byte but running `do_fight` on each byte each iteration before hex encoding.

```c

byte do_fight(byte param_1)

{
  undefined local_1c;
  undefined local_d;
  undefined4 local_c;

  local_d = 0;
  local_1c = param_1;
  for (local_c = 0; local_c < 8; local_c = local_c + 1) {
    local_d = local_d << 1 | local_1c & 1;
    local_1c = local_1c >> 1;
  }
  return local_d;
}

```

This is taking the input byte, then reversing the order of its bits. `local_d` is shifted left once then the rightmost bit of `local_1c` is extracted. This new extracted bit is added to `local_d` using `|` (OR). `local_1c` is then shifted right by 1 to process the next one. This is repeated 8 times (for each bit in the byte).

e.g. `10110011` becomes `11001101`.

So the overall functionality is taking a string, getting each byte, reversing the bit order and then hex encoding it.

So to undo it we need to:

- Hex Decode the string
- Reverse the bits

I do this in Python:

```python
def do_fight(byte):
    result = 0
    for _ in range(8):
        result = (result << 1) | (byte & 1)
        byte = byte >> 1
    return result

def reverse_transform(hex_string):
    result = bytearray()
    for i in range(0, len(hex_string), 2):
        hex_byte = hex_string[i:i+2]
        byte_val = int(hex_byte, 16)
        original = do_fight(byte_val)
        result.append(original)
    return bytes(result)

target = "D2C22A62DEA62CCE9EFA0ECC86CE9AFA4ECC6EFAC6162C3636CC76E6A6BE"
flag = reverse_transform(target)
print(f"Decoded flag: {flag.decode()}")
```

This outputs:

```bash
$ python3 script.py
Decoded flag: KCTF{e4sy_p3asY_r3v_ch4ll3nge}
```

Flag: `KCTF{e4sy_p3asY_r3v_ch4ll3nge}`
