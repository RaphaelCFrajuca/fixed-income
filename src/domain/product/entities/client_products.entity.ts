import { Product } from "./product.entity";

export class ClientProducts {
    id?: number;
    applicatedValue: number;
    returnTax: number;
    expirationDate: Date;
    product?: Product;
}
