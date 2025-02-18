import { ConflictException, InternalServerErrorException, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { Client } from "src/domain/client/entities/client.entity";
import { ProductDto } from "src/domain/product/dtos/product.dto";
import { ClientProducts } from "src/domain/product/entities/client_products.entity";
import { Product } from "src/domain/product/entities/product.entity";
import { DataSource, Repository } from "typeorm";
import { Database } from "../../interfaces/database.interface";
import { ClientEntity } from "./entities/client.entity";
import { ClientProductsEntity } from "./entities/client_products.entity";
import { ProductEntity } from "./entities/product.entity";
import { MysqlConfig } from "./interfaces/mysql.interface";
import { GenerateProducts1739814637050 } from "./migration/generate-products.migration";

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

    private getClientProductsRepository(): Repository<ClientProductsEntity> {
        return MysqlProvider.dataSource.getRepository(ClientProductsEntity);
    }

    private getProductRepository(): Repository<ProductEntity> {
        return MysqlProvider.dataSource.getRepository(ProductEntity);
    }

    async contract(document: string, product: ProductDto): Promise<null> {
        const clientRepository = this.getClientRepository();
        const clientProductsRepository = this.getClientProductsRepository();
        const productRepository = this.getProductRepository();

        const [client, productFind] = await Promise.all([
            clientRepository.findOne({ where: { documentNumber: document } }),
            productRepository.findOne({ where: { name: product.name } }),
        ]);

        if (!client) throw new NotFoundException("Client not found");
        if (!productFind) throw new NotFoundException("Product not found");

        const clientProduct = { ...product, product: productFind, client: client } as unknown as ClientProductsEntity;
        try {
            await clientProductsRepository.save(clientProduct);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Error contracting product");
        }
        return null;
    }

    async getProducts(): Promise<Product[]> {
        const productRepository = this.getProductRepository();
        return await productRepository.find();
    }

    async findProductsByClient(document: string): Promise<ClientProducts[]> {
        const clientRepository = this.getClientRepository();
        const client = await clientRepository.findOne({
            where: { documentNumber: document },
            select: {
                products: {
                    id: true,
                    applicatedValue: true,
                    expirationDate: true,
                    returnTax: true,
                    product: {
                        name: true,
                        annualIncomeLimit: true,
                        type: true,
                    },
                },
            },
            relations: {
                products: {
                    product: true,
                },
            },
        });
        if (!client) throw new NotFoundException("Client not found");

        const transformedProducts = this.transformProducts(client);

        return transformedProducts;
    }

    private transformProducts(client: ClientEntity) {
        return client.products.map(product => ({
            id: product.id,
            name: product.name,
            applicatedValue: Number(product.applicatedValue),
            expirationDate: product.expirationDate,
            returnTax: Number(product.returnTax),
            product: {
                name: product.product.name,
                annualIncomeLimit: Number(product.product.annualIncomeLimit),
                type: product.product.type,
            },
        }));
    }

    async cancel(document: string, productId: number): Promise<null> {
        const clientRepository = this.getClientRepository();
        const clientProductsRepository = this.getClientProductsRepository();

        const client = await clientRepository.findOne({
            where: { documentNumber: document },
            relations: ["products"],
        });
        if (!client) throw new NotFoundException("Client not found");

        const product = client.products.find(product => product.id === productId);
        if (!product) throw new NotFoundException("Product not found");

        try {
            await clientProductsRepository.delete({ id: productId });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Error canceling product");
        }
        return null;
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
                entities: [ClientEntity, ProductEntity, ClientProductsEntity],
                migrations: [GenerateProducts1739814637050],
                migrationsRun: true,
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
