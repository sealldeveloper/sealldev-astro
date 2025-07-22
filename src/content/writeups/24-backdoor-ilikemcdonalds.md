---
title: "I Like McDonalds"
description: "My friend has created his own hashing service and has given it to me to crack it, can you help me with it. He has promised me a burger for this as I like McDonald's so much , can you help me get some? please :) :)"
pubDate: 2024-12-23
ctf: "BackdoorCTF 2024"
category: "cryptography"
author: "sealldev"
section: "CTFs"
image: "images/24-backdoor/icon.png"
---



We are given a `server.py`.

```python
import hashlib
from typing import List

class CustomMAC:
    def __init__(self):
        self._internal_state = b""
        
    def update(self, message: bytes) -> None:
        if not self._internal_state:
            self._internal_state = self.get_key() + message
        else:
            self._internal_state += message
            
    def get_key(self) -> bytes:
        return open("key.txt", "rb").read().strip()
            
    def digest(self) -> bytes:
        return hashlib.sha256(self._internal_state).digest()[:8]

class TokenManager:
    def __init__(self):
        self._mac = CustomMAC()
        self._seen_tokens: List[bytes] = []
        
    def verify_and_store(self, message: bytes, token: bytes) -> bool:
        self._mac = CustomMAC()
        self._mac.update(message)
        expected_token = self._mac.digest()
        
        if token != expected_token:
            print(f"Invalid token! Expected token: {expected_token.hex()}")
            return False
            
        if token in self._seen_tokens:
            print("Token already used!")
            return False
            
        self._seen_tokens.append(token)
        return True

def main():
    print("Welcome to the Token Verification Challenge!")
    print("============================================")
    print("Rules:")
    print("1. Submit message-token pairs")
    print("2. Each token must be valid for its message")
    print("3. You cannot reuse tokens")
    print("4. Get 64 valid tokens accepted to win!")
    print("\nFormat: <hex-encoded-message> <hex-encoded-token>")
    print("Example: 48656c6c6f 1234567890abcdef")
    
    manager = TokenManager()
    successes = 0
    
    for i in range(128):
        try:
            print(f"\nAttempt {i+1}/128")
            print("Enter your message and token: ", end='')
            user_input = input().strip().split()
            
            if len(user_input) != 2:
                print("Invalid input format!")
                continue
                
            message = bytes.fromhex(user_input[0])
            token = bytes.fromhex(user_input[1])
            
            if manager.verify_and_store(message, token):
                successes += 1
                print(f"Success! {successes}/64 valid tokens verified")
                
                if successes >= 64:
                    print("\nCongratulations! You beat the challenge!")
                    with open("flag.txt", "r") as f:
                        print(f.read().strip())
                    break
            
        except Exception as e:
            print(f"Error: {str(e)}")
            continue
            
    if successes < 64:
        print("\nChallenge failed! Not enough valid tokens.")

if __name__ == "__main__":
    main()
```

Connecting the logic works as follows:
- Give a hex encoded message and token
- It checks with `verify_and_store`
- `verify_and_store` prints the expected token when it's incorrect

Example:
```bash
$ nc 34.42.147.172 8004
Welcome to the Token Verification Challenge!
============================================
Rules:
1. Submit message-token pairs
2. Each token must be valid for its message
3. You cannot reuse tokens
4. Get 64 valid tokens accepted to win!

Format: <hex-encoded-message> <hex-encoded-token>
Example: 48656c6c6f 1234567890abcdef

Attempt 1/128
Enter your message and token: 48656c6c6f 1234567890abcdef
Invalid token! Expected token: 3d0111bd1a78a433

Attempt 2/128
Enter your message and token: 48656c6c6f 3d0111bd1a78a433
Success! 1/64 valid tokens verified
```

So, we can store all these expected token and message pairs, then reconnect to send them all!

In the end I write this solve script:
```python
from pwn import *
import os
import random

def generate_random_hex_string(length):
    return ''.join(random.choice('0123456789abcdef') for _ in range(length))

def save_valid_pairs(pairs, filename="valid_pairs.txt"):
    with open(filename, "w") as f:
        for message, token in pairs:
            f.write(f"{message} {token}\n")

def load_valid_pairs(filename="valid_pairs.txt"):
    with open(filename, "r") as f:
        return [line.strip().split() for line in f.readlines()]

def collect_valid_pairs():
    r = remote('34.42.147.172', 8004)
    for i in range(11):
        r.recvline()
    successes = 0
    valid_pairs = []

    while successes < 64:
        message_hex = generate_random_hex_string(16)
        token_hex = generate_random_hex_string(16)
        r.recvuntil('Enter your message and token: ')

        r.sendline(f"{message_hex} {token_hex}".encode())

        response = r.recvline().decode().strip()
        if "Invalid token!" in response:
            expected_token = response.split("Expected token: ")[1].strip()
            print(f"Invalid token! Expected token: {expected_token}")
            r.recvuntil('Enter your message and token: ')
            r.sendline(f"{message_hex} {expected_token}".encode())
            success_response = r.recvline().decode().strip()
            
            if "Success!" in success_response:
                successes += 1
                print(success_response)
                valid_pairs.append((message_hex, expected_token))
        else:
            print(response)
    print("Collected 64 valid pairs!")
    r.close()
    save_valid_pairs(valid_pairs)
    print("Saved valid pairs to 'valid_pairs.txt'.")

def replay_valid_pairs():
    r = remote('34.42.147.172', 8004)
    for i in range(11):
        r.recvline()
    valid_pairs = load_valid_pairs()
    for i, (message_hex, token_hex) in enumerate(valid_pairs):
        print(f"Replaying pair {i+1}: {message_hex} {token_hex}")
        r.sendline(f"{message_hex} {token_hex}".encode())
        response = r.recvline().decode().strip()
        print(response)
    print("Replayed all valid pairs! Switching to interactive mode...")
    r.interactive()

if __name__ == "__main__":
    collect_valid_pairs()
    replay_valid_pairs()
```

Running the script:
```bash
$ python3 script.py
[+] Opening connection to 34.42.147.172 on port 8004: Done
Success! 1/64 valid tokens verified
Invalid token! Expected token: 8dec32a4e7ff7d73
Success! 2/64 valid tokens verified
Invalid token! Expected token: 94b2ee17e272edf5
...
Replaying pair 61: 1de2ac610306d0a6 b131db957b5225ae
Attempt 21/128
Replaying pair 62: 9e9e9947d3a8c440 b56262081ee9c845
Enter your message and token: Success! 21/64 valid tokens verified
Replaying pair 63: 1ba77339e143f6e2 87f4d3071078c271

Replaying pair 64: 0b99b36e13266a6e 7148b612fe0ab893
Attempt 22/128
Replayed all valid pairs! Switching to interactive mode...
[*] Switching to interactive mode

Attempt 23/128
Enter your message and token: Success! 23/64 valid tokens verified
...
Enter your message and token: Success! 64/64 valid tokens verified

Congratulations! You beat the challenge!
flag{C0ngr4ts_0n_f1nd1ng_Th1s_H4sh_c0ll1s10ns_N0w_G0_h4v3_4_D0ubl3_Ch33s3_Burg3r}
```

Flag: `flag{C0ngr4ts_0n_f1nd1ng_Th1s_H4sh_c0ll1s10ns_N0w_G0_h4v3_4_D0ubl3_Ch33s3_Burg3r}`