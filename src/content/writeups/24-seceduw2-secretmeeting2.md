---
title: "Secret meeting!?"
description: "Cipher had a secret meeting!! We should probably report this to the police.\nThe flag should be of the format: `SECEDU{<LAT>,<LONG>}`, where the accuracy of the coordinates is to three decimal places."
pubDate: 2024-10-01
ctf: "SecEdu CTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---




In [`Secret Meeting?`](24-seceduw2-secretmeeting) we are given a link to a picture for the 'Usual Spot': `https://drive.google.com/open?id=1QeozkxSycS_IEFTlh4E6wQeIIpXa0vyr`

![secretmeeting.png](images/24-secedu/secretmeeting.png)

The interesting shape of the building in the background prompts me to check Google's Reverse Image search.
 
![googleimagesres.png](images/24-secedu/googleimagesres.png)

We see some results for Darling Park, I go into Google Maps to orient the coordinates.

![gmapspark.png](images/24-secedu/gmapspark.png)

I find around this point to be the correct coordinates, but I had issue orienting properly so I doubt the reliability of this precision.

Flag: `SECEDU{-33.872,151.203}`