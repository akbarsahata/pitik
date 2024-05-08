import { Static, Type } from '@sinclair/typebox';

export const ticketingHistoryItemsDTO = Type.Object({
  id: Type.String(),
  actionStatus: Type.String(),
  refTicketingId: Type.String(),
  refUserId: Type.String(),
  notes: Type.String(),
  timeAction: Type.String({ format: 'date-time' }),
  createdDate: Type.String({ format: 'date-time' }),
  modifiedDate: Type.String({ format: 'date-time' }),
  createdBy: Type.String(),
  modifiedBy: Type.String(),
});

export const ticketingHistorypayloadDTO = Type.Object({
  status: Type.String(),
  notes: Type.String(),
  refTicketingId: Type.String(),
});

export const ticketingHistoryResponseListDTO = Type.Object({
  code: Type.Integer(),
  count: Type.Integer(),
  data: Type.Array(ticketingHistoryItemsDTO),
});

export const ticketingHistoryQueryDTO = Type.Object({
  ...ticketingHistoryItemsDTO.properties,
});

export const ticketingHistoryResponseDTO = Type.Object({
  count: Type.Integer(),
  data: Type.Array(ticketingHistoryItemsDTO),
});

export type TicketingHistoryItemsDTO = Static<typeof ticketingHistoryItemsDTO>;

export type TicketingHistoryResponseListDTO = Static<typeof ticketingHistoryResponseListDTO>;

export type TicketingHistoryQueryDTO = Static<typeof ticketingHistoryQueryDTO>;

export type TicketingHistoryResponseDTO = Static<typeof ticketingHistoryResponseDTO>;

export type TicketingHistorypayloadDTO = Static<typeof ticketingHistorypayloadDTO>;
