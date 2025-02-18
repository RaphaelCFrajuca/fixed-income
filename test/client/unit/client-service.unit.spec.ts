import { Test } from "@nestjs/testing";
import { Database } from "src/common/database/interfaces/database.interface";
import { Client } from "src/domain/client/entities/client.entity";
import { ClientService } from "src/domain/client/services/client.service";

describe("ClientService (unit)", () => {
    let service: ClientService;
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
            providers: [ClientService, { provide: Database, useValue: mockDatabase }],
        }).compile();

        service = module.get(ClientService);
        mockDatabase = module.get(Database);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should create a client with the given properties when instantiated", () => {
        const client = new Client();
        client.name = "John Doe";
        client.address = "123 Main St";
        client.annualIncome = 50000;
        client.documentNumber = "12345678901";

        expect(client.name).toBe("John Doe");
        expect(client.address).toBe("123 Main St");
        expect(client.annualIncome).toBe(50000);
        expect(client.documentNumber).toBe("12345678901");
    });

    it("should allow updating client properties when properties are changed", () => {
        const client = new Client();
        client.name = "John Doe";
        client.address = "123 Main St";
        client.annualIncome = 50000;
        client.documentNumber = "12345678901";

        client.name = "Jane Doe";
        client.address = "456 Elm St";
        client.annualIncome = 60000;
        client.documentNumber = "09876543210";

        expect(client.name).toBe("Jane Doe");
        expect(client.address).toBe("456 Elm St");
        expect(client.annualIncome).toBe(60000);
        expect(client.documentNumber).toBe("09876543210");
    });

    describe("create", () => {
        it("should create a client when valid data is provided", async () => {
            const client: Client = {
                name: "John Doe",
                documentNumber: "12345678900",
                address: "Rua dos Bobos, nº 0",
                annualIncome: 1000,
            };
            const dbSpy = jest.spyOn(mockDatabase, "create").mockResolvedValue(null);

            expect(await service.create(client)).toBeNull();
            expect(dbSpy).toHaveBeenCalledWith(client);
        });

        it("should throw an error when the client already exists", async () => {
            const client: Client = {
                name: "John Doe",
                documentNumber: "12345678900",
                address: "Rua dos Bobos, nº 0",
                annualIncome: 1000,
            };
            jest.spyOn(mockDatabase, "create").mockRejectedValue(new Error("Client already exists"));

            await expect(service.create(client)).rejects.toThrowError("Client already exists");
        });
    });

    describe("findByDocument", () => {
        it("should find a client by document number", async () => {
            const document = "12345678900";
            const client: Client = {
                name: "John Doe",
                documentNumber: document,
                address: "Rua dos Bobos, nº 0",
                annualIncome: 1000,
            };
            const dbSpy = jest.spyOn(mockDatabase, "findByDocument").mockResolvedValue(client);

            expect(await service.findByDocument(document)).toBe(client);
            expect(dbSpy).toHaveBeenCalledWith(document);
        });

        it("should throw an error when the client is not found", async () => {
            const document = "12345678900";
            jest.spyOn(mockDatabase, "findByDocument").mockRejectedValue(new Error("Client not found"));

            await expect(service.findByDocument(document)).rejects.toThrowError("Client not found");
        });
    });

    describe("update", () => {
        it("should update a client when valid data is provided", async () => {
            const document = "12345678900";
            const client: Partial<Client> = {
                name: "John Doe",
                address: "Rua dos Bobos, nº 0",
                annualIncome: 1000,
            };
            const dbSpy = jest.spyOn(mockDatabase, "update").mockResolvedValue(null);

            expect(await service.update(document, client)).toBeNull();
            expect(dbSpy).toHaveBeenCalledWith(document, client);
        });

        it("should throw an error when the client is not found", async () => {
            const document = "12345678900";
            const client: Partial<Client> = {
                name: "John Doe",
                address: "Rua dos Bobos, nº 0",
                annualIncome: 1000,
            };
            jest.spyOn(mockDatabase, "update").mockRejectedValue(new Error("Client not found"));

            await expect(service.update(document, client)).rejects.toThrow("Client not found");
        });

        it("should throw an error when trying to update the document number", async () => {
            const document = "12345678900";
            const client: Partial<Client> = {
                name: "John Doe",
                address: "Rua dos Bobos, nº 0",
                annualIncome: 1000,
                documentNumber: "98765432100",
            };
            jest.spyOn(mockDatabase, "update").mockRejectedValue(new Error("Document number cannot be updated"));

            await expect(service.update(document, client)).rejects.toThrow("Document number cannot be updated");
        });
    });

    describe("delete", () => {
        it("should delete a client by document number", async () => {
            const document = "12345678900";
            const dbSpy = jest.spyOn(mockDatabase, "delete").mockResolvedValue(null);

            expect(await service.delete(document)).toBeNull();
            expect(dbSpy).toHaveBeenCalledWith(document);
        });

        it("should throw an error when the client is not found", async () => {
            const document = "12345678900";
            jest.spyOn(mockDatabase, "delete").mockRejectedValue(new Error("Client not found"));

            await expect(service.delete(document)).rejects.toThrow("Client not found");
        });
    });
});
