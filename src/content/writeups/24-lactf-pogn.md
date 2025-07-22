---
title: "pogn"
description: "Pogn in mong."
pubDate: 2024-02-19
ctf: "LACTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-lactf/icon.gif"
---

Opening the website we can see its a website version of pong with an unfair computer, so how do we win?

We can see its interacting with websockets firstly, so lets check the source code for more information.

Note: `ball[0]` and `ball[1]` reference the balls current X and Y on the screen.

```js
if (ball[0] < 0) {
  ws.send(JSON.stringify([
    Msg.GAME_END,
    'oh no you have lost, have you considered getting better'
  ]));
  clearInterval(interval);

// game still happening
} else if (ball[0] < 100) {
  ws.send(JSON.stringify([
    Msg.GAME_UPDATE,
    [ball, me]
  ]));

// user wins
} else {
  ws.send(JSON.stringify([
    Msg.GAME_END,
    'omg u won, i guess you considered getting better ' +
    'here is a flag: ' + flag,
    [ball, me]
  ]));
  clearInterval(interval);
}
```

The rules for win loss are flawed, if we hit the ball and force the position to be 0 on both X and Y we can bypass the rules and score a win.

I write a small python script to keep our player in the middle and try to hit the ball to `[0,0]` continually.

```python
from websocket import create_connection
ws = create_connection("ws://pogn.chall.lac.tf/ws")
cheating=True
while cheating:
	ws.send(b'[1,[[36.80555555555556,-2.082825822168086],[0,0]]]')
	d=ws.recv()
	print(d)
	if int(d[1]) == 2:
		cheating=False
```

Flag: `lactf{7_supp0s3_y0u_g0t_b3773r_NaNaNaN}`