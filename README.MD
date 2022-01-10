# Generator potwierdzeń nadania

## Opis
Generuje potwierdzenia nadania dla dokumentów, które posiadają następujący format:

Pierwszy wiersz może (lecz nie musi) zawierać miasto oraz datę w jednym z dwóch formatów:
- "Warszawa, dnia 12 grudnia 2020 roku" (miesiąc pisany słownie)
- "Warszawa, dnia 01.10.2019 roku" (miesiąc jako liczba)

Następnie występuja lista stron, które mogą być zdefiniowane:
- w postaci prostej (strona jest adresatem)
- w postaci strony i reprezentanta (reprezentant jest adresatem)
- w postaci strony/reprezentant i adresu do doręczeń (dane z adresu do doręczeń są podstawiane w miejscu adresata)
- w postaci grup odbiorców (pozwani, powodowie) -> nagłówki te są usuwane a zawartość przetwarzana na postać adresatów 

Przykładowy zrzut ekranu z pismem:
![Przykładowy dokument](/docs/sample-document.png)

## Użycie
### Generacja potwierdzeń

Po uruchomieniu aplikacji pokażę się puste okno generatora:
![Puste okno generatora](/docs/generator-main.png)

W górnej części okna znajduje sie dropdown z listą zdefiniowanych nadawców. Należy wybrać nadawcę, którego chcemy użyć na wygenerowanych potwierdzeniach.

Środkowa częśc okna to miejsce do ładowania dokumentów - można je załadować klikając guzik, lub po prostu przeciągając dokumenty na okno aplikacji.
Ekstrakcja odbiorców rozpocznie się automatycznie. Punktem granicznym dla rozdzielania odbiorców są kody pocztowe.

Po zakończeniu ekstrakcji odbiorców będzie widoczna lista adresatów z możliwością jej edycji oraz zaznaczania, których adresatow chcemy zapisać w książce (należy ich zaznaczyć oraz wcisnąć guzik "Zapisz odbiorców").
![Okno generatora z odbiorcami](/docs/generator-recipients.png)

Możemy również dodać do każdego dokumentu dodatkowych adresatów z książki przez wcisnięcie guzika "Dodaj więcej odbiorców", który pokaże modal z wyborem ww.
![Okno generatora z wyborem dodatkowych odbiorców](/docs/generator-add-more-recipients.png)

Po zakończeniu edycji należy wcisnąć guzik "Generuj potwierdzenie" aby wygenerować PDF. W czasie generacji będzie wyświetlony ekran ładowania
![Okno generatora z ekranem ładowania](/docs/generator-processing.png)

Po zakończeniu generowania potwierdzenia jego status będzie wyświetlony obok przycisku generacji.

Lokalizacja potwierdzeń konfigurowana jest w *Preferencjach*. W tak zdefiniowanym folderze tworzony jest folder z obecną datą, gdzie zapisywany jest PDF.

### Definiowanie nadawców

Aby zdefiniować listę nadawców należy wejść do zakładki "Nadawcy".
Można w niej dodawać nadawców, usuwać ich oraz ustawiać dowolnego nadawcę jako domyślnego (figuruje on wtedy jako domyślnie wybrany na ekranie generatora).

Nadawcy zapisywani są jako plik JSON w lokalizacji ustalonej w *Preferencjach*

Wygląd zakładki:
![Okno nadawców](/docs/senders.png)

### Preferencje

W zakładce "Preferencje" możemy ustalić lokalizację pliku z nadawcami oraz lokalizację zapisu wygenerowanych potwierdzeń.

![Okno preferencji](/docs/preferences-tab.png)


## Wykorzystane technologie
- Node.js 14.15
- ElectronJS
- TypeScript
- Axios
- pdfmake (generowanie potwierdzeń)

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

### Zbudowanie wersji "dystrybucjnej"
```
yarn release
```
