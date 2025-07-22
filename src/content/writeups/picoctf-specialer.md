---
title: "specialer"
description: "Reception of Special has been cool to say the least. That's why we made an exclusive version of Special, called Secure Comprehensive Interface for Affecting Linux Empirically Rad, or just 'Specialer'. With Specialer, we really tried to remove the distractions from using a shell. Yes, we took out spell checker because of everybody's complaining. But we think you will be excited about our new, reduced feature set for keeping you focused on what needs it the most. Please start an instance to test your very own copy of Specialer\n`ssh -p PORT ctf-player@saturn.picoctf.net`. The password is `d137d16e`.\n\nHint: What programs do you have access to?"
pubDate: 2025-03-14
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
image: "./images/picoctf/specialer/icon.png"
---

Using the `ssh` connection command given and the password, I connect to the server:
```bash
$ ssh -p 62619 ctf-player@saturn.picoctf.net
...
ctf-player@saturn.picoctf.net's password:
Specialer$ ls
-bash: ls: command not found
```

We are not restricted by characters, but the binaries don't exist! We can use `.` as an alias for `source` (which both still exist) to execute files.
```bash
Specialer$ .
-bash: .: filename argument required
.: usage: . filename [arguments]
Specialer$ . *
-bash: .: abra: is a directory
Specialer$ . */*
-bash: Nothing: command not found
```

So we can execute a file but when there is a command with a non-existent command, it will fail!

The solution is a simple feature that is so often forgotten, Tab. The tab key does autocompletion and if we do `abra/` then press tab twice, we get this:
```bash
Specialer$ . abra/cada
cadabra.txt   cadaniel.txt 
```

We can now explore the directories without `ls`! We can also see what binaries we have:
```bash
Specialer$ /
bin/   home/  lib/   lib64/
Specialer$ /bin/bash
```

Pressing tab inside `/bin` only gave us bash, which means that is the only binary available.

Let's press tab without any input to see what is available to us:
```bash
Specialer$
!          ]]         break      command    coproc     done       esac       false      function   if         local      pushd      return     source     times      ulimit     wait
./         alias      builtin    compgen    declare    echo       eval       fc         getopts    in         logout     pwd        select     suspend    trap       umask      while
:          bash       caller     complete   dirs       elif       exec       fg         hash       jobs       mapfile    read       set        test       true       unalias    {
[          bg         case       compopt    disown     else       exit       fi         help       kill       popd       readarray  shift      then       type       unset      }
[[         bind       cd         continue   do         enable     export     for        history    let        printf     readonly   shopt      time       typeset    until
```

A few features catch my eye, specifically `exec` and `echo`.

With `exec` we could provide the file content and if will execute it to the command line. After trying with a few files we eventually land the correct file!
```bash
Specialer$ exec < ala/kazam.txt
Specialer$ return 0 picoCTF{y0u_d0n7_4ppr3c1473_wh47_w3r3_d01ng_h3r3_838b49d1}
```

Flag: `picoCTF{y0u_d0n7_4ppr3c1473_wh47_w3r3_d01ng_h3r3_838b49d1}`

### Other Solutions

#### `mapfile`
We can read the file by using `mapfile` to take the file contents into a variable `a` then printing the variable's contents with `echo`.
```bash
Specialer$ mapfile -t a < ala/kazam.txt
Specialer$ echo $a
return 0 picoCTF{y0u_d0n7_4ppr3c1473_wh47_w3r3_d01ng_h3r3_838b49d1}
```

### `echo`
We can provide the file content to `echo` by using a command substitution and the file content as an input.
```bash
Specialer$ echo $(<abra/cadaniel.txt )
Yes, I did it! I really did it! I'm a true wizard!
Specialer$ echo $(<ala/kazam.txt )
return 0 picoCTF{y0u_d0n7_4ppr3c1473_wh47_w3r3_d01ng_h3r3_838b49d1}
```