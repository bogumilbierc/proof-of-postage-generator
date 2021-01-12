import * as log from 'electron-log';

export class AddressLinesExtractor {

    static readonly POSSIBLE_END_OF_ADDRESSES: string[] = [
        'Sygn. akt',
        'Sygn.akt',
        'Wartość przedmiotu',
        'Przesądowe wezwanie',
        'opłata sądowa',
        'zażalenie'
    ]

    static readonly MAXIUM_LINES_AFTER_LAST_POSCODE: number = 10;
    static readonly POSTCODE_CITY_REGEX = /\d{2}-\d{3} \D{3,}$/;

    extractLinesWithPotentialAddresses(documentText: string): string[] {
        const splitted = documentText
            ?.split('\n')
            ?.filter((line: string) => !!line);

        if (!splitted.length) {
            return [];
        }

        const linesToTake: string[] = [];

        let lastLineWithPostcode = 0;
        let numberOfPostcodes = 0;

        for (let i = 0; i < splitted.length; i++) {
            const line = splitted[i];
            linesToTake.push(line);

            if (this.isPostcodeLine(line)) {
                lastLineWithPostcode = i;
                numberOfPostcodes++;
            }

            if (this.isEndOfAddressSectionByTextContent(line) || this.isEndOfAddressSectionByDistanceToLastPostcodeLine(i, lastLineWithPostcode)) {
                break;
            }
        }

        linesToTake.length = lastLineWithPostcode + 1; // remove lines after last postcode - they are useless

        return linesToTake;
    }

    private isEndOfAddressSectionByDistanceToLastPostcodeLine(currentLineIndex: number, lastLineWithPostcode: number): boolean {
        const reachedMaximumDistanceSinceLastPoscode = currentLineIndex - lastLineWithPostcode > AddressLinesExtractor.MAXIUM_LINES_AFTER_LAST_POSCODE;
        if (reachedMaximumDistanceSinceLastPoscode) {
            log.debug(`Reached end of address section (by distance to last postcode line) with line number: ${currentLineIndex}`);
            return true;
        }
        return false;
    }

    private isEndOfAddressSectionByTextContent(line: string): boolean {
        const match = AddressLinesExtractor.POSSIBLE_END_OF_ADDRESSES.find((possibleEnding: string): boolean => {
            return line.toLowerCase().includes((possibleEnding.toLowerCase()))
        });

        if (match) {
            log.debug(`Reached end of address section (by text content) with line: ${line}`);
            return true;
        }
        return false;
    }

    private isPostcodeLine(text: string): boolean {
        return AddressLinesExtractor.POSTCODE_CITY_REGEX.test(text);
    }
}