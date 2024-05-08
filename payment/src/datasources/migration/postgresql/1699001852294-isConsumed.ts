/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class IsConsumed1699001852294 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      ADD COLUMN consumed_date timestamp NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      DROP COLUMN consumed_date;
    `);
  }
}
