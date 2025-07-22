---
title: "Insp3ct0r"
description: "Kishor Balan tipped us off that the following code may need inspection: https://jupiter.challenges.picoctf.org/problem/44924/ or http://jupiter.challenges.picoctf.org:44924\n\nHint: How do you inspect web code on a browser?\nHint: There's 3 parts"
pubDate: 2025-03-14
category: "web"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
image: "./images/picoctf/insp3ct0r/icon.png"
---

We are given a very boring website:
![home.png](images/picoctf/insp3ct0r/home.png)

The challenge name is 'leet speak' for Inspector, and **Inspect** element is used to view the HTML source code of the current page. I click CTRL+U (COMMAND+U on MacOS) on Firefox to open the source code for the page:
```html
<!doctype html>
<html>
  <head>
    <title>My First Website :)</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="mycss.css">
    <script type="application/javascript" src="myjs.js"></script>
  </head>

  <body>
    <div class="container">
      <header>
	<h1>Inspect Me</h1>
      </header>

      <button class="tablink" onclick="openTab('tabintro', this, '#222')" id="defaultOpen">What</button>
      <button class="tablink" onclick="openTab('tababout', this, '#222')">How</button>
      
      <div id="tabintro" class="tabcontent">
	<h3>What</h3>
	<p>I made a website</p>
      </div>

      <div id="tababout" class="tabcontent">
	<h3>How</h3>
	<p>I used these to make this site: <br/>
	  HTML <br/>
	  CSS <br/>
	  JS (JavaScript)
	</p>
	<!-- Html is neat. Anyways have 1/3 of the flag: picoCTF{tru3_d3 -->
      </div>
      
    </div>
    
  </body>
</html>
```

Inside the comment is the first part of the flag: `picoCTF{tru3_d3`!

The other important detail is that it lists on the site 2 other things used to make the site: CSS & JS. As there are 3 flag parts and 3 listed 'things' used to make the site, it's a fair assumption to think there is a flag part in each!

Looking at the start of the page's HTML source code, we can see a stylesheet is added with a `<link>` element:
```html
...
<link rel="stylesheet" type="text/css" href="mycss.css">
...
```

Let's visit `/mycss.css` to view the contents of the file:
```css
div.container {
    width: 100%;
}

header {
    background-color: black;
    padding: 1em;
    color: white;
    clear: left;
    text-align: center;
}

body {
    font-family: Roboto;
}

h1 {
    color: white;
}

p {
    font-family: "Open Sans";
}

.tablink {
    background-color: #555;
    color: white;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 14px 16px;
    font-size: 17px;
    width: 50%;
}

.tablink:hover {
    background-color: #777;
}

.tabcontent {
    color: #111;
    display: none;
    padding: 50px;
    text-align: center;
}

#tabintro { background-color: #ccc; }
#tababout { background-color: #ccc; }

/* You need CSS to make pretty pages. Here's part 2/3 of the flag: t3ct1ve_0r_ju5t */
```

There is the 2nd part of the flag: `t3ct1ve_0r_ju5t`!

Finally, there is a `<script>` element in the HTML:
```html
...
<script type="application/javascript" src="myjs.js"></script>
...
```

Let's visit `/myjs.js` to view the contents:
```javascript
function openTab(tabName,elmnt,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
	tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
	tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(tabName).style.display = "block";
    if(elmnt.style != null) {
	elmnt.style.backgroundColor = color;
    }
}

window.onload = function() {
    openTab('tabintro', this, '#222');
}

/* Javascript sure is neat. Anyways part 3/3 of the flag: _lucky?f10be399} */
```

At the end of the file is the final part of the flag: `_lucky?f10be399}`!

Flag: `picoCTF{tru3_d3t3ct1ve_0r_ju5t_lucky?f10be399}`