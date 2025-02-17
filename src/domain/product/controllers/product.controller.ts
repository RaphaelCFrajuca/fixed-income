import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ContractProductDto } from "../dtos/contract-product.dto";
import { ProductDto } from "../dtos/product.dto";
import { ProductService } from "../services/product.service";

@Controller("product")
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post("contract/:document")
    contract(@Param() params: ContractProductDto, @Body() product: ProductDto) {
        return this.productService.contract(params.document, product);
    }

    @Get("list/:document")
    list(@Param("document") document: string) {
        return "Product listed";
    }

    @Delete("cancel/:document/:productId")
    cancel(@Param("document") document: string, @Param("productId") productId: number) {
        return "Product canceled";
    }
}
