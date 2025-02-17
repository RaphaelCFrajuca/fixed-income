import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientEntity } from "./client.entity";
import { ProductEntity } from "./product.entity";

@Entity("client_products")
export class ClientProductsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "client_id", type: "int", nullable: false })
    @ManyToOne(() => ClientEntity, client => client.id)
    clientId: number;

    @Column({ name: "product_id", type: "int", nullable: false })
    @ManyToOne(() => ProductEntity, product => product.id)
    productId: number;

    @Column({ name: "applicated_value", type: "decimal", precision: 10, scale: 2, nullable: false })
    applicatedValue: number;

    @Column({ name: "return_tax", type: "decimal", precision: 10, scale: 2, nullable: false })
    returnTax: number;

    @Column({ name: "expiration_date", type: "date", nullable: false })
    expirationDate: Date;
}
