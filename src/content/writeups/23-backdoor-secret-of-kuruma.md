---
title: "Secret-of-kuruma"
description: "Madara attacked leaf village. everyone wants Naruto to turn into Nine-Tails, Naruto don't know what's the SECRET to change its role to 'NineTails'? can you as a shinobi help Naruto??? username: Naruto Password: Chakra"
pubDate: 2023-12-18
ctf: "BackdoorCTF 2023"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/23-backdoor/icon.png"
---

We are given a webpage with a username password field and some creds to start (`Naruto:Chakra`). After logging in two hyperlinks are provided, one being of interest, `/secret_of_Kuruma`. 

Looking at the cookies we see a `jwt_token`. If we look at the data (using [jwt.io](https://jwt.io)) we see its a HMAC256 and has a username and role field.

```json
{
	"username": "Naruto",
	"role": "shinobi"
}
```

The challenge is trying to get us NineTails role, so we need to break the SHA256 on it. I saved the JWT and used `john` with the [rockyou wordlist](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Leaked-Databases/rockyou.txt.tar.gz) to bruteforce it.
```
$ hashcat -a 0 -m 16500 jwt.hash ~/.../SecLists/Passwords/Leaked-Databases/rockyou.txt
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 16500 (JWT (JSON Web Token))
```

This gives us the password: `minato`. We can then use [jwt.io](https://jwt.io/) to remake the JWT with our role: `NineTails!`

Flag: `flag{y0u_ar3_tru3_L34F_sh1n0b1_bf56gtr59894}`