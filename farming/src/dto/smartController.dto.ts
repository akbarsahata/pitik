import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';

export const sendSmartControllerSettingsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const getSmartControllerSettingsQueryDTO = Type.Object({
  id: Type.String(),
});

export const getSmartControllerSettingsParamsDTO = Type.Object({
  coopId: Type.String(),
});

export const getSmartControllerGeneralSettingsQueryDTO = Type.Object({
  coopId: Type.String(),
  deviceId: Type.String(),
});

export const getSmartControllerCoopSummaryQueryDTO = Type.Object({
  ...getSmartControllerGeneralSettingsQueryDTO.properties,
});

export const getSmartControllerFanSettingsQueryDTO = Type.Object({
  ...getSmartControllerGeneralSettingsQueryDTO.properties,
});

export const getSmartControllerFanDetailSettingsQueryDTO = Type.Object({
  ...getSmartControllerGeneralSettingsQueryDTO.properties,
  id: Type.String(),
});

export const getSmartControllerGrowthDaySettingsQueryDTO = Type.Object({
  ...getSmartControllerGeneralSettingsQueryDTO.properties,
});

export const getSmartControllerLampSettingsQueryDTO = Type.Object({
  ...getSmartControllerGeneralSettingsQueryDTO.properties,
});

export const getSmartControllerCoolerSettingsQueryDTO = Type.Object({
  ...getSmartControllerGeneralSettingsQueryDTO.properties,
});

export const getSmartControllerHeaterSettingsQueryDTO = Type.Object({
  ...getSmartControllerGeneralSettingsQueryDTO.properties,
});

export const getSmartControllerCoopSummaryDetailParamsDTO = Type.Object({
  coopId: Type.String(),
  deviceId: Type.String(),
});

export const getSmartControllerFanDetailSettingsParamsDTO = Type.Object({
  coopId: Type.String(),
  id: Type.String(),
});

export const smartControllerFanSettingDTO = Type.Object({
  id: Type.String(),
  fanName: Type.String(),
  temperatureTarget: Type.Number(),
  periodic: Type.Boolean(),
  intermitten: Type.Boolean(),
  errors: Type.String(),
  status: Type.Boolean(),
  coopId: Type.String(),
});

export const getSmartControllerFanSettingsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Union([smartControllerFanSettingDTO, Type.Object({})]),
});

export const getSmartControllerFanSettingListResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(smartControllerFanSettingDTO),
});

export const getSmartControllerFanDetailSettingResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    id: Type.String(),
    temperatureTarget: Type.Number(),
    onlineDuration: Type.String(),
    offlineDuration: Type.String(),
    intermitten: Type.Boolean(),
  }),
});

export const getSmartControllerCoopDataResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    coopName: Type.String(),
    floor: Type.Array(
      Type.Object({
        id: Type.String(),
        coopId: Type.String(),
        deviceId: Type.String(),
        floorName: Type.String(),
        day: Type.Number(),
        periode: Type.Number(),
        chickinDate: Nullable(Type.String({ type: 'date-time' })),
        temperature: Type.Number(),
        humidity: Type.Number(),
      }),
    ),
  }),
});

export const getSmartControllerCoopSummaryResponseDTO = Type.Union([
  Type.Object({
    code: Type.Number(),
    data: Type.Object({
      growthDay: Type.Object({
        id: Type.String(),
        deviceId: Type.String(),
        temperature: Type.Number(),
        day: Type.Number(),
        status: Type.Boolean(),
      }),
      fan: Type.Object({
        id: Type.String(),
        deviceId: Type.String(),
        online: Type.Number(),
        offline: Type.Number(),
        status: Type.Boolean(),
      }),
      heater: Type.Object({
        id: Type.String(),
        deviceId: Type.String(),
        temperature: Type.Number(),
        status: Type.Boolean(),
      }),
      cooler: Type.Object({
        id: Type.String(),
        deviceId: Type.String(),
        temperature: Type.Number(),
        status: Type.Boolean(),
      }),
      lamp: Type.Object({
        id: Type.String(),
        deviceId: Type.String(),
        name: Type.String(),
        onlineTime: Type.String(),
        offlineTime: Type.String(),
        status: Type.Boolean(),
      }),
      alarm: Type.Object({
        id: Type.String(),
        deviceId: Type.String(),
        cold: Type.Number(),
        hot: Type.Number(),
      }),
      resetTime: Type.Object({
        id: Type.String(),
        deviceId: Type.String(),
        onlineTime: Type.String(),
      }),
    }),
  }),
  Type.Object({
    code: Type.Number(),
    data: Type.Any(),
  }),
]);

export const getSmartControllerGrowthDaySettingsResponseDTO = Type.Union([
  Type.Object({
    code: Type.Number(),
    data: Type.Object({
      requestTemperature: Type.Number(),
      growthDay: Type.Number(),
      temperature: Type.Number(),
      temperatureReduction: Type.Array(
        Type.Object({
          group: Type.String(),
          day: Type.Number(),
          reduction: Type.Number(),
        }),
      ),
    }),
  }),
  Type.Object({
    code: Type.Number(),
    data: Type.Any(),
  }),
]);

