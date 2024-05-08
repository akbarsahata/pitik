/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVirtualAccountPaymentTable1689086568967 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS payment.virtual_account_payment (
            id VARCHAR(36) PRIMARY KEY,
            virtual_account_id VARCHAR(36) NOT NULL,
            payment_id VARCHAR(36) NOT NULL,
            amount NUMERIC(20, 2) NOT NULL,
            transaction_timestamp TIMESTAMP NOT NULL,
            currency VARCHAR(3) NOT NULL,
            remark VARCHAR(255),
            reference VARCHAR(255)
        );
    `);

    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment ADD CONSTRAINT virtual_account_payment_fk FOREIGN KEY (virtual_account_id) REFERENCES payment.virtual_account(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS payment.virtual_account_payment;
        `);
  }
}
