/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVirtualAccountTable1688356135962 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE payment.virtual_account (
                id VARCHAR(36) PRIMARY KEY,
                partner_id VARCHAR(36) NOT NULL,
                merchant_code VARCHAR(36) NOT NULL,
                account_number VARCHAR(50) NOT NULL,
                bank_code VARCHAR(36) NOT NULL,
                name VARCHAR(255) NOT NULL,
                is_closed BOOLEAN NOT NULL,
                is_single_use BOOLEAN NOT NULL,
                expiration_date TIMESTAMP NOT NULL,
                status VARCHAR(10) NOT NULL,
                created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE payment.virtual_account;
        `);
  }
}
