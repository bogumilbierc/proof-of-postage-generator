export class CaseSignatureExtractor {

    static readonly POSSIBLE_CASE_SIGNATURES: string[] = [
        'Sygn. akt:',
        'Sygn. akt',
        'Sygn.akt:',
        'Sygn.akt',
        'Sygnatura akt:',
        'Sygnatura akt',
    ];

    extractCaseSignature(documentText: string): string | null {
        if (!documentText) {
            return null;
        }

        const documentLines = documentText
            ?.split('\n')
            ?.filter((line: string) => !!line);

        if (!documentLines?.length) {
            return null;
        }

        let lineWithPotentialCaseSignature = documentLines.find((line: string) => {
            const matchingSentence = CaseSignatureExtractor.POSSIBLE_CASE_SIGNATURES.find((signatureText: string) => {
                return line?.toLowerCase()?.includes(signatureText?.toLowerCase());
            });
            return !!matchingSentence;
        });

        if (!lineWithPotentialCaseSignature) {
            return null;
        }

        CaseSignatureExtractor.POSSIBLE_CASE_SIGNATURES.forEach((possibleSignature: string) => {
            lineWithPotentialCaseSignature = this.replaceCaseInsensitive(lineWithPotentialCaseSignature, possibleSignature);
        });

        return lineWithPotentialCaseSignature?.trim() || null;
    }

    private replaceCaseInsensitive(value: string, replace: string): string {
        const espacedReplace = replace.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(espacedReplace, 'ig');
        return value.replace(regex, '');
    }

}