import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateClientDto } from "../dtos/create-client.dto";
import { GetClientDto } from "../dtos/get-client.dto";
import { UpdateClientDto } from "../dtos/update-client.dto";
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

    @Patch(":document")
    update(@Param() params: GetClientDto, @Body() updateClientDto: UpdateClientDto) {
        return this.clientService.update(params.document, updateClientDto);
    }

    @Delete()
    delete() {
        return this.clientService.delete();
    }
}
