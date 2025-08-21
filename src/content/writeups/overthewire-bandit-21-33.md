---
title: "OverTheWire Bandit Levels 21-33"
description: "Learning the crontab, git, bash scripting, vim, and a bashjail"
pubDate: 2025-08-21
section: "OverTheWire"
category: "linux"
difficulty: "easy" 
tags: ["linux", "ssh", "bashjail", "beginner", "cronjob", "git", "vim"]
---

> This was made as a part of my university work, and a tool to automate all of OverTheWire's Bandit. You can see this tool [here](https://github.com/sealldeveloper/overthewire-bandit-1todone).

# Level 21 -> 22

> A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

```bash
bandit21@bandit:~$ ls /etc/cron.d
behemoth4_cleanup  cronjob_bandit22  cronjob_bandit24  leviathan5_cleanup    otw-tmp-dir
clean_tmp          cronjob_bandit23  e2scrub_all       manpage3_resetpw_job  sysstat
bandit21@bandit:~$ cat /etc/cron.d/cronjob_bandit22
@reboot bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
* * * * * bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
```

As explained, cron runs jobs periodically depending on the config. The `* * * * *` is the config.

This can be read in the following:
- The 1st character is how many minutes, `*` means any minute.
- The 2nd is hours, if it's a numeric it's only on that hour.
- The 3rd is day (month), so it only runs on a certain day of the month with respects to the first and 2nd character.
- The 4th is month, so it would do with respects of character 3, 2 and 1.
- The 5th is day (week), so we can make it repeat every minute on Saturday for example.

