---
title: "Where's skat?"
description: "While traveling over the holidays, I was doing some casual wardriving (as I often do). Can you use my capture to find where I went? Note: the flag is irisctf{the_location}, where the_location is the full name of my destination location, not the street address. For example, irisctf{Washington_Monument}. Note that the flag is not case sensitive."
pubDate: 2024-01-08
ctf: "IrisCTF 2024"
category: "networks"
author: "sealldev"
section: "CTFs"
image: "images/24-irisctf/icon.png"
---

We are given a PCAP file, and since we are asked where they went, (the destination specifically) we can go to the end of the PCAP and look around. As they are wardriving they will be communicating with nearby routers.

![Communication](images/24-irisctf/ws_wireshark.png)

We can see they are communicating with a CISCO router at the end, we can get the BSSID of this router and look it up on Wigle for a location. Wigle is an online index of scanned WiFi routers with GPS data attached, so if our BSSID is there we should get a rough location.

![Communication](images/24-irisctf/ws_1.png)

BSSID: `10:05:ca:bb:40:11`

![Wigle Lookup](images/24-irisctf/ws_2.png)

We get a hit, now where is it?

![Wigle Map](images/24-irisctf/ws_3.png)

Looking at the structure marker nearby we seem to be at `Los Angeles Union Station`.

Which gives us the flag!

Flag: `irisctf{los_angeles_union_station}`

**Files:** [wheres-skat.tar.gz](https://web.archive.org/web/20240107222928/https://cdn.2024.irisc.tf/wheres-skat.tar.gz)