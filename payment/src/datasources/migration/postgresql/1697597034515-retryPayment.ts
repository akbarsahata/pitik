/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RetryPayment1697597034515 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      ADD COLUMN retry_date timestamp NULL
    `);
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      ADD COLUMN retry_attempt int NULL
      DEFAULT 0;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      DROP COLUMN retry_date;
    `);
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      DROP COLUMN retry_attempt;
    `);
  }
}
