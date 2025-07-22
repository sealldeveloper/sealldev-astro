---
title: "CryoWarmup"
description: "You've been on ice for a long time, so before you start your journey you'll need to defrost and warm up your skills. As luck would have it, you've forgotten the password to your trusty Electro-Safe-o-Matic, where your most prized possessions are. Can you still remember how to crack in?"
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



We are given an ELF binary, I open it in Ghidra and start the flags.

#### Flag 1
> 1. What libc function is used to check if the password is correct?

Looking at the `validate_password` function, we can see its using `strcmp`.

```c

bool validate_password(char *param_1)

{
  int iVar1;
  long in_FS_OFFSET;
  char local_51 [65];
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  builtin_strncpy(local_51,"G SS\x1eI_b",9);
  strcpy(local_51 + 9,param_1);
  generate_key(local_51 + 9);
  iVar1 = strcmp(local_51 + 9,local_51);
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return iVar1 == 0;
}
```

Flag: `strcmp`

#### Flag 2
> 2. What is the size of the password buffer, based on the argument to scanf?

Looking at the `scanf` in main:
```c

undefined8 main(void)

{
  bool bVar1;
  undefined7 extraout_var;
  long in_FS_OFFSET;
  char local_48 [56];
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  printf("Enter the password: ");
  __isoc99_scanf(&DAT_00102019,local_48);
  bVar1 = validate_password(local_48);
  if ((int)CONCAT71(extraout_var,bVar1) == 0) {
    puts("Access denied!");
  }
  else {
    puts("Access granted!");
  }
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return 0;
}
```

The `&DAT_00102019` should hold the key:
```
                             DAT_00102019                                    XREF[2]:     main:001012a8(*), 
                                                                                          main:001012af(*)  
        00102019 25              ??         25h    %
        0010201a 34              ??         34h    4
        0010201b 39              ??         39h    9
        0010201c 73              ??         73h    s
        0010201d 00              ??         00h
```
`%49s`

Flag: `49`

#### Flag 3
> 3. What is the name of the function that modifies the user's input?

There is an XOR on the user input in `generate_password` called `generate_key`:
```c
void generate_key(char *param_1)

{
  size_t sVar1;
  int local_1c;
  
  local_1c = 0;
  while( true ) {
    sVar1 = strlen(param_1);
    if (sVar1 <= (ulong)(long)local_1c) break;
    param_1[local_1c] = (param_1[local_1c] ^ 0x2aU) + 5;
    local_1c = local_1c + 1;
  }
  return;
}
```

Flag: `generate_key`

#### Flag 4
> 4. What would be the result of applying the operation from this function to a string containing one character, 'B'? Provide your answer as a hex number, e.g. 0x4f.

It is adding 5 then XOR'ing by `0x2a`.

So `B` (66) + 5 = 71
Then `71 ^ 0x2a` = 109
Which is 0x6d = m

Flag: `0x6d`

#### Flag 5
> 5. What is printed if the password is correct?

Looking at `main`, it prints `Access granted!`

Flag: `Access granted!`

#### Flag 6
> 6. How long is the password, based on the value that the user's input is compared against (not including the final null byte)?

Looking at the expected result in the decompiled `validate_password` we should be expecting 9. Excluding the null byte it is 8.

Flag: `8`

#### Flag 7
> 7. What is the password?

From the `validate_password` we know the expected and we know its encoded with +5 then XOR, so we can revert it with -5 then XOR, I wrote a Python script to do this.

```python
def reverse_key(target):
    result = ""
    for c in target:
        # Subtract 5 first, then XOR with 0x2A
        reversed_char = chr(((ord(c) - 5) ^ 0x2A) & 0xFF)
        result += reversed_char
    return result

print(reverse_key('G SS\x1eI_b'))
```

The output is `h1dd3npw`.

Flag: `h1dd3npw`