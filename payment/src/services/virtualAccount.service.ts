import { Inject, Service } from 'fastify-decorators';
import { Not } from 'typeorm';
import { VirtualAccountStatusProducer } from '../dao/kafka/producer/virtualAccountStatus.producer';
import { VirtualAccountDAO } from '../dao/postgresql/virtualAccount.dao';
import { XenditDAO } from '../dao/xendit/xendit.dao';
import {
  BANK_CODE,
  VIRTUAL_ACCOUNT_STATUS,
  VirtualAccount,
} from '../datasources/entity/postgresql/virtualAccount.entity';
import { CreateVirtualAccountBody, VirtualAccountItem } from '../dto/virtualAccount.dto';
import { VirtualAccountItem as XenditVirtualAccountItem } from '../dto/xendit.dto';
import {
  ERR_CREATE_VIRTUAL_ACCOUNT_FAILED,
  ERR_VIRTUAL_ACCOUNT_EXIST,
} from '../libs/constants/errors';
import {
  createExternalId,
  extractPartnerId,
  normalizeVirtualAccountName,
  rateLimiter,
} from '../libs/utils/helpers';

@Service()
export class VirtualAccountService {
  @Inject(VirtualAccountDAO)
  private dao!: VirtualAccountDAO;

  @Inject(XenditDAO)
  private xenditDAO!: XenditDAO;

  @Inject(VirtualAccountStatusProducer)
  private virtualAccountStatusProducer!: VirtualAccountStatusProducer;

  async create(opts: { body: CreateVirtualAccountBody }): Promise<VirtualAccountItem> {
    await rateLimiter(`create-virtual-account:${opts.body.partnerId}-${opts.body.bankCode}`, 10);

    // generate externalId
    const externalId = createExternalId(opts.body.partnerId, opts.body.bankCode);

    // validate existing virtual account
    const existingVA = await this.dao.getOne({
      where: {
        partnerId: externalId,
        bankCode: opts.body.bankCode,
        status: Not(VIRTUAL_ACCOUNT_STATUS.INACTIVE),
      },
    });

    if (existingVA) {
      throw ERR_VIRTUAL_ACCOUNT_EXIST();
    }

    // create virtual account to xendit
    const generatedVA = await this.xenditDAO.createVirtualAccount({
      bankCode: opts.body.bankCode,
      name: normalizeVirtualAccountName(opts.body.name),
      externalID: externalId,
    });

    if (!generatedVA) {
      throw ERR_CREATE_VIRTUAL_ACCOUNT_FAILED('Unexpected response from xendit');
    }

    if (generatedVA.externalId !== externalId) {
      throw ERR_CREATE_VIRTUAL_ACCOUNT_FAILED('Unexpected externalId');
    }

    const qr = await this.dao.startTransaction();

    try {
      // save to database
      const VA = await this.dao.upsertOne(
        {
          ...opts.body,
          ...generatedVA,
          partnerId: externalId,
          bankCode: generatedVA.bankCode as BANK_CODE,
          expirationDate: new Date(generatedVA.expirationDate),
          status: generatedVA.status as VIRTUAL_ACCOUNT_STATUS,
        },
        qr,
      );

      await this.dao.commitTransaction(qr);

      return this.mapEntityToDTO(VA);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async virtualAccountStatusCallback(opts: {
    body: XenditVirtualAccountItem;
  }): Promise<VirtualAccountItem> {
    // validate virtual account payload
    const va = await this.xenditDAO.validateVAStatus(opts.body.id);

    const qr = await this.dao.startTransaction();

    try {
      // save to database
      const VA = await this.dao.updateOne(
        {
          id: va.id,
          partnerId: va.external_id,
          bankCode: va.bank_code as BANK_CODE,
        },
        {
          accountNumber: va.account_number,
          isClosed: va.is_closed,
          merchantCode: va.merchant_code,
          name: va.name,
          expirationDate: new Date(va.expiration_date),
          status: va.status as VIRTUAL_ACCOUNT_STATUS,
        },
        qr,
      );

      // notify VA status to odoo service
      await this.virtualAccountStatusProducer.send({
        id: va.id,
        partnerId: extractPartnerId(VA.partnerId),
        status: VA.status,
        accountNumber: VA.accountNumber,
        bankCode: VA.bankCode,
        expirationDate: VA.expirationDate,
        name: VA.name,
      });

      await this.dao.commitTransaction(qr);

      return this.mapEntityToDTO(VA);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async setExpire(opts: {
    params: {
      partnerId: string;
      bankCode: BANK_CODE;
    };
    body: {
      expirationDate: string;
    };
  }) {
    const va = await this.dao.getOneStrict({
      where: {
        partnerId: createExternalId(opts.params.partnerId, opts.params.bankCode),
        bankCode: opts.params.bankCode,
        status: Not(VIRTUAL_ACCOUNT_STATUS.INACTIVE),
      },
    });

    const qr = await this.dao.startTransaction();
    try {
      const expirationDate = new Date(opts.body.expirationDate);
      await this.dao.updateOne(
        {
          id: va.id,
        },
        {
          expirationDate,
        },
        qr,
      );

      await this.xenditDAO.setExpire(va.id, expirationDate);

      await this.dao.commitTransaction(qr);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async retryLatestVAStatus(opts: {
    params: {
      vaNumber: string;
    };
  }) {
    const va = await this.dao.getOneStrict({
      where: {
        accountNumber: opts.params.vaNumber,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    // notify VA status to odoo service
    await this.virtualAccountStatusProducer.send({
      id: va.id,
      partnerId: extractPartnerId(va.partnerId),
      status: va.status,
      accountNumber: va.accountNumber,
      bankCode: va.bankCode,
      expirationDate: va.expirationDate,
      name: va.name,
    });

    return this.mapEntityToDTO(va);
  }

  // eslint-disable-next-line class-methods-use-this
  private mapEntityToDTO(entity: VirtualAccount): VirtualAccountItem {
    return {
      ...entity,
      expirationDate: entity.expirationDate.toISOString(),
    };
  }
}
