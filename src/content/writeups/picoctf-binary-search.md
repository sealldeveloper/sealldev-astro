---
title: "Binary Search"
description: "Want to play a game? As you use more of the shell, you might be interested in how they work! Binary search is a classic algorithm used to quickly find an item in a sorted list. Can you find the flag? You'll have 1000 possibilities and only 10 guesses. Cyber security often has a huge amount of data to look through - from logs, vulnerability reports, and forensics. Practicing the fundamentals manually might help you in the future when you have to write your own tools! You can download the challenge files here: challenge.zip. Use the instance for further information."
pubDate: 2024-03-27
category: "general skills"
author: "sealldev"
section: "PicoCTF"
tags: ["easy"]
---

Reading the `challenge.zip` down some directories is a `guessing_game.sh`, reading this file contains some bash commands:

```bash
#!/bin/bash

# Generate a random number between 1 and 1000
target=$(( (RANDOM % 1000) + 1 ))

echo "Welcome to the Binary Search Game!"
echo "I'm thinking of a number between 1 and 1000."

# Trap signals to prevent exiting
trap 'echo "Exiting is not allowed."' INT
trap '' SIGQUIT
trap '' SIGTSTP

# Limit the player to 10 guesses
MAX_GUESSES=10
guess_count=0

while (( guess_count < MAX_GUESSES )); do
    read -p "Enter your guess: " guess

    if ! [[ "$guess" =~ ^[0-9]+$ ]]; then
        echo "Please enter a valid number."
        continue
    fi

    (( guess_count++ ))

    if (( guess < target )); then
        echo "Higher! Try again."
    elif (( guess > target )); then
        echo "Lower! Try again."
    else
        echo "Congratulations! You guessed the correct number: $target"

        # Retrieve the flag from the metadata file
        flag=$(cat /challenge/metadata.json | jq -r '.flag')
        echo "Here's your flag: $flag"
        exit 0  # Exit with success code
    fi
done

# Player has exceeded maximum guesses
echo "Sorry, you've exceeded the maximum number of guesses."
exit 1  # Exit with error code to close the connection
```

I connect to the instance to start guessing.

```
Welcome to the Binary Search Game!
I'm thinking of a number between 1 and 1000.
Enter your guess: 500
Lower! Try again.
Enter your guess: 300
Lower! Try again.
Enter your guess: 100
Higher! Try again.
Enter your guess: 250
Lower! Try again.
Enter your guess: 150
Lower! Try again.
Enter your guess: 120
Lower! Try again.
Enter your guess: 107
Lower! Try again.
Enter your guess: 103
Higher! Try again.
Enter your guess: 104
Congratulations! You guessed the correct number: 104
Here's your flag: picoCTF{g00d_gu355_6dcfb67c}
Connection to atlas.picoctf.net closed.
```

Seems guessing worked fine, there's the flag!

Flag: `picoCTF{g00d_gu355_6dcfb67c}`