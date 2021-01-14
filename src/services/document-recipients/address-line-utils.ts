export class AddressLineUtils {

    static readonly POSTCODE_CITY_REGEX = /\d{2}-\d{3} \D{3,}$/;


    static readonly RECIPIENT_GROUP_CAPTION_REGEXES: RegExp[] = [
        /^Powód:\s*\.?/i,
        /^Pozwan\w*:\s*\.?/i,
        /^Powodowie\w*:\s*\.?/i,
    ];

    static isPostcodeLine(text: string): boolean {
        return AddressLineUtils.POSTCODE_CITY_REGEX.test(text);
    }

    static isBeginningOfNewGroupOfRecipients(text: string): boolean {
        return !!AddressLineUtils.RECIPIENT_GROUP_CAPTION_REGEXES.find((regex: RegExp): boolean => {
            return regex.test(text);
        })
    }
}