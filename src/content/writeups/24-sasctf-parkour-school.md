---
title: "Parkour School"
description: "I bought a lesson on parkour online, but the website only gave me some weird file. Help me learn parkour to impress my mates."
pubDate: 2024-05-21
ctf: "SASCTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-sasctf/icon.png"
---

This challenge gives a Minecraft datapack inside a `.zip` file, I start by loading the files as a datapack into a world.

Upon disabling and re-enabling the pack, I'm teleported into the sky which says the following:
```
Every 50 jumps one symbol of the flag will appear in chat
SAS{p4rkour_m4ster_
```

It then spawns a glass block and teleports you onto it, and another black stained glass block nearby to jump to, once you land the score is incremented and the black glass is now normal glass, and the old one disappears, new black glass, repeat.

In the code it shows in the `make_next_task.mcfunction` that its looking for a score of 1000 jumps to finish the flag:
```
execute if score Global score matches 1000 run function parkour:line050/execute3
...
(inside line050/execute3)
...
tellraw @s ["",{"text":"}"}]
```

So, I'm not jumping 1000 times, how can we skip this check?

The check if the player is on the block is inside the `tick.mcfunction`
```
execute as @a at @s if entity @e[type=minecraft:marker,distance=..1] run function parkour:make_next_task
```
This is checking if any player is within 1 block of the marker entity (where the block is), in which is makes the next block, increments score, etc.

So, we can beat this in two ways.

**Remove the distance check**
```
execute as @a at @s if entity @e[type=minecraft:marker] run function parkour:make_next_task
```

Now it's always true and it solves itself.

**Teleport to the marker**

This one looks way more fun, so I use this.
```
tp @a @e[type=minecraft:marker,limit=1]
execute as @a at @s if entity @e[type=minecraft:marker,distance=..1] run function parkour:make_next_task
```

Either way, we get the flag in chat.

<img src="/public/24-sasctf-parkourgif.gif"/>

Flag: `SAS{p4rkour_m4ster_68671502BB91657819EE}`