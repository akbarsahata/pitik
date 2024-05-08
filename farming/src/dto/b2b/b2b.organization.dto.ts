import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from '../common.dto';

export const b2bOrganizationItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  code: Type.String(),
  image: Type.String(),
});

export const getB2BOrganizationQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(Type.Pick(b2bOrganizationItemDTO, ['name', 'code'])).properties,
});

export const getB2BOrganizationResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(b2bOrganizationItemDTO),
});

export type GetB2BOrganizationQuery = Static<typeof getB2BOrganizationQueryDTO>;

export type GetB2BOrganizationResponse = Static<typeof getB2BOrganizationResponseDTO>;
