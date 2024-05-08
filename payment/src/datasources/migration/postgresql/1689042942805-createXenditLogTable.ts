/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateXenditLogTable1689042942805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS payment.xendit_log (
                id VARCHAR(36) PRIMARY KEY,
                action_name VARCHAR(255) NOT NULL,
                log JSONB NOT NULL,
                created_date TIMESTAMP NOT NULL DEFAULT NOW(),
                modified_date TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS payment.xendit_log;
        `);
  }
}
