---
title: "CSS Password"
description: "last time we had a worbler, it failed miserably and left everyone sad, and no one got their flags. now we have another one, maybe it'll work this time? Hint: try not to byte off more than you can chew! what does your code look like?"
pubDate: 2024-01-15
ctf: "UofTCTF 2024"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/24-uoftctf/icon.png"
---

We are also given the following snippet of the code running:
```
                      _     _             
                     | |   | |            
  __      _____  _ __| |__ | | ___ _ __   
  \ \ /\ / / _ \| '__| '_ \| |/ _ \ '__|  
   \ V  V / (_) | |  | |_) | |  __/ |     
    \_/\_/ \___/|_|  |_.__/|_|\___|_|     
                                          
==========================================
Enter flag: *redacted*
Here's your flag:  a81c0750d48f0750
```

Now, looking at the file we are given and some basic research we find this is disassembled python code (thanks again to my teammate, skat). Looking online there were some tools referenced to re-assemble the code from this state but none seemed compatible so we decided to approach it the long way and manually reconstruct the code. We both split up to work on functions and create a 1:1 bytecode copy.

We checked our work using a basic script:

```python
from dis import dis
from worbler import main
print(dis(main))
```

And then manually comparing the output against the original code.

We arrive at the following exact replica of the code:

```python
def main():
    import re

    pattern=re.compile("^uoftctf\\{([bdrw013]){9}\\}$")

    def worble(s):
        s1 = 5
        s2 = 31

        for n in range(len(s)):
            s1 = (s1 + ord(s[n]) + 7) % 65521
            s2 = (s1 * s2) % 65521

        return (s2 << 16) | s1

    def shmorble(s):
        r=''
        for i in range(len(s)):
            r+=s[i-len(s)]
            
        return r

    def blorble(a,b):
        return format(a,'x')+format(b,'x')

    print('                      _     _             ')
    print('                     | |   | |            ')
    print('  __      _____  _ __| |__ | | ___ _ __   ')
    print("  \\ \\ /\\ / / _ \\| '__| '_ \\| |/ _ \\ '__|  ")
    print('   \\ V  V / (_) | |  | |_) | |  __/ |     ')
    print('    \\_/\\_/ \\___/|_|  |_.__/|_|\\___|_|     ')
    print('                                          ')
    print('==========================================')

    flag=input('Enter flag: ')
    if not pattern.match(flag):
        print('Incorrect format!'); return None

    a=worble(flag)
    b=worble(flag[::-1])

    print("Here's your flag:",shmorble(blorble(a,b))); return None
```

Looking into the functions we can see that we give a flag input, and then the maths operations of the functions will distort the input into an output string. We can also see from the pattern we only have 7 characters to choose from for the 9 characters inside the flag.

We utilise `crunch` to generate a wordlist to use:

```
$ crunch 9 9 bdrw013 > wordlist.txt
Crunch will now generate the following amount of data: 403536070 bytes
384 MB
0 GB
0 TB
0 PB
Crunch will now generate the following number of lines: 40353607
```

Now with the wordlist we can reorganise the existing script to check till we get the correct output:

```python
def main(flag):
    import re

    pattern=re.compile("^uoftctf\\{([bdrw013]){9}\\}$")

    def worble(s):
    
        s1 = 5
        s2 = 31
    
        for n in range(len(s)):
            s1 = (s1 + ord(s[n]) + 7) % 65521
            s2 = (s1 * s2) % 65521
        
        return (s2 << 16) | s1
    def shmorble(s):
        r=''
        for i in range(len(s)):
            r+=s[i-len(s)]
        return r

    def blorble(a,b):
        return format(a,'x')+format(b,'x')

    if not pattern.match(flag):
        return None

    a=worble(flag)
    b=worble(flag[::-1])

    return shmorble(blorble(a,b))

with open("wordlist.txt", "r") as f:
    wordlist = f.read().split("\n")

for i,word in enumerate(wordlist):
    if i % 10000 == 0:
        print(f"Currently on {i}")
    output = main("uoftctf{"+word+"}")
    if output == "a81c0750d48f0750":
        print(word)
        break
```

Which eventually returns: `d3w0rb13d` as the value.

We use this as our flag!

Flag: `uoftctf{d3w0rb13d}`

**Files:** [worbler](https://files.seall.dev/ctfs/uoftctf2024/all-worbled-up/worbler)