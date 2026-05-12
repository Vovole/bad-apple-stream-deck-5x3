Set WshShell = CreateObject("WScript.Shell")

WshShell.Run "taskkill /IM StreamDeck.exe /F", 0, True

WshShell.Run "node index.js", 0, True

WshShell.Run """C:\Program Files\Elgato\StreamDeck\StreamDeck.exe""", 0, False

Set WshShell = Nothing