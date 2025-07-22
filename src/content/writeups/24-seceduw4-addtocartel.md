---
title: "add_to_cartel"
description: "Whispers in the digital underground hint at a startling revelation about NO_NO_NO's elusive funding source. Buried in encrypted data streams, links to a cryptic online storefront have surfaced. Could this innocuous merch shop be the key to NO_NO_NO's financial puzzle? Stranger still, the store is offering free merchandise as part of a limited time promotion. Might as well grab some free merch while it’s available?\n\n`http://chals.secedu.site:5016`"
pubDate: 2024-10-02
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev & finnersio"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



We are first presented with what looks like a store page to buy merchandise:
![storesite.png](images/24-secedu/storesite.png)

The only interactive portion of the site is the merch request form, that sends a `POST` request.

We can view that using either a MITM Proxy or just the Network Tab.

When submitting the default request, it replies with an error: `You must be a member to request free merch`

Looking at the `POST` has the following payload:
```
-----------------------------429214736125992314531083334719
Content-Disposition: form-data; name="name"

a
-----------------------------429214736125992314531083334719
Content-Disposition: form-data; name="email"

a@a.a
-----------------------------429214736125992314531083334719
Content-Disposition: form-data; name="address"

a
-----------------------------429214736125992314531083334719
Content-Disposition: form-data; name="role"

viewer
-----------------------------429214736125992314531083334719--
```

There is a `role` attribute to the form. Changing this to `member` and sending the request should reveal the flag.

The server responds with: `Congratulations! Not only do you get a free Hoodie, you also get a flag: SECEDU{yes_yes_yes_we_want_free_merch}`

Flag: `SECEDU{yes_yes_yes_we_want_free_merch}`