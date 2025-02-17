import { Client } from "src/domain/client/entities/client.entity";

export interface Database {
    create(client: Client): Promise<null>;
    findByCpf(): Promise<null>;
    update(): Promise<null>;
    delete(): Promise<null>;
}

export const Database = Symbol("Database");
