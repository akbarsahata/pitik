import { Type } from '@sinclair/typebox';

export const paginationDTO = Type.Object({
  $page: Type.Number(),
  $limit: Type.Number(),
  $order: Type.String(),
});
