---
title: "Linkage"
description: "ORG-B has given us a message that is being passed around the organisation. They've found it on a few of their machines, but are unsure what it says. jvvr8--ga0/76/5;/7:/317,cr/qmwvjgcqv/0,amorwvg,cocxmlcuq,amo-. The message was signed by a mysterious \"Y\". Interesting."
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "cryptography"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



I put the mysterious string into CyberChef, and use `Magic` with `Intensive mode` enabled.

It finds `XOR({'option':'Hex','string':'2'},'Standard',false)`, which decodes to an EC2 URL: `http://ec2-54-79-58-135.ap-southeast-2.compute.amazonaws.com/`.

Flag: `SECEDU{http://ec2-54-79-58-135.ap-southeast-2.compute.amazonaws.com/}`