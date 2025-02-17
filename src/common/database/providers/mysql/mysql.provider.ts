import { ConflictException, InternalServerErrorException, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { Client } from "src/domain/client/entities/client.entity";
import { DataSource, Repository } from "typeorm";
import { Database } from "../../interfaces/database.interface";
import { ClientEntity } from "./entities/client.entity";
import { ProductEntity } from "./entities/product.entity";
import { MysqlConfig } from "./interfaces/mysql.interface";

export class MysqlProvider implements Database {
    constructor(private readonly mysqlConfig: MysqlConfig) {}
    protected static dataSource: DataSource;

    async create(client: Client): Promise<null> {
        const clientRepository = this.getClientRepository();
        const actualClient = await clientRepository.findOne({ where: { documentNumber: client.documentNumber } });
        if (actualClient) {
            throw new ConflictException("Client already exists");
        }
        await clientRepository.save(client);
        return null;
    }

    async findByDocument(document: string): Promise<Client> {
        const clientRepository = this.getClientRepository();
        try {
            const client: Client = await clientRepository.findOneOrFail({ where: { documentNumber: document }, select: ["name", "address", "annualIncome", "documentNumber"] });
            return client;
        } catch (error) {
            console.error(error);
            throw new NotFoundException("Client not found");
        }
    }

    async update(document: string, client: Partial<Client>): Promise<null> {
        const clientRepository = this.getClientRepository();

        await this.findByDocument(document);
        if (client?.documentNumber) throw new NotAcceptableException("Document number cannot be updated");

        try {
            await clientRepository.update({ documentNumber: document }, client);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Error updating client");
        }
        return null;
    }

    async delete(document: string): Promise<null> {
        const clientRepository = this.getClientRepository();
        await this.findByDocument(document);

        try {
            await clientRepository.delete({ documentNumber: document });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Error deleting client");
        }

        return null;
    }

    private getClientRepository(): Repository<ClientEntity> {
        return MysqlProvider.dataSource.getRepository(ClientEntity);
    }

    connect = async () => {
        if (!MysqlProvider.dataSource) {
            MysqlProvider.dataSource = new DataSource({
                type: "mysql",
                host: this.mysqlConfig.host,
                port: this.mysqlConfig.port,
                username: this.mysqlConfig.username,
                password: this.mysqlConfig.password,
                database: this.mysqlConfig.database,
                entities: [ClientEntity, ProductEntity],
                synchronize: true,
                logging: false,
            });
        }

        if (!MysqlProvider.dataSource.isInitialized) {
            await MysqlProvider.dataSource.initialize();
        }
        return this;
    };
}
