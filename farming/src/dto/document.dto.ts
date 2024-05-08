import { Static, Type } from '@sinclair/typebox';

export const documentResponseItemDTO = Type.Object({
  url: Type.String({ format: 'uri' }),
});

export const documentResponseDTO = Type.Object({
  code: Type.Number(),
  data: documentResponseItemDTO,
});

export const getDocumentByIdentifierKeyValueParamsDTO = Type.Object({
  identifierKey: Type.String(),
  identifierValue: Type.String(),
});

export type GetDocumentByIdentifierKeyValueResponse = Static<typeof documentResponseDTO>;

export type GetDocumentByIdentifierKeyValueRequestParams = Static<
  typeof getDocumentByIdentifierKeyValueParamsDTO
>;
