Set WshShell = CreateObject("WScript.Shell")

' Ferme Stream Deck
WshShell.Run "taskkill /IM StreamDeck.exe /F", 0, True

' Lance Bad Apple caché
WshShell.Run "node player.js", 0, True

' Relance Stream Deck caché
WshShell.Run """C:\Program Files\Elgato\StreamDeck\StreamDeck.exe""", 0, False

Set WshShell = Nothing