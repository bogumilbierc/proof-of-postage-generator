import { Recipient } from "../../models/recipient.model";

export class AddressRefiner {

    static readonly PUNCTUATION_REGEX = /^\d{1}[.|)]\.?\s*/;


    refineRecipientAddress(recipient: Recipient): Recipient {

        if (!recipient || !recipient?.address?.length) {
            return recipient;
        }
        const withoutPunctuation: Recipient = this.removePunctuation(recipient);
        // remove puncutation
        // choose delivery address
        // remove representants
        return withoutPunctuation;
    }

    private removePunctuation(recipient: Recipient): Recipient {
        return {
            ...recipient,
            address: recipient.address.map((addressLine: string) => {
                return addressLine.replace(AddressRefiner.PUNCTUATION_REGEX, '')
            })
        };

    }

}