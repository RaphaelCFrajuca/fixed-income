import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { CreateClientDto } from "../dtos/create-client.dto";
import { ClientService } from "../services/client.service";

@Controller("client")
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientService.create(createClientDto);
    }

    @Get()
    findByCpf() {
        return this.clientService.findByCpf();
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
