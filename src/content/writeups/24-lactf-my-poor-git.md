---
title: "my poor git"
description: "My poor git server! I think someone took a hammer to the server and ruined a few of the files! The git repo is available at /flag.git"
pubDate: 2024-02-19
ctf: "LACTF 2024"
category: "misc"
author: "sealldev"
section: "CTFs"
image: "images/24-lactf/icon.gif"
---

To start I use GitTools [Dumper](https://github.com/internetwache/GitTools) to dump whatever it can find to a folder.

```
$ ./gitdumper.sh https://poor-git.chall.lac.tf/flag.git/ dumb-git-final --git-dir=flag.git
###########
# GitDumper is part of https://github.com/internetwache/GitTools
#
# Developed and maintained by @gehaxelt from @internetwache
#
# Use at your own risk. Usage might be illegal in certain circumstances.
# Only for educational purposes!
###########


[*] Destination folder does not exist
[+] Creating dumb-git-f/flag.git/
[+] Downloaded: HEAD
[+] Downloaded: objects/info/packs
[-] Downloaded: description
[-] Downloaded: config
[-] Downloaded: COMMIT_EDITMSG
[-] Downloaded: index
[-] Downloaded: packed-refs
[-] Downloaded: refs/heads/master
[-] Downloaded: refs/remotes/origin/HEAD
[-] Downloaded: refs/stash
[-] Downloaded: logs/HEAD
[-] Downloaded: logs/refs/heads/master
[-] Downloaded: logs/refs/remotes/origin/HEAD
[+] Downloaded: info/refs
[-] Downloaded: info/exclude
[-] Downloaded: /refs/wip/index/refs/heads/master
[-] Downloaded: /refs/wip/wtree/refs/heads/master
[+] Downloaded: objects/21/7ecd3c93b00c6b7404473d3bdfcb222a22edf4
```

Looking at what was extracted, my key interest is in `objects` and looking at the file we got, I have a look at whats in it. (It didn't download for me so I manually did so.)

```
$ wget "https://poor-git.chall.lac.tf/flag.git/objects/21/7ecd3c93b00c6b7404473d3bdfcb222a22edf4"
...
$ file 7ecd3c93b00c6b7404473d3bdfcb222a22edf4
7ecd3c93b00c6b7404473d3bdfcb222a22edf4: zlib compressed data
```

Seeing its zlib, I use `zlib_decompress` to extract it.

```
$ zlib_decompress 7ecd3c93b00c6b7404473d3bdfcb222a22edf4 out
WARNING: zlib_decompress is deprecated and will be removed in a future version
$ cat out
commit 1128tree b46f24349a27913ddfa5c8a29bc3bcc8d2722358
parent c2e6e9737a8a666667b27c3a1dc84a76c8f4dab3
author burturt <31748545+burturt@users.noreply.github.com> 1705793830 -0800
committer burturt <31748545+burturt@users.noreply.github.com> 1705793830 -0800
gpgsig -----BEGIN PGP SIGNATURE-----

 iQIzBAABCAAdFiEES9haaAXoglC6rYp5y1IcUPPMLo8FAmWsWSYACgkQy1IcUPPM
 Lo+D7xAArOSdQR7brnqMfoeYp5no8DH/GduQ0k8M6EPMaVWG8Muj2yt1rBMJQxy+
 LQdMHDCEXJIZ/xjqMsSB7wIKd83QjtT2l2dfo8f/s4HibiSe/1legY69jcigbZ7X
 /k4ghGrp0MKL8o768GcbOVZ/eRhQeSef+X2bCnUD9ITHqmjEUq2f0LBGvLulmSIb
 jlqEhSfm5bu3PjUyD3sn81oZoL02313FQABGgMNz7NSSP7T0qpfqNhrNvgTvZCao
 L+yuk3g4iFnVztUIW+QS91+VpTrJZU5fsOd+aLNRkR6ka8ZZOwzuDpKP3gYQ2oyB
 0pxHQdkQ1imlc1atTCqGvCUERWGzRqfF2hyNRLy008uSY/yR9dPkHVnmq/Y7jL9C
 CrkjwwqUHk7abCPPIqKS0IA0nwiMFh3ifSxVqcqkchbca6rfTdRiYhoRIIpf4igK
 RHnSEOE/pmwt4Nd0oHh/QR3x0zoYI3+et7fGAD0yJ/TgakZRqts00XOspkT1ExDv
 b73vq71qTBwggGzNx92xWvtQEqRXAabnjj9kf5ku7Ff3gfqj0auzLtWmJYvX+b8o
 cJlZ5OREHrs/M898uP1CWwmkGSv7Jn+ZsMGdE0yxh7SWMPLMoKqnFCy9oEN49IWC
 RVzOF8yeqNYNsvfDOxGv6PoMch2+M/mu21XzwcU2ku2I4MUp4hs=
 =uif1
 -----END PGP SIGNATURE-----

remove flag again uugh
```

I can see some more referenced ID's in this commit for the tree and parent. The commit message states removing a flag so I work backwards a commit to `c2e6e9737a8a666667b27c3a1dc84a76c8f4dab3`.

```
$ wget "https://poor-git.chall.lac.tf/flag.git/objects/c2/e6e9737a8a666667b27c3a1dc84a76c8f4dab3"
...
$ zlib_decompress e6e9737a8a666667b27c3a1dc84a76c8f4dab3 out
...
$ cat out
commit 1172tree 47442ca74fffb4c5d1293fbd7bb0bc048d8fdff4
parent ac4d7070179f49c03ed06d98c19068cc8e2d74c5
parent b061db539557e1bb4dbcffd936a2d1412eeb1f66
author burturt <31748545+burturt@users.noreply.github.com> 1705793796 -0800
committer burturt <31748545+burturt@users.noreply.github.com> 1705793796 -0800
gpgsig -----BEGIN PGP SIGNATURE-----

 iQIzBAABCAAdFiEES9haaAXoglC6rYp5y1IcUPPMLo8FAmWsWQsACgkQy1IcUPPM
 Lo/WTQ/+NHlgQ/9EPV/6hgdC/ZrzatMEckzxCW7ZByOkDoO0c/69HcarTtXZbR7B
 ewd1eqUdVRAmfIxzH9wkQptn05lEpJm6waiA6udsFkh2ZiFmdgq66reVXrLpP/4M
 YBCcpM1i4Z7MLE8u/hJDWE+yogaGBF97nP+sm7NGIkyrrRgf1DwYNxuGsdsOnOtD
 scbA1/mnRvKQ06I0zKlSmbhjXtkNyMY8fQ9B4nq3JoReIQ+QNCPd6HuU/D83bHVt
 agFKnBCQE9lNgeMZYuQSnHKA8Vg9GhoMqa7u9sIRZEBtiJJnVcs7o1EvwF9iOF87
 ZJRRt3rU/BoM4G8i/0g7FnHb2VaTi0UgXe9Vy6QHryje8cUhCxc8WcpU/s6jheid
 q6BR6oDJxTCZZktz5/DYZzRl7Ekz2dv2d0f9Ie3/gK5Ro4bSAOFV1vTEL2ekDpX2
 3DVo5//jKuQH9mZQHcSZwI9gvp1oITC6w2NGs+IHLA3L1p7in0WmcMoA6biKRXEb
 LpLkhQ2+7Qi+8X/e0l1Nuo2KMuL+2Py9JwNmCgMNF65Hv8orpEmw8flc6Jz5bT73
 o7BDNyzNjo347pMs476jZHnsd7cHXezAPCPzHSuvGgB71uTdNRXOQ8zwWy1j2gS/
 Pe0QyoNVW5FFvryhe2DEuHTHiQ6f/bpxn/SMicO28v488/78rlU=
 =tzsP
 -----END PGP SIGNATURE-----

Merge branch 'fix'
```

If we go back a bit more we eventually encounter this commit.

```
$ cat out
commit 1114tree 75e7c1f3b178941ef76997bc3a9ca19bdc0dda09
parent fd87b3b95fc02fea268ecea9dce20964b285f50b
author burturt <31748545+burturt@users.noreply.github.com> 1705793578 -0800
committer burturt <31748545+burturt@users.noreply.github.com> 1705793578 -0800
gpgsig -----BEGIN PGP SIGNATURE-----

 iQIzBAABCAAdFiEES9haaAXoglC6rYp5y1IcUPPMLo8FAmWsWCoACgkQy1IcUPPM
 Lo+qoA//aHEpF4eedE4gfR+ghdo9qbNIJTJME1hyeS421Z4xZWBZZtX989yVdWDo
 ryD2eqwvMFJhoZc/Rr5NZnv0D+ozn+qFd3Td6wpQK8d8CeYrD/TmtPsX2ABZD2Nx
 so2EY+73+YGYtqVHiVlFNjI4IpUb2bkjwPXfonr9N4ZPiVF4eEf08iOVKmWHpvE1
 Jg3R8EHyZ//osphfPyfoTP8w5FSaO7La/p5HuyXYIYnnZSy6Zqz9YZ5AfPFedpwN
 1LrOI5hukgXms+LwO8AONNqYJsaDkwNivpmh3EGM/HLICwv8yXiY69E3EopaaTfY
 lWqZ7GZA9kFkykyfnb+g4wlu/OdfHLtuMLiB++4bPsChVFh1FPOxxL96JOnmA+jh
 7F3T50guec5z4plaw68vYkiUS0vC1A20qqW0GJLgutSlQDR9s66Wr64I8ltgZCHQ
 vs8paRHqYrmZt4TM1EgMEvRszSgCEw0p9vGYeF6UuhdWHo1E6ecwpelUzpjUF33k
 sNvyhdW17l1IAwT5vT1tt93zPJ8edjJ6IKsWmB8hhKzmyrmJnlzr+vMPRP2LZiJX
 qiFzgWNbdhb+j4v4apvOIpas2oJdX30nhqnTsU8zlz1SfiGf8G1d5RRkacuR3Bxj
 9eYRlqsxcKvF4z1owMbhmFd2sDhgSVRsN4W5OFqzwF4fjr5QaQY=
 =O3tj
 -----END PGP SIGNATURE-----

add flag
```

Perfect, lets have a look at the tree object, when we utilise git to read the tree object we can see the objects stored and what their ids are.

```
$ cd ..
$ mkdir 75
$ cd 75
$ wget "https://poor-git.chall.lac.tf/flag.git/objects/75/e7c1f3b178941ef76997bc3a9ca19bdc0dda09"
...
$ git ls-tree 75e7c1f3b178941ef76997bc3a9ca19bdc0dda09
100644 blob 741fa59ac9ec45f978d799bd88b7290bc304abdd	flag.txt
```

Let's download that blob, this should be it!

```
$ wget "https://poor-git.chall.lac.tf/flag.git/objects/74/1fa59ac9ec45f978d799bd88b7290bc304abdd"
...
$ zlib_decompress 1fa59ac9ec45f978d799bd88b7290bc304abdd out
...
$ cat out
blob 32lactf{u51n9_dum8_g17_pr070c01z}
```

There's our flag!

If this was a longer challenge I would make a script to do this, but it was relatively short.

Flag: `lactf{u51n9_dum8_g17_pr070c01z}`