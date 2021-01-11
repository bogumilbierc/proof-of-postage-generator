# Generator potwierdzeń nadania

## Opis
Generuje potwierdzenia nadania dla dokumentów, które posiadają następujący format:

Pierwszy wiersz może (lecz nie musi) zawierać miasto oraz datę w jednym z dwóch formatów:
- "Warszawa, dnia 12 grudnia 2020 roku" (miesiąc pisany słownie)
- "Warszawa, dnia 01.10.2019 roku" (miesiąc jako liczba)

Przykładowy zrzut ekranu z pismem:
![Przykładowy dokument](/docs/sample-document.png)

## Użycie
### Generacja potwierdzeń

Po uruchomieniu aplikacji pokażę się puste okno generatora:
![Puste okno generatora](/docs/generator-main.png)

W górnej części okna znajduje sie dropdown z listą zdefiniowanych nadawców. Należy wybrać nadawcę, którego chcemy użyć na wygenerowanych potwierdzeniach.

Środkowa częśc okna to miejsce do ładowania dokumentów - można je załadować klikając guzik, lub po prostu przeciągając dokumenty na okno aplikacji.
Przetwarzanie zostanie uruchomione automatycznie po załadowaniu plików

Po zakończeniu przetwarzania będzie widoczny jego status w dolnej części ekranu:
![Okno generatora z podsumowaniem](/docs/generator-status.png)

Na podsumowaniu status widoczne jest miejsce, gdzie zapisało się potwierdzenie.

Lokalizacja potwierdzeń konfigurowana jest w *Preferencjach*. W tak zdefiniowanym folderze tworzony jest folder z obecną datą, gdzie zapisywany jest PDF.

### Definiowanie nadawców

Aby zdefiniować listę nadawców należy wejść do zakładki "Nadawcy".
Można w niej dodawać nadawców, usuwać ich oraz ustawiać dowolnego nadawcę jako domyślnego (figuruje on wtedy jako domyślnie wybrany na ekranie generatora).

Nadawcy zapisywani są jako plik JSON w lokalizacji ustalonej w *Preferencjach*

Wygląd zakładki:
![Okno nadawców](/docs/senders.png)

### Preferencje

W zakładce "Preference" możemy ustalić lokalizację pliku z nadawcami oraz lokalizację zapisu wygenerowanych potwierdzeń.

![Okno preferencji](/docs/preferences-tab.png)


## Wykorzystane technologie
- Node.js 14.15
- ElectronJS
- TypeScript
- Axios
- `http://p.ar2oor.pl/potwierdzenia/` (generowanie potwierdzeń)

## Uruchomienie środowiska developerskiego

### Instalacja zależności
1. Wybierz poprawną wersję Node.js z wykorzystaniem *nvm*
```
nvm use
```

2. Zainstaluj pakiety
```
yarn
```

### Odpalenie aplikacji
```
yarn start
```

### Odpalenie testów
```
yarn test
```

