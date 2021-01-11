import axios from "axios";
import { Sender } from "./sender-store";


export class PdfGenerator {

    async generate(sender: Sender, recipient: string[]) {


        await axios.post('http://p.ar2oor.pl/potwierdzenia/pdf.php')

    }
}