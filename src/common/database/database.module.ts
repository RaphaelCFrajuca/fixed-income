import { Module } from "@nestjs/common";
import { EnvironmentModule } from "../environment/environment.module";
import { databaseFactory } from "./database.factory";
import { Database } from "./interfaces/database.interface";

@Module({
    imports: [EnvironmentModule],
    providers: [
        {
            provide: Database,
            useFactory: databaseFactory,
            inject: ["DATABASE_PROVIDER"],
        },
    ],
    exports: [Database],
})
export class DatabaseModule {}
