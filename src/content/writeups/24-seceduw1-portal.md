---
title: "Portal"
description: "They've given us one of their programs running in the background to us. Let's hope it's not insecure!! (or in your case, that it's not secure instead ;) )\n\n`nc chals.secedu.site 5000`"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "pwn"
author: "sealldev & tulip"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



We were given this source code:
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int checkIfA(char *username, char *password);
void printFile();

int main() {
    int admin = 0;
    char protect[] = {'\0', 'A'};
    char username[10];
	char password[5];

    printf("This is the company's employee portal.\n");
    printf("---------------------------------------------\n");
	printf("Please enter your name:\n");
    gets(username);
    printf("Please enter your password:\n");
    gets(password);


    if (strcmp(username, "AAAAAAAAAA") == 0 || strcmp(password, "AAAAA") == 0) {
        printf("What a strange username or password!\n");
        return 1;
    }

    if (admin != 0 && protect[0] == '\0' && protect[1] == 'A') {
        printf("Welcome admin!\n");
        printFile();
        return 0;
    }

    printf("Employee not found!\n");
    return 1;
}

void printFile() {
    FILE *file = fopen("flag.txt", "r");
    int c;
    while ((c = fgetc(file)) != EOF) { fputc(c, stdout); }
    fclose(file);
}
```

We can see that the `admin` variable is initially `0`, there are two `protect` values of `\0` and `A`, and there is a set limit on the `username` and `password` (10 and 5 respectively).

The check then checks if the `username` matches `AAAAAAAAAA` or the `password` matches `AAAAA`, if it does, it exits the program.

The next check is for if the user is an admin:
- The `admin` value needs to be a non-0 value
- The `protect[0]` must be `\0`
- The `protect[1]` must be `A`

That's, it...?

We can do a Buffer Overflow to break this challenge.

The `strcmp` is only checking for an **exact match**, so we could use `B`'s or `a`'s or anything but `A`'s.

We can then overflow to rewrite the `admin` value, but we need to preserve the values of `protect`.

So, we can start with the overflow: `bbbbbbbbbb`, then add the protect values `\0` and `A`, then changing `admin` to a `1`.

The value is `bbbbbbbbbb\0A1`, we can inject the NULL value to netcat with `CTRL+SHIFT+2`, we can then ignore the password value as its never used apart from the `strcmp` check.

```
$ nc chals.secedu.site 5000
This is the company's employee portal.
---------------------------------------------
Please enter your name:
bbbbbbbbbb^@A1
Please enter your password:

Welcome admin!
```

Flag: `SECEDU{por74l_to_n0wh3r3}`