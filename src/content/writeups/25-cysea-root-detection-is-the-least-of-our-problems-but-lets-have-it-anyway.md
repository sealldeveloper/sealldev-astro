---
title: "Root Detection is the least of our problems but let's have it anyway"
description: "In an attempt to implement security best practices, the mobile developers has implemented a root detection mechanism. Can you identify all the binaries that they check for? The flag may or may not be in that list :)"
pubDate: 2025-08-05
ctf: "CySea 2025"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---

# Goal

We are given an APK file, we need to locate the root detection mechanisms and find a flag inside it.

# Foothold

Generally you start reverse engineering an APK with jadx, I did this for a while and there was actually nothing of interest... odd

I then used apktool:
```bash
$ apktool d voting-app.apk
I: Using Apktool 2.12.0 on voting-app.apk with 8 threads
I: Baksmaling classes.dex...
I: Loading resource table...
I: Baksmaling classes2.dex...
I: Baksmaling classes3.dex...
I: Decoding file-resources...
I: Loading resource table from file: .../apktool/framework/1.apk
I: Decoding values */* XMLs...
I: Decoding AndroidManifest.xml with resources...
I: Copying original files...
I: Copying assets...
I: Copying lib...
I: Copying unknown files...
```

Inside was mostly the usual compiled Smali for the app, I decide to try and determine which files may be relevant by doing a `grep` for `/su` and only one file matches inside `assets`:
```bash
$ grep -iR "/su" assets/
Binary file assets/index.android.bundle matches
```

What is this bundle file?

# Hermes

Running `file` on the file returns the following:
```bash
$ file index.android.bundle
index.android.bundle: Hermes JavaScript bytecode, version 96
```

What is Hermes? As [FaceBook's own repo](https://github.com/facebook/hermes) describes it:
> Hermes is a JavaScript engine optimized for fast start-up of React Native apps. It features ahead-of-time static optimization and compact bytecode.

Interesting! Can we decompile it? With a little bit of searching I find [hermes-dec](https://github.com/P1sec/hermes-dec)

I setup an environment with the repo and use the tool:

```bash
$ git clone git@github.com:P1sec/hermes-dec.git
$ cd hermes-dec
$ ./hbc_decompiler.py ../index.android.bundle > ../hermes-script.js
$ head ../hermes-script.js
_fun0: for(var _fun0_ip = 0; ; ) switch(_fun0_ip) {
case 0:
    __BUNDLE_START_TIME__ = undefined;
    __DEV__ = undefined;
    process = undefined;
    __METRO_GLOBAL_PREFIX__ = undefined;
    r4 = this;
    r0 = global;
    r1 = r0.globalThis;
    r1 = r1.nativePerformanceNow;
```

Looking in the `hermes-script.js` for `/su` I get a good hit here:
```js
r3 = ['/system/of/a/down/su', '/oops/system/bin/su', '/oops/system/xbin/su', '/oops/sbin/su', '/oops/system/su', '/oops/vendor/bin/su', '/oops/system/app/Superuser.apk', '/oops/system/app/SuperSU.apk', '/oops/system/xbin/which', '/oops/data/local/xbin/su', '/oops/data/local/bin/su', '/oops/system/sd/xbin/su', '/oops/system/bin/failsafe/su', 'Y3lzZWF7dWhfdGhpc19haW50X2FfYmluYXJ5X2J1dF9oZXJlJ3NfYV9mbGFnX2M4YWRmYmZmY2R9Cg=='];
```

What's that Base64?

```bash
$ echo "Y3lzZWF7dWhfdGhpc19haW50X2FfYmluYXJ5X2J1dF9oZXJlJ3NfYV9mbGFnX2M4YWRmYmZmY2R9Cg==" | base64 -d
cysea{uh_this_aint_a_binary_but_here's_a_flag_c8adfbffcd}
```

Flag: `cysea{uh_this_aint_a_binary_but_here's_a_flag_c8adfbffcd}`

This challenge also gave me a lovely opportunity to set up a rooted AVD Android testing environment, and [write about it](/blog/rooted-android-vm-with-android-studio)!
# Cheese Solves

Using `strings` with the Base64 of the flag header:
```bash
$ strings voting-app.apk | grep 'Y3lzZW'
...FONT_FAMILY3lzZWF7dWhfdGhpc19haW50X2FfYmluYXJ5X2J1dF9oZXJlJ3NfYV9mbGFnX2M4YWRmYmZmY2R9Cg==Are...
```

Using `strings` on the bundle directly (once `apktool d` has been used) with the same idea, but even lazier:
```bash
$ strings index.android.bundle| grep '=='
...GGLE_DRAWERR_FONT_FAMILY3lzZWF7dWhfdGhpc19haW50X2FfYmluYXJ5X2J1dF9oZXJlJ3NfYV9mbGFnX2M4YWRmYmZmY2R9Cg==Are you sure you ...
==5>5?5a+
S==;4
```