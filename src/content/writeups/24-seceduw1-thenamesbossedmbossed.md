---
title: "The name's Bossed, M. Bossed!"
description: "Whilst scanning the network we found an unknown service running on port 4953. What could it be?"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



Using the same domain as earlier `chals.secedu.site`, I run an `nmap` scan on port `4953`. Taking a guess I notice the `53` and presume its related to DNS, as port `53` is used for DNS.

Note: I seemed to have noticed some inconsistency in `nmap`'s results for figuring out what service this is, sometimes getting something `db` related.

```
PORT     STATE SERVICE VERSION
4953/tcp open  domain  dnsmasq 2.68
| dns-nsid:
|_  bind.version: dnsmasq-2.68
```

Starting with a usage of `chaos` which can return metadata about the DNS server, we can see the version like how `nmap` has.

```bash
$ dig @chals.secedu.site -p 4953 chaos txt version.bind +short
"dnsmasq-2.68"
```

I then look into `chals.secedu.site` as thats the subdomain we are on:
```bash
$ dig @chals.secedu.site -p 4953 chals.secedu.site +short
172.31.0.25
```

An `A` record is interesting, I then do a reverse lookup of the IP below that one: `172.31.0.24`.

```bash
$ dig @chals.secedu.site -p 4953 -x 172.31.0.24 +short      
x-ray.secedu.site.
```

Interesting!

I make a script to map out the subdomains:
```bash
#!/bin/bash

server="chals.secedu.site"
port="4953"
base_ip="172.31.0."
start=1
end=256

for i in $(seq $start $end); do
    ip_address="${base_ip}${i}"
    reverse_name=$(dig +short -x "$ip_address" @"$server" -p "$port")
    
    if [ -n "$reverse_name" ]; then
        echo "$ip_address -> $reverse_name"
    else
        echo "$ip_address -> No PTR record found"
    fi
done
```

This outputs:
```
172.31.0.1 -> alfa.secedu.site.
172.31.0.2 -> bravo.secedu.site.
172.31.0.3 -> charlie.secedu.site.
172.31.0.4 -> delta.secedu.site.
172.31.0.5 -> echo.secedu.site.
172.31.0.6 -> foxtrot.secedu.site.
172.31.0.7 -> golf.secedu.site.
172.31.0.8 -> hotel.secedu.site.
172.31.0.9 -> india.secedu.site.
172.31.0.10 -> juliett.secedu.site.
172.31.0.11 -> kilo.secedu.site.
172.31.0.12 -> lima.secedu.site.
172.31.0.13 -> mike.secedu.site.
172.31.0.14 -> november.secedu.site.
172.31.0.15 -> oscar.secedu.site.
172.31.0.16 -> papa.secedu.site.
172.31.0.17 -> quebec.secedu.site.
172.31.0.18 -> romeo.secedu.site.
172.31.0.19 -> sierra.secedu.site.
172.31.0.20 -> tango.secedu.site.
172.31.0.21 -> uniform.secedu.site.
172.31.0.22 -> victor.secedu.site.
172.31.0.23 -> whiskey.secedu.site.
172.31.0.24 -> x-ray.secedu.site.
172.31.0.25 -> chals.secedu.site.
172.31.0.26 -> hydrogen.secedu.site.
172.31.0.27 -> helium.secedu.site.
172.31.0.28 -> lithium.secedu.site.
172.31.0.29 -> beryllium.secedu.site.
172.31.0.30 -> boron.secedu.site.
...
172.31.0.135 -> darmstadtium.secedu.site.
172.31.0.136 -> roentgenium.secedu.site.
172.31.0.137 -> copernicium.secedu.site.
172.31.0.138 -> nihonium.secedu.site.
172.31.0.139 -> flerovium.secedu.site.
172.31.0.140 -> moscovium.secedu.site.
172.31.0.141 -> livermorium.secedu.site.
172.31.0.142 -> tennessine.secedu.site.
172.31.0.143 -> oganesson.secedu.site.
```

We see that the subdomains for `y` and `z` in the phonetic alphabet are missing, and we instead see the `chals` subdomain, then all the elements from 1-118.

Lots of enumeration, searching for non-existent subs for names like `yankee` or `zulu` giving nothing, as well as scanning for all the record types under those subs we find nothing...

My teammate suggests we look for records under the original `secedu.site` domain.

We *eventually* got a hit on a `SOA` record:
```bash
$ dig @chals.secedu.site -p 4953 SOA secedu.site +short +time=1  
;; Got bad packet: bad label type
185 bytes
2b 63 85 a0 00 01 00 01 00 02 00 00 06 73 65 63          +c...........sec
65 64 75 04 73 69 74 65 00 00 06 00 01 06 73 65          edu.site......se
63 65 64 75 04 73 69 74 65 00 00 06 00 01 00 00          cedu.site.......
02 58 00 5f 00 48 53 45 43 45 44 55 7b 34 71 43          .X._.HSECEDU{4qC
5a 34 71 43 64 34 71 43 4f 34 71 43 34 34 71 43          Z4qCd4qCO4qC44qC
66 34 71 43 6c 34 71 43 52 34 71 43 69 34 71 43          f4qCl4qCR4qCi4qC
65 34 71 43 34 34 71 43 4f 34 71 43 56 34 71 43          e4qC44qCO4qCV4qC
48 34 71 43 6e 34 71 43 52 34 71 43 5a 7d 00 00          H4qCn4qCR4qCZ}..
00 00 2a 00 00 04 b0 00 00 00 b4 00 12 75 00 00          ..*..........u..
00 02 58 c0 1d 00 02 00 01 00 00 02 58 00 01 00          ..X.........X...
c0 1d 00 02 00 01 00 00 02 58 00 0d 06 73 65 63          .........X...sec
65 64 75 04 73 69 74 65 00                               edu.site.
```

Flag! Quickly submit it!

![boss-incorrect.png](images/24-secedu/boss-incorrect.png)

Well, seems we have more work to do. That string looks weird come to think of it!

Putting the string into Cyberchef its identified as Base64, decoding to some unicode: `⠙⠝⠎⠸⠟⠥⠑⠢⠞⠸⠎⠕⠇⠧⠑⠙`.

This is Braille! (That explains the M. Bossed name, Embossed, very funny...)

I used [brailletranslator.org](https://www.brailletranslator.org/) to decode it to the flag.

Flag: `SECEDU{dns_que5t_solved}`