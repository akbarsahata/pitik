import { Static, Type } from '@sinclair/typebox';
import { USER_TYPE_B2B_EXTERNAL } from '../../libs/constants';
import { paginationDTO } from '../common.dto';

export const b2bRoleResponseItem = Type.Object({ id: Type.String(), name: Type.String() });

export const b2bOrganizationMemberInfoDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  phoneNumber: Type.String(),
  waNumber: Type.String(),
  role: Type.String(),
  roles: Type.Array(b2bRoleResponseItem),
  organizationId: Type.String(),
  organizationName: Type.String(),
  createdDate: Type.String(),
});

export const b2bOrganizationMemberInfoResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object(b2bOrganizationMemberInfoDTO).properties,
});

export const createB2BOrganizationMemberFmsDTO = Type.Object({
  organizationId: Type.String(),
  userId: Type.String(),
  name: Type.String(),
  userType: Type.Enum(USER_TYPE_B2B_EXTERNAL),
  status: Type.Boolean({ default: true }),
  ownerId: Type.Optional(Type.String()),
});

export const b2bOrganizationMemberItemDTO = Type.Object({
  id: Type.String(),
  organization: Type.Object({
    id: Type.String(),
    name: Type.String(),
    image: Type.String(),
  }),
  user: Type.Object({
    id: Type.String(),
    name: Type.String(),
    code: Type.String(),
    role: Type.String(),
    email: Type.String(),
    phoneNumber: Type.String(),
    waNumber: Type.String(),
    status: Type.Boolean(),
    modifiedBy: Type.String(),
    modifiedDate: Type.String(),
  }),
});

export const b2bOrganizationMemberQueryDTO = Type.Object({
  name: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean({ default: true })),
});

export const getB2BOrganizationMemberParamDTO = Type.Object({
  memberId: Type.String(),
});

export const getB2BOrganizationMemberListQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(b2bOrganizationMemberQueryDTO).properties,
});

export const getB2BOrganizationMemberListResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(b2bOrganizationMemberItemDTO),
});

export const getB2BOrganizationMemberDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: b2bOrganizationMemberItemDTO,
});

export type GetB2BOrganizationMemberItemResponse = Static<typeof b2bOrganizationMemberInfoDTO>;

export type GetB2BOrganizationMemberInfoResponse = Static<
  typeof b2bOrganizationMemberInfoResponseDTO
>;

export type CreateB2BOrganizationMemberFms = Static<typeof createB2BOrganizationMemberFmsDTO>;

export type B2BOrganizationMemberItem = Static<typeof b2bOrganizationMemberItemDTO>;

export type GetB2BOrganizationMemberListQuery = Static<typeof getB2BOrganizationMemberListQueryDTO>;

export type GetB2BOrganizationMemberParams = Static<typeof getB2BOrganizationMemberParamDTO>;

export type GetB2BOrganizationMemberDetailResponse = Static<
  typeof getB2BOrganizationMemberDetailResponseDTO
>;

export type GetB2BOrganizationMemberListResponse = Static<
  typeof getB2BOrganizationMemberListResponseDTO
>;
