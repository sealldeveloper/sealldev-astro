---
title: "Are you sure that's all?"
description: "We've captured a section of network traffic from ORG-A. Can you make sure that no sensitive data is being transmitted in plaintext? We can find some interesting details on the transmitted data by following the TCP stream. What kind of file does this reveal?"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "forensics"
author: "sealldev & finnersio"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



Opening up the PCAP file there are only a couple packets, and they are all part of the one stream. Right-clicking on any of the packets we can follow the TCP stream. 

Immediately we see some data at the top the stream showing a PDF file was sent:

![notquiteall](images/24-secedu/notquiteall.png)

We can extract the data by clicking `Show data as: Raw` and `Save as`, saving the data as a PDF file. 

Opening up the PDF, the flag is in the top left.

![notquiteallpdf](images/24-secedu/notquiteall-pdf.png)

Flag: `SECEDU{s0m3_empl0y33_b3n3fit5}`