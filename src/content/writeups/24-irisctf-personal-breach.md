---
title: "Personal Breach"
description: "Security questions can be solved by reconnaissance. The weakest link in security could be the people around you."
pubDate: 2024-01-08
ctf: "IrisCTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-irisctf/icon.png"
---

We are looking for the following information points about Iris:
- How old is Iris?
- What hospital was Iris born in?
- What company does Iris work for?

Looking through what we have, in the tagged posts section of Michelangelo's Instagram is a post!

![Post tagging Michelangelo](images/24-irisctf/pb_1.png)

It's from Iris, we can now look through her Instagram.

![Iris's Instagram](images/24-irisctf/pb_2.png)

Looking through her posts, a particular one catches my attention from the description:

![Post mentioning mother](images/24-irisctf/pb_3.png)

We can see she mentions an `Elaina Stein` and trying to visit an Instagram with that tag fails, so I check Facebook and get a hit!

![Elaina's Facebook](images/24-irisctf/pb_4.png)

Looking through her posts, we find two birthdays. One for herself (8th of April 1965) and for Iris (27th of April 1996). I originally messed these up due to my timezone displaying them incorrectly so double check!

We now know Iris's age to be `27`.

In the comments of the birthday post is Elaina with some extra information.

![Facebook Comment](images/24-irisctf/pb_5.png)

By searching for the exact phrase "best maternity hospital in Manhattan" we get a hit on [Yelp](https://www.yelp.com/search?find_desc=maternity+hospital&find_loc=Manhattan%2C+NY).

Our top result is `Lenox Hill Hospital`, so there's our hospital.

![Hospital Review](images/24-irisctf/pb_6.png)

Looking up Iris's name online we also get a [LinkedIn](https://www.linkedin.com/in/iris-stein-57894b2a7).

![LinkedIn for Iris](images/24-irisctf/pb_7.png)

And there's her job! `Mountain Peak Hiring Agency`

![Submission of answers](images/24-irisctf/pb_8.png)

There we go!

Flag: `irisctf{s0c1al_m3d1a_1s_an_1nf3cti0n}`