---
title: "Crawler"
description: "Instead of properly updating their list of websites when they need to, ORG-A has instead just appended their new pages, and hasn't removed any pages that they've taken down. Find the page that is still up and running. Vuln scans on infrastructure are out of scope, and aren't very relevant here. To be clear, there is no requirement to probe infrastructure in this way.\b\bHint: Is there a conventional way to indicate to crawlers that you don't want a website indexed?"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "web"
author: "sealldev & tulip"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



Looking at `chals.secedu.site:4999` is a HTTP server, the root of the site returning this:
```
                    This is a normal website.



                    
                               (
                               )
                               (
                        /\  .-"""-.  /\
                       //\\/  ,,,  \//\\
                       |/\| ,;;;;;, |/\|
                       //\\\;-"""-;///\\
                      //  \/   .   \/  \\
                     (| ,-_| \ | / |_-, |)
                       //`__\.-.-./__`\\
                      // /.-(() ())-.\ \\
                     (\ |)   '---'   (| /)
                      ` (|           |) `
                        \)           (/
```

Checking `/robots.txt` we are given a long list of disallowed URLs.

```
User-agent: crawleroonie
Disallow: /21783c459d191dfa316089d6a92e12b6.txt
Disallow: /705901f6c304c0241cc280c554545a03.txt
Disallow: /cfaed1eedebe78cdc97b463eadae5496.txt
Disallow: /b075cb4e9b412a423f75fa1c1e2372c4.txt
Disallow: /864d6f99de9586ec3645cda069505d58.txt
Disallow: /da88fbf2659689cd1f63151284deca3a.txt
Disallow: /d749dfba7d82ce432aa29003aa10142a.txt
Disallow: /a22a8352622c5e598b4a1445c7ed66c5.txt
Disallow: /ab1cb7fba3fb1078dd8b1f1a4cf10052.txt
Disallow: /67d769a20963cb5f4111dfea3538ff6d.txt
Disallow: /0de16dde4e4eef57bd2ca85fea70e3e8.txt
Disallow: /085fc0f95c6166f12868802a169521cc.txt
Disallow: /5a011b23e58c207514b75a41db320d65.txt
Disallow: /c9442d9464989b2bcf7c058feb4ea903.txt
Disallow: /988cd933fcca577b7f62091f3ee3a449.txt
...
Disallow: /648dac3911383260e21fc523b552e37a.txt
Disallow: /6d0aebad2ab918535acdf1f09481aa9e.txt
Disallow: /87e4a94bf95f00a36b3efd99aa336ac1.txt
```

I copied the full list of URLs, excluding the `User-agent` line, and filtered it down to a wordlist.

I then use ffuf to find any valid endpoints:
```
$ ffuf -w robots-wordlist.txt -u 'http://chals.secedu.site:4999/FUZZ'

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v1.0.2
________________________________________________

 :: Method           : GET
 :: URL              : http://chals.secedu.site:4999/FUZZ
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403
________________________________________________

224029dc48091e43908719211cfa63e7.txt [Status: 200, Size: 33, Words: 1, Lines: 2]
:: Progress: [1000/1000] :: Job [1/1] :: 1000 req/sec :: Duration: [0:00:01] :: Errors: 0 ::
```

Visiting the only endpoint to respond, we get the flag.

Flag: `SECEDU{th3r3_g0es_0ur_b3ndwidth}`