---
title: "valentines-day"
description: "Happy Valentine's Day! I'm unfortunately spending my Valentine's Day working on my CS131 homework. I'm getting bored so I wrote something for my professor. To keep it secret, I encrypted it with a Vigenere cipher with a really long key (161 characters long!) As a hint, I gave you the first part of the message I encrypted. Surely, you still can't figure it out though? Flag format is lactf{xxx} with only lower case letters, numbers, and underscores between the braces."
pubDate: 2024-02-19
ctf: "LACTF 2024"
category: "crypto"
author: "sealldev"
section: "CTFs"
image: "images/24-lactf/icon.gif"
---

We are given both a ciphertext and a sample of the text, I actually approached this challenge without using the sample text at all.

I opened up Cryptool 1 on Windows and analysed the text as a Vignere. I supplied the key length as 161 and was given a key, after fixing a few typos from the [very recognisable song](https://www.youtube.com/watch?v=dQw4w9WgXcQ), we are given our key!

Key: `NEVERGONNAGIVEYOUUPNEVERGONNALETYOUDOWNNEVERGONNARUNAROUNDANDDESERTYOUNEVERGONNAMAKEYOUCRYNEVERGONNASAYGOODBYENEVERGONNATELLALIEANDHURTYOUIHOPEYOUENJOYEDTHISSONG`

Decrypting the cipher, we spot a flag.

Flag: `lactf{known_plaintext_and_were_off_to_the_races}`