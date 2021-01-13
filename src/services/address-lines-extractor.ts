import * as log from 'electron-log';
import { AddressLineUtils } from './address-line-utils';

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
    static readonly CITY_DATE_START_REGEX = /^\D{3,}, dnia/;
    static readonly CITY_DATE_END_REGEX = /(\d{4} roku)|(\d{4} r.)/;

    extractLinesWithPotentialAddresses(documentText: string): string[] {
        const splitted = documentText
            ?.split('\n')
            ?.filter((line: string) => !!line);

        if (!splitted?.length) {
            return [];
        }

        const linesToTake: string[] = [];

        let lastLineWithPostcode = 0;

        for (let i = 0; i < splitted.length; i++) {
            const line = splitted[i]?.trim();
            if (!this.isDateAndCityLine(line)) {
                linesToTake.push(line);
            }

            if (AddressLineUtils.isPostcodeLine(line)) {
                lastLineWithPostcode = i;
            }

            if (this.isEndOfAddressSectionByTextContent(line) || this.isEndOfAddressSectionByDistanceToLastPostcodeLine(i, lastLineWithPostcode)) {
                break;
            }
        }

        if (!linesToTake.length) {
            return [];
        }

        linesToTake.length = lastLineWithPostcode;

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

    private isDateAndCityLine(text: string): boolean {
        return AddressLinesExtractor.CITY_DATE_START_REGEX.test(text) || AddressLinesExtractor.CITY_DATE_END_REGEX.test(text);
    }
}