import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Database } from "src/common/database/interfaces/database.interface";
import { Client } from "src/domain/client/entities/client.entity";
import { ClientProducts } from "src/domain/product/entities/client_products.entity";
import { Product, ProductType } from "src/domain/product/entities/product.entity";
import { ProductService } from "src/domain/product/services/product.service";

describe("ClientService (unit)", () => {
    let service: ProductService;
    let mockDatabase: Database;

    beforeEach(async () => {
        mockDatabase = {
            create: jest.fn(),
            findByDocument: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            contract: jest.fn(),
            getProducts: jest.fn(),
            findProductsByClient: jest.fn(),
            cancel: jest.fn(),
        };

        const module = await Test.createTestingModule({
            providers: [ProductService, { provide: Database, useValue: mockDatabase }],
        }).compile();

        service = module.get(ProductService);
        mockDatabase = module.get(Database);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should create a ClientProducts instance with the given properties when instantiated", () => {
        const product = new Product();
        product.name = "Product1";
        product.annualIncomeLimit = 100;
        product.type = ProductType.PF;

        const clientProduct = new ClientProducts();
        clientProduct.id = 1;
        clientProduct.name = "ClientProduct1";
        clientProduct.applicatedValue = 1000;
        clientProduct.returnTax = 10;
        clientProduct.expirationDate = new Date("2025-12-31");
        clientProduct.product = product;

        expect(clientProduct.id).toBe(1);
        expect(clientProduct.name).toBe("ClientProduct1");
        expect(clientProduct.applicatedValue).toBe(1000);
        expect(clientProduct.returnTax).toBe(10);
        expect(clientProduct.expirationDate).toEqual(new Date("2025-12-31"));
        expect(clientProduct.product).toBe(product);
    });

    it("should allow updating ClientProducts properties when properties are changed", () => {
        const product = new Product();
        product.name = "Product1";
        product.annualIncomeLimit = 100;
        product.type = ProductType.PF;

        const clientProduct = new ClientProducts();
        clientProduct.id = 1;
        clientProduct.name = "ClientProduct1";
        clientProduct.applicatedValue = 1000;
        clientProduct.returnTax = 10;
        clientProduct.expirationDate = new Date("2025-12-31");
        clientProduct.product = product;

        clientProduct.name = "UpdatedClientProduct";
        clientProduct.applicatedValue = 2000;
        clientProduct.returnTax = 15;
        clientProduct.expirationDate = new Date("2026-12-31");

        expect(clientProduct.name).toBe("UpdatedClientProduct");
        expect(clientProduct.applicatedValue).toBe(2000);
        expect(clientProduct.returnTax).toBe(15);
        expect(clientProduct.expirationDate).toEqual(new Date("2026-12-31"));
    });

    describe("contract", () => {
        it("should contract a product for a client when valid data has provied", async () => {
            const document = "12345678901";
            const products = [
                {
                    name: "Test Product",
                    type: ProductType.PF,
                    annualIncomeLimit: 50,
                } as Product,
            ];
            const product: ClientProducts = {
                name: "Test Product",
                applicatedValue: 1000,
                returnTax: 0,
                expirationDate: new Date("2026/12/31"),
                product: products[0],
            };

            const client: Client = {
                annualIncome: 50000,
                name: "Test Client",
                address: "Rua Teste",
                documentNumber: "12345678901",
            };

            const spyFindProductsByClient = jest.spyOn(mockDatabase, "findProductsByClient").mockResolvedValue([
                {
                    product: {
                        name: "Test Product",
                        type: ProductType.PF,
                        annualIncomeLimit: 50,
                    },
                    applicatedValue: 500,
                    name: "Test",
                    returnTax: 0,
                    expirationDate: new Date("2026/12/31"),
                },
            ]);

            const spyGetProducts = jest.spyOn(mockDatabase, "getProducts").mockResolvedValue(products);

            const spyFindByDocument = jest.spyOn(mockDatabase, "findByDocument").mockResolvedValue(client);

            const spyContract = jest.spyOn(mockDatabase, "contract").mockResolvedValue(null);

            expect(await service.contract(document, product)).toBeNull();
            expect(spyFindProductsByClient).toHaveBeenCalledWith(document);
            expect(spyGetProducts).toHaveBeenCalled();
            expect(spyFindByDocument).toHaveBeenCalledWith(document);
            expect(spyContract).toHaveBeenCalledWith(document, product);
        });

        it("should not contract a product for a client when the product is not found", async () => {
            const document = "12345678901";
            const product: ClientProducts = {
                name: "Test Product",
                applicatedValue: 1000,
                returnTax: 0,
                expirationDate: new Date("2026/12/31"),
                product: {
                    name: "Test Product",
                    type: ProductType.PF,
                    annualIncomeLimit: 50,
                },
            };

            const client: Client = {
                annualIncome: 50000,
                name: "Test Client",
                address: "Rua Teste",
                documentNumber: "12345678901",
            };

            const spyFindProductsByClient = jest.spyOn(mockDatabase, "findProductsByClient").mockResolvedValue([
                {
                    product: {
                        name: "Test Product",
                        type: ProductType.PF,
                        annualIncomeLimit: 50,
                    },
                    applicatedValue: 500,
                    name: "Test",
                    returnTax: 0,
                    expirationDate: new Date("2026/12/31"),
                },
            ]);

            const spyGetProducts = jest.spyOn(mockDatabase, "getProducts").mockResolvedValue([]);

            const spyFindByDocument = jest.spyOn(mockDatabase, "findByDocument").mockResolvedValue(client);

            const spyContract = jest.spyOn(mockDatabase, "contract").mockResolvedValue(null);

            await expect(service.contract(document, product)).rejects.toThrow("Product not Found");
            expect(spyFindProductsByClient).toHaveBeenCalledWith(document);
            expect(spyGetProducts).toHaveBeenCalled();
            expect(spyFindByDocument).toHaveBeenCalledWith(document);
            expect(spyContract).not.toHaveBeenCalled();
        });

        it("should not contract a product for a client when the client is not found", async () => {
            const document = "12345678901";
            const product: ClientProducts = {
                name: "Test Product",
                applicatedValue: 1000,
                returnTax: 0,
                expirationDate: new Date("2026/12/31"),
                product: {
                    name: "Test Product",
                    type: ProductType.PF,
                    annualIncomeLimit: 50,
                },
            };

            const spyFindProductsByClient = jest.spyOn(mockDatabase, "findProductsByClient").mockResolvedValue([
                {
                    product: {
                        name: "Test Product",
                        type: ProductType.PF,
                        annualIncomeLimit: 50,
                    },
                    applicatedValue: 500,
                    name: "Test",
                    returnTax: 0,
                    expirationDate: new Date("2026/12/31"),
                },
            ]);

            const spyGetProducts = jest.spyOn(mockDatabase, "getProducts").mockResolvedValue([]);

            const spyFindByDocument = jest.spyOn(mockDatabase, "findByDocument").mockRejectedValue(new NotFoundException("Client not found"));

            const spyContract = jest.spyOn(mockDatabase, "contract").mockResolvedValue(null);

            await expect(service.contract(document, product)).rejects.toThrow("Client not found");
            expect(spyFindProductsByClient).toHaveBeenCalledWith(document);
            expect(spyGetProducts).toHaveBeenCalled();
            expect(spyFindByDocument).toHaveBeenCalledWith(document);
            expect(spyContract).not.toHaveBeenCalled();
        });

        it("should not contract a product for a client when the product is not qualified (PF)", async () => {
            const document = "12345678901";
            const products = [
                {
                    name: "Test Product",
                    type: ProductType.PJ,
                    annualIncomeLimit: 50,
                } as Product,
            ];
            const product: ClientProducts = {
                name: "Test Product",
                applicatedValue: 1000,
                returnTax: 0,
                expirationDate: new Date("2026/12/31"),
                product: products[0],
            };

            const client: Client = {
                annualIncome: 50000,
                name: "Test Client",
                address: "Rua Teste",
                documentNumber: "12345678901",
            };

            const spyFindProductsByClient = jest.spyOn(mockDatabase, "findProductsByClient").mockResolvedValue([
                {
                    product: {
                        name: "Test Product",
                        type: ProductType.PF,
                        annualIncomeLimit: 50,
                    },
                    applicatedValue: 500,
                    name: "Test",
                    returnTax: 0,
                    expirationDate: new Date("2026/12/31"),
                },
            ]);

            const spyGetProducts = jest.spyOn(mockDatabase, "getProducts").mockResolvedValue(products);

            const spyFindByDocument = jest.spyOn(mockDatabase, "findByDocument").mockResolvedValue(client);

            const spyContract = jest.spyOn(mockDatabase, "contract").mockResolvedValue(null);

            await expect(service.contract(document, product)).rejects.toThrow("Product not qualified for contracting");
            expect(spyFindProductsByClient).toHaveBeenCalledWith(document);
            expect(spyGetProducts).toHaveBeenCalled();
            expect(spyFindByDocument).toHaveBeenCalledWith(document);
            expect(spyContract).not.toHaveBeenCalled();
        });

        it("should not contract a product for a client when the product is not qualified (PJ)", async () => {
            const document = "12345678901000";
            const products = [
                {
                    name: "Test Product",
                    type: ProductType.PF,
                    annualIncomeLimit: 50,
                } as Product,
            ];
            const product: ClientProducts = {
                name: "Test Product",
                applicatedValue: 1000,
                returnTax: 0,
                expirationDate: new Date("2026/12/31"),
                product: products[0],
            };

            const client: Client = {
                annualIncome: 50000,
                name: "Test Client",
                address: "Rua Teste",
                documentNumber: "12345678901000",
            };

            const spyFindProductsByClient = jest.spyOn(mockDatabase, "findProductsByClient").mockResolvedValue([
                {
                    product: {
                        name: "Test Product",
                        type: ProductType.PJ,
                        annualIncomeLimit: 50,
                    },
                    applicatedValue: 500,
                    name: "Test",
                    returnTax: 0,
                    expirationDate: new Date("2026/12/31"),
                },
            ]);

            const spyGetProducts = jest.spyOn(mockDatabase, "getProducts").mockResolvedValue(products);

            const spyFindByDocument = jest.spyOn(mockDatabase, "findByDocument").mockResolvedValue(client);

            const spyContract = jest.spyOn(mockDatabase, "contract").mockResolvedValue(null);

            await expect(service.contract(document, product)).rejects.toThrow("Product not qualified for contracting");
            expect(spyFindProductsByClient).toHaveBeenCalledWith(document);
            expect(spyGetProducts).toHaveBeenCalled();
            expect(spyFindByDocument).toHaveBeenCalledWith(document);
            expect(spyContract).not.toHaveBeenCalled();
        });

        it("should not contract a product for a client when the client has insufficient limit to apply", async () => {
            const document = "12345678901";
            const products = [
                {
                    name: "Test Product",
                    type: ProductType.PF,
                    annualIncomeLimit: 50,
                } as Product,
            ];
            const product: ClientProducts = {
                name: "Test Product",
                applicatedValue: 1000,
                returnTax: 0,
                expirationDate: new Date("2026/12/31"),
                product: products[0],
            };

            const client: Client = {
                annualIncome: 50000,
                name: "Test Client",
                address: "Rua Teste",
                documentNumber: "12345678901",
            };

            const spyFindProductsByClient = jest.spyOn(mockDatabase, "findProductsByClient").mockResolvedValue([
                {
                    product: {
                        name: "Test Product",
                        type: ProductType.PF,
                        annualIncomeLimit: 50,
                    },
                    applicatedValue: 50000,
                    name: "Test",
                    returnTax: 0,
                    expirationDate: new Date("2026/12/31"),
                },
            ]);

            const spyGetProducts = jest.spyOn(mockDatabase, "getProducts").mockResolvedValue(products);

            const spyFindByDocument = jest.spyOn(mockDatabase, "findByDocument").mockResolvedValue(client);

            const spyContract = jest.spyOn(mockDatabase, "contract").mockResolvedValue(null);

            await expect(service.contract(document, product)).rejects.toThrow("Insufficient Limit to apply");
            expect(spyFindProductsByClient).toHaveBeenCalledWith(document);
            expect(spyGetProducts).toHaveBeenCalled();
            expect(spyFindByDocument).toHaveBeenCalledWith(document);
            expect(spyContract).not.toHaveBeenCalled();
        });
    });

    describe("findProductsByClient", () => {
        it("should find products by client document number", async () => {
            const document = "12345678901";
            const clientProducts = [
                {
                    product: {
                        name: "Test Product",
                        type: ProductType.PF,
                        annualIncomeLimit: 50,
                    },
                    applicatedValue: 500,
                    name: "Test",
                    returnTax: 0,
                    expirationDate: new Date("2026/12/31"),
                },
            ];

            const spyFindProductsByClient = jest.spyOn(mockDatabase, "findProductsByClient").mockResolvedValue(clientProducts);

            expect(await service.findProductsByClient(document)).toBe(clientProducts);
            expect(spyFindProductsByClient).toHaveBeenCalledWith(document);
        });

        it("should throw an error when the client is not found", async () => {
            const document = "12345678901";
            jest.spyOn(mockDatabase, "findProductsByClient").mockRejectedValue(new NotFoundException("Client not found"));

            await expect(service.findProductsByClient(document)).rejects.toThrow("Client not found");
        });
    });

    describe("cancel", () => {
        it("should cancel a product for a client when valid data has provied", async () => {
            const document = "12345678901";
            const productId = 1;

            const spyCancel = jest.spyOn(mockDatabase, "cancel").mockResolvedValue(null);

            expect(await service.cancel(document, productId)).toBeNull();
            expect(spyCancel).toHaveBeenCalledWith(document, productId);
        });

        it("should throw an error when the client is not found", async () => {
            const document = "12345678901";
            const productId = 1;
            jest.spyOn(mockDatabase, "cancel").mockRejectedValue(new NotFoundException("Client not found"));

            await expect(service.cancel(document, productId)).rejects.toThrow("Client not found");
        });
    });
});
