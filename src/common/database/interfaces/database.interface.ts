import { Client } from "src/domain/client/entities/client.entity";

export interface Database {
    create(client: Client): Promise<null>;
    findByDocument(document: string): Promise<Client>;
    update(document: string, client: Partial<Client>): Promise<null>;
    delete(document: string): Promise<null>;
}

export const Database = Symbol("Database");
