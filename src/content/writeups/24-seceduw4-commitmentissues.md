---
title: "commitment_issues"
description: "The extremists are believed to be operating under a number of front companies, including Redfield Industries. Intelligence gathering has led to the discovery of the company's website. Careful analysis of how this website was made may reveal crucial information linking back to the extremist group, potentially exposing their true identities or operational details.\n\nhttps://tobiasredfield.github.io/redfield-industries/"
pubDate: 2024-10-02
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



The website is very empty, with nothing but a Twitter link to `https://twitter.com/` and some generic PR slop...

![githubpages.png](images/24-secedu/githubpages.png)

This website is a GitHub Pages site, the format is `<username>.github.io` for a GitHub account so lets investigate: `https://github.com/tobiasredfield`.

![tobiasgithub.png](images/24-secedu/tobiasgithub.png)

There is one repo `redfield-industries`, with 8 commits but one catching my eye as that empty Twitter URL might not have been so empty:

![socialscommit.png](images/24-secedu/socialscommit.png)

The commit was also by another user `elanamarwood`, let's keep that in mind as a potential link to `tobiasredfield`.

Inside the commit is the follow previous HTML:
```html
<li><a href="https://twitter.com/tobias_redfield" target="_blank">Twitter</a></li> <!-- remember to change this when Tobias sorts out the Redfield twitter but for now use his personal -->
```

A new Twitter Account! Let's check it out...

![tobiastwt.png](images/24-secedu/tobiastwt.png)

Checking the replies tab we find a reply from Tobias to Elana Marwood (the other person committing on the repo!) with an image containing the flag:

![tweetsolve.png](images/24-secedu/tweetsolve.png)

Flag: `SECEDU{TW1TT3R_L3AKS}`