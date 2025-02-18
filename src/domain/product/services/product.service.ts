import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { Database } from "src/common/database/interfaces/database.interface";
import { Client } from "src/domain/client/entities/client.entity";
import { ClientProducts } from "../entities/client_products.entity";
import { Product, ProductType } from "../entities/product.entity";

export class ProductService {
    constructor(@Inject(Database) private readonly database: Database) {}

    private async getTotalContractedClientValueByProductName(document: string, productName: string) {
        const productsContracted = (await this.database.findProductsByClient(document)).filter(clientProduct => clientProduct.product.name === productName);
        let valueProductsContracted = 0;
        valueProductsContracted = productsContracted.reduce((prev, curr) => prev + curr.applicatedValue, valueProductsContracted);
        return valueProductsContracted;
    }

    async contract(document: string, product: ClientProducts): Promise<null> {
        const [valueProductsContracted, products, client] = await Promise.all([
            this.getTotalContractedClientValueByProductName(document, product.name),
            this.database.getProducts(),
            this.database.findByDocument(document),
        ]);

        const productSelected = products.find(productArray => productArray.name === product.name);

        this.canContract(productSelected, document, valueProductsContracted, product, client);

        return await this.database.contract(document, product);
    }

    private canContract(productSelected: Product | undefined, document: string, valueProductsContracted: number, product: ClientProducts, client: Client) {
        if (!productSelected) throw new NotFoundException("Product not Found");
        if (document.length === 11 && productSelected.type !== ProductType.PF) throw new ForbiddenException("Product not qualified for contracting");
        if (document.length === 14 && productSelected.type !== ProductType.PJ) throw new ForbiddenException("Product not qualified for contracting");

        if (!(valueProductsContracted + product.applicatedValue < (Number(client.annualIncome) * Number(productSelected.annualIncomeLimit)) / 100))
            throw new ForbiddenException("Insufficient Limit to apply");
    }

    async findProductsByClient(document: string) {
        return await this.database.findProductsByClient(document);
    }

    async cancel(document: string, productId: number): Promise<null> {
        return await this.database.cancel(document, productId);
    }
}
