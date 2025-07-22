---
title: "Worthy Knight"
description: "The gates of the Crimson Keep stand locked, sealed by cryptic runes from ages past. Many challengers have tested their might against these ancient wards—yet all were found wanting. Will you speak the correct incantation and earn the Keep’s hidden treasures? Prove your valor and stand among legends… if you truly are a Worthy Knight."
pubDate: 2025-01-22
ctf: "KnightCTF 2025"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/25-knight/icon.png"
---



Another binary, ELF, you know the gist by now... I open Ghidra.

We have to get 5 pairs of characters:

First:

```c
      if ((byte)(local_c8[1] ^ local_c8[0]) == 0x24) {
        if (local_c8[1] == 0x6a) {
```

Second:

```c
          if ((local_c8[2] ^ local_c8[3]) == 0x38) {
            if (local_c8[3] == 0x53) {
```

Third is a hash, we can crack this with hashcat/johntheripper as its just 2 characters. I crack it and it is `Tf`. But this proves to be useless due to something we see later.

Fourth:

```c
                if ((local_c8[6] ^ local_c8[7]) == 0x38) {
                  if (local_c8[7] == 0x61)
```

Fifth:

```c
                    if ((byte)(local_c8[9] ^ local_c8[8]) == 0x20) {
                      if (local_c8[9] == 0x69) {
```

But this was incorrect and Ghidra was not being helpful, its decompilation was quite unclear and after calculating the values it was wrong. My teammate (Solopie) puts the binary into dogbolt and the HexRays decompile was a lot more helpful.

First:

```c
  if ( (s[0] ^ s[1]) != 36 )
  {
    puts("\nThe wards reject your Pair 1.");
    puts(aTheAncientDrag);
    return 1;
  }
  if ( s[1] != 106 )
  {
    puts("\nThe wards reject your Pair 1 second char.");
    puts(aTheAncientDrag);
    return 1;
  }
```

- `s[1]` = 'j' (106)
- `s[0]` = 106 ^ 36 = 78 ('N')
  Result: "Nj"

Second:

```c
  if ( (s[3] ^ s[2]) != 56 )
  {
    puts("\nThe wards reject your Pair 2.");
    puts(aTheAncientDrag);
    return 1;
  }
  if ( s[3] != 83 )
  {
    puts("\nThe wards reject your Pair 2 second char.");
    puts(aTheAncientDrag);
    return 1;
  }
```

- `s[3]` = 'S' (83)
- `s[2]` = 83 ^ 56 = 107 ('k')
  Result: "kS"

Third is still the hash, but I notice there is some preprocessing (which was in Ghidra but more irritating to spot for myself):

```c
  v15 = 0;
  v9 = v16;
  *(_WORD *)v14 = __ROL2__(*(_WORD *)&s[4], 8);
  v10 = strlen(v14);
  v11 = s1;
  MD5(v14, v10, v16);
  do
  {
    v12 = (unsigned __int8)*v9;
    v13 = v11;
    v11 += 2;
    ++v9;
    sprintf(v13, "%02x", v12);
  }
  while ( &v18 != v11 );
  v18 = 0;
  v7 = strcmp(s1, "33a3192ba92b5a4803c9a9ed70ea5a9c");
  if ( v7 )
  {
    puts("\nThe dragon's eyes glow red... The final seal remains locked.");
    puts(aTheAncientDrag);
    return 1;
  }
```

What this is doing is before doing a comparison it is modifying the input.

1. Takes the two characters as a 16-bit word
2. Rotates left by 8 bits (swaps the bytes)
3. Calculates MD5 hash

We can replicate this process in Python and find the correct characters. The characters are going to be a lowercase and uppercase letter.

Let's do it with this Python script:

```python
import hashlib
import string
import itertools

letters = string.ascii_letters
pairs = itertools.product(letters, repeat=2)

for c1, c2 in pairs:
    pair = bytes([ord(c1), ord(c2)])
    rotated = bytes([pair[1], pair[0]])
    md5_hash = hashlib.md5(rotated).hexdigest()
    if md5_hash == "33a3192ba92b5a4803c9a9ed70ea5a9c":
        print(f"Found match: {c1}{c2}")
        break
```

It returns `fT` (the inverse of the cracked hash, :p).

Fourth:

```c
  if ( (s[7] ^ s[6]) != 56 )
  {
    puts("\nThe wards reject your Pair 4.");
    puts(aTheAncientDrag);
    return 1;
  }
  if ( s[7] != 97 )
  {
    puts("\nThe wards reject your Pair 4 second char.");
    puts(aTheAncientDrag);
    return 1;
  }
```

- `s[7]` = 'a' (97)
- `s[6]` = 97 ^ 56 = 89 ('Y')
  Result: "Ya"

Fifth:

```c
  if ( (s[8] ^ s[9]) != 32 )
  {
    puts("\nThe wards reject your Pair 5.");
    puts(aTheAncientDrag);
    return 1;
  }
  if ( s[9] != 105 )
  {
    puts("\nThe wards reject your Pair 5 second char.");
    puts(aTheAncientDrag);
    return 1;
  }
```

- `s[9]` = 'i' (105)
- `s[8]` = 105 ^ 32 = 73 ('I')
  Result: "Ii"

The final string is: `NjkSfTYaIi`!

```bash
$ ./worthy.knight
                       (Knight's Adventure)

         O
        <M>            .---.
        /W\           ( -.- )--------.
   ^    \|/            \_o_/         )    ^
  /|\    |     *      ~~~~~~~       /    /|\
  / \   / \  /|\                    /    / \
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Welcome, traveler. A mighty dragon blocks the gate.
Speak the secret incantation (10 runic letters) to continue.

Enter your incantation: NjkSfTYaIi

   The kingdom's gates open, revealing the hidden realm...
                         ( (
                          \ \
                     .--.  ) ) .--.
                    (    )/_/ (    )
                     '--'      '--'
    "Huzzah! Thy incantation is true. Onward, brave knight!"

The final scroll reveals your reward: KCTF{NjkSfTYaIi}
```

Flag: `KCTF{NjkSfTYaIi}`
