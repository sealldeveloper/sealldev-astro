---
title: "OverTheWire Bandit Levels 11-20"
description: "A walkthrough of basic Linux shell concepts and one-liner approaches"
pubDate: 2025-08-21
section: "OverTheWire"
category: "linux"
difficulty: "easy" 
tags: ["linux", "ssh", "bash", "beginner"]
---

> This was made as a part of my university work, and a tool to automate all of OverTheWire's Bandit. You can see this tool [here](https://github.com/sealldeveloper/overthewire-bandit-1todone).

# Level 11 -> 12

> The password for the next level is stored in the file data.txt, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions

Reading the description this is a ROT13 challenge.

```bash
bandit11@bandit:~$ ls
data.txt
bandit11@bandit:~$ cat data.txt
Gur cnffjbeq vf 7k16JArUVv5LxVuJfsSVdbbtaHGlw9D4
```

We can just use a ROT13 converter such as https://rot13.com/ online!

```
The password is 7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4
```

## One-liner

```bash
cat data.txt | tr "A-Za-z" "N-ZA-Mn-za-m" | sed "s/.* //g"
```

We are using `tr` to translate characters, in this case A is the 1st letter and N is the 13th, so rotating it by 13. We can then use `sed` to get the last word.

# Level 12 -> 13

> The password for the next level is stored in the file data.txt, which is a hexdump of a file that has been repeatedly compressed. For this level it may be useful to create a directory under /tmp in which you can work. Use mkdir with a hard to guess directory name. Or better, use the command “mktemp -d”. Then copy the datafile using cp, and rename it using mv (read the manpages!)

```bash
bandit12@bandit:~$ ls
data.txt
bandit12@bandit:~$ cat data.txt | head
00000000: 1f8b 0808 0933 9f68 0203 6461 7461 322e  .....3.h..data2.
00000010: 6269 6e00 0148 02b7 fd42 5a68 3931 4159  bin..H...BZh91AY
00000020: 2653 59be 9d9d 9600 001f ffff fe7f fbcf  &SY.............
00000030: af7f 9eff f7ee ffdf bff7 fef7 ddbe 9db7  ................
00000040: bf9f 9f5f ca6f fffe d6fb feff b001 3ab3  ..._.o........:.
00000050: 0403 40d0 0000 00d0 01a0 03d4 0000 0346  ..@............F
00000060: 41a1 9000 0000 1900 0190 0686 8191 a326  A..............&
00000070: 1340 0c8c 4d0f 4d4c 4403 468d 0d1a 0001  .@..M.MLD.F.....
00000080: a686 8000 01a0 6462 6868 6800 0006 8f50  ......dbhhh....P
00000090: 00d0 1a06 9a0c d406 8c80 189a 6834 64d0  ............h4d.
```

We can use `xxd` to parse this hexdump into actual data, and then pipe that to `file`.

```bash
bandit12@bandit:~$ cat data.txt | xxd -r | file -
/dev/stdin: gzip compressed data, was "data2.bin", last modified: Fri Aug 15 13:15:53 2025, max compression, from Unix
```

Now we can use `gunzip` to decompress it.

```bash
bandit12@bandit:~$ cat data.txt | xxd -r | gunzip -d | file -
/dev/stdin: bzip2 compressed data, block size = 900k
```

Then `bzip2` decompression:

```bash
bandit12@bandit:~$ cat data.txt | xxd -r | gunzip -d | bzip2 -d | file -
/dev/stdin: gzip compressed data, was "data4.bin", last modified: Fri Aug 15 13:15:53 2025, max compression, from Unix
```

Then `tar` for the `.tar.gz` using `xzOf` options:
- `x` for extract
- `z` for gzip compression
- `O` for sending result to stdout
- `f` for file specification
- `-` representing the stdin data

```bash
bandit12@bandit:~$ cat data.txt | xxd -r | gunzip -d | bzip2 -d | tar xzOf - | file -
/dev/stdin: POSIX tar archive (GNU)
```

