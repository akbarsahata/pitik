import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  CreateB2BSmartControllerBody,
  createB2BSmartControllerBodyDTO,
  CreateB2BSmartControllerResponse,
  createB2BSmartControllerResponseDTO,
  EditB2BSmartControllerBody,
  editB2BSmartControllerBodyDTO,
  EditB2BSmartControllerParam,
  editB2BSmartControllerParamDTO,
  EditB2BSmartControllerResponse,
  editB2BSmartControllerResponseDTO,
} from '../../../dto/b2b/b2b.smartController.dto';
import {
  GetSmartControllerCoolerSettingsQueryDTO,
  getSmartControllerCoolerSettingsQueryDTO,
  GetSmartControllerCoolerSettingsResponseDTO,
  getSmartControllerCoolerSettingsResponseDTO,
  GetSmartControllerCoopDataResponseDTO,
  getSmartControllerCoopDataResponseDTO,
  GetSmartControllerCoopSummaryDetailParamsDTO,
  getSmartControllerCoopSummaryDetailParamsDTO,
  GetSmartControllerCoopSummaryQueryDTO,
  getSmartControllerCoopSummaryQueryDTO,
  GetSmartControllerCoopSummaryResponseDTO,
  getSmartControllerCoopSummaryResponseDTO,
  getSmartControllerFanDetailSettingResponseDTO,
  GetSmartControllerFanDetailSettingsQueryDTO,
  getSmartControllerFanDetailSettingsQueryDTO,
  getSmartControllerFanSettingListResponseDTO,
  GetSmartControllerFanSettingListResponseDTO,
  GetSmartControllerFanSettingsQueryDTO,
  getSmartControllerFanSettingsQueryDTO,
  GetSmartControllerFanSettingsResponseDTO,
  getSmartControllerGrowthDaySettingsQueryDTO,
  GetSmartControllerGrowthDaySettingsResponseDTO,
  getSmartControllerGrowthDaySettingsResponseDTO,
  getSmartControllerHeaterSettingsQueryDTO,
  GetSmartControllerHeaterSettingsQueryDTO,
  GetSmartControllerHeaterSettingsResponseDTO,
  getSmartControllerHeaterSettingsResponseDTO,
  GetSmartControllerLampSettingsQueryDTO,
  getSmartControllerLampSettingsQueryDTO,
  GetSmartControllerLampSettingsResponseDTO,
  getSmartControllerLampSettingsResponseDTO,
  GetSmartControllerSettingsGrowthDayQueryDTO,
  GetSmartControllerSettingsParamsDTO,
  getSmartControllerSettingsParamsDTO,
  GetSmartControllerSettingsQueryDTO,
  getSmartControllerSettingsQueryDTO,
  SendSmartControllerGrowthDaySettingBody,
  sendSmartControllerGrowthDaySettingBodyDTO,
  SendSmartControllerSettingsResponseDTO,
  sendSmartControllerSettingsResponseDTO,
} from '../../../dto/smartController.dto';
import { MQTT_CONTROLLER_SETTING_TYPES } from '../../../libs/constants/mqttMessage';
import {
  SetAlarmSettingPayload,
  SetCoolerSettingPayload,
  SetHeaterSettingPayload,
  SetLampSettingPayload,
} from '../../../mqtt/publisher/smartController.publisher';
import { B2BSmartControllerService } from '../../../services/b2b/b2b.smartController.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b/iot-devices/smart-controller',
  type: 0,
  tags: [{ name: 'b2b-iot-devices-smart-controller' }],
})
export class B2BSmartControllerController {
  @Inject(B2BSmartControllerService)
  private service!: B2BSmartControllerService;

