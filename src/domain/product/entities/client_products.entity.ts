import { Product } from "./product.entity";

export class ClientProducts {
    id?: number;
    name: string;
    applicatedValue: number;
    returnTax: number;
    expirationDate: Date;
    product: Product;
}
