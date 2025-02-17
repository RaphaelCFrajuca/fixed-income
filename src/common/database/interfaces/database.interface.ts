import { Client } from "src/domain/client/entities/client.entity";

export interface Database {
    create(client: Client): Promise<null>;
    findByDocument(document: string): Promise<Client>;
    update(): Promise<null>;
    delete(): Promise<null>;
}

export const Database = Symbol("Database");