  @POST({
    url: '/register',
    options: {
      schema: {
        body: createB2BSmartControllerBodyDTO,
        response: {
          '2xx': createB2BSmartControllerResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createB2BSmartController(
    req: FastifyRequest<{
      Body: CreateB2BSmartControllerBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateB2BSmartControllerResponse> {
    const data = await this.service.createSmartController(req.body, req.user);

    reply.code(201);

    return {
      code: 201,
      data,
    };
  }

  @PATCH({
    url: '/:deviceId/rename',
    options: {
      schema: {
        params: editB2BSmartControllerParamDTO,
        body: editB2BSmartControllerBodyDTO,
        response: {
          200: editB2BSmartControllerResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async renameB2BSmartController(
    req: FastifyRequest<{
      Params: EditB2BSmartControllerParam;
      Body: EditB2BSmartControllerBody;
    }>,
  ): Promise<EditB2BSmartControllerResponse> {
    const data = await this.service.renameB2BSmartController(req.params, req.body, req.user);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/coop',
    options: {
      schema: {
        querystring: getSmartControllerSettingsQueryDTO,
        response: {
          200: getSmartControllerCoopDataResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getCoop(
    req: FastifyRequest<{
      Querystring: GetSmartControllerSettingsQueryDTO;
    }>,
  ): Promise<GetSmartControllerCoopDataResponseDTO> {
    const data = await this.service.getCoopData(req.query.id);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/coop/summary',
    options: {
      schema: {
        querystring: getSmartControllerCoopSummaryQueryDTO,
        response: {
          200: getSmartControllerCoopSummaryResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getCoopSummary(
    req: FastifyRequest<{
      Querystring: GetSmartControllerCoopSummaryQueryDTO;
    }>,
  ): Promise<GetSmartControllerCoopSummaryResponseDTO> {
    const data = await this.service.getControllerCoopSummarySetting(req.query);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/coop/summary/get-data/:coopId/:deviceId',
    options: {
      schema: {
        params: getSmartControllerCoopSummaryDetailParamsDTO,
        response: {
          200: getSmartControllerCoopSummaryResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getCoopSummaryDetail(
    req: FastifyRequest<{
      Params: GetSmartControllerCoopSummaryDetailParamsDTO;
    }>,
  ): Promise<GetSmartControllerCoopSummaryResponseDTO> {
    const data = await this.service.getControllerCoopSummarySetting(req.params);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/coop/fan/:coopId',
    options: {
      schema: {
        params: getSmartControllerSettingsParamsDTO,
        response: {
          200: sendSmartControllerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async sendFanSetting(
    req: FastifyRequest<{
      Params: GetSmartControllerSettingsParamsDTO;
      Body: {
        id: string;
        temperatureTarget: number;
        timeOnFan: string;
        timeOffFan: string;
        intermittentFan: boolean;
        deviceId: string;
      };
    }>,
  ): Promise<SendSmartControllerSettingsResponseDTO> {
    const payload = {
      ...req.body,
      temperatureFan: req.body.temperatureTarget,
    };

    await this.service.sendControllerSetting({
      payload,
      coopCode: req.params.coopId,
      settingType: MQTT_CONTROLLER_SETTING_TYPES.FAN,
    });

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @GET({
    url: '/coop/fan',
    options: {
      schema: {
        querystring: getSmartControllerFanSettingsQueryDTO,
        response: {
          200: getSmartControllerFanSettingListResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getFanList(
    req: FastifyRequest<{
      Querystring: GetSmartControllerFanSettingsQueryDTO;
    }>,
  ): Promise<GetSmartControllerFanSettingListResponseDTO> {
    const data = await this.service.getControllerFanSetting(req.query);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/coop/fan/detail',
    options: {
      schema: {
        querystring: getSmartControllerFanDetailSettingsQueryDTO,
        response: {
          200: getSmartControllerFanDetailSettingResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getFanDetail(
    req: FastifyRequest<{
      Querystring: GetSmartControllerFanDetailSettingsQueryDTO;
    }>,
  ): Promise<GetSmartControllerFanSettingsResponseDTO> {
    const data = await this.service.getControllerFanDetailSetting(req.query);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/coop/growth-day/:coopId',
    options: {
      schema: {
        params: getSmartControllerSettingsParamsDTO,
        body: sendSmartControllerGrowthDaySettingBodyDTO,
        response: {
          200: sendSmartControllerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async sendGrowthDaySetting(
    req: FastifyRequest<{
      Params: GetSmartControllerSettingsParamsDTO;
      Body: SendSmartControllerGrowthDaySettingBody;
    }>,
  ): Promise<SendSmartControllerSettingsResponseDTO> {
    // TODO: remove this after b2b app patch release
    const payload = {
      ...req.body,
      temperatureReduction: req.body.temperatureReduction.map((elm) => ({
        ...elm,
        group: parseInt(elm.group.slice(-1), 10) + 1,
      })),
    };

    await this.service.sendControllerSetting({
      payload,
      coopCode: req.params.coopId,
      settingType: MQTT_CONTROLLER_SETTING_TYPES.GROWTH_DAY,
    });

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @GET({
    url: '/coop/growth-day',
    options: {
      schema: {
        querystring: getSmartControllerGrowthDaySettingsQueryDTO,
        response: {
          200: getSmartControllerGrowthDaySettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getGrowthDay(
    req: FastifyRequest<{
      Querystring: GetSmartControllerSettingsGrowthDayQueryDTO;
    }>,
  ): Promise<GetSmartControllerGrowthDaySettingsResponseDTO> {
    const data = await this.service.getControllerGrowthSetting(req.query);

    return {
      code: 200,
      data: {
        ...data,
        temperatureReduction: data.temperatureReduction?.map((elm: any) => ({
          ...elm,
          group: elm.group?.toString(),
        })),
      },
    };
  }

  @PATCH({
    url: '/coop/alarm/:coopId',
    options: {
      schema: {
        params: getSmartControllerSettingsParamsDTO,
        response: {
          200: sendSmartControllerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async sendAlarmSetting(
    req: FastifyRequest<{
      Params: GetSmartControllerSettingsParamsDTO;
      Body: SetAlarmSettingPayload;
    }>,
  ): Promise<SendSmartControllerSettingsResponseDTO> {
    await this.service.sendControllerSetting({
      payload: {
        ...req.body,
      },
      coopCode: req.params.coopId,
      settingType: MQTT_CONTROLLER_SETTING_TYPES.ALARM,
    });

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @PATCH({
    url: '/coop/lamp/:coopId',
    options: {
      schema: {
        params: getSmartControllerSettingsParamsDTO,
        response: {
          200: sendSmartControllerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async sendLampSetting(
    req: FastifyRequest<{
      Params: GetSmartControllerSettingsParamsDTO;
      Body: SetLampSettingPayload;
    }>,
  ): Promise<SendSmartControllerSettingsResponseDTO> {
    await this.service.sendControllerSetting({
      payload: {
        ...req.body,
      },
      coopCode: req.params.coopId,
      settingType: MQTT_CONTROLLER_SETTING_TYPES.LAMP,
    });

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @GET({
    url: '/coop/lamp',
    options: {
      schema: {
        querystring: getSmartControllerLampSettingsQueryDTO,
        response: {
          200: getSmartControllerLampSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getLamp(
    req: FastifyRequest<{
      Querystring: GetSmartControllerLampSettingsQueryDTO;
    }>,
  ): Promise<GetSmartControllerLampSettingsResponseDTO> {
    const data = await this.service.getControllerLampSetting(req.query);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/coop/cooler/detail/:coopId',
    options: {
      schema: {
        params: getSmartControllerSettingsParamsDTO,
        response: {
          200: sendSmartControllerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async sendCoolerSetting(
    req: FastifyRequest<{
      Params: GetSmartControllerSettingsParamsDTO;
      Body: SetCoolerSettingPayload;
    }>,
  ): Promise<SendSmartControllerSettingsResponseDTO> {
    await this.service.sendControllerSetting({
      payload: {
        ...req.body,
      },
      coopCode: req.params.coopId,
      settingType: MQTT_CONTROLLER_SETTING_TYPES.COOLER,
    });

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @GET({
    url: '/coop/cooler/detail',
    options: {
      schema: {
        querystring: getSmartControllerCoolerSettingsQueryDTO,
        response: {
          200: getSmartControllerCoolerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getCooler(
    req: FastifyRequest<{
      Querystring: GetSmartControllerCoolerSettingsQueryDTO;
    }>,
  ): Promise<GetSmartControllerCoolerSettingsResponseDTO> {
    const data = await this.service.getControllerCoolerSetting(req.query);

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/coop/heater/:coopId',
    options: {
      schema: {
        params: getSmartControllerSettingsParamsDTO,
        response: {
          200: sendSmartControllerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async sendHeaterSetting(
    req: FastifyRequest<{
      Params: GetSmartControllerSettingsParamsDTO;
      Body: SetHeaterSettingPayload;
    }>,
  ): Promise<SendSmartControllerSettingsResponseDTO> {
    await this.service.sendControllerSetting({
      payload: {
        ...req.body,
      },
      coopCode: req.params.coopId,
      settingType: MQTT_CONTROLLER_SETTING_TYPES.HEATER,
    });

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @GET({
    url: '/coop/heater',
    options: {
      schema: {
        querystring: getSmartControllerHeaterSettingsQueryDTO,
        response: {
          200: getSmartControllerHeaterSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getHeater(
    req: FastifyRequest<{
      Querystring: GetSmartControllerHeaterSettingsQueryDTO;
      Body: SetAlarmSettingPayload;
    }>,
  ): Promise<GetSmartControllerHeaterSettingsResponseDTO> {
    const data = await this.service.getControllerHeaterSetting(req.query);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/settings/:coopId',
    options: {
      schema: {
        params: getSmartControllerSettingsParamsDTO,
        response: {
          200: sendSmartControllerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getAllSetting(
    req: FastifyRequest<{
      Querystring: GetSmartControllerSettingsQueryDTO;
      Body: SetAlarmSettingPayload;
    }>,
  ): Promise<any> {
    await this.service.getControllerSetting(req.query.id);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }

  @GET({
    url: '/coop/historical',
    options: {
      schema: {
        querystring: getSmartControllerSettingsQueryDTO,
        response: {
          200: sendSmartControllerSettingsResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getHistorical(
    req: FastifyRequest<{
      Querystring: GetSmartControllerSettingsQueryDTO;
      Body: SetAlarmSettingPayload;
    }>,
  ): Promise<any> {
    await this.service.getControllerSetting(req.query.id);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }
}
