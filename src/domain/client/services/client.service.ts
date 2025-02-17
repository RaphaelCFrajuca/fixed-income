import { Inject } from "@nestjs/common";
import { Database } from "src/common/database/interfaces/database.interface";
import { Client } from "../entities/client.entity";

export class ClientService {
    constructor(@Inject(Database) private readonly database: Database) {}
    async create(client: Client) {
        await this.database.create(client);
        return "Client created";
    }
    findByCpf() {
        return "Client found";
    }
    update() {
        return "Client updated";
    }
    delete() {
        return "Client deleted";
    }
}
