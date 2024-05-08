/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';

export enum UploadFolderEnum {
  TASK_TICKET = 'task-ticket',
  REPORTS = 'reports',
  ISSUE = 'issue',
  COOPS = 'coops',
  DOWNSTREAM_DISPOSAL = 'downstream-disposal',
  TASK_LIBRARY = 'task-library',
  TRANSFER_REQUEST = 'transfer-request',
  GOODS_RECEIPT_PURCHASE_ORDER = 'goods-receipt-purchase-order',
  GOODS_RECEIPT_TRANSFER_REQUEST = 'goods-receipt-transfer-request',
  HARVEST_RECORD = 'harvest-records',
  FIRMWARE_SENSOR = 'firmware-sensor',
  FIRMWARE_CONTROLLER = 'firmware-controller',
  FIRMWARE_CAMERA = 'firmware-camera',
  SMARTSCALE_WEIGHING_HARVEST = 'smartscale-weighing-harvest',
}

export const uploadQueryDTO = Type.Object({
  folder: Type.Enum(UploadFolderEnum),
});

export const uploadBodyDTO = Type.Object({
  filename: Type.Optional(Type.String()),
});

export const uploadResponseDTO = Type.Object({
  code: Type.Integer(),
  data: Type.Object({
    url: Type.String({ format: 'uri' }),
  }),
});

export type UploadQuery = Static<typeof uploadQueryDTO>;

export type UploadBody = Static<typeof uploadBodyDTO>;

export type UploadResponse = Static<typeof uploadResponseDTO>;
