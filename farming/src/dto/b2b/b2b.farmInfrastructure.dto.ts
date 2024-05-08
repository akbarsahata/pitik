import { Static, Type } from '@sinclair/typebox';

export const b2bGetFarmListResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(
    Type.Object({
      farmId: Type.String(),
      farmName: Type.String(),
      farmCode: Type.String(),
    }),
  ),
});

export const b2bGetCoopListResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(
    Type.Object({
      coopId: Type.String(),
      coopName: Type.String(),
      coopCode: Type.String(),
    }),
  ),
});

export const getB2BRoomItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  level: Type.Number(),
  status: Type.String(),
  devices: Type.Array(
    Type.Optional(
      Type.Object({
        mac: Type.String(),
        deviceId: Type.String(),
        deviceName: Type.String(),
        deviceType: Type.String(),
        deviceSummary: Type.Optional(Type.Any()),
        sensorCount: Type.Number(),
      }),
    ),
  ),
});

export const getB2BFarmInfrastructureHomeItemResponseDTO = Type.Object({
  farm: Type.Object({
    id: Type.String(),
    name: Type.String(),
    code: Type.String(),
  }),
  organization: Type.Object({
    id: Type.String(),
    name: Type.String(),
    image: Type.String(),
  }),
  coops: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        status: Type.String(),
        room: Type.Object({
          ...getB2BRoomItemDTO.properties,
          devices: Type.Optional(Type.Any()),
        }),
      }),
    ),
  ),
});

export const getB2BFarmInfrastructureHomeResponseDTO = Type.Object({
  code: Type.Number(),
  data: getB2BFarmInfrastructureHomeItemResponseDTO,
});

export const getB2BFarmInfrastructureCoopListItemResponseDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const getB2BFarmInfrastructureCoopListResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(getB2BFarmInfrastructureCoopListItemResponseDTO),
  count: Type.Number(),
});

export const createB2BFarmInfrastructureCoopBodyDTO = Type.Object({
  farmId: Type.String(),
  coopName: Type.String(),
  coopType: Type.String(),
  rooms: Type.Array(
    Type.Object({
      id: Type.Optional(Type.String()),
      level: Type.Number(),
      name: Type.String(),
    }),
  ),
  ownerId: Type.Optional(Type.String()),
});

export const createB2BFarmInfrastructureCoopItemResponseDTO = Type.Object({
  farmId: Type.String(),
  coopId: Type.String(),
  coopName: Type.String(),
  coopType: Type.String(),
  rooms: Type.Array(
    Type.Object({
      id: Type.Optional(Type.String()),
      name: Type.String(),
      level: Type.Number(),
      status: Type.Optional(Type.String({ default: 'active' })),
    }),
  ),
});

export const createB2BFarmInfrastructureCoopResponseDTO = Type.Object({
  code: Type.Number(),
  data: createB2BFarmInfrastructureCoopItemResponseDTO,
});

export const deleteB2BFarmInfrastructureCoopParamDTO = Type.Object({
  coopId: Type.String(),
});

export const deleteB2BFarmInfrastructureCoopResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const getB2BFarmInfrastructureCoopParamDTO = Type.Object({
  coopId: Type.String(),
});

export const getB2BFarmInfrastructureCoopItemResponseDTO = Type.Object({
  id: Type.String(),
  coopName: Type.String(),
  coopType: Type.String(),
  rooms: Type.Array(getB2BRoomItemDTO),
});

export const getB2BFarmInfrastructureCoopResponseDTO = Type.Object({
  code: Type.Number(),
  data: getB2BFarmInfrastructureCoopItemResponseDTO,
});

export const getB2BFarmInfrastructureCoopRoomParamDTO = Type.Object({
  coopId: Type.String(),
  roomId: Type.String(),
});

export const getB2BFarmInfrastructureCoopRoomItemResponseDTO = Type.Object({
  coopId: Type.String(),
  coopName: Type.String(),
  coopStatus: Type.String(),
  coopType: Type.String(),
  room: getB2BRoomItemDTO,
});

export const getB2BFarmInfrastructureCoopRoomResponseDTO = Type.Object({
  code: Type.Number(),
  data: getB2BFarmInfrastructureCoopRoomItemResponseDTO,
});

export const patchB2BFarmInfrastructureCoopRoomParamDTO = Type.Object({
  coopId: Type.String(),
  roomId: Type.String(),
});

export const patchB2BFarmInfrastructureCoopParamDTO = Type.Object({
  coopId: Type.String(),
});

export const patchB2BFarmInfrastructureCoopRoomBodyDTO = Type.Object({
  coopName: Type.String(),
  coopType: Type.KeyOf(
    Type.Object({
      'Open House': Type.String(),
      'Semi House': Type.String(),
      'Closed House': Type.String(),
    }),
  ),
  coopStatus: Type.KeyOf(
    Type.Object({
      active: Type.String(),
      inactive: Type.String(),
    }),
  ),
  room: Type.Object({
    name: Type.String(),
    level: Type.Number(),
    status: Type.KeyOf(
      Type.Object({
        active: Type.String(),
        inactive: Type.String(),
      }),
    ),
  }),
});

export const patchB2BFarmInfrastructureCoopRoomItemResponseDTO = Type.Object({
  ...patchB2BFarmInfrastructureCoopRoomBodyDTO.properties,
});

