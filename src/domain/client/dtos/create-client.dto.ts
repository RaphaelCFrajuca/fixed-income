import {
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    Length,
    Matches,
    Min,
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { Client } from "../entities/client.entity";

@ValidatorConstraint({ async: false })
export class IsCPFOrCNPJConstraint implements ValidatorConstraintInterface {
    validate(documentNumber: string) {
        if (!documentNumber) return false;

        documentNumber = documentNumber.replace(/\D/g, "");

        if (documentNumber.length === 11) {
            return cpf.isValid(documentNumber);
        } else if (documentNumber.length === 14) {
            return cnpj.isValid(documentNumber);
        }
        return false;
    }

    defaultMessage() {
        return "Documento inválido. Deve ser um CPF ou CNPJ válido.";
    }
}

export function IsCPFOrCNPJ(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCPFOrCNPJConstraint,
        });
    };
}

export class CreateClientDto implements Client {
    @IsString()
    @IsNotEmpty({ message: "O nome é obrigatório" })
    @Length(3, 100, { message: "O nome deve ter entre 3 e 100 caracteres" })
    name: string;

    @IsString()
    @IsNotEmpty({ message: "O endereço é obrigatório" })
    @Length(10, 100, { message: "O endereço deve ter entre 10 e 100 caracteres" })
    address: string;

    @IsNumber()
    @IsNotEmpty({ message: "A renda anual é obrigatória" })
    @IsPositive({ message: "A renda anual deve ser um número positivo" })
    @Min(1, { message: "A renda/faturamento anual deve ser maior que 0" })
    annualIncome: number;

    @IsString()
    @IsNotEmpty({ message: "O CPF/CNPJ é obrigatório" })
    @Length(11, 14, { message: "O documento deve ter 11 (CPF) ou 14 (CNPJ) caracteres" })
    @Matches(/^\d+$/, { message: "O documento deve conter apenas números" })
    @IsCPFOrCNPJ()
    documentNumber: string;
}
