import { sub } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { IsNull, LessThanOrEqual, Not } from 'typeorm';
import { env } from '../config/env';
import { PaymentStatusProducer } from '../dao/kafka/producer/paymentStatus.producer';
import { VirtualAccountDAO } from '../dao/postgresql/virtualAccount.dao';
import { VirtualAccountPaymentDAO } from '../dao/postgresql/virtualAccountPayment';
import { SlackDAO } from '../dao/slack/slack.dao';
import { XenditDAO } from '../dao/xendit/xendit.dao';
import { VirtualAccountPayment } from '../datasources/entity/postgresql/virtualAccountPayment.entity';
import { VirtualAccountPaymentCallbackBody } from '../dto/xendit.dto';
import { ERR_UNEXPECTED_ACCOUNT_NUMBER } from '../libs/constants/errors';
import { extractPartnerId } from '../libs/utils/helpers';
import { Logger } from '../libs/utils/logger';

@Service()
export class PaymentService {
  @Inject(PaymentStatusProducer)
  private paymentStatusProducer!: PaymentStatusProducer;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(VirtualAccountDAO)
  private virtualAccountDAO!: VirtualAccountDAO;

  @Inject(VirtualAccountPaymentDAO)
  private virtualAccountPaymentDAO!: VirtualAccountPaymentDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(XenditDAO)
  private xenditDAO!: XenditDAO;

  async virtualAccountPaymentCallback(opts: {
    body: VirtualAccountPaymentCallbackBody;
  }): Promise<void> {
    if (env.VA_BLACKLIST.split(',').find((item) => item === opts.body.account_number)) {
      this.logger.info(`Skip payment callback for ${opts.body.account_number}`);
      return;
    }

    // validate request to xendit
    const validPayment = await this.xenditDAO.validateVAPayment(opts.body.payment_id!);

    const existingPayment = await this.virtualAccountPaymentDAO.getOne({
      where: {
        id: validPayment.id,
      },
    });

    if (existingPayment && !existingPayment.failedDate) {
      return;
    }

    const virtualAccount = await this.virtualAccountDAO.getOneStrict({
      where: {
        id: validPayment.callback_virtual_account_id,
      },
    });

    if (
      virtualAccount.accountNumber !== `${validPayment.merchant_code}${validPayment.account_number}`
    ) {
      throw ERR_UNEXPECTED_ACCOUNT_NUMBER('Account number mismatch');
    }

    const qr = await this.virtualAccountPaymentDAO.startTransaction();
    try {
      // save payment log
      if (existingPayment) {
        await this.virtualAccountPaymentDAO.updateOne(
          {
            id: validPayment.id,
          },
          {
            ...existingPayment,
            failedDate: null,
          },
          qr,
        );
      } else {
        await this.virtualAccountPaymentDAO.createOne(
          {
            id: validPayment.id,
            virtualAccountId: validPayment.callback_virtual_account_id,
            paymentId: validPayment.payment_id,
            amount: validPayment.amount,
            currency: validPayment.currency,
            transactionTimestamp: new Date(validPayment.transaction_timestamp),
            reference: opts.body.payment_detail?.reference,
            remark: opts.body.payment_detail?.remark,
          },
          qr,
        );
      }

      // notify payment to odoo
      await this.paymentStatusProducer.send({
        partnerId: extractPartnerId(virtualAccount.partnerId),
        accountNumber: virtualAccount.accountNumber,
        amount: validPayment.amount,
        bankCode: virtualAccount.bankCode,
        paymentId: validPayment.payment_id,
        notes: opts.body.payment_detail?.remark || '',
        paymentTime: new Date(validPayment.transaction_timestamp),
      });

      await this.virtualAccountPaymentDAO.commitTransaction(qr);
    } catch (error) {
      this.logger.error(error);
      await this.virtualAccountPaymentDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async retryVirtualAccountPayment(opts: {
    params: {
      paymentId: string;
    };
  }): Promise<VirtualAccountPayment> {
    const payment = await this.virtualAccountPaymentDAO.getOneStrict({
      where: {
        id: opts.params.paymentId,
      },
      relations: {
        virtualAccount: true,
      },
    });

    // notify payment to odoo
    await this.paymentStatusProducer.send({
      partnerId: extractPartnerId(payment.virtualAccount.partnerId),
      accountNumber: payment.virtualAccount.accountNumber,
      amount: payment.amount,
      bankCode: payment.virtualAccount.bankCode,
      paymentId: payment.paymentId,
      notes: payment.remark || '',
      paymentTime: new Date(payment.transactionTimestamp),
    });

    const updated = await this.virtualAccountPaymentDAO.updateOne(
      {
        id: opts.params.paymentId,
      },
      {
        ...payment,
        failedDate: null,
        retryDate: new Date(),
        retryAttempt: payment.retryAttempt + 1,
      },
    );

    return updated;
  }

  async getUndeliveredPayments(): Promise<VirtualAccountPayment[]> {
    const timeThreshold = sub(new Date(), { hours: 1 }); // after 1 hour
    const [payments] = await this.virtualAccountPaymentDAO.getMany({
      where: [
        {
          failedDate: Not(IsNull()),
          retryDate: LessThanOrEqual(timeThreshold),
          consumedDate: IsNull(),
        },
        {
          createdDate: LessThanOrEqual(timeThreshold),
          consumedDate: IsNull(),
        },
      ],
    });

    return payments;
  }

  async alertUndeliveredPayments(): Promise<void> {
    const payments = await this.getUndeliveredPayments();

    if (payments.length > 0) {
      await this.slackDAO.alertUndeliveredPayment(payments);
    }
  }
}
