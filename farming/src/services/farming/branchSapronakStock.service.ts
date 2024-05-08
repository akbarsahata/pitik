import { Inject, Service } from 'fastify-decorators';
import { QueryRunner } from 'typeorm';
import { BranchSapronakStockDAO } from '../../dao/branchSapronakStock.dao';
import { TransferRequest } from '../../datasources/entity/pgsql/TransferRequest.entity';
import { ERR_TRANSFER_REQUEST_FROM_BRANCH_NO_STOCK } from '../../libs/constants/errors';
import { Transactional } from '../../libs/decorators/transactional';

@Service()
export class BranchSapronakStockService {
  @Inject(BranchSapronakStockDAO)
  private branchSapronakStockDAO: BranchSapronakStockDAO;

  @Transactional()
  async bookSapronakStocks(transferRequest: TransferRequest, queryRunner: QueryRunner) {
    const user = { id: transferRequest.createdBy, role: '' };

    await transferRequest.transferRequestProducts.reduce(async (last, trp) => {
      await last;

      const stock = await this.branchSapronakStockDAO.getOneWithTx(
        {
          where: {
            branchId: transferRequest.branchSourceId!,
            categoryCode: trp.categoryCode,
            productCode: trp.productCode,
          },
        },
        queryRunner,
      );

      if (!stock || stock.quantity - stock.bookedQuantity < trp.quantity) {
        throw ERR_TRANSFER_REQUEST_FROM_BRANCH_NO_STOCK(
          `(${trp.categoryCode}) ${trp.productCode} - ${trp.productName}`,
        );
      }

      await this.branchSapronakStockDAO.incrementBookedQuantityWithTx(
        {
          branchId: transferRequest.branchSourceId!,
          categoryCode: trp.categoryCode,
          productCode: trp.productCode,
        },
        trp.quantity,
        user,
        queryRunner,
      );
    }, Promise.resolve());
  }

  @Transactional()
  async abortBookedSapronakStocks(transferRequest: TransferRequest, queryRunner: QueryRunner) {
    const user = { id: transferRequest.createdBy, role: '' };

    await transferRequest.transferRequestProducts.reduce(async (last, trp) => {
      await last;

      const stock = await this.branchSapronakStockDAO.getOneWithTx(
        {
          where: {
            branchId: transferRequest.branchSourceId!,
            categoryCode: trp.categoryCode,
            productCode: trp.productCode,
          },
        },
        queryRunner,
      );

      if (stock) {
        await this.branchSapronakStockDAO.incrementBookedQuantityWithTx(
          {
            id: stock.id,
          },
          -1 * trp.quantity,
          user,
          queryRunner,
        );
      }
    }, Promise.resolve());
  }
}
