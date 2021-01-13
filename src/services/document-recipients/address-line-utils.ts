export class AddressLineUtils {

    static readonly POSTCODE_CITY_REGEX = /\d{2}-\d{3} \D{3,}$/;

    static isPostcodeLine(text: string): boolean {
        return AddressLineUtils.POSTCODE_CITY_REGEX.test(text);
    }
}