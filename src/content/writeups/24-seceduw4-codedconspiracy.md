---
title: "coded_conspiracy"
description: "Our team has discovered a series of binaries on a seized web server associated with NO_NO_NO. These binaries seem to communicate extensively. Your task is to find a way to analyse these messages.\n\n`nc chals.secedu.site 5018`"
pubDate: 2024-10-02
ctf: "SecEdu CTF 2024"
category: "rev"
author: "sealldev & finnersio"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



As part of the challenge we are provided with a binary and something to netcat to, we also know these programs are communicating with each other.

Running `file` on the provided binary we see it’s stripped, meaning we won’t have any debugging symbols like function names to help us analyse the program.

```bash
$ file mystery
mystery: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, stripped
```

Running the `strings` command we can see the file is presumably written in the go programming language.

```bash
$ strings mystery | tail
.noptrbss
.go.fuzzcntrs
.go.buildinfo
.elfdata
.rodata
.typelink
.itablink
.gosymtab
.gopclntab
.shstrtab
```

Running the binary, we get what looks to be gibberish or encoded data:

```
./mystery
Received: bhOz*
               ;
                *
rt^RGLwOQ~DH~N1iSu^Yu^OSL~oODoToGP tDH~DH6fYuMHs(
                                                   tDR~IHrER!
_wEO~'6_KH~VER7
+
o~Z)/
+	+
{V~1yYi\Yi^ip]
hK_4	(k 1cGP;\YiYUtD9~D_tNUuM9COt#6$6'
                                         xTihBzy;BHvFK~Wc4k(i4nh_
dS~qW
5OX]uYUoCSuKP4y6;
;
;
6^NzDOr^UtD]wXoN% s^Qw*xOncBHvF
DvFRhs^Hk4]KlK(SiM*"Ds^QcGP!F]uM9OR9
;UEH;cQkFYvORoOX'Hr^P~6sO]6^tNE% 5T*	+6
% 5'^tNE% 4BHvFB
```

*For those wondering what this says, you’ll want to investigate the while loop at the end of the main function*

We get some more gibberish when we connect via `nc`:
```bash
$ nc chals.secedu.site 5018
DS;LPzM}EN;SSn
```

