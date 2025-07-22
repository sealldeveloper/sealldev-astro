---
title: "Cursed Credential"
description: "I forgot my Browser's saved password although a friend of mine tells that I can find it if I know my master key. The problem is I dont even remember that, hopefully you can rock your brain and help me out."
pubDate: 2024-12-23
ctf: "BackdoorCTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-backdoor/icon.png"
---



We are given a `logins.json`, `key4.db` and `cert9.db`.

These are hallmark Firefox files, the `key4.db` is a dead giveaway. The challenge description hints towards a master password being set, '`I can find it if I know my master key`'.

I try using firefox_decrypt and see the following:
```bash
$ python3 firefox_decrypt/firefox_decrypt.py 7glfqj3r.default-release                                                                                                                                        
2024-12-23 20:41:41,805 - WARNING - profile.ini not found in 7glfqj3r.default-release
2024-12-23 20:41:41,805 - WARNING - Continuing and assuming '7glfqj3r.default-release' is a profile location

Master Password for profile 7glfqj3r.default-release: 
```

I look into password recovery tools for Firefox's master password and found FireMaster. 

I originally try using the tool with `rockyou.txt` but the execution is *way* too slow, so I tried minimising the wordlist with some arbitrary words from the challenges description/title.

I grabbed all the passwords from rockyou (regardless of capitalisation) that contained: `fire`, `fox`, `cred`, `browse`, `friend`, `brain` and `help`.

I ran the program with `wine` and the custom wordlist and got a hit:
```bash
$ wine ../../FireMaster/FireMaster.exe -d -f customwordlist.txt -q . 
...
 FireMaster 8.0: The Firefox Master Password Recovery Tool

 For more HELP, please visit https://securityxploded.com/firemaster.php 


 Performing Firefox Master Password Recovery operation...

 Firefox Profile Path: [.]

 Recovery Method :   Dictionary
 Dictionary File :   customwordlist2.txt 

 Found Key4.db file, using new password recovery method0024:fixme:ntdll:NtQuerySystemInformation info_class SYSTEM_PERFORMANCE_INFORMATION
wine: Read access denied for device L"\\??\\Z:\\", FS volume label and serial are not available.
0024:fixme:file:NtLockFile I/O completion on lock not implemented yet


 Performing dictionary crack (Quiet Mode)....please wait 

 [DictCrack] 1: Trying password => cursed 
 [DictCrack] 500: Trying password => firechild 
 [DictCrack] 1000: Trying password => fireba11 

 ******** Congratulations!!! Your Master Password Recovered Successfully ********* 

 Master Password: phoenixthefirebird14

 *************************************************************************************



 FireMaster Recovery Operation Statistics 
 ==========================================
 Dictionary crack speed : 113 cracks/sec
 FireMaster Init time   : 23-12-2024 02:46:52
 FireMaster Exit time   : 23-12-2024 02:47:02
 Total crack time       : 00h 00m 10s 648ms 

0024:fixme:kernelbase:AppPolicyGetProcessTerminationMethod FFFFFFFA, 0082FD84
```

I re-use `firefox_decrypt` with the password recovered `phoenixthefirebird14`.
```bash
$ python3 firefox_decrypt/firefox_decrypt.py 7glfqj3r.default-release
2024-12-23 21:40:58,193 - WARNING - profile.ini not found in 7glfqj3r.default-release
2024-12-23 21:40:58,193 - WARNING - Continuing and assuming '7glfqj3r.default-release' is a profile location

Master Password for profile 7glfqj3r.default-release: 

Website:   https://play.picoctf.org
Username: '4n0nym0u5'
Password: 'flag{n0_p@ssw0rd_15_s3cur3??}'
```

Flag: `flag{n0_p@ssw0rd_15_s3cur3??}`