import { Client } from "src/domain/client/entities/client.entity";
import { ClientProducts } from "src/domain/product/entities/client_products.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClientProductsEntity } from "./client_products.entity";

@Entity("client")
export class ClientEntity implements Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ name: "address", type: "varchar", length: 255, nullable: false })
    address: string;

    @Column({ name: "annual_income", type: "decimal", precision: 10, scale: 2, nullable: false })
    annualIncome: number;

    @Column({ name: "document_number", type: "varchar", length: 14, nullable: false, unique: true })
    documentNumber: string;

    @OneToMany(() => ClientProductsEntity, clientProducts => clientProducts.client)
    products: ClientProducts[];
}