export const patchB2BFarmInfrastructureCoopRoomResponseDTO = Type.Object({
  code: Type.Number(),
  data: patchB2BFarmInfrastructureCoopRoomItemResponseDTO,
});

export const patchB2BFarmInfrastructureCoopBodyDTO = Type.Object({
  ...createB2BFarmInfrastructureCoopBodyDTO.properties,
  farmId: Type.Optional(Type.String()),
});

export const patchB2BFarmInfrastructureCoopItemResponseDTO = Type.Object({
  farmId: Type.String(),
  coopId: Type.String(),
  coopName: Type.String(),
  coopType: Type.String(),
  rooms: Type.Array(
    Type.Object({
      level: Type.Number(),
      name: Type.String(),
    }),
  ),
});

export const patchDeactivateB2BFarmInfrastructureCoopParamDTO = Type.Object({
  ...patchB2BFarmInfrastructureCoopParamDTO.properties,
  action: Type.KeyOf(
    Type.Object({
      activate: Type.String(),
      deactivate: Type.String(),
    }),
  ),
});

export const patchDeactivateB2BFarmInfrastructureCoopResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const patchB2BFarmInfrastructureCoopResponseDTO = Type.Object({
  code: Type.Number(),
  data: patchB2BFarmInfrastructureCoopItemResponseDTO,
});

export type GetB2BFarmListResponse = Static<typeof b2bGetFarmListResponseDTO>;

export type GetB2BCoopListResponse = Static<typeof b2bGetCoopListResponseDTO>;

export type GetB2BFarmInfrastructureHomeItemResponse = Static<
  typeof getB2BFarmInfrastructureHomeItemResponseDTO
>;

export type GetB2BFarmInfrastructureHomeResponse = Static<
  typeof getB2BFarmInfrastructureHomeResponseDTO
>;

export type GetB2BFarmInfrastructureCoopListItemResponse = Static<
  typeof getB2BFarmInfrastructureCoopListItemResponseDTO
>;

export type GetB2BFarmInfrastructureCoopListResponse = Static<
  typeof getB2BFarmInfrastructureCoopListResponseDTO
>;

export type CreateB2BFarmInfrastructureCoopBody = Static<
  typeof createB2BFarmInfrastructureCoopBodyDTO
>;

export type CreateB2BFarmInfrastructureCoopItemResponse = Static<
  typeof createB2BFarmInfrastructureCoopItemResponseDTO
>;

export type CreateB2BFarmInfrastructureCoopResponse = Static<
  typeof createB2BFarmInfrastructureCoopResponseDTO
>;

export type DeleteB2BFarmInfrastructureCoopParam = Static<
  typeof deleteB2BFarmInfrastructureCoopParamDTO
>;

export type DeleteB2BFarmInfrastructureCoopResponse = Static<
  typeof deleteB2BFarmInfrastructureCoopResponseDTO
>;

export type GetB2BFarmInfraStructureCoopParam = Static<typeof getB2BFarmInfrastructureCoopParamDTO>;

export type GetB2BFarmInfrastructureCoopItemResponse = Static<
  typeof getB2BFarmInfrastructureCoopItemResponseDTO
>;

export type GetB2BFarmInfrastructureCoopResponse = Static<
  typeof getB2BFarmInfrastructureCoopResponseDTO
>;

export type GetB2BFarmInfrastructureCoopRoomParam = Static<
  typeof getB2BFarmInfrastructureCoopRoomParamDTO
>;

export type GetB2BFarmInfrastructureCoopRoomItemResponse = Static<
  typeof getB2BFarmInfrastructureCoopRoomItemResponseDTO
>;

export type GetB2BFarmInfrastructureCoopRoomResponse = Static<
  typeof getB2BFarmInfrastructureCoopRoomResponseDTO
>;

export type PatchB2BFarmInfrastructureCoopRoomParam = Static<
  typeof patchB2BFarmInfrastructureCoopRoomParamDTO
>;

export type PatchB2BFarmInfrastructureCoopParam = Static<
  typeof patchB2BFarmInfrastructureCoopParamDTO
>;

export type PatchB2BFarmInfrastructureCoopRoomBody = Static<
  typeof patchB2BFarmInfrastructureCoopRoomBodyDTO
>;

export type PatchB2BFarmInfrastructureCoopBody = Static<
  typeof patchB2BFarmInfrastructureCoopBodyDTO
>;

export type PatchB2BFarmInfrastructureCoopRoomItemResponse = Static<
  typeof patchB2BFarmInfrastructureCoopRoomItemResponseDTO
>;

export type PatchB2BFarmInfrastructureCoopItemResponse = Static<
  typeof patchB2BFarmInfrastructureCoopItemResponseDTO
>;

export type PatchB2BFarmInfrastructureCoopRoomResponse = Static<
  typeof patchB2BFarmInfrastructureCoopRoomResponseDTO
>;

export type PatchB2BFarmInfrastructureCoopResponse = Static<
  typeof patchB2BFarmInfrastructureCoopResponseDTO
>;

export type PatchDeactivateB2BFarmInfrastructureCoopParam = Static<
  typeof patchDeactivateB2BFarmInfrastructureCoopParamDTO
>;

export type PatchDeactivateB2BFarmInfrastructureCoopResponse = Static<
  typeof patchDeactivateB2BFarmInfrastructureCoopResponseDTO
>;
