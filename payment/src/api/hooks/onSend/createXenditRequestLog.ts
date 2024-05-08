import { onSendAsyncHookHandler } from 'fastify';
import { getInstanceByToken } from 'fastify-decorators';
import { XenditLogDAO } from '../../../dao/postgresql/xenditLog.dao';
import { Logger } from '../../../libs/utils/logger';
import { SlackDAO } from '../../../dao/slack/slack.dao';

const logger = getInstanceByToken<Logger>(Logger);
const slackDAO = getInstanceByToken<SlackDAO>(SlackDAO);
const xenditLogRepository = getInstanceByToken<XenditLogDAO>(XenditLogDAO);

export const createXenditRequestLog: onSendAsyncHookHandler<any> = async (
  request,
  reply,
  payload,
) => {
  try {
    const {
      headers: { 'x-callback-token': callbackToken, ...headers },
    } = request;

    const log = {
      request: {
        ip: request.ip,
        method: request.raw.method,
        url: request.raw.url,
        headers,
        body: request.body,
      },
      response: {
        statusCode: reply.statusCode,
        headers: reply.getHeaders(),
        body: payload,
      },
    };

    const xenditLog = await xenditLogRepository.createOne({
      actionName: 'http-response',
      log,
    });

    if (reply.statusCode >= 400) {
      slackDAO.alertXenditErrorLog(xenditLog);
    }
  } catch (error) {
    logger.error(error);
  }
};
