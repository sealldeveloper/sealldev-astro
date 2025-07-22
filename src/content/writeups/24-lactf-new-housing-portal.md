---
title: "new-housing-portal"
description: "After that old portal, we decided to make a new one that is ultra secure and not based off any real housing sites. Can you make Samy tell you his deepest darkest secret? Hint - You can send a link that the admin bot will visit as samy. Hint - Come watch the real Samy's talk if you are stuck!"
pubDate: 2024-02-19
ctf: "LACTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-lactf/icon.gif"
---

We are given an admin bot, a web interface and the source code.

Looking at the capabilities of the app, we seem to be able to register a user with a few parameters (username, password, name and deepest darkest secret).

![nhp-1.png](images/24-lactf/nhp-1.png)

Looking at the source code, we can see a user 'samy' (the GOAT) is registered and the flag is stored in his deepest darkest secret.

```js
users.set('samy', {
  username: 'samy',
  name: 'Samy Kamkar',
  deepestDarkestSecret: process.env.FLAG || 'lactf{test_flag}',
  password: process.env.ADMINPW || 'owo',
  invitations: [],
  registration: Infinity
});
```

Once registered we seem to have a few capabilities:
- Sending invites to a user based on their username, it displays their username, name and an invite button (`/finder/?q=USERNAME`)

![nhp-2.png](images/24-lactf/nhp-2.png)

- Recieveing invites from a user, displays their name and deepest darkest secret (`/request`)

![nhp-3.png](images/24-lactf/nhp-3.png)

It seems we have to force samy to send an invite to us to see the flag, I make a new user with a potential payload idea involving XSS.

I make a new form using HTML with my username to submit an invite, and an XSS to trigger the form, as follows:

```html
<form name="invitefix" action="/finder" method="POST">
  <input type="hidden" name="username" value="USERNAME">
  <input type="submit" value="Invite">
</form>
<img src=x onerror="document.invitefix.submit()"/>
```

The form being redefined above allows it to access the form, and using the `<img src=x onerror="">` allows some slight delay before triggering, which seemed more consistent.

I send the following URL to the admin bot to trigger the search for my user and set the payload off.

`https://new-housing-portal.chall.lac.tf/finder/?q=USERNAME`

Once visited, we can see samy has visited and sent us an invite, how kind!

Flag: `lactf{b4t_m0s7_0f_a77_y0u_4r3_my_h3r0}`