Now we can use tar normally without `z`.

```bash
bandit12@bandit:~$ cat data.txt | xxd -r | gunzip -d | bzip2 -d | tar xzOf - | tar xOf - | file -
/dev/stdin: bzip2 compressed data, block size = 900k
```

Now we just repeat a bit... It's boring I'm going to the end.

```bash
bandit12@bandit:~$ cat data.txt | xxd -r | gunzip -d | bzip2 -d | tar xzOf - | tar xOf - | bzip2 -d | tar xOf - | gunzip -d
The password is FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn
```

No temporary files (and in my opinion the way it should be taught).

## One-liner

```bash
cat data.txt | xxd -r | gunzip -d | bzip2 -d | tar xzOf - | tar xOf - | bzip2 -d | tar xOf - | gunzip -d | sed "s/.* //g"
```

Same as before, just add the `sed` to get the last word!

# Level 13 -> 14

> The password for the next level is stored in /etc/bandit_pass/bandit14 and can only be read by user bandit14. For this level, you don’t get the next password, but you get a private SSH key that can be used to log into the next level. Note: localhost is a hostname that refers to the machine you are working on

```bash
bandit13@bandit:~$ ls
sshkey.private
bandit13@bandit:~$ cat sshkey.private
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAxkkOE83W2cOT7IWhFc9aPaaQmQDdgzuXCv+ppZHa++buSkN+
...
```

We need to use that key locally! Let's make a copy of it on our host.

Use either `nano`, `vim`, `emacs`, `mousepad` or some GUI editor to store the key. Mine will be in `sshkey`.

# Level 14 -> 15

> The password for the next level can be retrieved by submitting the password of the current level to port 30000 on localhost.

If we try to use this key with SSH as it is, we will be warned and it won't let us.

We need to `chmod 600 sshkey` to set the appropriate permissions for a private key.

We can now connect with the key like so:
```bash
$ ssh bandit14@bandit.labs.overthewire.org -p 2220 -i sshkey
```

`-i` provides the identity, in this case the private key file.

Once connected, we need to get the current passwords. All the level passwords are stored at `/etc/bandit_pass/bandit<NUM>` and can only be accessed by that user.

```bash
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
```

Now, we need to make a connection to `localhost:30000`. This can be done with `nc` (netcat), like so:
```bash
bandit14@bandit:~$ nc localhost 30000
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
Correct!
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
```

We can press Ctrl+c to exit.

## One-liner

```bash
cat /etc/bandit_pass/bandit14 | nc localhost 30000 | sed "/^[[:space:]]*$/d" | tail -1
```

This is reading the password then using a pipe to pass that to `localhost:30000`. The `sed` is used to delete all blank lines, then get the last line (containing the password).

# Level 15 -> 16

> The password for the next level can be retrieved by submitting the password of the current level to port 30001 on localhost using SSL/TLS encryption.

With the same SSH connection as before, we can use that password on `localhost:30001`. We need to connect with SSL/TLS though. We can do this with `openssl`.

Using `s_client` we can use `-connect` to connect!

```bash
bandit14@bandit:~$ openssl s_client -connect localhost:30001
CONNECTED(00000003)
...
read R BLOCK
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
Correct!
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx

closed
```

Pasting the password returns the next one!

## One-liner

```bash
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14 | nc localhost 30000 | sed "/^[[:space:]]*$/d" | tail -1 | openssl s_client -connect localhost:30001 -ign_eof -quiet | sed "/^[[:space:]]*$/d" | tail -1
Can't use SSL_get_servername
depth=0 CN = SnakeOil
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN = SnakeOil
verify return:1
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx
```

We are using the first component to get the first password from 14 -> 15.

