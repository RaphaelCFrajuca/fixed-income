import { IsCPFOrCNPJ } from "./create-client.dto";

export class GetClientDto {
    @IsCPFOrCNPJ()
    document: string;
}
