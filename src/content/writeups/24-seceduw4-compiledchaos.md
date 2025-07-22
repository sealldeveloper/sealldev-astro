---
title: "compiled_chaos"
description: "The next target has been identified, and agents have cleared the cars of the CL-2384 train, and found an unknown implant device attached to the speed controllers. We were able to produce a firmware dump from the device. We need you to find out what this device is doing, and what information it is collecting or sending! Is anyone really bothered to make their own protocol these days?"
pubDate: 2024-10-02
ctf: "SecEdu CTF 2024"
category: "rev"
author: "sealldev & finnersio"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



Opening up the dump in Ghidra, let’s take a look at the defined strings, we see what looks to be HTTP request. Let’s take a look there as we know from the description the firmware was meant to be sending some data.

```
POST %s HTTP/1.1
Host: %s
Connection: close
Content-Type: %s
Content-Length: %d

%s
```

Looking at the `XREF` for the string reveals a function which looks to be constructing a HTTP request from several variables.

```c
  do {
    pbVar1 = pbVar1 + 1;
    *pbVar5 = abStack_120[uVar3];
    uVar3 = (uint)*pbVar1;
    pbVar5 = pbVar5 + 1;
  } while (uVar3 != 0);
  *pbVar5 = *pbVar1;
  uVar2 = FUN_10030cb0(&DAT_20002858);
  FUN_1002e510(&DAT_2000ceb8,0x800,
               "POST %s HTTP/1.1\r\nHost: %s\r\nConnection: close\r\nContent-Type: %s\r\nContent-Len gth: %d\r\n\r\n%s"
               ,&DAT_20002c58,&DAT_20002d58,&DAT_20002758,uVar2,&DAT_20002858);
  return &DAT_2000ceb8;
}
```

Towards the top of the function we can see an array of characters being constructed as `abStack_120` from two strings.

```c
DAT_100385c0 = "?q2AwgR+$&ials-IG5T<}(;cz#S)*mhUb[H4>\\uXpFKd,E`!^9~L\"x8_tVJQ6Beo|]PnZ0=kj.O3{%raw%}{%{%endraw%}M7rY'N@fyC1D/W:"
DAT_10034a99 = "23456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
  do {
    abStack_120[(byte)(&DAT_100385c0)[iVar6]] = bVar4;
    bVar4 = (&DAT_10034a99)[iVar6];
    iVar6 = iVar6 + 1;
  } while (bVar4 != 0);
```

We see from the loop the byte value of each character from `DAT_100385c0` is being used as an index for `abStack_120` and that characters inserted into `abStack_120` are being drawn from `DAT_10034a99`. Let’s reconstruct `abStack_120` with some Python.

```python
chars_into_abstack = "23456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
char_to_index = "?q2AwgR+$&ials-IG5T<}(;cz#S)*mhUb[H4>\\uXpFKd,E`!^9~L\"x8_tVJQ6Beo|]PnZ0=kj.O3{%raw%}{%{%endraw%}M7rY'N@fyC1D/W:"

indexes = [ord(c) for c in char_to_index]
abstack_120 = ['*'] * 256 # '*' is a placeholder for no value
bVar4 = '0'
iVar6 = 0

# First iteration outside the loop
abstack_120[indexes[iVar6]] = bVar4
iVar6 += 1

# Rest of the iterations
for i in range(len(chars_into_abstack)):
	bVar4 = chars_into_abstack[i]
	abstack_120[indexes[iVar6]] = bVar4
	iVar6 += 1
abstack_120 = "".join(abstack_120)
print(abstack_120)
->
# After removing the '*'
MRq9;a@mst8Jf-|)`3/AiZ=TO~nk*B0\4!_{KGhzgXHQ<[.&Y7rjwW}E?(yC%NULcxoI"]6vb,+du'#F2>eVD*5S^p:$lP
```

Further down the function we see `abStack_120` is being used to create a new string `pbVar5`:
```c
uVar3 = "<s[)*Sc<s)e{e-}&ID;v*CTmw*C)*S?;IwC*vlA[WeW"
do {
	pbVar1 = pbVar1 + 1;
	*pbVar5 = abStack_120[uVar3];
	uVar3 = (uint)*pbVar1;
	pbVar5 = pbVar5 + 1;
} while (uVar3 != 0);
```

This time, the characters in `uVar3` determine the index of `abStack_120` and the value stored at that index will be added to `pbVar5`. Let’s create a Python script to recreate the new string.
```python
pbVar1 = "<s[)*Sc<s)e{e-}&ID;v*CTmw*C)*S?;IwC*vlA[WeW"
uVar3 = 'D'  # 0x44
request_body = [abstack_120[ord(uVar3)]]
for char in pbVar1:
	uVar3 = char
	request_body.append(abstack_120[ord(uVar3)])
	if abstack_120[ord(uVar3)] == '*':
		print(ord(uVar3))
DAT_20002858 = "".join(request_body)
->
{keystrokes":"flag{n*t_ju5t_str0ng5_t*d4y}"}
```

Not quite the string, but close enough to fill in the blanks: `flag{not_ju5t_string5_today}`

Flag: `flag{not_ju5t_string5_today}`