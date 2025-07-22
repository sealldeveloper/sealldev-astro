---
title: "Flying High"
description: "I'm trying to find a flight I took back in 2012. I forgot the airport and the plane, but I know it is the one with an orange/red logo on the right side of this photo I took. Can you help me identify it? The flag format is `UofTCTF{AIRPORT_AIRLINE_AIRCRAFT}`. AIRPORT is the 3 letter IATA code, AIRLINE is the name of the airline (dash-separated if required), and AIRCRAFT is the aircraft model and variant (omit manufacturer name). For example, `UofTCTF{YYZ_Air-Canada_A320-200}` or `UofTCTF{YYZ_Delta_767-300}`. Note: The aircraft variant should be of X00 format; ie. there may be models with XYZ-432, but the accepted variant will be XYZ-400."
pubDate: 2024-01-15
ctf: "UofTCTF 2024"
category: "osint"
author: "sealldev"
section: "CTFs"
image: "images/24-uoftctf/icon.png"
---

We are given the following image to start with:

![Airplane Picture](images/24-uoftctf/flying-high.png)

The challenge description states we need the 3 letter IATA code for the airport, the airline and the aircraft model and variant.

The building on the left side 'Novespace' seems to have only 1 hit on Google Maps in [France](https://www.google.com.au/maps/@44.8378482,-0.7161052,3a,75y,119.31h,93.15t/data=!3m6!1e1!3m4!1sPLLVOdxxS24c-6eTu1fJ4g!2e0!7i13312!8i6656). More specifically, Bordeaux-Mérignac Airport or BOD.

Looking at the symbols on the plane in the picture and browsing a [Wikipedia Entry](https://en.wikipedia.org/wiki/List_of_airline_liveries_and_logos) for the phrase 'yellow and red', I eventually stumble upon Iberia Airline.

![Iberia Plane](images/24-uoftctf/iberia.jpg)

Seem's like the same markings! Now what model do we have?

I look on Iberia's website and find a [current fleet](https://www.iberia.com/iberia-fleet/) list.

![Planes](images/24-uoftctf/planes.png)

After trying a few I spot the 'A340-600' model and get success with the following flag.

Flag: `UofTCTF{BOD_Iberia_A340-600}`