import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/common/database/database.module";
import { ClientController } from "./controllers/client.controller";
import { ClientService } from "./services/client.service";

@Module({
    imports: [DatabaseModule],
    controllers: [ClientController],
    providers: [ClientService],
})
export class ClientModule {}
