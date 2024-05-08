import { Static, Type } from '@sinclair/typebox';
import { GR_STATUS } from '../../datasources/entity/pgsql/sales/GoodsReceived.entity';
import { InternalTransferStatusEnum } from '../../datasources/entity/pgsql/sales/InternalTransfer.entity';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const userItemDTO = Type.Object(
  {
    id: Type.String(),
    fullName: Type.String(),
  },
  {
    additionalProperties: false,
  },
);

export const operationUnitItemDTO = Type.Object({
  id: Type.String(),
  operationUnitName: Type.String(),
  type: Type.Enum(OperationUnitTypeEnum),
});

export const productItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  quantity: Type.Number(),
  weight: Type.Number(),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  totalQuantity: Type.Number(),
  totalWeight: Type.Number(),
  quantityUOM: Nullable(Type.String()),
  weightUOM: Nullable(Type.String()),
  productItems: Type.Array(productItemDTO, { default: [] }),
});

export const productsInGoodsReceivedItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  productItem: Type.Optional(productItemDTO),
  price: Nullable(Type.Number()),
  quantity: Type.Optional(Type.Number()),
  weight: Type.Number(),
});

export const goodsReceivedItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  status: Type.Enum(GR_STATUS),
  products: Type.Array(productsInGoodsReceivedItemDTO),
});

export const internalTransferItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  remarks: Type.Optional(Nullable(Type.String())),
  driverRemarks: Type.Optional(Nullable(Type.String())),
  targetOperationUnitId: Type.String(),
  sourceOperationUnitId: Type.String(),
  status: Type.Enum(InternalTransferStatusEnum),
  goodsReceived: Nullable(goodsReceivedItemDTO),
  driverId: Nullable(Type.String()),
  createdBy: Type.String(),
  createdDate: Type.String(),
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
  targetOperationUnit: operationUnitItemDTO,
  sourceOperationUnit: operationUnitItemDTO,
  driver: Nullable(userItemDTO),
  products: Type.Array(productCategoryDTO),
});

export const internalTransferIdParamDTO = Type.Object({
  id: Type.String(),
});

export const internalTransferPickUpBodyDTO = Type.Object({
  driverRemarks: Type.Optional(Type.String()),
});

export const productInInternalTransferItemBodyDTO = Type.Object(
  {
    productItemId: Type.String(),
    quantity: Type.Number({ default: 0, minimum: 0 }),
    weight: Type.Number({ default: 0, minimum: 0 }),
  },
  {
    additionalProperties: false,
  },
);

export const internalTransferFormDTO = Type.Object(
  {
    ...Type.Pick(internalTransferItemDTO, [
      'targetOperationUnitId',
      'sourceOperationUnitId',
      'status',
      'remarks',
      'driverRemarks',
    ]).properties,
    products: Type.Array(productInInternalTransferItemBodyDTO),
  },
  {
    additionalProperties: false,
  },
);

export const getInternalTransfersQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(
    Type.Pick(internalTransferItemDTO, [
      'targetOperationUnitId',
      'sourceOperationUnitId',
      'createdBy',
      'code',
      'driverId',
    ]),
  ).properties,
  status: Type.Optional(
    Type.Union([
      Type.Array(Type.Enum(InternalTransferStatusEnum)),
      Type.Enum(InternalTransferStatusEnum),
    ]),
  ),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  productCategoryId: Type.Optional(Type.String()),
  productItemId: Type.Optional(Type.String()),
  source: Type.Optional(Type.Enum(OperationUnitTypeEnum)),
});

export const internalTransferDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: internalTransferItemDTO,
});

export const internalTransferListResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(internalTransferItemDTO),
});

export const okResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const internalTransfersetDriverDTO = Type.Pick(internalTransferItemDTO, ['driverId']);

export const internalTransferDeliveredBodyDTO = Type.Object({
  latitude: Type.Number(),
  longitude: Type.Number(),
  driverRemarks: Type.Optional(Nullable(Type.String())),
});

export const checkInBodyDTO = Type.Object({
  latitude: Type.Number(),
  longitude: Type.Number(),
});

export const checkInResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    distance: Type.Number(),
  }),
});

export type InternalTransferItem = Static<typeof internalTransferItemDTO>;

export type InternalTransferIdParam = Static<typeof internalTransferIdParamDTO>;

export type InternalTransferPickUpBody = Static<typeof internalTransferPickUpBodyDTO>;

export type InternalTransferForm = Static<typeof internalTransferFormDTO>;

export type GetInternalTransfersQuery = Static<typeof getInternalTransfersQueryDTO>;

export type InternalTransferDetailResponse = Static<typeof internalTransferDetailResponseDTO>;

export type InternalTransferListResponse = Static<typeof internalTransferListResponseDTO>;

export type OkResponse = Static<typeof okResponseDTO>;

export type InternalTransfersetDriver = Static<typeof internalTransfersetDriverDTO>;

export type InternalTransferDeliveredBody = Static<typeof internalTransferDeliveredBodyDTO>;

export type CheckInBody = Static<typeof checkInBodyDTO>;

export type CheckInResponse = Static<typeof checkInResponseDTO>;

export type ProductCategory = Static<typeof productCategoryDTO>;
