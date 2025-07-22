---
title: "matrix"
description: ""
pubDate: 2024-06-26
ctf: "SCONES 2024"
category: "hardware"
author: "sealldev"
section: "CTFs"
image: "images/24-scones/icon.png"
---

This challenge I cracked while in the badge workshop, they taught us how to dump firmware from the badge and to make our own!

The demo on [this repo](https://github.com/rdttl/Scones-Demo) with the supplied programmer and leads allowed us to dump the badge firmware.

```markdown
## The really easy way to flash and dump an ATtiny414 mcu
This approach leverages the Arduino IDE's avrdude instance to permit support for compilation from c source to avr for 1-series ATtiny chips over UPDI (and a few others :) )!
We also use this method to quickly program the programmer ;)
It is possible to modify your own avrdude configuration here too, but I won't cover that here. Feel free to do this yourself though! :)


## STEPS:
1. Install the Arduino IDE from their website.
	* Version 2.3.2 is tested. https://www.arduino.cc/en/software
	* Ubuntu 24.04 has some issues with sandboxing. To get around this, extract the zip, then (sudo chown root:root chrome-sandbox && sudo chmod 4755 chrome-sandbox) inside the folder.

2. Get jtag2updi into our programming boards.
	* git clone https://github.com/SpenceKonde/jtag2updi.git
	* Open up jtag2updi.ino in the arduino IDE. Wait for it to load in other files.
	* Select the correct board and port that the programmer is, and is connected to.
	* The large ones are “Arduino Uno”, the small ones are “Arduino Nano”
	* The board shouldn't have any attached cables at this point. Upload from jtag2upsi.ino as appropriate.
	* Connect the capacitor (the small blue thing) between the RESET and GND pins.

3. Add board support for our one-series chips.
	* Goto File->Preferences. Walled garden enthusiasts might have this under Arduino->Preferences.
	* Navigate to "Additional boards manager URLs", and paste the entire following link:
	* https://raw.githubusercontent.com/rdttl/Scones-Demo/main/pkgrdttl.json
	* Then, goto Tools->Board->Boards manager. Search for 'megaTinyCore', and install it
	* Restart the IDE

4. Select the correct board.
	* Goto Tools->Board->megaTinyCore, and select ATtiny3224/.../414
	* Goto Tools->Chip, and select ATtiny414
	* Goto Tools->Programmer, and select “jtag2updi”
	* Ensure that the correct port or file (such as dev/ttyXXX) is selected. You might have to plug the board in for this step :))

#### IMPORTANT: **DO NOT** power the board externally when dumping/flashing firmware as below! The programmer board should provide sufficient power.
5. We can also leverage the now super supportive avrdude program to dump an existing flash on the board.
	* Ensure the programmer<->target pins are connected as:
		- 5V <-> VCC
		- GND <-> GND
		- PWM pin 6 <-> UPDI
	* We need to identify where your avrdude installation file is, we can test this by turning on verbose output in File->Preferences and attempting an upload. Alternatively, just search the system for the file names as normal.
	* After this, we are essentially copying the command out again, adjusting r/w flags as appropriate.
		* This should yield something similar to:
		* `"$avrdude_location/avrdude" -C "$avrdude_conf" -v -V -pattiny414 -cjtag2updi -P/dev/ttyACM0 -b115200 "-Uflash:r:dump.hex:i"`
	* It shouldn't need to be said, but connect your programmer to the computer too ;)

6. We can also now write to the board!! The sky is the limit!! Well, actually the low specs of the board is, but you get the idea.
	* Ensure the programmer<->target pins are connected as:
		- 5V <-> VCC
		- GND <-> GND
		- PWM pin 6 <-> UPDI
    * We can now compile our program and flash our chip with the generated hex file. (Sketch->Upload using Programmer) (or avrdude)%  
```

Then we can use the supplied `dump.sh` to dump the firmware.

```bash
#!/bin/bash

script_dir=$(dirname "$0")
avrdude_conf="$script_dir/avrdude.conf"
"$script_dir/avrdude" -C "$avrdude_conf" -v -V -pattiny414 -cjtag2updi -P/dev/ttyUSB0 -b115200 "-Uflash:r:dump.hex:i"
```

The extracted hex can then be extracted to a `.bin` with `binwalk -e`.
```
$ binwalk -e flash.hex 

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             Intel HEX data, record type: data
```

I then read the extracted `0.hex.bin` and the flag is at the end!

```
$ cat 0.hex.bin
...
`7n0q7pkz:267~�  SCONES{sm4ll_bUt_byt3y_11546}�%  
```

Flag: `SCONES{sm4ll_bUt_byt3y_11546}`