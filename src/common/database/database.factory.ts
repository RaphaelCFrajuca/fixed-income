import { InternalServerErrorException, Logger } from "@nestjs/common";
import { MysqlProvider } from "./providers/mysql/mysql.provider";

export function databaseFactory(databaseProvider: DatabaseProvider) {
    if (databaseProvider === DatabaseProvider.MySQL) {
        Logger.log("Creating MySQL database provider");
        return new MysqlProvider();
    } else if (databaseProvider === undefined) {
        throw new Error("Database provider not provided");
    } else {
        throw new InternalServerErrorException(`Database provider ${databaseProvider as string} not supported`);
    }
}

enum DatabaseProvider {
    MySQL = "mysql",
}
