---
title: "Not quite all"
description: "The previously captured traffic contained an interesting tidbit towards the end of the file. What was the second line sent in the secret message? The message should wrapped in `SECEDU{}`. If it's another language, do not translate it. The text is in cyrillic, so ASCII doesn't display it nicely. What encoding scheme can cyrillic utilise?"
pubDate: 2024-09-12
ctf: "SecEdu CTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-secedu/icon.png"
---



Looking at the same PDF from [`Are you sure that's all?`](24-seceduw1-areyousurethatsall), there is some data at the end of the PDF.

```bash
$ cat extract.pdf | tail             
/Root 14 0 R
/Info 1 0 R>>
startxref
173068
%%EOF
Привет, Cipher.
Я думаю, сейчас самое время начать извлечение данных.
У них новая команда, и я беспокоюсь, что у нас не будет достаточно времени, чтобы получить то, что нам нужно.
Как проходит передача?
Ӝ҃ӻӱӶҁ/#@jskfq-	Ӭ#ӷҀӿӳҍ/#҂ӶӺ҄ӳ҂#҂ӳӿӽӶ#ӱ҃ӶӿҌ#Ӿӳ҄ӳҁҏ#ӻӴӱӸӶ҄ӶӾӻӶ#ӷӳӾӾ҈҆-	Ӡ#Ӿӻ҆#ӾӽӱӳҌ#ӹӽӿӳӾӷӳ/#ӻ#Ҍ#ӲӶ҂Ӽӽӹӽҍ҂ҏ/#҄ҁӽ#Ҁ#Ӿӳ҂#ӾӶ#ӲҀӷӶҁ#ӷӽ҂ҁӳҁӽ҄Ӿӽ#ӱ҃ӶӿӶӾӻ/#҄ҁӽӲ҈#ӼӽӸҀ҄ӻҁҏ#ҁӽ/#҄ҁӽ#Ӿӳӿ#ӾҀӵӾӽ-	әӳӹ#Ӽ҃ӽ҆ӽӷӻҁ#ӼӶ҃Ӷӷӳ҄ӳ<	
```

There is some Russian text!

The second line is: `Я думаю, сейчас самое время начать извлечение данных.`

Flag: `SECEDU{Я думаю, сейчас самое время начать извлечение данных.}`