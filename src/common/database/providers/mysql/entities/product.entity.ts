import { ProductType } from "src/domain/product/entities/product.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ name: "type", type: "varchar", length: 2, nullable: true })
    type: ProductType;

    @Column({ name: "annual_income_limit", type: "decimal", nullable: false })
    annualIncomeLimit: number;
}
