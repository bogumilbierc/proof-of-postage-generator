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

    static readonly PESEL_REGEXES: RegExp[] = [
        /^PESEL ?\d{11}$/i
    ]

    static readonly CITY_AND_DATE_REGEXES: RegExp[] = [
        /^\D{3,}, dnia/i,
        /(\d{4} roku)|(\d{4} r.)/i,
        /\D*, ?\d{1,2} \D* \d{4}r/i
    ]

    static readonly RECIPIENT_GROUP_CAPTION_REGEXES: RegExp[] = [
        /^Powód:\s*.?$/i,
        /^Pozwan\w*:\s*.?$/i,        
        /^Powodowie\w*:\s*.?$/i,
    ]

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
            linesToTake.push(line);
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

        linesToTake.length = lastLineWithPostcode + 1;
        log.debug('Unfiltered lines:');
        log.debug(linesToTake);

        return linesToTake
            .filter((line: string) => {
                return !this.shouldFilterOutLine(line)
            });
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

    private shouldFilterOutLine(text: string): boolean {
        const linesToFilterOutRegexes = [
            ...AddressLinesExtractor.PESEL_REGEXES,
            ...AddressLinesExtractor.CITY_AND_DATE_REGEXES,
            ...AddressLinesExtractor.RECIPIENT_GROUP_CAPTION_REGEXES
        ];

        const matchinRegex = linesToFilterOutRegexes.find((regex: RegExp) => regex.test(text));
        log.debug(`Matching regex: ${matchinRegex}`);
        return !!matchinRegex;
    }

}