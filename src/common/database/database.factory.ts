import { InternalServerErrorException, Logger } from "@nestjs/common";
import { MysqlConfig } from "./providers/mysql/interfaces/mysql.interface";
import { MysqlProvider } from "./providers/mysql/mysql.provider";

export function databaseFactory(databaseProvider: DatabaseProvider, mysqlConfig: MysqlConfig) {
    if (databaseProvider === DatabaseProvider.MySQL) {
        Logger.log("Creating MySQL database provider");
        return new MysqlProvider(mysqlConfig).connect();
    } else if (databaseProvider === undefined) {
        throw new Error("Database provider not provided");
    } else {
        throw new InternalServerErrorException(`Database provider ${databaseProvider as string} not supported`);
    }
}

enum DatabaseProvider {
    MySQL = "mysql",
}
