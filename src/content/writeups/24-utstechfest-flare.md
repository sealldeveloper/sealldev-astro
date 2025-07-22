---
title: "flare"
description: "we just migrated to cloudflare, i really hope that our flag is protected 😲"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

This took me surprisingly long because I wasn't reading...

When loading to `flare.domain.tld`, clicking the `Go to admin` panel triggers a cloudflare error. If we open the network tab on the main page we can see a call to a `script.js` but its being called from `flare-nonprod` subdomain. 

If we go to `flare-nonprod.domain.tld/admin/` we get the flag, as there is no Cloudflare WAF on the non-production domain.

Flag: `CSEC{1_7H0U6H7_7H47_U51N6_C10UDF14r3_M34N7_W3_W3r3_54F3_Fr0M_4774CK5_:(}`