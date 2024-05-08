/* eslint-disable class-methods-use-this */
import { format } from 'date-fns';
import { Service } from 'fastify-decorators';
import fetch from 'node-fetch';
import env from '../../config/env';
import { DATETIME_59_SQL_FORMAT } from '../../libs/constants';
import { DEVICE_ALERT_TELEGRAM_MESSAGE_TYPE } from '../../libs/constants/deviceSensor';

@Service()
export class TelegramDAO {
  async sendTelegramAlertIotTicketingStage(data: any, type: string): Promise<void> {
    const chatId: string = env.TELEGRAM_CHAT_ID_IOT_TICKETING_STAGE;

    const apiUrl: string = `${env.TELEGRAM_API_URL}${env.TELEGRAM_BOT_TOKEN_IOT_TICKETING_STAGE}/sendMessage`;

    const textMessage = await this.constructTelegramMessage(data, type);

    await this.sendMessageToTelegram(apiUrl, chatId, textMessage);
  }

  protected async constructTelegramMessage(data: any[], type: string): Promise<string> {
    let contentMessage: string = 'MESSAGE FROM PITIK FARMING SERVICE';

    switch (type) {
      case DEVICE_ALERT_TELEGRAM_MESSAGE_TYPE.IOT_TICKETING_STAGE_DEVICE_OFFLINE_MESSAGE: {
        const contentHeader: string =
          '<b>Hi Team, berikut device yang terpantau offline, mohon bantuan pengecekkan yaa, terimakasih :) </b>\n';

        let contentTableRow: string = '';
        data.forEach((elm, idx) => {
          contentTableRow += `<pre>${idx + 1}. | ${elm.coop?.farm?.branch?.name || '-'} | ${
            elm.room?.building?.name || '-'
          } | ${elm.coop?.coopCode || '-'} | ${elm.coop?.coopName || '-'} | ${
            elm.mac || '-'
          } | ${format(new Date(elm.lastOnlineTime), DATETIME_59_SQL_FORMAT)}</pre>`;
        });

        const contentBody: string = `<pre>No. | Branch | Building | CoopCode | CoopName | Mac | Last Online </pre>\n${contentTableRow}`;

        contentMessage = contentHeader + contentBody;

        return contentMessage;
      }
      case DEVICE_ALERT_TELEGRAM_MESSAGE_TYPE.IOT_TICKETING_STAGE_DEVICE_BACKUP_ONLINE_MESSAGE: {
        const contentHeader: string =
          '<b>Hi Team, device berikut sudah kembali online, terimakasih sudah di cek yaa :) </b>\n';

        let contentTableRow: string = '';
        data.forEach((elm, idx) => {
          contentTableRow += `<pre>${idx + 1}. | ${elm.coop?.farm?.branch?.name || '-'} | ${
            elm.room?.building?.name || '-'
          } | ${elm.coop?.coopCode || '-'} | ${elm.coop?.coopName || '-'} | ${
            elm.mac || '-'
          } | ${format(new Date(elm.lastOnlineTime), DATETIME_59_SQL_FORMAT)}</pre>`;
        });

        const contentBody: string = `<pre>No. | Branch | Building | CoopCode | CoopName | Mac | Last Online </pre>\n${contentTableRow}`;

        contentMessage = contentHeader + contentBody;

        return contentMessage;
      }
      default:
        return contentMessage;
    }
  }

  protected async sendMessageToTelegram(
    apiUrl: string,
    chatId: string,
    textMessage: string,
  ): Promise<void> {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: 'HTML',
        text: textMessage,
      }),
    });
  }
}
