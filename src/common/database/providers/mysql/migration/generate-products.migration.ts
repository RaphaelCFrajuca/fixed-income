import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateProducts1739814637050 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO \`fixed-income\`.product (name, \`type\`, annual_income_limit) VALUES
                ('RF-01', 'PF', 50),
                ('RF-02', 'PJ', 70),
                ('RF-03', 'PF', 50),
                ('RF-03', 'PJ', 70)
            ON DUPLICATE KEY UPDATE name = name;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`fixed-income\`.product 
            WHERE name IN ('RF-01', 'RF-02', 'RF-03');
        `);
    }
}
