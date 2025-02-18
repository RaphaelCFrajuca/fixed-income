import { IsNumber, IsPositive } from "class-validator";
import { IsCPFOrCNPJ } from "src/domain/client/dtos/create-client.dto";

export class CancelProductDto {
    @IsPositive()
    @IsNumber()
    productId: number;

    @IsCPFOrCNPJ()
    document: string;
}
