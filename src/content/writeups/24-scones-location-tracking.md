---
title: "location tracking"
description: "My friend invited me to a cool event on and sent a picture which included this QR code in the corner but isn't looking at his phone to tell me where it is :(. Where is the lecture theatre?\n\n**Note**: Your answer should be the address of the building, you do not need to wrap your answer with `SCONES{}`. For example, if you think the answer is UTS Building 10, then supply `235 Jones St, Ultimo NSW 2007` as the flag."
pubDate: 2024-06-26
ctf: "SCONES 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-scones/icon.png"
---

We are given an image of a QR code:
![location tracking](images/24-scones/locationtracking.jpg)

Scanning the QR Code has a URL.
```
https://www.service.nsw.gov.au/campaign/service-nsw-mobile-app?data=eyJ0IjoiY292aWQxOV9idXNpbmVzcyIsImJpZCI6IjIwODY3MSIsImJuYW1lIjoiVU5TVyBBaW5zd29ydGggRzAzIiwiYmFkZHJlc3MiOiJLLUoxNy1HMDMgLSBBaW5zd3RoRzAzIEtlbnNpbmd0b24gTlNXIDIwNTIifQ==
```

The `data` param can be decoded from b64 to some JSON:
```json
{
  "t": "covid19_business",
  "bid": "208671",
  "bname": "UNSW Ainsworth G03",
  "baddress": "K-J17-G03 - AinswthG03 Kensington NSW 2052"
}
```

The flag was the `baddress`.

Flag: `K-J17-G03 - AinswthG03 Kensington NSW 2052`