import { IsDate, IsNotEmpty, IsPositive, IsString, Length, Min, MinDate } from "class-validator";
import { ClientProducts } from "../entities/client_products.entity";

export class ProductDto extends ClientProducts {
    @IsString()
    @Length(1, 5, { message: "O nome do produto deve ter entre 1 e 5 caracteres" })
    @IsNotEmpty({ message: "O nome do produto é obrigatório" })
    name: string;

    @IsNotEmpty({ message: "O valor aplicado é obrigatório" })
    @IsPositive({ message: "O valor aplicado deve ser maior que zero" })
    @Min(1, { message: "O valor aplicado deve ser maior que zero" })
    applicatedValue: number;

    @IsNotEmpty({ message: "A taxa de retorno é obrigatória" })
    @IsPositive({ message: "A taxa de retorno deve ser maior que zero" })
    @Min(1, { message: "A taxa de retorno deve ser maior que zero" })
    returnTax: number;

    @IsNotEmpty({ message: "A data de vencimento é obrigatória" })
    @IsDate({ message: "A data de vencimento deve ser no formato AAAA/MM/DD" })
    @MinDate(new Date(), { message: "A data de vencimento deve ser maior que a data atual" })
    expirationDate: Date;
}
