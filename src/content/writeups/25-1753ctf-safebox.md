---
title: "Safebox"
description: "Your files. Encrypted at rest. Premium accounts available soon. // careful, this app is resetting every 15 minutes" 
pubDate: 2025-04-28
ctf: "1753CTF 2025"
category: "web"
author: "sealldev"
section: "CTFs"
image: "images/25-1753ctf/icon.png"
tags: ["aes", "xor"]
---

This challenge provides JavaScript source code.

The premise is, the application allows you to register and login as a user and upload files.

The `admin` user has uploaded a `flag.txt`:
```js
(async () => {
    await fs.mkdir(uploadsDir, { recursive: true });
    const items = await fs.readdir(uploadsDir);
    for(item of items) await fs.rm(path.join(uploadsDir, item), { recursive: true, force: true });

    const flagFile = await fs.readFile(path.join(__dirname, 'flag.txt'));
    uploadFile('admin', 'flag.txt', flagFile)
})();
```

We can retrieve the contents of the file by visiting the SHA256 hash of the username of the user (in this case `admin`), so the flag is retrieveable at `/files/8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918/flag.txt`.

The issue is the flag is encrypted... So how do we decrypt it?

A few key codeblocks of note:
```js
function encrypt(buffer, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-ofb', key, iv);
    let encrypted = cipher.update(buffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
}
```

The application encrypts using the `aes-256-ofb` algorithm:

```js

const uploadFile = async (username, fileName, buffer) => { 

    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    ...
```

And uploaded files use a static IV!

The idea is that it is essentially an XOR operation now that the IV and Key don't change, so we can upload a file with a known plaintext of all A's, then use that against the flag.txt file.

A simple script can be used to automate this process:
```python
import requests
import hashlib
import base64
import random
import string

base_url = 'https://safebox-1bbcbadc1e5d.1753ctf.com/'

def generate_random_string(length=12, include_special=False):
    chars = string.ascii_letters + string.digits
    if include_special:
        chars += string.punctuation.replace('"', '').replace("'", "")
    return ''.join(random.choice(chars) for _ in range(length))

def xor_bytes(bytes1, bytes2):
    return bytes(a ^ b for a, b in zip(bytes1, bytes2))

def perform_attack():
    try:
        username = generate_random_string(random.randint(8, 12))
        password = generate_random_string(random.randint(12, 16))
        filename = generate_random_string(random.randint(6, 10)) + '.dat'
        
        print(f"Username: {username}")
        print(f"Password: {password}")
        print(f"Filename: {filename}")

        print('Registering...')
        register_response = requests.post(f'{base_url}/api/register', json={
            'username': username,
            'password': password
        })
        register_data = register_response.json()
        token = register_data['token']
        print(f'Token: {token}')

        known_plaintext = b'A' * 9999
        known_plaintext_b64 = base64.b64encode(known_plaintext).decode('utf-8')

        print(f'Uploading {filename}...')
        upload_response = requests.post(
            f'{base_url}/api/upload', 
            json={'fileName': filename, 'b64file': known_plaintext_b64},
            headers={'X-Token': token}
        )
        print('Uploaded')

        attacker_folder_hash = hashlib.sha256(username.encode()).hexdigest()
        print(f'Folder hash: {attacker_folder_hash}')

        print('Downloading our file...')
        encrypted_file_response = requests.get(
            f'{base_url}/files/{attacker_folder_hash}/{filename}',
            headers={'X-Token': token}
        )
        encrypted_data = encrypted_file_response.content

        print('Calculating keystream...')
        keystream = xor_bytes(encrypted_data, known_plaintext[:len(encrypted_data)])
        print(f'Keystream calculated')

        admin_folder_hash = hashlib.sha256(b'admin').hexdigest()
        print(f'Admin folder hash: {admin_folder_hash}')

        print('Downloading flag...')
        encrypted_flag_response = requests.get(
            f'{base_url}/files/{admin_folder_hash}/flag.txt',
            headers={'X-Token': token}
        )
        encrypted_flag = encrypted_flag_response.content

        print('Decrypting flag...')
        usable_keystream = keystream[:len(encrypted_flag)]
        
        decrypted_flag = xor_bytes(encrypted_flag, usable_keystream)
        print(f'Decrypted flag: {decrypted_flag.decode("utf-8", errors="ignore")}')

        with open('decrypted_flag.txt', 'wb') as f:
            f.write(decrypted_flag)
        print('Flag saved to decrypted_flag.txt')

    except Exception as e:
        print(f'Attack failed: {str(e)}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    perform_attack()
```

Executing the script, we get the flag!
```
$ python3 script2.py
Username: C0WbFwxL
Password: Yc5MAFTvOh5qB
Filename: s4sbeZyU.dat
Registering...
Token: d7f5496dd9b7a9476862e6b4d9ed6e5243cda1265fb65dca5abf586871b11e06
Uploading s4sbeZyU.dat...
Uploaded
Folder hash: 7e59f49f9b469520a593ac7dcf46fee9e0b0b5a2296cc04d738e21c05d448393
Downloading file...
Calculating keystream...
Keystream calculated
Admin folder hash: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
Downloading flag...
Decrypting flag...
Decrypted flag: Well, good this file is encrypted, cause in any other
case someone could just come here and steal my valuable
flag. The flag is 1753c{encrypt3d_but_n0t_s0000_s4fe_b0x}. Cool, huh?

Yes it is!

Sincerely yours,
Mr. Admin
Flag saved to decrypted_flag.txt
```

Flag: `1753c{encrypt3d_but_n0t_s0000_s4fe_b0x}`