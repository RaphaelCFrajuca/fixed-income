import { Test } from "@nestjs/testing";
import { Database } from "src/common/database/interfaces/database.interface";
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
});
