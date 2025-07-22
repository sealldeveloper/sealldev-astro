---
title: "one by one"
description: "One..... by.......... one............... whew I'm tired, this form is waaaaaaay too long. Note: the flag does have random characters at the end - that is intentional."
pubDate: 2024-02-19
ctf: "LACTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-lactf/icon.gif"
---

This seems to be another Google Forms challenge like infinite loop, so I approach it the same way and look at the JS code. Looking at a bit of it, it seems like we can select letters in a correct order to construct our flag.

To crack the flag I looked at the basic patterns of the code, I noticed that some letters had 0 impact on the final result but some had all but 1 point to the same value, I selected all the ones that had values and the one odd value out to construct the flag. I copied the object into the same script and wrote the following Javascript.

```js
function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}
flag=""
for (x in FB_PUBLIC_LOAD_DATA_[1][1]) {
    if (!FB_PUBLIC_LOAD_DATA_[1][1][x][1].includes('letter')) continue
    if (FB_PUBLIC_LOAD_DATA_[1][1][x][4][0][1][0][4] === 0) continue
    numbers = []
    for (y in FB_PUBLIC_LOAD_DATA_[1][1][x][4][0][1]) {
        numbers.push(FB_PUBLIC_LOAD_DATA_[1][1][x][4][0][1][y][2])
    }
    removeItemAll(numbers,mode(numbers))
    for (y in FB_PUBLIC_LOAD_DATA_[1][1][x][4][0][1]) {
        if(FB_PUBLIC_LOAD_DATA_[1][1][x][4][0][1][y][2] === numbers[0]) flag+=FB_PUBLIC_LOAD_DATA_[1][1][x][4][0][1][y][0]
    }
}
console.log(flag)
```

This works by checking if the title is a select a letter, then if it actually matters what value we select, then finds the odd value out and records it to the flag.

In the end we are given this `lactf{1_by_0n3_by3_un0_*,"g1'` which we add a `}` to the end to get out the flag.

Flag: `lactf{1_by_0n3_by3_un0_*,"g1'}`

**Files:** [Form (Potentially Down in future)](https://docs.google.com/forms/d/e/1FAIpQLSc-A-Vmx_Te-bAqnu3TrRj-DAsYTgn52uSk92v3fECQb3T83A/viewform)