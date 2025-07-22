---
title: "PSW"
description: "With knowledge of the attacker's avatar, we can find their github repo. Is there any senstive information that 'was' found here?"
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



Their Gravatar description is a good hint: `I might not be the best hacker, but my repos are clean.`.

Using the username found from earlier, we can find a GitHub profile.

![githubprof.png](images/24-secedu/githubprof.png)

The one repo on their profile has some usual commits and one weird one, specifically one with the name "You didn't see that.."

![githubcommit.png](images/24-secedu/githubcommit.png)

Flag: `0ld-Fa1thful-P@ssw0rd`