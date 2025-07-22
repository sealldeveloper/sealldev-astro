---
title: "Blast from the Past"
description: "The judge for these pictures is a real fan of antiques. Can you age this photo to the specifications? Set the timestamps on this picture to 1970:01:01 00:00:00.001+00:00 with as much precision as possible for each timestamp. In this example, +00:00 is a timezone adjustment. Any timezone is acceptable as long as the time is equivalent. As an example, this timestamp is acceptable as well: 1969:12:31 19:00:00.001-05:00. For timestamps without a timezone adjustment, put them in GMT time (+00:00). The checker program provides the timestamp needed for each."
pubDate: 2024-03-27
category: "forensics"
author: "sealldev"
section: "PicoCTF"
tags: ["medium"]
---

We have to modify a given picture to appear as from `1970:01:01 00:00:00.001+00:00` on all the timestamps the bot checks.

Let's start by submitting the file with 0 modifications and see what happens!

#### Q1

```
Checking tag 1/7
Looking at IFD0: ModifyDate
Looking for '1970:01:01 00:00:00'
```

Okay, so we first need to change `IFD0: ModifyDate`.

I find [a page](https://superuser.com/questions/1757307/how-to-set-an-images-date-and-time-with-timezone-with-exiftool) on some commands with `exiftool` to change these headers!

> SubSecCreateDate writes to the EXIF:CreateDate (called DateTimeDigitized by the EXIF spec), EXIF:SubSecTimeDigitized, and the EXIF:OffsetTimeDigitized tags. SubSecModifyDate writes to the EXIF:ModifyDate (called DateTime by the EXIF spec), EXIF:SubSecTime, and the EXIF:OffsetTime tags.

The mention `SubSecModifyDate` edits the `ModifyDate`, so I do this command:

```
$ exiftool -SubSecModifyDate="1970:01:01 00:00:00.001+00:00" original.jpg
    1 image files updated
```

Works perfectly!

#### Q2
```
Checking tag 2/7
Looking at ExifIFD: DateTimeOriginal
Looking for '1970:01:01 00:00:00'
```

Using the [same page from before](https://superuser.com/questions/1757307/how-to-set-an-images-date-and-time-with-timezone-with-exiftool) they mention that `SubSecDateTimeOriginal` edit that header.

```
$ exiftool -SubSecDateTimeOriginal="1970:01:01 00:00:00.001+00:00" original.jpg
    1 image files updated
```

This works!

#### Q3
```
Checking tag 3/7
Looking at ExifIFD: CreateDate
Looking for '1970:01:01 00:00:00'
```

Using the [same page *again*](https://superuser.com/questions/1757307/how-to-set-an-images-date-and-time-with-timezone-with-exiftool) they mention that `SubSecCreateDate` is a good header to edit to get the correct result.

```
$ exiftool -SubSecCreateDate="1970:01:01 00:00:00.001+00:00" original.jpg
    1 image files updated
```

This actually gets us all the way to Question 7, as the other headers that were checked for were `Composite: SubSecCreateDate`, `Composite: SubSecDateTimeOriginal`, and `Composite: SubSecModifyDate` which are all already modified!

#### Q7
```
Looking at Samsung: TimeStamp
Looking for '1970:01:01 00:00:00.001+00:00'
Found: 2023:11:20 20:46:21.420+00:00
```

`Samsung: TimeStamp` was by far the most troublesome, doing some research on the header shows [this discussion](https://exiftool.org/forum/index.php?topic=7818.0) shows the tool cannot edit it but link to the format [here](https://www.exiftool.org/TagNames/Samsung.html#Trailer) on ExifTool's docs. The TimeStamp is at the end of the trailer and has to be manually edited, so I open the file with a hex editor.

At the end of the file is an epoch timestamp: `1700513181420` which [when converted](https://www.epochconverter.com/) matches what the bot is detecting as the timestamp, so I change it to `0000000000001` and reapply all the commands we used previously to make sure that no edits changes any of the EXIF data, then send the file.

```
Great job, you got that one!

You did it!
picoCTF{71m3_7r4v311ng_p1c7ur3_a4f2b526}
```

Flag: `picoCTF{71m3_7r4v311ng_p1c7ur3_a4f2b526}`