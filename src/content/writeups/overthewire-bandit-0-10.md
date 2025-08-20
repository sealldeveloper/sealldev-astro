---
title: "OverTheWire Bandit Levels 0-10"
description: "A walkthrough of basic Linux shell concepts and one-liner approaches"
pubDate: 2025-08-21
section: "OverTheWire"
category: "linux"
difficulty: "easy" 
tags: ["linux", "ssh", "bash", "beginner"]
---

> This was made as a part of my university work, and a tool to automate all of OverTheWire's Bandit. You can see this tool [here](https://github.com/sealldeveloper/overthewire-bandit-1todone).

# Level 0 -> 1

> The password for the next level is stored in a file called readme located in the home directory. Use this password to log into bandit1 using SSH. Whenever you find a password for a level, use SSH (on port 2220) to log into that level and continue the game.

This is to teach the basics of `ssh`. We can connect like so.

```bash
$ ssh bandit0@bandit.labs.overthewire.org -p 2220
```

To break down the format:
- `ssh` is the command we are running
- `bandit0` is the username, the `@` seperates the username and the host.
- `bandit.labs.overthewire.org` is the host
- `-p 2220` is to specify a custom port of `2220`

Let's try it!

```bash
$ ssh bandit0@bandit.labs.overthewire.org -p 2220
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

backend: gibson-0
bandit0@bandit.labs.overthewire.org's password:
```

This blank input, we need to type the password. It will stay blank as we type it for security purposes. Once we have typed `bandit0`, we can press Enter and get a shell!

```bash
bandit0@bandit:~$
```

What does this mean? Again to break it down:
- `bandit0` is the username
- `@` separates the host and username
- `bandit` is the hostname of the computer
- `:` separates the host and the path
- `~` indicates the home folder of the current user, in this case `/home/bandit0`
- `$` is the indicator of a non-root shell, typically for root shells you will see `#` instead

Now what? Let's start with `ls` which is used to list the contents of the directory.

```bash
bandit0@bandit:~$ ls
readme
```

This means we have a file `readme` in the directory! We can read it with `cat`:
```bash
bandit0@bandit:~$ cat readme
Congratulations on your first steps into the bandit game!!
Please make sure you have read the rules at https://overthewire.org/rules/
If you are following a course, workshop, walkthrough or other educational activity,
please inform the instructor about the rules as well and encourage them to
contribute to the OverTheWire community so we can keep these games free!

The password you are looking for is: ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If
```

The password is what we need for the next level!

## One-liner

```bash
bandit0@bandit:~$ cat readme | grep 'password' | sed "s/.* //"
ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If
```

All we are doing is,
- `cat` to read the file
- `grep` to match any lines containing 'password'
- `sed` is used to run a substitution (indicated by the `s` at the start). The stuff after the first `/` is a regex. `.*` matches any amount of any character and then the space is afterwards. The `/` splits then what to replace with, in this case nothing. All this does is get every word and remove it, getting the last word in the line.

# Level 1 -> 2

> The password for the next level is stored in a file called readme located in the home directory. Use this password to log into bandit1 using SSH. Whenever you find a password for a level, use SSH (on port 2220) to log into that level and continue the game.

Let's authenticate with `ssh` using the password from last stage.

Starting with `ls`:
```bash
bandit1@bandit:~$ ls
-
```

Let's read it with `cat -`:
```bash
bandit1@bandit:~$ cat -

```

Nothing happens?

We can exit this with Ctrl+C, but this is intended as Bash is parsing this character. We can use `./-` to reference it instead!

`.` means current directory, `/` is the separator for the directory and then `-` is the file name.

So `./` means read from current directory, and `-` is the filename.

We can also use `../` to go back a directory. so `./../bandit1/` would also work as we are going `/home/bandit1` -> `/home` -> `/home/bandit1`.

Anyway, we just read with `cat ./-`

```bash
bandit1@bandit:~$ cat ./-
263JGJPfgU6LtdEvgfWU1XP5yac29mFx
```

# Level 2 -> 3

