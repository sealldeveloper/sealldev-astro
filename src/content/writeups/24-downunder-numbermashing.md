---
title: "number mashing"
description: "Mash your keyboard numpad in a specific order and a flag might just pop out!"
pubDate: 2024-07-10
ctf: "DownUnderCTF 2024"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/24-downunder/icon.png"
---



This is a reverse engineering challenge in which we are given an ELF binary.

I open the binary with Ghidra and disassemble it to look at the pseudocode.

```c

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined8 main(void)

{
  int local_11c;
  int local_118;
  int local_114;
  FILE *local_110;
  undefined8 local_108;
  undefined8 uStack_100;
  undefined8 local_f8;
  undefined8 uStack_f0;
  undefined8 uStack_e8;
  undefined8 uStack_e0;
  undefined8 local_d8;
  undefined8 uStack_d0;
  undefined8 uStack_c8;
  undefined8 uStack_c0;
  undefined8 local_b8;
  undefined8 uStack_b0;
  undefined8 uStack_a8;
  undefined8 uStack_a0;
  undefined8 local_98;
  undefined8 uStack_90;
  undefined8 uStack_88;
  undefined8 uStack_80;
  undefined8 local_78;
  undefined8 uStack_70;
  undefined8 uStack_68;
  undefined8 uStack_60;
  undefined8 local_58;
  undefined8 uStack_50;
  undefined8 uStack_48;
  undefined8 uStack_40;
  undefined8 local_38;
  undefined8 uStack_30;
  undefined8 uStack_28;
  undefined8 uStack_20;
  undefined8 local_18;
  undefined8 uStack_10;
  long local_8;
  
  local_8 = ___stack_chk_guard;
  setvbuf(_stdout,(char *)0x0,2,0);
  setvbuf(_stdin,(char *)0x0,2,0);
  printf("Give me some numbers: ");
  __isoc99_scanf("%d %d",&local_11c,&local_118);
  if (((local_11c == 0) || (local_118 == 0)) || (local_118 == 1)) {
    puts("Nope!");
                    /* WARNING: Subroutine does not return */
    exit(1);
  }
  local_114 = 0;
  if (local_118 != 0) {
    local_114 = local_11c / local_118;
  }
  if (local_114 != local_11c) {
    puts("Nope!");
                    /* WARNING: Subroutine does not return */
    exit(1);
  }
  local_108 = 0;
  uStack_100 = 0;
  uStack_f0 = 0;
  local_f8 = 0;
  uStack_e0 = 0;
  uStack_e8 = 0;
  uStack_d0 = 0;
  local_d8 = 0;
  uStack_c0 = 0;
  uStack_c8 = 0;
  uStack_b0 = 0;
  local_b8 = 0;
  uStack_a0 = 0;
  uStack_a8 = 0;
  uStack_90 = 0;
  local_98 = 0;
  uStack_80 = 0;
  uStack_88 = 0;
  uStack_70 = 0;
  local_78 = 0;
  uStack_60 = 0;
  uStack_68 = 0;
  uStack_50 = 0;
  local_58 = 0;
  uStack_40 = 0;
  uStack_48 = 0;
  uStack_30 = 0;
  local_38 = 0;
  uStack_20 = 0;
  uStack_28 = 0;
  uStack_10 = 0;
  local_18 = 0;
  local_110 = fopen("flag.txt","r");
  fread(&local_108,1,0x100,local_110);
  printf("Correct! %s\n",(char *)&local_108);
  if (local_8 - ___stack_chk_guard != 0) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail(&__stack_chk_guard,0,0,local_8 - ___stack_chk_guard);
  }
  return 0;
}
```

I ask some AI to simplify this C code:
```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int num1, num2, result;
    FILE *file;
    char flag[256];

    // Set buffer modes for stdout and stdin
    setvbuf(stdout, NULL, _IOLBF, 0);
    setvbuf(stdin, NULL, _IOLBF, 0);

    // Prompt user for input
    printf("Give me some numbers: ");
    if (scanf("%d %d", &num1, &num2) != 2) {
        puts("Invalid input!");
        exit(1);
    }

    // Perform checks on the input numbers
    if (num1 == 0 || num2 == 0 || num2 == 1) {
        puts("Nope!");
        exit(1);
    }

    result = num1 / num2;
    if (result != num1) {
        puts("Nope!");
        exit(1);
    }

    // Open the flag file and read its content
    file = fopen("flag.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        exit(1);
    }

    if (fread(flag, 1, sizeof(flag) - 1, file) <= 0) {
        perror("Error reading file");
        fclose(file);
        exit(1);
    }
    fclose(file);

    // Null-terminate the flag string
    flag[sizeof(flag) - 1] = '\0';

    // Print the flag
    printf("Correct! %s\n", flag);

    return 0;
}
```

The checks are as follows:
- Must provide 2 numbers.
- The first number cannot be 0.
- The second number cannot be 0 or 1.
- The first number divided by the second must equal the first number.

This never checks for negative numbers! So we have access to `-1` but thats no use as if we did `10 -1` for example, `result` would be `-10` and `num1` is still `10`...

Could we use integer overflows? So if we used the 32 bit integer limit: `2147483648` and `-1` we'd get `0` as `num1` as it overflows, and then `0` as it becomes `-2147483648` which again underflows to `0`, so passing the requirements and getting the flag.

```
$ nc 2024.ductf.dev xxxxx
Give me some numbers: 2147483648 -1
Correct! DUCTF{w0w_y0u_just_br0ke_math!!}
```

This also works with `-2147483648 -1` as the `result` then overflows and the `num1` underflows.

Flag: `DUCTF{w0w_y0u_just_br0ke_math!!}`