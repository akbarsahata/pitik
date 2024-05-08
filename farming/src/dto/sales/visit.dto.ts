import { Static, Type } from '@sinclair/typebox';
import {
  SalesLeadStatus,
  SalesProspect,
} from '../../datasources/entity/pgsql/sales/CustomerVisit.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const customerProductItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  dailyQuantity: Type.Number(),
  uom: Nullable(Type.String()),
  value: Nullable(Type.Number()),
  category: productCategoryDTO,
  price: Type.Number({ minimum: 1000 }),
});

export const salespersonItemDTO = Type.Object({
  id: Type.String(),
  email: Type.String(),
});

export const orderIssueCategoryItemDTO = Type.Object({
  id: Type.String(),
  title: Type.Optional(Type.String()),
});

export const visitItemDTO = Type.Object({
  createdDate: Type.String(),
  id: Type.String(),
  latitude: Type.Number(),
  longitude: Type.Number(),
  leadStatus: Type.Enum(SalesLeadStatus),
  orderIssue: Type.Boolean(),
  orderIssueCategories: Type.Array(orderIssueCategoryItemDTO),
  products: Type.Array(customerProductItemDTO),
  prospect: Type.Enum(SalesProspect),
  remarks: Nullable(Type.String()),
  salespersonId: Type.String(),
  salesperson: salespersonItemDTO,
});

export const createVisitParamDTO = Type.Object({
  customerId: Type.String(),
});

export const createVisitBodyDTO = Type.Object(
  {
    ...Type.Pick(visitItemDTO, ['leadStatus', 'prospect', 'orderIssue', 'latitude', 'longitude'])
      .properties,
    ...Type.Optional(Type.Pick(visitItemDTO, ['orderIssueCategories', 'remarks'])).properties,
    products: Type.Array(customerProductItemDTO),
  },
  { additionalProperties: false },
);

export const createVisitResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const getVisitParamDTO = Type.Object({
  customerId: Type.String(),
  visitId: Type.String(),
});

export const getVisitByIdResponseItemDTO = Type.Object({
  ...Type.Pick(visitItemDTO, [
    'id',
    'leadStatus',
    'prospect',
    'orderIssue',
    'orderIssueCategories',
    'latitude',
    'longitude',
    'salesperson',
    'remarks',
  ]).properties,
  products: Type.Array(customerProductItemDTO),
});

export const getVisitResponseDTO = Type.Object({
  code: Type.Number(),
  data: getVisitByIdResponseItemDTO,
});

export const getVisitListParamDTO = Type.Object({
  customerId: Type.String(),
});

export const getVisitListQueryDTO = Type.Object({
  ...Type.Omit(Type.Partial(paginationDTO), ['$order']).properties,
});

export const getVisitListItemDTO = Type.Pick(visitItemDTO, [
  'id',
  'createdDate',
  'leadStatus',
  'salesperson',
]);

export const getVisitListResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getVisitListItemDTO),
});

export const checkInBodyDTO = Type.Pick(visitItemDTO, ['latitude', 'longitude']);

export const checkInResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    distance: Type.Number(),
  }),
});

export type CustomerProductItem = Static<typeof customerProductItemDTO>;

export type VisitItem = Static<typeof visitItemDTO>;

export type CreateVisitParam = Static<typeof createVisitParamDTO>;

export type CreateVisitBody = Static<typeof createVisitBodyDTO>;

export type CreateVisitResponse = Static<typeof createVisitResponseDTO>;

export type GetVisitParam = Static<typeof getVisitParamDTO>;

export type GetVisitByIdResponseItem = Static<typeof getVisitByIdResponseItemDTO>;

export type GetVisitResponse = Static<typeof getVisitResponseDTO>;

export type GetVisitListParam = Static<typeof getVisitListParamDTO>;

export type GetVisitListQuery = Static<typeof getVisitListQueryDTO>;

export type GetVisitListItem = Static<typeof getVisitListItemDTO>;

export type GetVisitListResponse = Static<typeof getVisitListResponseDTO>;

export type CheckInBody = Static<typeof checkInBodyDTO>;

export type CheckInResponse = Static<typeof checkInResponseDTO>;
