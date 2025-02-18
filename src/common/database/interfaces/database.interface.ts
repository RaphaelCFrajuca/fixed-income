import { Client } from "src/domain/client/entities/client.entity";
import { ClientProducts } from "src/domain/product/entities/client_products.entity";

export interface Database {
    create(client: Client): Promise<null>;
    findByDocument(document: string): Promise<Client>;
    update(document: string, client: Partial<Client>): Promise<null>;
    delete(document: string): Promise<null>;

    contract(document: string, product: ClientProducts): Promise<null>;
    findProductsByClient(document: string): Promise<ClientProducts[]>;
}

export const Database = Symbol("Database");
