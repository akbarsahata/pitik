import { Static, Type } from '@sinclair/typebox';

export const createB2BSmartControllerBodyDTO = Type.Object({
  coopId: Type.String(),
  roomId: Type.String(),
  mac: Type.String(),
});

export const createB2BSmartControllerItemResponseDTO = Type.Object({
  id: Type.String(),
  coopId: Type.String(),
  roomId: Type.String(),
  mac: Type.String(),
});

export const createB2BSmartControllerResponseDTO = Type.Object({
  code: Type.Number(),
  data: createB2BSmartControllerItemResponseDTO,
});

export const editB2BSmartControllerParamDTO = Type.Object({
  deviceId: Type.String(),
});

export const editB2BSmartControllerBodyDTO = Type.Object({
  deviceName: Type.String(),
});

export const editB2BSmartControllerItemResponseDTO = Type.Object({
  deviceName: Type.String(),
  deviceId: Type.String(),
});

export const editB2BSmartControllerResponseDTO = Type.Object({
  code: Type.Number(),
  data: editB2BSmartControllerItemResponseDTO,
});

export type CreateB2BSmartControllerBody = Static<typeof createB2BSmartControllerBodyDTO>;

export type CreateB2BSmartControllerItemResponse = Static<
  typeof createB2BSmartControllerItemResponseDTO
>;

export type CreateB2BSmartControllerResponse = Static<typeof createB2BSmartControllerResponseDTO>;

export type EditB2BSmartControllerParam = Static<typeof editB2BSmartControllerParamDTO>;

export type EditB2BSmartControllerBody = Static<typeof editB2BSmartControllerBodyDTO>;

export type EditB2BSmartControllerItemResponse = Static<
  typeof editB2BSmartControllerItemResponseDTO
>;

export type EditB2BSmartControllerResponse = Static<typeof editB2BSmartControllerResponseDTO>;
