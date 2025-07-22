---
title: "Barrier"
description: "Another secret note in the files that you can't translate. Wonder what the secret is here?"
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "cryptography"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



We are supplied a `mix.txt` which is a large text file or various English, Cyrillic and Chinese characters.

I put this into [Dcode.fr's Cipher Identifier](https://www.dcode.fr/cipher-identifier).

It is pretty sure it's a **Skip Cipher**.

Going to the Skip Cipher page, I try the whole of `mix.txt` and get no results...

I look at the `mix.txt` and notice a portion with a `{` and a `}`.

```
yd我,S e眼
Erw前ВCoe出ыEag现шDds了еU. 一л{
l个 n
e人и0Ti，з_ht
 lee
м4nt他оn .似рgw
乎яua
因 asD为нg a长а3tn时 _hn间бbe 的е4 b沉рrfe默еrer而гiau声,3rh音
r i嘶П}ag哑о狼 t。вはle
о
i 
р痩ts当аせti我чこlc在иけeh茫вた  茫а体qd沙еにui漠т荷ie中сをe 看я背tA到 負en他кっdg时 て
s，оい t
```

I copy this into the Skip Cipher decoder, and ignore spaces.

```
y road.  Then was the fear a little quieted  , Вышел из моря на берег, Поворачивается к оdewegs leitet.  Dann beruhigte sich die AngstSECEDU{n0_l4nguag3_b4rri3r}狼は 痩せこけた体に荷を背負ってい我眼前出现了一个人，  他似乎因为长时间的沉默而声音嘶哑。  当我在茫茫沙漠中看到他时，
```
It decodes it!

Flag: `SECEDU{n0_l4nguag3_b4rri3r}`