import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const getBranchSapronakStockQueryDTO = Type.Object(
  {
    type: Type.KeyOf(
      Type.Object({
        ovk: Type.String(),
        pakan: Type.String(),
        OVK: Type.String(),
        PAKAN: Type.String(),
      }),
    ),
    branchId: Type.String(),
    subcategoryCode: Type.Optional(Type.String()),
    subcategoryName: Type.Optional(Type.String()),
    productCode: Type.Optional(Type.String()),
    productName: Type.Optional(Type.String()),
    ...paginationDTO.properties,
    $order: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const getBranchSapronakStockResponseItemDTO = Type.Object({
  id: Type.String(),
  branchId: Type.String(),
  branchName: Type.String(),
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Number(),
  uom: Type.String(),
});

export const getBranchSapronakStockResponseListDTO = Type.Array(
  getBranchSapronakStockResponseItemDTO,
);

export const getBranchSapronakStockResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getBranchSapronakStockResponseListDTO,
  count: Type.Integer(),
});

export type GetBranchSapronakStockQuery = Static<typeof getBranchSapronakStockQueryDTO>;

export type GetBranchSapronakStockResponseItem = Static<
  typeof getBranchSapronakStockResponseItemDTO
>;

export type GetBranchSapronakStockResponseList = Static<
  typeof getBranchSapronakStockResponseListDTO
>;

export type GetBranchSapronakStockResponse = Static<typeof getBranchSapronakStockResponseDTO>;
