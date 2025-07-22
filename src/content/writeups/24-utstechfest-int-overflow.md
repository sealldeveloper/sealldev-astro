---
title: "int overflow"
description: "I discovered you can type cast variables in c!"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "pwn"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

Starting with an ELF binary, I load it into Ghidra.

This is the pseudocode that was generated:
```c
undefined8 main(void)

{
  undefined8 uVar1;
  char local_a8 [112];
  char local_38 [36];
  int local_14;
  short local_e;
  int local_c;
  
  printf("Enter a number: ");
  fflush(stdout);
  fgets(local_38,0x20,stdin);
  local_c = atoi(local_38);
  if (local_c < 0) {
    puts("Positive numbers only.");
    uVar1 = 0xffffffff;
  }
  else {
    local_e = (short)local_c;
    if (local_e == -1) {
      puts("Hidden functionality goes brrr");
      local_14 = open("./flag.txt",0);
      if (local_14 < 0) {
        puts("flag.txt not found in pwd. If this is on the server please let an admin know.");
        return 0xffffffff;
      }
      read(local_14,local_a8,100);
      fprintf(stdout,"FLAG: %s\n",local_a8);
    }
    printf("input : %d\n",(int)local_e);
    uVar1 = 0;
  }
  return uVar1;
}
```

Looking at the variables:
- `local_38` takes the input.
- `local_c` does an `atoi` operation which is `ASCII To Integer`, this is to check for negative numbers being inputted once parsed.
- `local_3` converts `local_c` to a short.

Shorts have a size limit of `65535`, so if we input that it should resolve to a `-1`, which it does.

Flag: `CSEC{Unv3rifi3d_7yp3_c45t5_4r5_b4d}`