> The password for the next level is stored in a file called --spaces in this filename-- located in the home directory

Authenticate, start with `ls` (I'm not going to say this anymore unless things change).

```bash
bandit2@bandit:~$ ls
--spaces in this filename--
```

Hmm, how do we handle that? We can use `./` like before but we encounter a new problem:
```bash
bandit2@bandit:~$ cat ./--spaces in this filename--
cat: ./--spaces: No such file or directory
cat: in: No such file or directory
cat: this: No such file or directory
cat: filename--: No such file or directory
```

We need to deal with the spaces, it thinks they are separate files.

We can do this quickly in future by using the Tab key, which will autocomplete syntactically correct filenames based on the prefix matching.

E.g.
```bash
bandit2@bandit:~$ cat ./-
```

Now press Tab
```bash
bandit2@bandit:~$ cat ./--spaces\ in\ this\ filename--
```

Nice!

Backslashes (`\`) can be used to escape characters, like space!

```bash
bandit2@bandit:~$ cat ./--spaces\ in\ this\ filename--
MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx
```

# Level 3 -> 4

> The password for the next level is stored in a hidden file in the inhere directory.

```bash
bandit3@bandit:~$ ls
inhere
```

This time that is a directory so we can't `cat`, we can use `cd` to **c**hange **d**irectory.

```bash
bandit3@bandit:~$ cd inhere
bandit3@bandit:~/inhere$
```

Now we run `ls` again:
```bash
bandit3@bandit:~/inhere$ ls
```

Nothing? Now we need to try use `-a`, which shows all results including hidden files starting with `.`. Typically people do `ls -lha` to show detailed information and all files in the directory.

```bash
bandit3@bandit:~/inhere$ ls -lha
total 12K
drwxr-xr-x 2 root    root    4.0K Aug 15 13:16 .
drwxr-xr-x 3 root    root    4.0K Aug 15 13:16 ..
-rw-r----- 1 bandit4 bandit3   33 Aug 15 13:16 ...Hiding-From-You
```

There it is! We can use Tab again.

```bash
bandit3@bandit:~/inhere$ cat ./...Hiding-From-You
2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ
```

## One-liner

```bash
bandit3@bandit:~$ cat inhere/...Hiding-From-You
2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ
```

We can avoid the `cd` by just reading inside the directory directly. `inhere/` means enter the `inhere` folder in current directory, then inside that folder look for `...Hiding-From-You` and read it!

# Level 4 -> 5

> The password for the next level is stored in the only human-readable file in the inhere directory. Tip: if your terminal is messed up, try the “reset” command.

```bash
bandit4@bandit:~$ ls
inhere
bandit4@bandit:~$ cd inhere/
bandit4@bandit:~/inhere$ ls
-file00  -file01  -file02  -file03  -file04  -file05  -file06  -file07  -file08  -file09
```

Seems there are multiple files this time. We need to find the human-readable one! This can be identified with the `file` command. This command uses the contents of the file to attempt to identify the file type.

We can also use `*` to select all files in a folder, we can check the type of the files pretty quickly like this.

```bash
bandit4@bandit:~/inhere$ file ./*
./-file00: Non-ISO extended-ASCII text, with no line terminators, with overstriking
./-file01: data
./-file02: data
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
./-file08: data
./-file09: data
```

Now we can only see one with valid `ASCII text`, `./-file07`.

```bash
bandit4@bandit:~/inhere$ cat ./-file07
4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw
```

## One-liner

```bash
bandit4@bandit:~$ cat inhere/-file07
4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw
```

Just know the file, or...

```bash
$ cat $(file inhere/* | grep ': ASCII' | sed 's/: .*//')
4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw
```

Breaking this down:
- `file inhere/*` gets all the file types for the files in `inhere`
- `grep ': ASCII'` match only lines with `: ASCII`.
- `sed 's/: .*//'` replace all matches of `: <any amount of anything>` with nothing

This grabs the file name of the only entry with `ACSII text`.

Wrapping this with `$()` executes it and replaces where that is with the result, so we can prefix a `cat` to read the extracted filename!

# Level 5 -> 6

> The password for the next level is stored in a file somewhere under the inhere directory and has all of the following properties:
>
>    human-readable
>
>    1033 bytes in size
>
>    not executable

```bash
bandit5@bandit:~$ ls
inhere
bandit5@bandit:~$ ls inhere
maybehere00  maybehere03  maybehere06  maybehere09  maybehere12  maybehere15  maybehere18
maybehere01  maybehere04  maybehere07  maybehere10  maybehere13  maybehere16  maybehere19
maybehere02  maybehere05  maybehere08  maybehere11  maybehere14  maybehere17
```

Note: we can supply a directory to `ls`, and it will list the contents of the supplied directory.

We need to use `find` for this. This is the final command:
```bash
find . -type f ! -executable -size 1033c
```

What this means:
- `.` is current directory
- `-type f` is the type of match must be a file (not a directory)
- `! -executable` means not executable
- `-size 1033c` means size of 1033 bytes

Running it:
```bash
bandit5@bandit:~$ find . -type f ! -executable -size 1033c
./inhere/maybehere07/.file2
bandit5@bandit:~$ cat ./inhere/maybehere07/.file2
HWasnPhtq9AVKe0dmk45nxy20cvUa6EG<LOTS OF WHITESPACE>
```

## One-liner

```bash
bandit5@bandit:~$ find . -type f ! -executable -size 1033c -exec cat {} \; | tr -d "[:space:]"
HWasnPhtq9AVKe0dmk45nxy20cvUa6EG
```

What have we changed?

- `-exec cat {}` means instead of printing the filename, run `cat file-name` instead.
- The `\;` indicates the end of the `exec` command.
- `tr -d "[:space:]"` is deleting all instances of whatever string match supplied, in thing case `[:space:]` is the symbol for any whitespace.

# Level 6 -> 7

> The password for the next level is stored somewhere on the server and has all of the following properties:
>
>    owned by user bandit7
>
>    owned by group bandit6
>
>    33 bytes in size

As it is stored somewhere on the server, it could be anywhere. We need to use `find` again:
```bash
find / -group bandit6 -user bandit7 -size 33c
```

Again to break it down:
- `-group bandit6` specifies the file is owned by the group `bandit6`
- `-user bandit7` specifies the file is owned by the user `bandit7`
- `-size 33c` specifies the file is 33 bytes in size

Small problem, when we run that. 20 bajillion errors...

How do we get the errors to shutup?

Use the magic `2>/dev/null`! Which means:

- `2>` means to pipe the output from the file description channel 2. There are 3 file descriptors: 0 is standard out (stdout), 1 is standard in (stdin), 2 is standard err (stderr). This captures specifically the output from stderr.
- `/dev/null` means to send it to `null`, the output is discarded.

```bash
bandit6@bandit:~$ find / -group bandit6 -user bandit7 -size 33c 2>/dev/null
/var/lib/dpkg/info/bandit7.password
bandit6@bandit:~$ cat /var/lib/dpkg/info/bandit7.password
morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj
```

## One-liner

We can use `exec` again like before:
```bash
find / -group bandit6 -user bandit7 -size 33c -exec cat {} \; 2>/dev/null
```

# Level 7 -> 8

> The password for the next level is stored in the file data.txt next to the word millionth

```bash
bandit7@bandit:~$ ls
data.txt
```

This is a very long file, we can use `head` to get the first few lines:
```bash
bandit7@bandit:~$ head data.txt
aileron's       OZ18kr0JQ4foUlDQ203BRlnggygCfwOL
Gallo   hBQB8IHbDxu0M4Zax1MUkhhA6A1Xpm3g
jewelers        731Lz9zm2R8Pu5d7vxdNqAfndtgdseIC
Kepler  7ELccFIE0sltZWtAFQfTkwwEL3s6KhmP
vinegary        NJnwsaqp7xYe6fdmRvftOfcK9YLGxWfC
stool   4Scu7Gb5VKY06zopnkqNohznDxV6wI1X
rotisseries     tUH4vKiK9dLcNIRkEtRFCidprOdXAxmv
Billie's        m9jn7053akOsAmsDUiu41tnpkPDq8zdj
ejaculation's   sE1cJ1Oz56mz02ODIbGHGdMwrdSNfdlz
Phaethon        D63ocDs9dgeCQ0sYiaBDgIxPkEtNDXjk
```

and use `wc` to check the length:
```bash
bandit7@bandit:~$ wc -l data.txt
98567 data.txt
```

We can use `grep` to find the match:
```bash
bandit7@bandit:~$ cat data.txt | grep 'millionth'
millionth       dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc
```

## One-liner

```bash
cat data.txt | grep "millionth" | sed "s/millionth[[:space:]]*//"
```

This is fairly similar, but we need to used `sed` to clean it up. It replaces `millionth<any amount of whitespace>` with nothing.

# Level 8 -> 9

> The password for the next level is stored in the file data.txt and is the only line of text that occurs only once

```bash
bandit8@bandit:~$ ls
data.txt
bandit8@bandit:~$ head data.txt
ZzQDv5Imr9y5XSYGD3r61uP1fjXAhuod
bjQCibPw40urmZNBNNpv8zTOaFVFWSbv
uG6s7CFzkh4lqmcJtwLIxa4sU1v8gkhU
WkcJmDs54n2OynP1oYNjZ64kXa4KjVJY
KtzxzcvxasfTcGEobGpZ9SDoCGtiCqoa
ZzQDv5Imr9y5XSYGD3r61uP1fjXAhuod
EVUICc3XWvOsOyCzwfBk4lP9Phrq0yrx
CIf7GKFmEHSYJ4mkTGHkKrqxcJkCHmXx
Y8fwKYAyzkZ1H4TVJYjw2R9xPgrHpapw
lb1yDCOh6q8AV5p7twYZSSzuEysSae4n
bandit8@bandit:~$ wc -l data.txt
1001 data.txt
```

Here we use `sort` and `uniq -u`. We can't use `uniq` into `cat` just due to how `cat` reads its data. So we use `sort` then `uniq`.

We use `uniq -u` to get only unique lines, then pipe it together.

```bash
bandit8@bandit:~$ cat data.txt | sort | uniq -u
4CKMh1JI91bUIZZPXDqGanal4xvAg0JM
```

# Level 9 -> 10

> The password for the next level is stored in the file data.txt in one of the few human-readable strings, preceded by several ‘=’ characters.

```bash
bandit9@bandit:~$ ls
data.txt
bandit9@bandit:~$ file data.txt
data.txt: data
```

We need to parse this, we can use `strings` to extract only readable text.

```bash
$ strings data.txt | head
tvFJ
*M'Jg
>Id#{
VN5ZTH
9~T4
LkoV
$.`[
>K3Z
6tO/
PCa/
```

We can now use `grep` to look for strings with at least two `=`'s.
```bash
bandit9@bandit:~$ strings data.txt | grep "=="
========== theg
========== password
========== is
========== FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey
```

## One-liner

```bash
bandit9@bandit:~$ strings data.txt | grep "==" | tail -1 | sed "s/=* //"
FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey
```

We are using `tail -1` to get the last line of the `grep` results, then `sed` to substitute any amount of `=`'s then a space with nothing.

# Level 10 -> 11

> The password for the next level is stored in the file data.txt, which contains base64 encoded data

```bash
bandit10@bandit:~$ ls
data.txt
bandit10@bandit:~$ cat data.txt
VGhlIHBhc3N3b3JkIGlzIGR0UjE3M2ZaS2IwUlJzREZTR3NnMlJXbnBOVmozcVJyCg==
```

From eye-balling it this is base64 data, we can decode this in the terminal with the `base64` utility.

```bash
bandit10@bandit:~$ cat data.txt  | base64 -d
The password is dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr
```

## One-liner

```bash
bandit10@bandit:~$ cat data.txt | base64 -d | sed "s/.* //"
dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr
```

Another last word `sed`, no biggie.