The website [crontab.guru](https://crontab.guru/) is excellent for learning how to read these.

In this case, 5 instances of `*` means every minute.

What's in the script?
```bash
bandit21@bandit:~$ cat /usr/bin/cronjob_bandit22.sh
#!/bin/bash
chmod 644 /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
cat /etc/bandit_pass/bandit22 > /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
```

So it's in a `/tmp` file. Let's read it!

```bash
bandit21@bandit:~$ cat /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q
```

# Level 22 -> 23

> A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.


```bash
bandit22@bandit:~$ cat /etc/cron.d/cronjob_bandit23
@reboot bandit23 /usr/bin/cronjob_bandit23.sh  &> /dev/null
* * * * * bandit23 /usr/bin/cronjob_bandit23.sh  &> /dev/null
bandit22@bandit:~$ cat /usr/bin/cronjob_bandit23.sh
#!/bin/bash

myname=$(whoami)
mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

echo "Copying passwordfile /etc/bandit_pass/$myname to /tmp/$mytarget"

cat /etc/bandit_pass/$myname > /tmp/$mytarget
```

So this is a small bash script, let's pull it apart.

- `myname` is set to the result of executing `whoami`. As this is run by `bandit23`, the result is `bandit23`.
- `mytarget` gets the md5 hash of `I am user bandit23`
- It then copies the password to `/tmp/MD5HASH`

A hash is a one-way conversion of an amount of data to a defined-length string. It is unique to that data and not reversible, without repetitions.

There are a few examples of this, SHA256, MD5, bcrypt, SHA1, etc.

In this case they use MD5, (which doesn't adhere to all those hash rules any more as the algorithm is broken, but that's not important today).

We can find the hash locally like so:
```bash
$ echo "I am user bandit23" | md5sum | cut -d ' ' -f 1
8ca319486bfbbc3663ea0fbe81326349
```

Now we can read the file with that hash.

```bash
bandit22@bandit:~$ cat /tmp/8ca319486bfbbc3663ea0fbe81326349
0Zf11ioIjMVN551jX3CmStKLYqjk54Ga
```

## One-liner

```bash
bandit22@bandit:~$ cat /tmp/$(echo "I am user bandit23" | md5sum | cut -d ' ' -f 1)
0Zf11ioIjMVN551jX3CmStKLYqjk54Ga
```

We can calculate the hash inside the `$()` shell and then use cat with it.

# Level 23 -> 24

> A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

```bash
bandit23@bandit:~$ cat /etc/cron.d/cronjob_bandit24
@reboot bandit24 /usr/bin/cronjob_bandit24.sh &> /dev/null
* * * * * bandit24 /usr/bin/cronjob_bandit24.sh &> /dev/null
bandit23@bandit:~$ cat /usr/bin/cronjob_bandit24.sh
#!/bin/bash

myname=$(whoami)

cd /var/spool/$myname/foo
echo "Executing and deleting all scripts in /var/spool/$myname/foo:"
for i in * .*;
do
    if [ "$i" != "." -a "$i" != ".." ];
    then
        echo "Handling $i"
        owner="$(stat --format "%U" ./$i)"
        if [ "${owner}" = "bandit23" ]; then
            timeout -s 9 60 ./$i
        fi
        rm -f ./$i
    fi
done
```

Ok, this is a little more complicated!

Firstly, we get the username of the executing user, so `bandit24`.
```bash
myname=$(whoami)
```

We then change directory to `/var/spool/bandit24/foo`
```bash
cd /var/spool/$myname/foo
```

The script echos a message about executing and deleting scripts.
```bash
echo "Executing and deleting all scripts in /var/spool/$myname/foo:"
```

We then have a for loop for each file in the folder.
```bash
for i in * .*;
```

We check the file currently selected (`i`) is not `..` or `.`.
```bash
if [ "$i" != "." -a "$i" != ".." ];
```

It then handles the file, it extracts the owner with `stat`.
```bash
    then
        echo "Handling $i"
        owner="$(stat --format "%U" ./$i)"
```

Executing that stat command on a file in my home directory, we can see what it does:
```bash
bandit23@bandit:~$ stat --format "%U" ./.bashrc
root
```

So it extracts the user that owns the file.

We then check if the owner is bandit23, if it is we execute the file on a timeout of 60 seconds. The `-s 9` is the signal used to end the process, in this case '9' AKA 'SIGKILL'.
```bash
if [ "${owner}" = "bandit23" ]; then
    timeout -s 9 60 ./$i
fi
```

Then delete the file:
```bash
rm -f ./$i
```

So, we need to make our own bash script that will be executed!

We can use Vim, nano, emacs, etc to make the file. I'll be using Vim.

I create the file with the following:
```bash
bandit23@bandit:~$ vim /tmp/bandit23_script.sh
```

I then press `i` for insert mode, and start typing this script:
```bash
#!/bin/bash
cat /etc/bandit_pass/bandit24 > /tmp/sealldev_bandit24
```

Then press ESC, then type `:wq` and press enter. (Or just do `ZZ` if you are fancy).

We can validate the contents with `cat`:
```bash
bandit23@bandit:~$ cat /tmp/bandit23_script.sh
#!/bin/bash
cat /etc/bandit_pass/bandit24 > /tmp/sealldev_bandit24
```

We need to make the script executable, so we can use `chmod`:
```bash
bandit23@bandit:~$ chmod +x /tmp/bandit23_script.sh
```

Now we need to make a copy of that script in the `/var/spool/bandit24/foo/`, we can use `cp`:
```bash
bandit23@bandit:~$ cp /tmp/bandit23_script.sh /var/spool/bandit24/foo/
```

This copies `bandit23_script.sh` into the folder, we could specify a new name for it (if we wanted) after the `foo/`.

As this executes every minute, we need to wait. After some time we will have the password in our file:
```bash
bandit23@bandit:~$ cat /tmp/sealldev_bandit24
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8
```

## One-liner

```bash
F="/tmp/bandit24_pass_sealldev";G="/tmp/bandit$$.sh";echo "#!/bin/bash" > $G; echo "cat /etc/bandit_pass/bandit24 > $F" >> $G; chmod +x $G; cp $G /var/spool/bandit24/foo/; while [ ! -e $F ]; do sleep 0.1; done; cat $F
```

Ok ok... It's not that scary I promise

Firstly, let's break it up into 1 command per line.

```bash
F="/tmp/bandit24_pass_sealldev"
G="/tmp/bandit$$.sh"

echo "#!/bin/bash" > $G
echo "cat /etc/bandit_pass/bandit24 > $F" >> $G;

chmod +x $G

cp $G /var/spool/bandit24/foo/

while [ ! -e $F ];
  do sleep 0.1;
done

cat $F
```

Start by defining 2 variables, `F` is the location of the output file and `G` is the location of the script we make.

Note that `$$` is just the process ID, so just a unique number to this process.

```bash
F="/tmp/bandit24_pass_sealldev"
G="/tmp/bandit$$.sh"
```

The difference between `>` and `>>` is write vs append, we write out file contents.

```bash
echo "#!/bin/bash" > $G
echo "cat /etc/bandit_pass/bandit24 > $F" >> $G;
```

We then `chmod +x` the file to make it executable:
```bash
chmod +x $G; cp $G /var/spool/bandit24/foo/
```

And copy the file script to the folder:
```bash
cp $G /var/spool/bandit24/foo/
```

Now, the `while` loop is checking for if the output file doesn't exist. So it's waiting till it does exist.

```bash
while [ ! -e $F ];
  do sleep 0.1;
done
```

Once it exists, we read it:
```bash
cat $F
```

Cool!

# Level 24 -> 25

> A daemon is listening on port 30002 and will give you the password for bandit25 if given the password for bandit24 and a secret numeric 4-digit pincode. There is no way to retrieve the pincode except by going through all of the 10000 combinations, called brute-forcing.

This requires some bash scripting, so we need to make a loop to generate every number `0000` to `9999`.

```bash
bandit24@bandit:~$ for i in {00..11}; do echo $i; done
00
01
02
03
04
05
06
07
08
09
10
11
```

We can do it like this, where `{}` specifies our number range, and we separate the first and last number by `..`.

We can do the same with `0000..9999` and then `echo "PASSWORD $i"`.

```bash
bandit24@bandit:~$ for i in {00..11}; do echo "gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 $i"; done
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 00
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 01
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 02
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 03
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 04
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 05
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 06
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 07
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 08
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 09
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 10
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 11
```

Now pass this into netcat, this is doable with a pipe.

```bash
bandit24@bandit:~$ for i in {0000..0011}; do echo "gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 $i"; done | nc localhost 30002
I am the pincode checker for user bandit25. Please enter the password for user bandit24 and the secret pincode on a single line, separated by a space.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
Wrong! Please enter the correct current password and pincode. Try again.
```

Ok, let's also make a inverse-grep to ignore all lines that contain the error message, and send all the numbers.

```bash
bandit24@bandit:~$ for i in {0000..9999}; do echo "gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 $i"; done | nc localhost 30002 | grep -v 'Wrong'
I am the pincode checker for user bandit25. Please enter the password for user bandit24 and the secret pincode on a single line, separated by a space.
Correct!
The password of user bandit25 is iCi86ttT4KSNe1armKiwbQNmB3YJP3q4
```

Nice!

## One-liner

```bash
PASS=$(cat /tmp/bandit24_pass_sealldev); for i in {0000..9999}; do echo "$PASS $i"; done | nc localhost 30002 | grep -v "Wrong" | tail -2 | head -1 | sed "s/.* //"
```

Breaking it up:
```bash
PASS=$(cat /tmp/bandit24_pass_sealldev);
for i in {0000..9999}; 
  do echo "$PASS $i"; 
done | nc localhost 30002 | grep -v "Wrong" | tail -2 | head -1 | sed "s/.* //"
```

This grabs the password file from the previous level, then does the for loop to generate the lines. We can send this into netcat with a pip and do the grep negative match. We then get the last 2 lines, then the topmost line (therefore getting the 2nd last line). Then `sed` for the last word.

# Level 25 -> 26 and Lebel 26 -> 27

> Logging in to bandit26 from bandit25 should be fairly easy… The shell for user bandit26 is not /bin/bash, but something else. Find out what it is, how it works and how to break out of it.

```bash
bandit25@bandit:~$ ls
bandit26.sshkey
bandit25@bandit:~$ cat bandit26.sshkey
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEApis2AuoooEqeYWamtwX2k5z9uU1Afl2F8VyXQqbv/LTrIwdW
pTfaeRHXzr0Y0a5Oe3GB/+W2+PReif+bPZlzTY1XFwpk+DiHk1kmL0moEW8HJuT9
/5XbnpjSzn0eEAfFax2OcopjrzVqdBJQerkj0puv3UXY07AskgkyD5XepwGAlJOG
...
```

Using that key we can login to bandit26, but it automatically exits:
```bash
...
  _                     _ _ _   ___   __
 | |                   | (_) | |__ \ / /
 | |__   __ _ _ __   __| |_| |_   ) / /_
 | '_ \ / _` | '_ \ / _` | | __| / / '_ \
 | |_) | (_| | | | | (_| | | |_ / /| (_) |
 |_.__/ \__,_|_| |_|\__,_|_|\__|____\___/
Connection to bandit.labs.overthewire.org closed.
```

hmm, let's check what is set in `/etc/passwd` for user `bandit26` from the shell on `bandit25`.

```bash
bandit25@bandit:~$ cat /etc/passwd | grep bandit26
bandit26:x:11026:11026:bandit level 26:/home/bandit26:/usr/bin/showtext
```

What's `showtext`?
```bash
bandit25@bandit:~$ file /usr/bin/showtext
/usr/bin/showtext: POSIX shell script, ASCII text executable
bandit25@bandit:~$ cat /usr/bin/showtext
#!/bin/sh

export TERM=linux

exec more ~/text.txt
exit 0
```

Ok, it's using `more`. If `more` has short file content, and the terminal isn't small it won't enter the 'scrollable' section and will just print it.

So we need to zoom in our terminal a lot, then re-connect. We get this instead:
```

  _
   _ _ _   ___   __
 | |
  | (_) | |__ \ / /
 | |__   __ _ _ __
--More--(41%)
```

Inside more we can press `v` for vim mode.

```
  _                     _ _ _   ___   __
 | |                   | (_) | |__ \ / /
 | |__   __ _ _ __   __| |_| |_   ) / /_
 | '_ \ / _` | '_ \ / _` | | __| / / '_ \
 | |_) | (_| | | | | (_| | | |_ / /| (_) |
 |_.__/ \__,_|_| |_|\__,_|_|\__|____\___/
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
"~/text.txt" [readonly] 6L, 258B                                                      1,3           All
```

From inside vim, we can activate a shell! Trying to do `:shell` without setting anything fails. So we need to `:set shell=/bin/bash`, then do `:shell` again.

```
:shell
bandit26@bandit:~$
```

Now we need to get the password:
```bash
bandit26@bandit:~$ ls
bandit27-do  text.txt
bandit26@bandit:~$ ./bandit27-do cat /etc/bandit_pass/bandit27
upsNCc7vzaRDx6oZC6GiR6ERwe1MowGB
```

We can escape with `exit` then `:q` then `q`.

## One-liner
Using Paramiko for my automated script, I used a small function to do it all. Not really a one-liner but I don't think I can do much better.

```python
def bandit32_shellescape(client):
    """Optimized shell escape with better output parsing"""
    channel = client.invoke_shell(term='vt100')
    
    try:
        time.sleep(1)
        print('Escaping bashjail...')
        channel.send('$0\n')
        time.sleep(2)
        
        while channel.recv_ready():
            channel.recv(4096)
        
        print('Getting password...')
        channel.send('cat /etc/bandit_pass/bandit33\n')
        time.sleep(2)
        
        output = ""
        max_wait = 10
        start_time = time.time()
        
        while time.time() - start_time < max_wait:
            if channel.recv_ready():
                chunk = channel.recv(4096).decode('utf-8', errors='ignore')
                output += chunk
                if len(chunk.strip()) == 32 and chunk.strip().isalnum():
                    return chunk.strip()
            time.sleep(0.1)
        
        lines = [line.strip() for line in output.splitlines() if line.strip()]
        for line in lines:
            if len(line) == 32 and line.isalnum():
                return line
                
        return lines[1] if len(lines) > 1 else lines[0] if lines else ""
        
    finally:
        channel.close()
```

# Level 27 -> 28

> There is a git repository at ssh://bandit27-git@localhost/home/bandit27-git/repo via the port 2220. The password for the user bandit27-git is the same as for the user bandit27.

Now we need to use `git`, we can do all the git levels from the host machine.

We can clone the repo like so:
```bash
$ git clone ssh://bandit27-git@bandit.labs.overthewire.org:2220/home/bandit27-git/repo
Cloning into 'repo'...
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit27-git@bandit.labs.overthewire.org's password:
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.
```

The format for the clone command is `protocol://username@host:port/repo-path`

Now, we can traverse the repo:
```bash
$ cd repo
$ ls
README
$ cat README
The password to the next level is: Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN
```

## One-liner

I use `expect` locally to automate this:
```bash
expect -c "spawn git clone ssh://bandit27-git@bandit.labs.overthewire.org:2220/home/bandit27-git/repo /tmp/bandit27_repo; expect \"*password*\"; send \"PREVPASSWORD\r\"; expect eof" >/dev/null 2>&1 && cat /tmp/bandit27_repo/README | sed "s/.* //g" && rm -rf /tmp/bandit27_repo
```

Pulling this apart:
- Clone the repo
- Fill in the password automatically
- Send all output from clone to `/dev/null`
- Read the file, use `sed` to get last word
- Cleanup repo files

# Level 28 -> 29

> There is a git repository at ssh://bandit28-git@localhost/home/bandit28-git/repo via the port 2220. The password for the user bandit28-git is the same as for the user bandit28.

```bash
$ git clone ssh://bandit28-git@bandit.labs.overthewire.org:2220/home/bandit28-git/repo
Cloning into 'repo'...
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit28-git@bandit.labs.overthewire.org's password:
remote: Enumerating objects: 9, done.
remote: Counting objects: 100% (9/9), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 9 (delta 2), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (9/9), done.
Resolving deltas: 100% (2/2), done.
$ cd repo
$ ls
README.md
$ cat README.md
# Bandit Notes
Some notes for level29 of bandit.

## credentials

- username: bandit29
- password: xxxxxxxxxx

```

So, the password is censored?

Maybe a previous commit has the information we need:
```bash
$ git log | tee
commit 710c14a2e43cfd97041924403e00efb00b3a956e
Author: Morla Porla <morla@overthewire.org>
Date:   Fri Aug 15 13:16:10 2025 +0000

    fix info leak

commit 68314e012fbaa192abfc9b78ac369c82b75fab8f
Author: Morla Porla <morla@overthewire.org>
Date:   Fri Aug 15 13:16:10 2025 +0000

    add missing data

commit a158f9a82c29a16dcea474458a5ccf692a385cd4
Author: Ben Dover <noone@overthewire.org>
Date:   Fri Aug 15 13:16:10 2025 +0000

    initial commit of README.md
```

Looks like the middle commit `68314e012fbaa192abfc9b78ac369c82b75fab8f` has what we need, let's check the changes with `git show`.

```bash
$ git show 68314e012fbaa192abfc9b78ac369c82b75fab8f | tee
commit 68314e012fbaa192abfc9b78ac369c82b75fab8f
Author: Morla Porla <morla@overthewire.org>
Date:   Fri Aug 15 13:16:10 2025 +0000

    add missing data

diff --git a/README.md b/README.md
index 7ba2d2f..d4e3b74 100644
--- a/README.md
+++ b/README.md
@@ -4,5 +4,5 @@ Some notes for level29 of bandit.
 ## credentials

 - username: bandit29
-- password: <TBD>
+- password: 4pT1t5DENaYuqnqvadYs1oE4QLCdjmJ7

```

## One-liner

```bash
expect -c "spawn git clone ssh://bandit28-git@bandit.labs.overthewire.org:2220/home/bandit28-git/repo /tmp/bandit28_repo; expect \"*password*\"; send \"PREVPASSWORD\r\"; expect eof; spawn bash -c \"cd /tmp/bandit28_repo && git show 68314e012fbaa192abfc9b78ac369c82b75fab8f | tee | tail -2 | head -1 | sed 's/.* //' && cd / && rm -rf /tmp/bandit28_repo\"; expect eof" | tail -1
```

Again pulling it apart:
- Clone the repo
- Show the commit and parse the 2nd last line
- Use `sed` to get the last word
- Clean up

# Level 29 -> 30

> There is a git repository at ssh://bandit29-git@localhost/home/bandit29-git/repo via the port 2220. The password for the user bandit29-git is the same as for the user bandit29.

```bash
$ git clone ssh://bandit29-git@bandit.labs.overthewire.org:2220/home/bandit29-git/repo
Cloning into 'repo'...
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit29-git@bandit.labs.overthewire.org's password:
remote: Enumerating objects: 16, done.
remote: Counting objects: 100% (16/16), done.
remote: Compressing objects: 100% (11/11), done.
remote: Total 16 (delta 2), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (16/16), done.
Resolving deltas: 100% (2/2), done.
$ cd repo
$ ls
README.md
$ cat README.md
# Bandit Notes
Some notes for bandit30 of bandit.

## credentials

- username: bandit30
- password: <no passwords in production!>
```

Nothing in the commits either...

I wonder if it's in another branch?

Branches are used for separate lines of development. Imagine a company with a production, staging and development instance of websites. Git can do this with branches separating features, different stages of development, etc.

```bash
$ git branch -a | tee
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev
  remotes/origin/master
  remotes/origin/sploits-dev
```

Nice, let's try `git switch dev` to change to that branch.

```bash
$ git switch dev
branch 'dev' set up to track 'origin/dev'.
Switched to a new branch 'dev'
$ ls
code      README.md
$ cat README.md
# Bandit Notes
Some notes for bandit30 of bandit.

## credentials

- username: bandit30
- password: qp30ex3VLz5MDG1n91YowTv4Q8l7CDZL
```

Nice!

## One-liner
```bash
expect -c "spawn git clone ssh://bandit29-git@bandit.labs.overthewire.org:2220/home/bandit29-git/repo /tmp/bandit29_repo; expect \\"*password*\\"; send \\"PREVPASSWORD\\r\\"; expect eof; spawn bash -c \\"cd /tmp/bandit29_repo && git switch dev && cat README.md | grep password | sed 's/.* //g' && cd / && rm -rf /tmp/bandit29_repo\\"; expect eof" | tail -1
```

- Clone the repo
- Switch the dev branch
- Read the README and `sed` the last word of the password line.
- Clean up

# Level 30 -> 31

> There is a git repository at ssh://bandit30-git@localhost/home/bandit30-git/repo via the port 2220. The password for the user bandit30-git is the same as for the user bandit30.

```bash
$ git clone ssh://bandit30-git@bandit.labs.overthewire.org:2220/home/bandit30-git/repo
Cloning into 'repo'...
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit30-git@bandit.labs.overthewire.org's password:
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (4/4), done.
$ cd repo
$ ls
README.md
$ git branch -a | tee
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
$ git log | tee
commit de654f201881f820c364f176ffcdea2876431bee
Author: Ben Dover <noone@overthewire.org>
Date:   Fri Aug 15 13:16:14 2025 +0000

    initial commit of README.md
```

Nothing in commits or branches, let's start checking the `.git` folder. After a few file checks `packed_refs` contains an interesting entry.

```bash
$ cat .git/packed-refs
# pack-refs with: peeled fully-peeled sorted
de654f201881f820c364f176ffcdea2876431bee refs/remotes/origin/master
84368f3a7ee06ac993ed579e34b8bd144afad351 refs/tags/secret
```

How do we access secret?

We can use `git cat-file` to identify what type of thing it is, let's try:
```bash
$ git cat-file -t 84368f3a7ee06ac993ed579e34b8bd144afad351
blob
```

Ok, so a blob is generally just data! Let's read the tag:
```bash
$ git cat-file -p 84368f3a7ee06ac993ed579e34b8bd144afad351
fb5S2xb7bRyFmAvQYQGEqsbhVyJqhnDy
```

## One-liner
```bash
expect -c "spawn git clone ssh://bandit30-git@bandit.labs.overthewire.org:2220/home/bandit30-git/repo /tmp/bandit30_repo; expect \"*password*\"; send \"PREVPASSWORD\r\"; expect eof; spawn bash -c \"cd /tmp/bandit30_repo && git cat-file -p 84368f3a7ee06ac993ed579e34b8bd144afad351 && cd / && rm -rf /tmp/bandit30_repo\"; expect eof" | tail -1
```

- Clone the repo
- Read the blob from the hash
- Clean up

# Level 31 -> 32

> There is a git repository at ssh://bandit31-git@localhost/home/bandit31-git/repo via the port 2220. The password for the user bandit31-git is the same as for the user bandit31.

```bash
$ git clone ssh://bandit31-git@bandit.labs.overthewire.org:2220/home/bandit31-git/repo
Cloning into 'repo'...
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit31-git@bandit.labs.overthewire.org's password:
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (4/4), done.
$ cd repo
$ ls
README.md
$ cat README.md
This time your task is to push a file to the remote repository.

Details:
    File name: key.txt
    Content: 'May I come in?'
    Branch: master
```

We need to create and commit a file!

Let's create the file, I use Vim.

```bash
$ vim key.txt
$ cat key.txt
May I come in?
```

Now with the file created, we can add the file, commit and push.

```bash
$ git add .
$ git commit -am 'key file'
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
$ git push
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit31-git@bandit.labs.overthewire.org's password:
Everything up-to-date
```

No push, meaning it didn't see and changes in the commit...

Is there a `.gitignore`?
```bash
$ cat .gitignore
*.txt
```

Yes, this means all `.txt` files are not included in commits, let's remove the `.gitignore` and try again.

```bash
$ rm .gitignore
$ git add .
$ git commit -am 'key file'
[master 1560659] key file
 2 files changed, 1 insertion(+), 1 deletion(-)
 delete mode 100644 .gitignore
 create mode 100644 key.txt
$ git push
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit31-git@bandit.labs.overthewire.org's password:
Enumerating objects: 4, done.
Counting objects: 100% (4/4), done.
Delta compression using up to 10 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 520 bytes | 520.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
remote: ### Attempting to validate files... ####
remote:
remote: .oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.
remote:
remote: Well done! Here is the password for the next level:
remote: 3O9RfhqyAlVBEZpVb6LYStshZoqoSx5K
remote:
remote: .oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.oOo.
remote:
To ssh://bandit.labs.overthewire.org:2220/home/bandit31-git/repo
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'ssh://bandit.labs.overthewire.org:2220/home/bandit31-git/repo'
```

## One-liner
```bash
expect -c "spawn git clone ssh://bandit31-git@bandit.labs.overthewire.org:2220/home/bandit31-git/repo /tmp/bandit31_repo; expect \"*password*\"; send \"PREVPASSWORD\r\"; expect eof; spawn bash -c \"cd /tmp/bandit31_repo && rm .gitignore && echo 'May I come in?' > key.txt && git add . && git commit -am 'key' && git push\"; expect \"*password*\"; send \"PREVPASSWORD\r\"; expect eof; spawn bash -c \"cd / && rm -rf /tmp/bandit31_repo\"; expect eof" | grep 'remote: ' | sed "s/remote: //g" | sed '/.* .*/!d' | tail -1 | sed $'s,\x1b\\[[0-9;]*[a-zA-Z],,g';
```

- Clone the repo
- Remove the `.gitignore`
- Write the file using `echo`
- Add and commit the files
- Push the commit
- Use `grep`, `sed` and `tail` to parse the output for the password

# Level 32 -> 33

> After all this git stuff, it’s time for another escape. Good luck!

```bash
$ ssh bandit32@bandit.labs.overthewire.org -p 2220
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit32@bandit.labs.overthewire.org's password:
...
WELCOME TO THE UPPERCASE SHELL
>> ls
sh: 1: LS: Permission denied
>> whoami
sh: 1: WHOAMI: Permission denied
>> 'test'
sh: 1: TEST: Permission denied
>> `test`
sh: 1: TEST: Permission denied
>> "test"
sh: 1: TEST: Permission denied
```

Everything we type is uppercased, how can we get a shell?

Well, there are environment variables we can use. These can be seen in `env`.

For example on `bandit31`:
```bash
bandit31@bandit:~$ env
SHELL=/bin/bash
PWD=/home/bandit31
LOGNAME=bandit31
XDG_SESSION_TYPE=tty
HOME=/home/bandit31
LANG=C.UTF-8
LS_COLORS=...
LESSCLOSE=/usr/bin/lesspipe %s %s
XDG_SESSION_CLASS=user
TERM=xterm-256color
LESSOPEN=| /usr/bin/lesspipe %s
USER=bandit31
SHLVL=1
XDG_SESSION_ID=19163
XDG_RUNTIME_DIR=/run/user/11031
QUOTING_STYLE=literal
DEBUGINFOD_URLS=https://debuginfod.ubuntu.com
LC_ALL=en_US.UTF-8
TMOUT=1800
XDG_DATA_DIRS=/usr/local/share:/usr/share:/var/lib/snapd/desktop
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/11031/bus
SSH_TTY=/dev/pts/55
GAMEHOSTNAME=bandit
_=/usr/bin/env
```


All of this is pretty useless, but we can use one that isn't listed: `$n`.

This gets the nth argument in a command, and `$0` will get the current shell path.

```bash
>> $0
$ whoami
bandit33
```

Now we can just read the password.

```bash
$ cat /etc/bandit_pass/bandit33
tQdtbs5D5i2vJwkO8mEyYEyTL8izoeJ0
```