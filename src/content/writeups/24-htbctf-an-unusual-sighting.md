---
title: "An unusual sighting"
description: "As the preparations come to an end, and The Fray draws near each day, our newly established team has started work on refactoring the new CMS application for the competition. However, after some time we noticed that a lot of our work mysteriously has been disappearing! We managed to extract the SSH Logs and the Bash History from our dev server in question. The faction that manages to uncover the perpetrator will have a massive bonus come competition!"
pubDate: 2024-03-14
ctf: "HTB Cyber Apocalypse 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-htbctf/icon.jpg"
---

We start this challenge with two files: `bash_history.txt` and `sshd.log`.

### Question 1
> What is the IP Address and Port of the SSH Server (IP:PORT)

Looking inside the `sshd.log`, line 3 says the following:
```
[2024-01-28 15:24:23] Connection from 100.72.1.95 port 47721 on 100.107.36.130 port 2221 rdomain ""
```

The `on` section is the server.

Flag: `100.107.36.130:2221`

### Question 2
> What time is the first successful Login

Reading the `sshd.log`, the lines containing `Accepted` are the successful logins, so whats the earliest instance?

```
[2024-02-13 11:29:50] Accepted password for root from 100.81.51.199 port 63172 ssh2
```

Flag: `2024-02-13 11:29:50`

### Question 3
> What is the time of the unusual Login

Reading the `sshd.log`, there is a weird login time at 4am onto the root account:
```
[2024-02-19 04:00:14] Connection from 2.67.182.119 port 60071 on 100.107.36.130 port 2221 rdomain ""
[2024-02-19 04:00:14] Failed publickey for root from 2.67.182.119 port 60071 ssh2: ECDSA SHA256:OPkBSs6okUKraq8pYo4XwwBg55QSo210F09FCe1-yj4
[2024-02-19 04:00:14] Accepted password for root from 2.67.182.119 port 60071 ssh2
[2024-02-19 04:00:14] Starting session: shell on pts/2 for root from 2.67.182.119 port 60071 id 0
[2024-02-19 04:38:17] syslogin_perform_logout: logout() returned an error
[2024-02-19 04:38:17] Received disconnect from 2.67.182.119 port 60071:11: disconnected by user
[2024-02-19 04:38:17] Disconnected from user root 2.67.182.119 port 60071
```

The rest of the logins being from ~0900-1900, this is highly suspicious.

Flag: `2024-02-19 04:00:14`

### Question 4
> What is the Fingerprint of the attacker's public key

Reading those suspicious logs from question 3, we can see the public key fails on the second line.

Flag: `OPkBSs6okUKraq8pYo4XwwBg55QSo210F09FCe1-yj4`

### Question 5
> What is the first command the attacker executed after logging in

This time reading `bash_history.txt` and going to the suspicious time (4am), we can see the first command executed is `whoami`.

```
[2024-02-16 12:38:11] python ./server.py --tests
[2024-02-16 14:40:47] python ./server.py --tests
[2024-02-19 04:00:18] whoami
[2024-02-19 04:00:20] uname -a
```

Flag: `whoami`

### Question 6
> What is the final command the attacker executed before logging out

Reading the same logs segment, we get the final command:
```
[2024-02-19 04:12:02] shred -zu latest.tar.gz
[2024-02-19 04:14:02] ./setup
[2024-02-20 11:11:14] nvim server.py
```

Flag: `./setup`

And in return, we are given our flag.

Flag: `HTB{B3sT_0f_luck_1n_th3_Fr4y!!}`