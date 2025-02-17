import { IsCPFOrCNPJ } from "src/domain/client/dtos/create-client.dto";

export class ContractProductDto {
    @IsCPFOrCNPJ()
    document: string;
}
