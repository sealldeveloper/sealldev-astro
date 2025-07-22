---
title: "My Aquarium"
description: "I have this website with some of my favorite sea animal images and facts. I have a secret document containing an my favorite animal, can you find it?\n\nThe website is running at http://connect.umbccd.net:20010" 
pubDate: 2025-04-29
ctf: "DawgCTF 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-dawgctf/icon.png"
---

We are given a remote web application that has 3 simple buttons:
![home.png](images/25-dawgctf/myaquarium/home.png)

Checking the source code, one of the buttons has an interesting URL: https://onlineaquarium.blob.core.windows.net/aquarium/resources/sea-animal-facts.txt

Visiting it, it contains a text file:
```
Sea Animal Facts:
...
- 
Credits to : noaa.gov
```

But this is likely what we need to look at, as the URL implies there are other resources available!

Looking at the [Microsoft Documentation for listing blob storage resources](https://learn.microsoft.com/en-us/rest/api/storageservices/enumerating-blob-resources), the user can query the resources with `/<NAME>?comp=list&include=metadata`.

Let's test that on the target: https://onlineaquarium.blob.core.windows.net/aquarium?comp=list&include=metadata
![xml.png](images/25-dawgctf/myaquarium/xml.png)

The highlighted entry in the screenshot has a 'secret' file!

Visiting the file at https://onlineaquarium.blob.core.windows.net/aquarium/resources/SecretFavoriteSeaAnimal.txt contains the flag!

Flag: `DawgCTF{Bl0b_F15h_4re_S1lly}`