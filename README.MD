# Generator potwierdzeń nadania

## Opis
Generuje potwierdzenia nadania dla dokumentów, które posiadają następujący format:

Pierwszy wiersz może (lecz nie musi) zawierać miasto oraz datę w jednym z dwóch formatów:
- "Warszawa, dnia 12 grudnia 2020 roku" (miesiąc pisany słownie)
- "Warszawa, dnia 01.10.2019 roku" (miesiąc jako liczba)

Przykładowy zrzut ekranu z pismem:
![GitHub Logo](/docs/sample-document.png)

## Wykorzystane technologie
- NodeJs 14.15
- ElectronJS
- TypeScript
- Axios
- `http://p.ar2oor.pl/potwierdzenia/` (generowanie potwierdzeń)