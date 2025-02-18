import { Inject } from "@nestjs/common";
import { Database } from "src/common/database/interfaces/database.interface";
import { ClientProducts } from "../entities/client_products.entity";

export class ProductService {
    constructor(@Inject(Database) private readonly database: Database) {}

    async contract(document: string, product: ClientProducts): Promise<null> {
        return await this.database.contract(document, product);
    }

    async findProductsByClient(document: string) {
        return await this.database.findProductsByClient(document);
    }
}
