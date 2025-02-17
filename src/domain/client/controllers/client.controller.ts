import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateClientDto } from "../dtos/create-client.dto";
import { GetClientDto } from "../dtos/get-client.dto";
import { UpdateClientDto } from "../dtos/update-client.dto";
import { Client } from "../entities/client.entity";
import { ClientService } from "../services/client.service";

@Controller("client")
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    create(@Body() createClientDto: CreateClientDto): Promise<null> {
        return this.clientService.create(createClientDto);
    }

    @Get(":document")
    findByDocument(@Param() params: GetClientDto): Promise<Client> {
        return this.clientService.findByDocument(params.document);
    }

    @Patch(":document")
    update(@Param() params: GetClientDto, @Body() updateClientDto: UpdateClientDto): Promise<null> {
        return this.clientService.update(params.document, updateClientDto);
    }

    @Delete(":document")
    delete(@Param() params: GetClientDto): Promise<null> {
        return this.clientService.delete(params.document);
    }
}
