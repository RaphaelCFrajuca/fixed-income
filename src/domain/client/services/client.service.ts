import { Inject } from "@nestjs/common";
import { Database } from "src/common/database/interfaces/database.interface";
import { Client } from "../entities/client.entity";

export class ClientService {
    constructor(@Inject(Database) private readonly database: Database) {}
    async create(client: Client): Promise<null> {
        return await this.database.create(client);
    }
    async findByDocument(document: string) {
        return await this.database.findByDocument(document);
    }
    async update(document: string, client: Partial<Client>) {
        return await this.database.update(document, client);
    }
    delete() {
        return "Client deleted";
    }
}
