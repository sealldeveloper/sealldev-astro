---
title: "Open Sesame"
description: "Whisper the phrase, unveil with 'Open Sesame"
pubDate: 2023-12-18
ctf: "BackdoorCTF 2023"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/23-backdoor/icon.png"
---

I went into this flag with no previous Android application knowledge, so I learnt this one on the fly!

After downloading and seeing `open_sesame.apk` I immediately opened it with jadx. I searched for the 'flag' phrase in the code and found an entry with some code.

```java
public void validateCredentials() {
	String trim = this.editTextUsername.getText().toString().trim();
	String trim2 = this.editTextPassword.getText().toString().trim();
	if (trim.equals(valid_user) && n4ut1lus(trim2)) {
		String str = "flag{" + flag(Integer.toString(sl4y3r(sh4dy(trim2))), "U|]rURuoU^PoR_FDMo@X]uBUg") + "}";
		return;
	}
	showToast("Invalid credentials. Please try again.");
}
```
and up the top, some credentials...

```java
private static final int[] valid_password = {52, AppCompatDelegate.FEATURE_SUPPORT_ACTION_BAR, 49, 98, 97, 98, 97};
private static final String valid_user = "Jack Ma";
```
The app takes a password and username. In the password is an unknown value (`AppCompatDelegate.FEATURE_SUPPORT_ACTION_BAR`) which can be found by searching for the value in the code, which returns the value `108`.

Username: We are given, `Jack Ma`

Password: Encoded in decmial! `52 108 49 98 97 98 97` -> `4l1baba`.

Now, how to show the flag..?

I did this by decompiling the APK with apktool (`apktool d open_sesame.apk`) and editing the Smali code to show the flag as a toast! Changing just before `goto :goto_56` to add these lines will display the flag as a toast upon correct credential entry.

```
move-result-object v0

invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
```

Then recompiling (`apktool b open_sesame -o open_sesame_repack.apk`), executing the APK and putting in the correct credentials shows our flag!

Flag: `flag{aLiBabA_and_forty_thiEveS}`

**Files:** [opensesame.zip](https://web.archive.org/web/20231218155829/https://staticbckdr.infoseciitr.in/opensesame.zip)