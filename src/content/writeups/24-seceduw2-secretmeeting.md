---
title: "Secret meeting?"
description: "Something that might be useful is an email address. What can we find with the information that has now been revealed to us? A particular commit might suggest a secret event may have taken place..."
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



I use the GitFive tool to extract an email address from their GitHub profile.

```bash
$ gitfive user Br0kenC1ph3r23                             
                                                            
                                                            
                   %%                   %%                  
                 (%%%%%,             (%%%%%,                
                 %%%%%@@@@@@@@@@@@@@@@@%%%%%                
                 %%%@@@@@@@@@(((@@@@@@@@@%%%                
                 @@@@@@((@@@(((@@@((@@@@@@%                
                 @@@@@@@((((@@@@@((((@@@@@@@                
                @@@@((((@@&(@@@@@(@@@((((@@@@               
               @@@@@(((((@@@@@@@@@@@((((%@@@@@              
               @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@              
               @@@@@@@@@@@@@.....@@@@@@@@@@@@@             
               @@@@@@@@@@@@@@@.@@@@@@@@@@@@@@@              
                 @@@@@@@@@@@@,,,@@@@@@@@@@@@                
           (((      @@@@@@@@@@@@@@@@@@@                    
              *((          @@@@@@@                          
                *((       @@@@@@@@@                         
                  (((((. @@@@@@@@@@@                        
                    (((((@@@@@@@@@@@&                       
                        @@@@@@@@@@@@@                       
                        @@@@@@@@@@@@@                       
                        .@@@@@@@@@@@#      

                  By: mxrch (🐦 @mxrchreborn)
            Support my work on GitHub Sponsors ! 💖 


            > GitFive 1.1.8 (Five Eyes Edition) <             

🎉 You are up to date !

[DEBUG] Cookies valid !

✍️ PROFILE
                                 
[Identifiers]
Username : Br0kenC1ph3r23
Name : Empty
ID : 179190221

[Avatar]
[+] Custom profile pic !
=> https://avatars.githubusercontent.com/u/179190221

...

[+] 36 potential emails generated !
[METAMON] 🐙 Added commits in 0.15s !

[+] [TARGET FOUND] 🐱 cipherbre4ker@gmail.com -> @Br0kenC1ph3r23

[+] Deleted the remote repo
```

Now with the email `cipherbre4ker@gmail.com` we can just use [GHunt](https://github.com/mxrch/GHunt) to dump anything interesting from the Google account itself.

```bash
$ ghunt email CipherBre4ker@gmail.com                                                                                                                 130 ↵

     .d8888b.  888    888                   888    
    d88P  Y88b 888    888                   888    
    888    888 888    888                   888    
    888        8888888888 888  888 88888b.  888888 
    888  88888 888    888 888  888 888 "88b 888    
    888    888 888    888 888  888 888  888 888    
    Y88b  d88P 888    888 Y88b 888 888  888 Y88b.  
     "Y8888P88 888    888  "Y88888 888  888  "Y888 v2

             By: mxrch (🐦 @mxrchreborn)
       Support my work on GitHub Sponsors ! 💖
    

         > GHunt 2.2.0 (Wardriving Edition) <        

🎉 You are up to date !

[+] Stored session loaded !
[+] Authenticated !

🙋 Google Account data

[+] Custom profile picture !
=> https://lh3.googleusercontent.com/a-/ALV-UjVcPJ8SznzuPWFrkRSPZGvKiwindmJI-rNh3Qsp0LhiQyL4th8

[-] Default cover picture

Last profile edit : 2024/08/27 07:24:39 (UTC)

Email : CipherBre4ker@gmail.com
Gaia ID : 110486421704465038404

...

🗺️ Maps data

Profile page : https://www.google.com/maps/contrib/110486421704465038404/reviews

[-] No review.

🗓️ Calendar data

[+] Public Google Calendar found !

Calendar ID : cipherbre4ker@gmail.com
Calendar Timezone : Australia/Sydney

[+] 2 events dumped ! Showing the last 2 ones...

╔═══════════════════════╤═════════════════════╤══════════╗
║         Name          │   Datetime (UTC)    │ Duration ║
╟───────────────────────┼─────────────────────┼──────────╢
║ Happy Birthday to Me! │          ?          │    ?     ║
╟───────────────────────┼─────────────────────┼──────────╢
║    Secret Meeting     │ 2024/09/02 23:00:00 │  1 hour  ║
╚═══════════════════════╧═════════════════════╧══════════╝

🗃️ Download link :
=> https://calendar.google.com/calendar/ical/CipherBre4ker@gmail.com/public/basic.ics
```

We can see a 'Secret Meeting' being organised, so let's have a look at that Google Calendar ICS file in a text editor.

We see the following information about the 'Secret Meeting':

```
Meeting with CipherM1nd about getting more involved.

Agenda:
 - How do I open this file - they said they used my password?  (I don't have **infinite** patience)
 - Deleting that Reddit comment I made under my S4dP4nd4_444 account??? What do they mean I did oopsec?

Flag: HerpDerpIHaveaPuBL1cKalendar

Join with Google Meet: https://meet.google.com/sau-jufv-rvd

Learn more about Meet at: https://support.google.com/a/users/answer/9282720
```

Flag: `SECEDU{HerpDerpIHaveaPuBL1cKalendar}`