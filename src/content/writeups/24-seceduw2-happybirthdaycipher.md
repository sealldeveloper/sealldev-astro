---
title: "Happy Birthday, Cipher!"
description: "When is Cipher's birthday?\nThe flag format is: `SECEDU{Month_XX}`, where XX is the date."
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



In the `ical` file from [`Secret meeting?`](24-seceduw2-secretmeeting), we have another event mentioning a birthday.

```
BEGIN:VEVENT
DTSTART;VALUE=DATE:20240608
DTEND;VALUE=DATE:20240609
DTSTAMP:20240930T110027Z
UID:2v8c69gkc1rhalqa511d17praf@google.com
CREATED:20240828T060831Z
LAST-MODIFIED:20240828T060842Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Happy Birthday to Me!
TRANSP:TRANSPARENT
END:VEVENT
```

We can see it was starting on the 8th of June 2024 and ending on the 9th.

Flag: `SECEDU{June_08}`