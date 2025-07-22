---
title: "Custom encryption"
description: "Can you get sense of this code file and write the function that will decode the given encrypted file content. Find the encrypted file here flag_info and code file might be good to analyze and get the flag."
pubDate: 2024-03-27
category: "crypto"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
---

We are given a `custom_encryption.py` and a `enc_flag` file. Reading the script it seems to be a script that utilises XOR and some number editing. The `enc_flag` gives a few set values:
```
a = 89
b = 27
cipher is: [33588, 276168, 261240, 302292, 343344, 328416, 242580, 85836, 82104, 156744, 0, 309756, 78372, 18660, 253776, 0, 82104, 320952, 3732, 231384, 89568, 100764, 22392, 22392, 63444, 22392, 97032, 190332, 119424, 182868, 97032, 26124, 44784, 63444]
```

The contents of the `custom_encryption.py`.
```py
from random import randint
import sys


def generator(g, x, p):
    return pow(g, x) % p


def encrypt(plaintext, key):
    cipher = []
    for char in plaintext:
        cipher.append(((ord(char) * key*311)))
    return cipher


def is_prime(p):
    v = 0
    for i in range(2, p + 1):
        if p % i == 0:
            v = v + 1
    if v > 1:
        return False
    else:
        return True


def dynamic_xor_encrypt(plaintext, text_key):
    cipher_text = ""
    key_length = len(text_key)
    for i, char in enumerate(plaintext[::-1]):
        key_char = text_key[i % key_length]
        encrypted_char = chr(ord(char) ^ ord(key_char))
        cipher_text += encrypted_char
    return cipher_text


def test(plain_text, text_key):
    p = 97
    g = 31
    if not is_prime(p) and not is_prime(g):
        print("Enter prime numbers")
        return
    a = randint(p-10, p)
    b = randint(g-10, g)
    print(f"a = {a}")
    print(f"b = {b}")
    u = generator(g, a, p)
    v = generator(g, b, p)
    key = generator(v, a, p)
    b_key = generator(u, b, p)
    shared_key = None
    if key == b_key:
        shared_key = key
    else:
        print("Invalid key")
        return
    semi_cipher = dynamic_xor_encrypt(plain_text, text_key)
    cipher = encrypt(semi_cipher, shared_key)
    print(f'cipher is: {cipher}')


if __name__ == "__main__":
    message = sys.argv[1]
    test(message, "trudeau")
```

So, to reverse the steps for the encryption we must do the following:
- Redefine `a` and `b` to be the values given.
- Make the input `cipher`.
- Reverse the order of steps so the `encrypt` then `dynamic_xor_encrypt` functions occur (in that order).
- Make a `decrypt` function by reversing the effects of `encrypt`.
- Make a `dynamic_xor_decrypt` by reversing the functions of `dynamic_xor_encrypt`.
- Print the plaintext.

So, step 1, 2 and 3 are easy, now let's make the `decrypt` and `dynamic_xor_decrypt` functions.

For `encrypt` they do the following:
- Take each character of the plaintext, convert it into a number for that character and multiply it by `key*311`.
- Return it in a list.

So for `decrypt` we should:
- Input a list, and for each item in the list, divide it by `key*311` to an integer then use `chr()` to convert it to a character.
- Return it in a string.

```python
def decrypt(cipher, key):
    pt = ""
    for char in cipher:
        pt+=chr(char//(key*311))
    return pt
```

Now for `dynamic_xor_decrypt`.

For `dynamic_xor_encrypt`, the following occurs:
- For each index and character in the plaintext read backwards:
  - Select the character in by `index % length of the key`
  - Encrypt it by getting a character out of the plaintext message key, converting it to an integer, and doing the same with they key to do one to the power of the other to get a new character.
  - Add it to the outputted cipher text

For `dynamic_xor_decrypt` all we need to do is read the text forwards and output it backwards to get the correct result:
```python
def dynamic_xor_decrypt(cipher_text, text_key):
    plaintext = ""
    key_length = len(text_key)
    for i, char in enumerate(cipher_text):
        key_char = text_key[i % key_length]
        decrypted_char = chr(ord(char) ^ ord(key_char))
        plaintext += decrypted_char
    return plaintext[::-1]
```

I then make this the new Python code:
```python
def test(cipher, text_key):
    p = 97
    g = 31
    a=89
    b=27
    u = generator(g, a, p)
    v = generator(g, b, p)
    key = generator(v, a, p)
    b_key = generator(u, b, p)
    shared_key = None
    if key == b_key:
        shared_key = key
    else:
        print("Invalid key")
        return
    
    pt = decrypt(cipher, shared_key)
    out = dynamic_xor_decrypt(pt, text_key)
    print(out)


if __name__ == "__main__":
    message=[33588, 276168, 261240, 302292, 343344, 328416, 242580, 85836, 82104, 156744, 0, 309756, 78372, 18660, 253776, 0, 82104, 320952, 3732, 231384, 89568, 100764, 22392, 22392, 63444, 22392, 97032, 190332, 119424, 182868, 97032, 26124, 44784, 63444]
    test(message, "trudeau")
```

And running it gives the flag!

Flag: `picoCTF{custom_d2cr0pt6d_dc499538}`