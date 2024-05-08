import { addDays } from 'date-fns';
import { Initializer, Inject, Service } from 'fastify-decorators';
import Xendit from 'xendit-node';
import VirtualAcc from 'xendit-node/src/va/va';
import { env } from '../../config/env';
import { SecretManagerConnection } from '../../datasources/connection/secretmanager.connection';
import { VirtualAccountItem, VirtualAccountPaymentItem } from '../../dto/xendit.dto';
import { Logger } from '../../libs/utils/logger';
import { XenditLogDAO } from '../postgresql/xenditLog.dao';

@Service()
export class XenditDAO {
  private client: Xendit;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(SecretManagerConnection)
  private secretManagerConnection!: SecretManagerConnection;

  @Inject(XenditLogDAO)
  private xenditLogDAO!: XenditLogDAO;

  private va: VirtualAcc;

  @Initializer([SecretManagerConnection])
  init() {
    this.client = new Xendit({
      secretKey: this.secretManagerConnection.xendit.secretKey,
    });

    this.va = new this.client.VirtualAcc({});
  }

  async createVirtualAccount(input: { externalID: string; bankCode: string; name: string }) {
    try {
      const virtualAccount = (await this.va.createFixedVA({
        externalID: input.externalID,
        bankCode: input.bankCode,
        name: input.name,
        isClosed: false,
        expirationDate: env.XENDIT_VA_LIFESPAN
          ? addDays(new Date(), env.XENDIT_VA_LIFESPAN)
          : undefined,
      })) as VirtualAccountItem;

      await this.xenditLogDAO.createOne({
        actionName: 'create-virtual-account',
        log: {
          input,
          result: virtualAccount,
        },
      });

      return {
        id: virtualAccount.id,
        ownerId: virtualAccount.owner_id,
        externalId: virtualAccount.external_id,
        accountNumber: virtualAccount.account_number,
        bankCode: virtualAccount.bank_code,
        merchantCode: virtualAccount.merchant_code,
        name: virtualAccount.name,
        isClosed: virtualAccount.is_closed,
        expirationDate: virtualAccount.expiration_date,
        isSingleUse: virtualAccount.is_single_use,
        status: virtualAccount.status,
      };
    } catch (error) {
      this.logger.error(error);

      await this.xenditLogDAO.createOne({
        actionName: 'create-virtual-account',
        log: {
          input,
          error,
        },
      });

      throw error;
    }
  }

  async validateVAPayment(paymentID: string): Promise<VirtualAccountPaymentItem> {
    try {
      const payment = await this.va.getVAPayment({ paymentID });

      return payment as VirtualAccountPaymentItem;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async validateVAStatus(id: string): Promise<VirtualAccountItem> {
    try {
      const fixedVA = await this.va.getFixedVA({ id });

      return fixedVA as VirtualAccountItem;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async setExpire(id: string, expirationDate: Date): Promise<VirtualAccountItem> {
    try {
      const fixedVA = await this.va.updateFixedVA({ id, expirationDate });

      return fixedVA as VirtualAccountItem;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
