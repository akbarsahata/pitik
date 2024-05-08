/* eslint-disable class-methods-use-this */
import { Inject, Service } from 'fastify-decorators';
import fetch from 'node-fetch';
import { ulid } from 'ulid';
import { env } from '../../config/env';
import { VIRTUAL_ACCOUNT_STATUS } from '../../datasources/entity/postgresql/virtualAccount.entity';
import { Logger } from '../../libs/utils/logger';
import { SlackDAO } from '../slack/slack.dao';

@Service()
export class ErpDAO {
  @Inject(Logger)
  private logger!: Logger;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  protected async post(path: string, body: any): Promise<any> {
    const url = `${env.HOST_ERP_V1}${path}`;
    const method = 'POST';
    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': env.API_KEY_ERP,
        'x-identifier-key': ulid(),
      },
    });

    const resultText = await response.text();

    try {
      const result = JSON.parse(resultText);

      if (!result || !result.result || !result.result.data) {
        this.logger.error(result, 'unexpected response');
        throw new Error('unexpected response');
      }

      if (result.result.code < 200 || result.result.code > 300) {
        this.logger.error(result, 'unexpected http code');
        throw new Error(`${result.result.code} - ${result.result.message}`);
      }

      if (result.error) {
        this.logger.error(result, 'unexpected error');
        throw new Error(`${result.error.http_status} - ${result.error.message}`);
      }

      return result.result;
    } catch (error) {
      await this.slackDAO.alertErpErrorLog(`POST ${url}`, response.status, body, resultText, error);

      throw new Error(
        JSON.stringify({
          message: error,
          payload: resultText,
        }),
      );
    }
  }

  async NotifyVirtualAccountStatus(body: {
    partnerId: string;
    bankCode: string;
    name: string;
    accountNumber: string;
    expirationDate: Date;
    status: VIRTUAL_ACCOUNT_STATUS;
  }) {
    const result = await this.post('/v2/internal/va_status_callback_xendit', body);

    this.logger.info({ body, result }, 'ErpDAO_NotifyVirtualAccountStatus');
    return result;
  }

  async NotifyVirtualAccountPayment(body: {
    paymentId: string;
    partnerId: string;
    bankCode: string;
    accountNumber: string;
    amount: number;
    paymentTime: Date;
    notes: string;
  }) {
    const result = await this.post('/v2/internal/payment_callback_xendit', body);

    this.logger.info({ body, result }, 'ErpDAO_NotifyVirtualAccountPayment');
    return result;
  }
}
