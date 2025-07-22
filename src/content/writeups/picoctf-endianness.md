---
title: "endianness"
description: "Know of little and big endian?"
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

For this challenge there is one file (`flag.c`) and I started the instance.

Reading the `flag.c` it seems we need to convert random words to a Little/Big endian format.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>
#include <time.h>

char *find_little_endian(const char *word)
{
    size_t word_len = strlen(word);
    char *little_endian = (char *)malloc((2 * word_len + 1) * sizeof(char));

    for (size_t i = word_len; i-- > 0;)
    {
        snprintf(&little_endian[(word_len - 1 - i) * 2], 3, "%02X", (unsigned char)word[i]);
    }

    little_endian[2 * word_len] = '\0';
    return little_endian;
}

char *find_big_endian(const char *word)
{
    size_t length = strlen(word);
    char *big_endian = (char *)malloc((2 * length + 1) * sizeof(char));

    for (size_t i = 0; i < length; i++)
    {
        snprintf(&big_endian[i * 2], 3, "%02X", (unsigned char)word[i]);
    }

    big_endian[2 * length] = '\0';
    return big_endian;
}

char *generate_random_word()
{
    printf("Welcome to the Endian CTF!\n");
    printf("You need to find both the little endian and big endian representations of a word.\n");
    printf("If you get both correct, you will receive the flag.\n");
    srand(time(NULL));

    int word_length = 5;
    char *word = (char *)malloc((word_length + 1) * sizeof(char));

    for (int i = 0; i < word_length; i++)
    {
        word[i] = (rand() % 26) + 'a';
    }

    word[word_length] = '\0';
    return word;
}

int main()
{
    char *challenge_word = generate_random_word();
    printf("Word: %s\n", challenge_word);
    fflush(stdout);

    char *little_endian = find_little_endian(challenge_word);
    size_t user_little_endian_size = strlen(little_endian);
    char user_little_endian[user_little_endian_size + 1];
    bool correct_flag = false;

    while (!correct_flag)
    {
        printf("Enter the Little Endian representation: ");
        fflush(stdout);
        scanf("%10s", user_little_endian);
        for (size_t i = 0; i < strlen(user_little_endian); i++)
        {
            user_little_endian[i] = toupper(user_little_endian[i]);
        }

        if (strncmp(user_little_endian, little_endian, user_little_endian_size) == 0)
        {
            printf("Correct Little Endian representation!\n");
            fflush(stdout);
            correct_flag = true;
        }
        else
        {
            printf("Incorrect Little Endian representation. Try again!\n");
            fflush(stdout);
        }
    }

    char *big_endian = find_big_endian(challenge_word);
    size_t user_big_endian_size = strlen(big_endian);
    char user_big_endian[user_big_endian_size + 1];

    bool final_flag = false;
    while (!final_flag)
    {
        printf("Enter the Big Endian representation: ");
        fflush(stdout);
        scanf("%10s", user_big_endian);
        for (size_t i = 0; i < strlen(user_big_endian); i++)
        {
            user_big_endian[i] = toupper(user_big_endian[i]);
        }

        if (strncmp(user_big_endian, big_endian, user_big_endian_size) == 0)
        {
            printf("Correct Big Endian representation!\n");
            fflush(stdout);
            final_flag = true;
        }
        else
        {
            printf("Incorrect Big Endian representation. Try again!\n");
            fflush(stdout);
        }
    }

    FILE *flag = fopen("flag.txt", "r");
    if (flag == NULL)
    {
        printf("Flag not found. Please run this on the server\n");
        fflush(stdout);
        exit(0);
    }

    char flag_content[100];
    fgets(flag_content, sizeof(flag_content), flag);
    printf("Congratulations! You found both endian representations correctly!\n");
    fflush(stdout);
    printf("Your Flag is: %s\n", flag_content);
    fflush(stdout);
    exit(0);

    return 0;
}
```

I copy the `find_little_endian` and `find_big_endian` functions and the imports and make my own C script to parse the word we are given.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>
#include <time.h>

char *find_little_endian(const char *word)
{
    size_t word_len = strlen(word);
    char *little_endian = (char *)malloc((2 * word_len + 1) * sizeof(char));

    for (size_t i = word_len; i-- > 0;)
    {
        snprintf(&little_endian[(word_len - 1 - i) * 2], 3, "%02X", (unsigned char)word[i]);
    }

    little_endian[2 * word_len] = '\0';
    return little_endian;
}

char *find_big_endian(const char *word)
{
    size_t length = strlen(word);
    char *big_endian = (char *)malloc((2 * length + 1) * sizeof(char));

    for (size_t i = 0; i < length; i++)
    {
        snprintf(&big_endian[i * 2], 3, "%02X", (unsigned char)word[i]);
    }

    big_endian[2 * length] = '\0';
    return big_endian;
}

int main()
{
    char *challenge_word = "WORD GOES HERE";
    char *little_endian = find_little_endian(challenge_word);
    printf(little_endian);
    printf("\n");
    char *big_endian = find_big_endian(challenge_word);
    printf(big_endian);
    exit(0);

    return 0;
}
```

I use the command to join the instance and this is printed:
```
Welcome to the Endian CTF!
You need to find both the little endian and big endian representations of a word.
If you get both correct, you will receive the flag.
Word: gjddf
Enter the Little Endian representation:
```

I replace the `WORD GOES HERE` in my script with `gjddf` and save it.

I compile the code and run it:
```
$ gcc solve.c -o solve
...
$ ./solve
6664646A67
676A646466
```

I put in my answers in order and get the flag:
```
Enter the Little Endian representation: 6664646A67
Correct Little Endian representation!
Enter the Big Endian representation: 676A646466
Correct Big Endian representation!
Congratulations! You found both endian representations correctly!
Your Flag is: picoCTF{3ndi4n_sw4p_su33ess_28329f0a}
```

Some other ways you could do this are with an [Online C Compiler](https://www.onlinegdb.com/online_c_compiler) or you could use a [recipe on CyberChef](https://gchq.github.io/CyberChef/#recipe=To_Hex('Space',0)Remove_whitespace(true,true,true,true,true,false)Swap_endianness('Hex',5,false)&input=Z2pkZGY) to get your values.

Flag: `picoCTF{3ndi4n_sw4p_su33ess_28329f0a}`