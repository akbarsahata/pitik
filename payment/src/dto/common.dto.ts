import { Static, Type } from '@sinclair/typebox';

export const okMessageDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export type OkMessage = Static<typeof okMessageDTO>;
