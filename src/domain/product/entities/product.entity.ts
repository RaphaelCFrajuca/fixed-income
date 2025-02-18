export class Product {
    name: string;
    type: ProductType;
    annualIncomeLimit: number;
}

export enum ProductType {
    PF = "PF",
    PJ = "PJ",
}