After doing a quick google on reversing Go binaries it looks like you can get most of the function names back in debuggers like IDA and Ghidra using some scripts. I decided to use Ghidra and [GoReSym](https://github.com/mandiant/GoReSym) to get the function names back.

After running GoReSym we can see a `main.main` function is identified in the functions window. There is a lot of stuff going on but right near the top of the function is a for loop which is XOR’ing some variable.

```go
for (lVar4 = 0; lVar4 < 0x29; lVar4 = lVar4 + 1) {
    uVar2 = lVar4 + (SUB168(SEXT816(-0x5555555555555555) * SEXT816(lVar4),8) + lVar4 >> 1) * -3;
    if (2 < uVar2) goto LAB_004d2ea5;
    *(byte *)(lVar1 + lVar4) = *(byte *)((long)&local_7b + uVar2) ^ *(byte *)(lVar4 + local_18);
  }
```

Let’s investigate, click on the beginning of the for loop and take a look at the listing window in ghidra and find the memory address for the instruction. Start up gdb and set a breakpoint:

```c
gdb mystery
(gdb) break *0x004d2be4
Breakpoint 1 at 0x4d2be4
(gdb) r
Thread 1 "mystery" hit Breakpoint 1, 0x00000000004d2be4 in ?? ()
```

After taking a look at the registries, I didn’t find much. Let’s see what they look like after an iteration of the loop.

```c
(gdb) c
Continuing.
Thread 1 "mystery" hit Breakpoint 1, 0x00000000004d2be4 in ?? ()
(gdb) i r
...
(gdb) x/s $rsi
0xc0000b6000:	"Hello, Server! Can I get the flag please?"
(gdb) x/s $rax
0xc00001c0f0:	"b"
```

After inspecting all the registries I found `rsi` and `rax` were storing strings, presumably the data being XOR’d in `rsi` and the result of the XOR in `rax`. Let’s find out, back in Ghidra find the ^ in the for loop’s body and set another breakpoint in gdb at this memory address.

```c
(gdb) break *0x004d2bcc
Breakpoint 2 at 0x4d2bcc
(gdb) r
(gdb) c
(gdb) c
Continuing.
Thread 1 "mystery" hit Breakpoint 2, 0x00000000004d2bcc in ?? ()
```

Analysing the instruction pointer we can see `edx` and `edi` are being XOR’d

```c
(gdb) x/i $rip
=> 0x4d2bcc:	xor    %edx,%edi
(gdb) i r
...
rdx            0x48                72
rdi            0x2a                42
...
```

We see `rdx` is storing `0x48` which corresponds to the ASCII value of ‘H’ and `rdi` is storing `0x2a`. `0x48 ^ 0x2a = 0x62` aka ‘b’, terrific news we’ll call it a day and skip to the end of the for loop...

```c
(gdb) x/s $rsi
0xc0000b2000:	"Hello, Server! Can I get the flag please?"
(gdb) x/s $rax
0xc0000b2030:	"bYwFS7\no~XJ~X\035;i]u\nu;MYo\nHsO\034}F]|\nLwO]hO\003"
```

Ah, not so fast `rsi ^ 0x2a` is not what’s ended up in `rax`, maybe the key is different for every character...

Let’s head back to breakpoint 2 and continue through the loop, examining the contents of the XOR key in `rdi` each time.

```c
// First iteration
rdi = 0x2a
// Second Iteration
rdi = 0x3c
// Third Iteration
rdi = 0x1b
// Fourth iteration
rdi = 0x2a
// Fifth Iteration
rdi = 0x3c
// Sixth Iteration
rdi = 0x1b
...
```

From this we can determine the XOR key is `2a3c1b`. We can also confirm this by looking at the value of `rax` which increments a counter to 2 on each iteration of the loop before resetting to 0.

Let’s send the string in `rax` to the server and see what we get:
```bash
$ echo -ne "bYwFS7\no~XJ~X\035;i]u\nu;MYo\nHsO\034}F]|\nLwO]hO\003" | nc chals.secedu.site 5018
bYwFS7
_wCYu^;O~
HsCO;^S;XYj_Yh^oBY;LPzM;DSuERt
                              #ZNZz#(
```

We get a different response this time, let’s decode this with our new found XOR key:
```
Hello, client! Use this to request the flag: nonono5783fddfa9383839
```

Take the `nonono5783fddfa9383839` and XOR that with the key and convert the result to hex with delimiter `\x` using [cyberchef](https://gchq.github.io/CyberChef/#recipe=XOR(%7B'option':'Hex','string':'2a3c1b'%7D,'Standard',false)To_Hex('%5C%5Cx',0)&input=bm9ub25vNTc4M2ZkZGZhOTM4MzgzOQ&oeol=VT). Let’s send that back to the server like it asked:

```bash
$ echo -ne "\x44\x53\x75\x45\x52\x74\x1f\x0b\x23\x19\x5a\x7f\x4e\x5a\x7a\x13\x0f\x23\x19\x04\x28\x13" | nc chals.secedu.site 5018 | xxd
```

We get some non-ascii characters in the response so I will take a hexdump instead and again XOR the result in [cyberchef](https://gchq.github.io/CyberChef/#recipe=From_Hex('Auto')XOR(%7B'option':'Hex','string':'2a3c1b'%7D,'Standard',false)&input=Nzk3OSA1ODZmIDc4NGUgNTE2NCAyYjc4IDYzNDIgMWE2OSA0OTc1IDBmNDIgMTk2ZiA0NDFhIDcyNTcgNzM0MQ) for the flag: `SECEDU{X0R_Y0UR_3Y3S_0NLY}`

Flag: `SECEDU{X0R_Y0UR_3Y3S_0NLY}`