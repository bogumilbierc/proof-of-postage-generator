import { Recipient } from "../../models/recipient.model";
import { AddressLineUtils } from "./address-line-utils";

export class AddressRefiner {

    static readonly PUNCTUATION_REGEX = /^\d{1}[.|)]\.?\s*/;
    static readonly DELIVERY_ADDRESS_REGEX: RegExp = /^adres do dor[e|ę]cze[n|ń]:?\s*/i;
    static readonly REPRESENTANT_REGEX: RegExp = /reprezentowan[i|a|y|ą] przez:?\s*|kt[ó|o]r[ą|a|e] reprezentuje:?\s*|kt[ó|o]rego reprezentuje:?\s*|kt[ó|o]rych reprezentuje:?\s*/i;

    refineRecipientAddress(recipient: Recipient): Recipient {

        if (!recipient || !recipient?.address?.length) {
            return recipient;
        }
        const rawAddress = recipient.address;
        const withoutGroupHeaders = this.removeRecipientGroupHeaders(rawAddress);
        const withoutPunctuation = this.removePunctuation(withoutGroupHeaders);
        const deliveryAddress = this.chooseDeliveryAddress(withoutPunctuation);
        const representantAddress = this.chooseRepresentant(deliveryAddress);
        return {
            address: representantAddress
        };
    }

    private removePunctuation(addressLines: string[]): string[] {
        return addressLines.
            map((addressLine: string) => {
                return addressLine.replace(AddressRefiner.PUNCTUATION_REGEX, '')
            })

    }

    private removeRecipientGroupHeaders(addressLines: string[]): string[] {
        return addressLines.
            map((addressLine: string) => {
                let cleanedLine = addressLine;
                AddressLineUtils.RECIPIENT_GROUP_CAPTION_REGEXES.forEach((regex: RegExp) => {
                    cleanedLine = cleanedLine.replace(regex, '');
                });
                return cleanedLine;
            })
            .filter((line: string) => !!line);
    }

    private chooseDeliveryAddress(addressLines: string[]): string[] {
        const lineWithDeliveryAddressIndex: number = addressLines.findIndex((addressLine: string): boolean => {
            return AddressRefiner.DELIVERY_ADDRESS_REGEX.test(addressLine);
        });
        if (lineWithDeliveryAddressIndex === -1) {
            return addressLines;
        }
        const deliveryAddressLines: string[] = addressLines.slice(lineWithDeliveryAddressIndex, addressLines.length);

        deliveryAddressLines[0] = deliveryAddressLines[0].replace(AddressRefiner.DELIVERY_ADDRESS_REGEX, '');
        return deliveryAddressLines
            .filter((line: string): boolean => !!line);
    }

    private chooseRepresentant(addressLines: string[]): string[] {
        const lineWithRepresentant: number = addressLines.findIndex((addressLine: string): boolean => {
            return AddressRefiner.REPRESENTANT_REGEX.test(addressLine);
        });
        if (lineWithRepresentant === -1) {
            return addressLines;
        }
        const deliveryAddressLines: string[] = addressLines.slice(lineWithRepresentant, addressLines.length);

        deliveryAddressLines[0] = deliveryAddressLines[0].replace(AddressRefiner.REPRESENTANT_REGEX, '');
        return deliveryAddressLines
            .filter((line: string): boolean => !!line);
    }

}