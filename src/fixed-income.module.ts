import { Module } from "@nestjs/common";
import { ClientModule } from "./domain/client/client.module";
import { ProductModule } from "./domain/product/product.module";

@Module({
    imports: [ClientModule, ProductModule],
    controllers: [],
    providers: [],
})
export class FixedIncomeModule {}
