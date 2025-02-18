import { Client } from "src/domain/client/entities/client.entity";
import { ClientProducts } from "src/domain/product/entities/client_products.entity";
import { Product } from "src/domain/product/entities/product.entity";

export interface Database {
    create(client: Client): Promise<null>;
    findByDocument(document: string): Promise<Client>;
    update(document: string, client: Partial<Client>): Promise<null>;
    delete(document: string): Promise<null>;

    contract(document: string, product: ClientProducts): Promise<null>;
    getProducts(): Promise<Product[]>;
    findProductsByClient(document: string): Promise<ClientProducts[]>;
}

export const Database = Symbol("Database");
