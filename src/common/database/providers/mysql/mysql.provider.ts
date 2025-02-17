import { Client } from "src/domain/client/entities/client.entity";
import { Database } from "../../interfaces/database.interface";

export class MysqlProvider implements Database {
    async create(client: Client): Promise<null> {
        throw new Error("Method not implemented.");
    }
    findByCpf(): Promise<null> {
        throw new Error("Method not implemented.");
    }
    update(): Promise<null> {
        throw new Error("Method not implemented.");
    }
    delete(): Promise<null> {
        throw new Error("Method not implemented.");
    }
}
