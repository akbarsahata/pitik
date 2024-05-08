import { Type } from '@sinclair/typebox';

export const healthResponseDTO = Type.Object({
  uptime: Type.Number(),
  date: Type.String(),
  status: Type.String(),
});
