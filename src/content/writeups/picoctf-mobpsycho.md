---
title: "Mob psycho"
description: "Can you handle APKs?"
pubDate: 2025-03-13
category: "forensics"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
image: "./images/picoctf/mobpsycho/icon.png"
---

We are given a `mobpsycho.apk`, APKs are Android Application Packages and can be decompiled and extracted like ZIP archives to view their contents.

I start by extracting it like a zip with `7z`:
```bash
$ 7z x mobpsycho.apk

7-Zip [64] 17.05 : Copyright (c) 1999-2021 Igor Pavlov : 2017-08-28
p7zip Version 17.05 (locale=utf8,Utf16=on,HugeFiles=on,64 bits,10 CPUs LE)

...

Folders: 46
Files: 726
Size:       10832069
Compressed: 4136368
```

I then use `tree` to view the directory structure:
- `AndroidManifest.xml` contains information about the application, [more information](https://www.geeksforgeeks.org/application-manifest-file-in-android/).
- `META-INF/` folder contains the manifest information and other metadata about the java package carried by the jar file, [more information](https://stackoverflow.com/questions/39305775/what-are-the-purposes-of-files-in-meta-inf-folder-of-an-apk-file).
- `classes.dex` - `classes3.dex` contain compiled Android application source code, [more information](https://stackoverflow.com/questions/14230573/role-of-classes-dex-file-in-an-apk-file).
- `res/` contains all the resources used by the application, [more information](https://developer.android.com/guide/topics/resources/providing-resources).
- `resources.arsc` contains the resources used by the application such as strings, values, styles, and other information. [More information](https://apktool.org/docs/advanced/resources-arsc/).

Most of the interesting files (without decompiling with a program such as `jadx`) are going to be in `res/`.

Some common files are going to contain `pico`, or have `flag` in the name or contents, let's start by using `find`.

```bash
$ find . -name '*pico*'
```

Has no results...

Maybe with `grep` we can check the contents (recursively, and ignoring case with `-iR`)?
```bash
$ grep -iR 'picoCTF' .
```

Nothing! Let's use `find` to see if we can find a flag.

```bash
$ find . -name '*flag*'
./res/color/flag.txt
```

Woo! Let's read that file.

```bash
$ cat res/color/flag.txt
7069636f4354467b6178386d433052553676655f4e5838356c346178386d436c5f35653637656135657d
```

That looks like hexadecimal data, there are various ways we can decode it (CyberChef, Dcode.fr, etc) but I use `python`:
```python
import binascii
print(binascii.unhexlify("7069636f4354467b6178386d433052553676655f4e5838356c346178386d436c5f35653637656135657d"))
```

```bash
$ python3 solve.py
b'picoCTF{ax8mC0RU6ve_NX85l4ax8mCl_5e67ea5e}'
```

Flag: `picoCTF{ax8mC0RU6ve_NX85l4ax8mCl_5e67ea5e}`