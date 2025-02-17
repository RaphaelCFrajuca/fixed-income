import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/common/database/database.module";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";

@Module({
    imports: [DatabaseModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
