import { Type } from '@sinclair/typebox';

export const benchmarkedDTO = Type.Object({
  dayNum: Type.Number(),
  current: Type.Number(),
  benchmark: Type.Number(),
});

export const targettedDTO = Type.Object({
  actual: Type.Number(),
  target: Type.Object({
    max: Type.Number(),
    min: Type.Number(),
  }),
});

export const paginationDTO = Type.Object({
  $page: Type.Number(),
  $limit: Type.Number(),
  $order: Type.String(),
});