export const getSmartControllerLampSettingsResponseDTO = Type.Union([
  Type.Object({
    code: Type.Number(),
    data: Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        onlineTime: Type.String(),
        offlineTime: Type.String(),
        isOnline: Type.Boolean(),
        error: Type.Boolean(),
        status: Type.Boolean(),
      }),
    ),
  }),
  Type.Object({
    code: Type.Number(),
    data: Type.Any(),
  }),
]);

export const getSmartControllerCoolerSettingsResponseDTO = Type.Union([
  Type.Object({
    code: Type.Number(),
    data: Type.Object({
      id: Type.String(),
      temperatureTarget: Type.Number(),
      onlineDuration: Type.String(),
      offlineDuration: Type.String(),
    }),
  }),
  Type.Object({
    code: Type.Number(),
    data: Type.Any(),
  }),
]);

export const getSmartControllerHeaterSettingsResponseDTO = Type.Union([
  Type.Object({
    code: Type.Number(),
    data: Type.Object({
      id: Type.String(),
      temperatureTarget: Type.Number(),
    }),
  }),
  Type.Object({
    code: Type.Number(),
    data: Type.Any(),
  }),
]);

export const sendSmartControllerGrowthDaySettingBodyDTO = Type.Object({
  deviceId: Type.String(),
  temperature: Type.Number(),
  requestTemperature: Type.Number(),
  growthDay: Type.Number(),
  temperatureReduction: Type.Array(
    Type.Object({
      day: Type.Number(),
      // TODO: this is workaround: change to Type.Number() instead, after b2b app updated
      group: Type.Any(),
      reduction: Type.Number(),
    }),
  ),
});

export const sendSmartControllerSettingsParamsDTO = Type.Object({
  coopCode: Type.String(),
  settingType: Type.String(),
  payload: Type.Object({
    ...Type.Partial(sendSmartControllerGrowthDaySettingBodyDTO).properties,
    deviceId: Type.String(),
  }),
});

export type SendSmartControllerSettingsResponseDTO = Static<
  typeof sendSmartControllerSettingsResponseDTO
>;

export type GetSmartControllerSettingsParamsDTO = Static<
  typeof getSmartControllerSettingsParamsDTO
>;

export type GetSmartControllerSettingsQueryDTO = Static<typeof getSmartControllerSettingsQueryDTO>;

export type GetSmartControllerCoopSummaryQueryDTO = Static<
  typeof getSmartControllerCoopSummaryQueryDTO
>;

export type GetSmartControllerFanSettingsQueryDTO = Static<
  typeof getSmartControllerFanSettingsQueryDTO
>;

export type GetSmartControllerFanDetailSettingsQueryDTO = Static<
  typeof getSmartControllerFanDetailSettingsQueryDTO
>;

export type GetSmartControllerSettingsGrowthDayQueryDTO = Static<
  typeof getSmartControllerGrowthDaySettingsQueryDTO
>;

export type GetSmartControllerLampSettingsQueryDTO = Static<
  typeof getSmartControllerLampSettingsQueryDTO
>;

export type GetSmartControllerCoolerSettingsQueryDTO = Static<
  typeof getSmartControllerCoolerSettingsQueryDTO
>;

export type GetSmartControllerHeaterSettingsQueryDTO = Static<
  typeof getSmartControllerHeaterSettingsQueryDTO
>;

export type SendSmartControllerSettingsParamsDTO = Static<
  typeof sendSmartControllerSettingsParamsDTO
>;

export type GetSmartControllerFanDetailSettingsParamsDTO = Static<
  typeof getSmartControllerFanDetailSettingsParamsDTO
>;

export type GetSmartControllerFanSettingsResponseDTO = Static<
  typeof getSmartControllerFanSettingsResponseDTO
>;

export type GetSmartControllerFanSettingListResponseDTO = Static<
  typeof getSmartControllerFanSettingListResponseDTO
>;

export type GetSmartControllerCoopSummaryDetailParamsDTO = Static<
  typeof getSmartControllerCoopSummaryDetailParamsDTO
>;

export type GetSmartControllerGrowthDaySettingsResponseDTO = Static<
  typeof getSmartControllerGrowthDaySettingsResponseDTO
>;

export type GetSmartControllerLampSettingsResponseDTO = Static<
  typeof getSmartControllerLampSettingsResponseDTO
>;

export type GetSmartControllerCoolerSettingsResponseDTO = Static<
  typeof getSmartControllerCoolerSettingsResponseDTO
>;

export type GetSmartControllerHeaterSettingsResponseDTO = Static<
  typeof getSmartControllerHeaterSettingsResponseDTO
>;

export type GetSmartControllerCoopDataResponseDTO = Static<
  typeof getSmartControllerCoopDataResponseDTO
>;

export type GetSmartControllerCoopSummaryResponseDTO = Static<
  typeof getSmartControllerCoopSummaryResponseDTO
>;

export type SendSmartControllerGrowthDaySettingBody = Static<
  typeof sendSmartControllerGrowthDaySettingBodyDTO
>;
