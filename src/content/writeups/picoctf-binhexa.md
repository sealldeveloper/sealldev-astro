---
title: "binhexa"
description: "How well can you perfom basic binary operations? Start searching for the flag here\n\n`nc titan.picoctf.net 56491`"
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

Running the supplied command prompts with some questions.

#### Q1

```
$ nc titan.picoctf.net 56491

Welcome to the Binary Challenge!"
Your task is to perform the unique operations in the given order and find the final result in hexadecimal that yields the flag.

Binary Number 1: 01111110
Binary Number 2: 01110111


Question 1/6:
Operation 1: '+'
Perform the operation on Binary Number 1&2.
Enter the binary result:
```

Using `+` we need to add the integers together and then convert the solution to binary.

`01111110` is 2+4+8+16+32+64 = 126

`01110111` is 1+2+4+16+32+64 = 119

126+119 is 245.

You can also do these steps with Python.

```
>>> int("01111110",2)
126
>>> int("01110111",2)
119
>>> int("01111110",2)+int("01110111",2)
245
```

Using Python we can do `bin(245)` to convert it to binary:
```
>>> bin(245)
'0b11110101'
```

Which is the answer: `011110101`.

#### Q2

```
Question 2/6:
Operation 2: '>>'
Perform a right shift of Binary Number 2 by 1 bits .
Enter the binary result:
```

The second binary number is `01110111` and the right shift is how many bits we need to move it. The bits in shifted right once are `00111011`.

#### Q3

```
Question 3/6:
Operation 3: '<<'
Perform a left shift of Binary Number 1 by 1 bits.
Enter the binary result:
```

Binary Number 1 is `01111110` and we need to shift it left once, which is `11111100`.

#### Q4

```
Question 4/6:
Operation 4: '*'
Perform the operation on Binary Number 1&2.
Enter the binary result:
```

Multiplying 126 and 119 to a binary output we can do with a one-liner in Python.
```
>>> bin(126*119)
'0b11101010010010'
```

Which is `011101010010010`.

#### Q5

```
Question 5/6:
Operation 5: '&'
Perform the operation on Binary Number 1&2.
Enter the binary result:
```

The `&` operand is 'and' and means if we have two `1`'s then the output should be one, every other case is a `0`, lets do this with the numbers.

`01111110` and `01110111` with an `&` result in `01110110`.

#### Q6

```
Question 6/6:
Operation 6: '|'
Perform the operation on Binary Number 1&2.
Enter the binary result:
```

The `|` operand is 'or' and means if we have a single `1` in common between the numbers its a `1`, otherwise only if we have two `0`'s do we get a `0`,.

`01111110` and `01110111` with an `|` result in `01111111`.

#### Q7?

```
Enter the results of the last operation in hexadecimal:
```

Let's convert `01111111` to hex with Python.

```
>>> hex(int("01111111",2))
'0x7f'
```

`hex()` converts a given number to hexadecimal, while `int("...",2)` converts binary to a number.

Inputting `7f` gives us the flag!

Flag: `picoCTF{b1tw^3se_0p3eR@tI0n_su33essFuL_6862762d}`