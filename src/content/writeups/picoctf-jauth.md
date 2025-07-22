---
title: "JAuth"
description: "Most web application developers use third party components without testing their security. Some of the past affected companies are:\n\nEquifax (a US credit bureau organization) - breach due to unpatched Apache Struts web framework CVE-2017-5638\nMossack Fonesca (Panama Papers law firm) breach - unpatched version of Drupal CMS used\nVerticalScope (internet media company) - outdated version of vBulletin forum software used\n\nCan you identify the components and exploit the vulnerable one? Can you become an `admin`? You can login as `test` with the password `Test123!` to get started.\n\nHint: Use the web browser tools to check out the JWT cookie.\nHint: The JWT should always have two (2) . separators."
pubDate: 2025-03-13
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
image: "./images/picoctf/jauth/icon.png"
---

We have a webapp with a login page, we can use the credentials supplied in the challenge description. Username `test` and password `Test123!`.
![login.png](images/picoctf/jauth/login.png)

Before I login, I set up Burp Suite with PwnFox to intercept my requests, and view what is being transmitted.

Now I login and we are presented this page:
![testuserauth.png](images/picoctf/jauth/testuserauth.png)

This is very uninteresting... Let's check Burp Suite, the challenge mentions a JWT cookie in the hints so let's look for that.

I find the POST request and response for the login:
```
POST /auth HTTP/1.1
Host: saturn.picoctf.net:63252
...

username=test&password=Test123%21
```

The response set's the cookie:
```
HTTP/1.1 302 Found
Set-Cookie: token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdXRoIjoxNzQxODY1Mzk2NTM2LCJhZ2VudCI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwLjE1OyBydjoxMzYuMCkgR2Vja28vMjAxMDAxMDEgRmlyZWZveC8xMzYuMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQxODY1Mzk3fQ.3Ba3iCnGmW-D11AxSUP4P_jJbcU58IXnb6e2j63M9rg; path=/; httponly
Location: /private
...
```

We can use jwt.io to decode and read the contents of the cookie:
![jwt.png](images/picoctf/jauth/jwt.png)

The data of the JWT has the `role` set to `user`, if we have the key or find some way to modify the JWT, we can update it to `admin` and get the flag!

Looking at common JWT vulnerabilities, this [PortSwigger article](https://portswigger.net/web-security/jwt) contains a lot of information!

[This specific section](https://portswigger.net/web-security/jwt#accepting-tokens-with-no-signature) is of interest:
> JWTs can be signed using a range of different algorithms, but can also be left unsigned. In this case, the `alg` parameter is set to `none`, which indicates a so-called "unsecured JWT". Due to the obvious dangers of this, servers usually reject tokens with no signature. However, as this kind of filtering relies on string parsing, you can sometimes bypass these filters using classic obfuscation techniques, such as mixed capitalization and unexpected encodings. 

So if we set it to `none`, where there is no verification of the signature, we can change the content to whatever we want!

Let's use the jwt.io encoder to change the `role` to `admin` and the `alg` to `none`:
![jwtencode.png](images/picoctf/jauth/jwtencode.png)

Using this output JWT, we can forge a request:
```
GET /private HTTP/1.1
Host: saturn.picoctf.net:63252
Cookie: token=<new forged JWT>
...
```

The server responds and it contains our flag!
![flag.png](images/picoctf/jauth/flag.png)

Flag: `picoCTF{succ3ss_@u7h3nt1c@710n_72bf8bd5}`