This is passed to `openssl` and we use `-ign_eof` to allow stdin inputs. `-quiet` is used to silence (somewhat...) `openssl` debug (WHICH NO MATTER WHAT WON'T COMPLETELY SHUTUP!!!!). We can the use `sed` to remove all the blank lines then get the last line for the password.

# Level 16 -> 17

> The credentials for the next level can be retrieved by submitting the password of the current level to a port on localhost in the range 31000 to 32000. First find out which of these ports have a server listening on them. Then find out which of those speak SSL/TLS and which don’t. There is only 1 server that will give the next credentials, the others will simply send back to you whatever you send to it.

This time we need to use `nmap` to get the open ports, as this is a test environment we can supply `-T5` for speed (lol).

```bash
bandit14@bandit:~$ nmap -T5 -p31000-32000 localhost
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-08-20 16:47 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00017s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT      STATE SERVICE
31046/tcp open  unknown
31518/tcp open  unknown
31691/tcp open  unknown
31790/tcp open  unknown
31960/tcp open  unknown

Nmap done: 1 IP address (1 host up) scanned in 0.05 seconds
```

`-p31000-32000` specifies the port range.

We can now try, one by one, to send the password over SSL/TLS with `openssl` and it works on port `31790`

```bash
bandit14@bandit:~$ openssl s_client -connect localhost:31790 -quiet
Can't use SSL_get_servername
depth=0 CN = SnakeOil
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN = SnakeOil
verify return:1
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx
Correct!
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAvmOkuifmMg6HL2YPIOjon6iWfbp7c3jx34YkYWqUH57SUdyJ
imZzeyGC0gtZPGujUSxiJSWI/oTqexh+cAMTSMlOJf7+BrJObArnxd9Y7YT2bRPQ
...
```

## One-liner

```bash
nmap -T5 -p31000-32000 localhost | grep "/tcp" | cut -d"/" -f1 | xargs -I {} sh -c "cat /etc/bandit_pass/bandit14 | nc localhost 30000 | sed \"/^[[:space:]]*$/d\" | tail -1 | openssl s_client -connect localhost:30001 -ign_eof -quiet | sed \"/^[[:space:]]*$/d\" | tail -1 | timeout 2 openssl s_client -connect localhost:{} -ign_eof -quiet" | sed "1,/Correct/d"
```

This works by doing the port scan, getting the port matching lines and passing it to `xargs`. For each line it runs the command with the argument. the main `sh -c` command is to get the previous password, then pass that with each port. Then it gets all lines below `Correct` and deletes that line.

# Level 17 -> 18

> There are 2 files in the homedirectory: passwords.old and passwords.new. The password for the next level is in passwords.new and is the only line that has been changed between passwords.old and passwords.new

We can do this with `diff`, which compares the difference between 2 files.  

```bash
bandit17@bandit:~$ ls
passwords.new  passwords.old
bandit17@bandit:~$ diff passwords.old passwords.new
42c42
< gvE89l3AhAhg3Mi9G2990zGnn42c8v20
---
> x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO
```

The `>` is from `passwords.new` and `<` is from `passwords.old`.

We want the new one, so `x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO`!

## One-liner

```bash
diff passwords.old passwords.new | tail -1 | cut -c3-
```

This does the diff, gets the last line with `tail` and we cut the first 2 characters.

# Level 18 -> 19

> The password for the next level is stored in a file readme in the homedirectory. Unfortunately, someone has modified .bashrc to log you out when you log in with SSH.

```bash
$ ssh bandit18@bandit.labs.overthewire.org -p 2220
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit18@bandit.labs.overthewire.org's password:
...
Byebye !
Connection to bandit.labs.overthewire.org closed.
```

Instantly closes!

We can pass commands directly through ssh by passing it as an argument.

```bash
$ ssh bandit18@bandit.labs.overthewire.org -p 2220 ls
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit18@bandit.labs.overthewire.org's password:
readme
```

And then get the password with `cat readme`:
```bash
$ ssh bandit18@bandit.labs.overthewire.org -p 2220 "cat readme"
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit18@bandit.labs.overthewire.org's password:
cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8
```

# Level 19 -> 20

> To gain access to the next level, you should use the setuid binary in the homedirectory. Execute it without arguments to find out how to use it. The password for this level can be found in the usual place (/etc/bandit_pass), after you have used the setuid binary.

```bash
bandit19@bandit:~$ ls
bandit20-do
bandit19@bandit:~$ ./bandit20-do
Run a command as another user.
  Example: ./bandit20-do id
```

This executes commands as the used `bandit20` with the SUID binary.

```bash
bandit19@bandit:~$ ./bandit20-do whoami
bandit20
```

We can then read the password as `bandit20` from `/etc/bandit_pass`.

```bash
bandit19@bandit:~$ ./bandit20-do cat /etc/bandit_pass/bandit20
0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
```

# Level 20 -> 21

> There is a setuid binary in the homedirectory that does the following: it makes a connection to localhost on the port you specify as a commandline argument. It then reads a line of text from the connection and compares it to the password in the previous level (bandit20). If the password is correct, it will transmit the password for the next level (bandit21).

```bash
bandit20@bandit:~$ ls
suconnect
bandit20@bandit:~$ ./suconnect
Usage: ./suconnect <portnumber>
This program will connect to the given port on localhost using TCP. If it receives the correct password from the other side, the next password is transmitted back.
```

We can solve this one with 2 simultaneous connections, in another terminal window I reconnect to SSH with the same credentials.

In the first terminal I setup a netcat listener:
```bash
bandit20@bandit:~$ nc -lvnp 9999
Listening on 0.0.0.0 9999
```

In the second one, I run the `suconnect`:
```bash
bandit20@bandit:~$ ./suconnect 9999
```

And I paste the current password in the netcat listener, receiving the next password:
```bash
bandit20@bandit:~$ nc -lvnp 9999
Listening on 0.0.0.0 9999
Connection received on 127.0.0.1 47690
0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
EeoULMCra2q0dSkYj561DX7s1CpBuOBt
```

## One-liner

This one was quite challenging as we needed to do a listener and a connection in 1 shell without background tasks not passing the output to Paramiko. This was the final payload:
```bash
PASS=$(cat /tmp/bandit20_pass_sealldev);mkfifo /tmp/pipe$$ && (echo "$PASS" > /tmp/pipe$$ &) && timeout 2 nc -lvnp 1337 < /tmp/pipe$$ 2>/dev/null & sleep 0.2 && ./suconnect 1337 > /dev/null 2>/dev/null && rm -f /tmp/pipe$$
```

We make a variable `PASS` that has the previous password from the last level (I stored it in `/tmp/bandit20_pass_sealldev` as we can't access it otherwise).

We then use `mkfifo` to make a named FIFO (first in first out) pipe. We can then echo the password into the pipe and setup the listener. The pipe passes its input into netcat, sleeps for a little and the starts the connection. The output of `suconnect` is discarded and the reason why these run simultaneously is due to `&` which backgrounds a task, resulting in logging of the PIDs of those background processes:
```bash
bandit20@bandit:~$ PASS=$(cat /tmp/bandit20_pass_sealldev);mkfifo /tmp/pipe$$ && (echo "$PASS" > /tmp/pipe$$ &) && timeout 2 nc -lvnp 1337 < /tmp/pipe$$ 2>/dev/null & sleep 0.2 && ./suconnect 1337 > /dev/null 2>/dev/null && rm -f /tmp/pipe$$
[1] 281750
EeoULMCra2q0dSkYj561DX7s1CpBuOBt
[1]+  Done                    mkfifo /tmp/pipe$$ && ( echo "$PASS" > /tmp/pipe$$ & ) && timeout 2 nc -lvnp 1337 < /tmp/pipe$$ 2> /dev/null
```

We then remove the pipe at the end.
