/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFailedDateColumn1695048273868 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      ADD COLUMN created_date timestamp NULL
      DEFAULT NOW();
    `);
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      ADD COLUMN modified_date timestamp NULL
      DEFAULT NOW();
    `);
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      ADD COLUMN failed_date timestamp NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      DROP COLUMN created_date;
    `);
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      DROP COLUMN modified_date;
    `);
    await queryRunner.query(`
      ALTER TABLE payment.virtual_account_payment
      DROP COLUMN failed_date;
    `);
  }
}
