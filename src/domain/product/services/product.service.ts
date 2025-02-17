import { Inject } from "@nestjs/common";
import { Database } from "src/common/database/interfaces/database.interface";
import { Product } from "../entities/product.entity";

export class ProductService {
    constructor(@Inject(Database) private readonly database: Database) {}

    async contract(document: string, product: Product): Promise<null> {
        return await this.database.contract(document, product);
    }
}
