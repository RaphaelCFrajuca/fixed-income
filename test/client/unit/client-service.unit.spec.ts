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
    });
});
