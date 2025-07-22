---
title: "EnableMe"
description: "You've received a confidential document! Follow the instructions to unlock it. Note: This is not malware"
pubDate: 2024-01-15
ctf: "UofTCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-uoftctf/icon.png"
---

We are given a `.docm` file which is notorious (among other office files) for its macros and tricking of employees.

I utilise a tool called [olevba](https://github.com/decalage2/oletools/wiki/olevba) to extract any macros in the file and find `AutoOpen.vba`. The `AutoOpen` name allows the file to automatically run a macro upon the opening of the document.

```vb
Sub AutoOpen()
    Dim v6 As Variant, v7 As Variant
    v6 = Array(98, 120, 113, 99, 116, 99, 113, 108, 115, 39, 116, 111, 72, 113, 38, 123, 36, 34, 72, 116, 35, 121, 72, 101, 98, 121, 72, 116, 39, 115, 114, 72, 99, 39, 39, 39, 106)
    v7 = Array(44, 32, 51, 84, 43, 53, 48, 62, 68, 114, 38, 61, 17, 70, 121, 45, 112, 126, 26, 39, 21, 78, 21, 7, 6, 26, 127, 8, 89, 0, 1, 54, 26, 87, 16, 10, 84)

    Dim v8 As Integer: v8 = 23

    Dim v9 As String, v10 As String, v4 As String, i As Integer
    v9 = ""
    For i = 0 To UBound(v6)
        v9 = v9 & Chr(v6(i) Xor Asc(Mid(Chr(v8), (i Mod Len(Chr(v8))) + 1, 1)))
    Next i

    v10 = ""
    For i = 0 To UBound(v7)
        v10 = v10 & Chr(v7(i) Xor Asc(Mid(v9, (i Mod Len(v9)) + 1, 1)))
    Next i

    MsgBox v10
End Sub
```

Analysing the contents of the script, it seems to have a list of ASCII characters that is runs through some `Chr`, `Xor` and other various arguments before displaying the result of `v10` in a message box.

Running this script gives us a message box with the following: `YOU HAVE BEEN HACKED! Just kidding :)`

If we change the `MsgBox` value from `v10` to `v9` we recieve the flag.

Flag: `uoftctf{d0cx_f1l35_c4n_run_c0de_t000}`

**Files:** [invoice.docm](https://files.seall.dev/ctfs/uoftctf2024/enableme/invoice.docm)