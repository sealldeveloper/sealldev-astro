---
title: "Ph4nt0m 1ntrud3r"
description: "A digital ghost has breached my defenses, and my sensitive data has been stolen! 😱💻 Your mission is to uncover how this phantom intruder infiltrated my system and retrieve the hidden flag. To solve this challenge, you'll need to analyze the provided PCAP file and track down the attack method. The attacker has cleverly concealed his moves in well timely manner. Dive into the network traffic, apply the right filters and show off your forensic prowess and unmask the digital intruder!\nFind the PCAP file here Network Traffic PCAP file and try to get the flag.\n\nHint: Filter your packets to narrow down your search.\nHint: Attacks were done in timely manner.\nHint: Time is essential"
pubDate: 2025-03-18
category: "forensics"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
image: "./images/picoctf/ph4nt0m1ntrud3r/packets.png"
---

We start with a `myNetworkTraffic.pcap` which can be opened with Wireshark, so let's start there.

![packets.png](images/picoctf/ph4nt0m1ntrud3r/packets.png)

There are a total of 22 TCP packets. Selecting a packet we can see what looks to be Base64 data in the `tcp.segment_data`:
![dataexample.png](images/picoctf/ph4nt0m1ntrud3r/dataexample.png)

Let's use tshark to extract the data:
```bash
$ tshark -r myNetworkTraffic.pcap -T fields -e tcp.segment_data
54636c672f33733d
626e52666447673064413d3d
...
39447049626b413d
514b7a46582b633d
```

Let's decode the hex in bash (This can also be done manually with CyberChef, Dcode.fr, etc):
```bash
$ tshark -r myNetworkTraffic.pcap -T fields -e tcp.segment_data | while read line; do echo $line | xxd -r -p; echo; done
Tclg/3s=
bnRfdGg0dA==
RHxhtS4=
...
9DpIbkA=
QKzFX+c=
```

Let's now decode the Base64 strings!
```bash
$ tshark -r myNetworkTraffic.pcap -T fields -e tcp.segment_data | while read line; do echo $line | xxd -r -p | base64 -d; echo; done
M�`�{
nt_th4t
D|a�.
...
�:Hn@
@��_�
```

Now were getting somewhere, I'm now going to filter it to human readable characters!
```bash
$ tshark -r myNetworkTraffic.pcap -T fields -e tcp.segment_data | while read line; do echo $line | xxd -r -p | base64 -d; echo; done | grep '^[A-Za-z0-9/\{\}\._-]*$'
nt_th4t
66d0bfb
{1t_w4s
_34sy_t
picoCTF
bh_4r_9
}
```

We can now visually reconstruct the flag!

Flag: `picoCTF{1t_w4snt_th4t_34sy_tbh_4r_966d0bfb}`