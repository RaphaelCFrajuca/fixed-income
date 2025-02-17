import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateClientDto } from "../dtos/create-client.dto";
import { GetClientDto } from "../dtos/get-client.dto";
import { ClientService } from "../services/client.service";

@Controller("client")
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientService.create(createClientDto);
    }

    @Get(":document")
    findByDocument(@Param() params: GetClientDto) {
        return this.clientService.findByDocument(params.document);
    }

    @Patch()
    update() {
        return this.clientService.update();
    }

    @Delete()
    delete() {
        return this.clientService.delete();
    }
}
