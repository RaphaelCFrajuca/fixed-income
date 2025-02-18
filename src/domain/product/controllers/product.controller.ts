import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CancelProductDto } from "../dtos/cancel-product.dto";
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
    list(@Param() params: ContractProductDto) {
        return this.productService.findProductsByClient(params.document);
    }

    @Delete("cancel/:document/:productId")
    cancel(@Param() params: CancelProductDto) {
        return this.productService.cancel(params.document, params.productId);
    }
}
