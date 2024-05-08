/* eslint-disable class-methods-use-this */
import { Service } from 'fastify-decorators';
import fetch from 'node-fetch';
import env from '../../config/env';
import { IotDevice } from '../../datasources/entity/pgsql/IotDevice.entity';

@Service()
export class SlackDAO {
  async alertFailedJobs(queueName: string, error: Error, data: any, jobId?: string) {
    if (env.isDev) return;

    const richText = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `Job at ${queueName || ''} has failed`,
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*JOB ID:* \`#${jobId || ''}\``,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*CC:* ${env.isProd ? '<!subteam^S03QDQ8N0G3>' : 'whomever it may concern'}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Reason:*\n${error.message || ''}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Data:*\n\`\`\`${JSON.stringify(data, null, 2)}\`\`\``,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*View:*\n<${env.HOST_QUEUE_MONITOR}${queueName}?status=failed|View Failed Jobs at ${queueName}>`,
          },
        },
      ],
    };

    await fetch(env.BULLMQ_FAILED_JOBS_WEBHOOK, {
      method: 'post',
      body: JSON.stringify(richText),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendIotAlert(
    webhook: string,
    alertTitle: string,
    device: IotDevice,
    alertData: object,
    slackId?: string,
  ) {
    // errant sensors
    const sensors = {
      blocks: device.sensors?.flatMap((item: any, index: number) => [
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*SENSOR ${index + 1} INFO*`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Room:*\n${item.room.roomType.name || item.room.roomName || 'n/a'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Position:*\n${item.position || 'n/a'}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Sensor Type:*\n${item.sensorType || 'n/a'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Sensor Code:*\n${item.sensorCode || 'n/a'}\n`,
            },
          ],
        },
      ]),
    };

    const alertMessage = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `[ALERT] ${alertTitle || 'n/a'}`,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*DEVICE INFO*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Branch:* ${device.coop.farm.branch?.name || 'n/a'}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Farm:*\n${device.coop.farm.farmName || 'n/a'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Coop:*\n${device.coop.coopName || 'n/a'}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Building:*\n${device.building.name || 'n/a'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Room:*\n${device.room.roomType.name || device.room.roomName || 'n/a'}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*MAC Address:*\n\`${device.mac.toUpperCase() || device.deviceId || 'n/a'}\``,
            },
            {
              type: 'mrkdwn',
              text: `*Device Type:*\n${device.deviceType || 'n/a'}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error:*\`\`\`${JSON.stringify(alertData, null, 2)}\`\`\`\n`,
          },
        },
        ...(Array.isArray(sensors.blocks) ? sensors.blocks : []),
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*cc:* ${slackId}`,
          },
        },
        {
          type: 'divider',
        },
      ],
    };

    await fetch(webhook, {
      method: 'post',
      body: JSON.stringify(alertMessage),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getAlertMessage(token: string, query: string, channel: string): Promise<any> {
    const apiUrl = 'https://slack.com/api/search.messages';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body:
        `query=${query}` +
        '%20from%3A%22iot%20alert%20service%22' +
        `%20in%3A${channel}` +
        '&sort=timestamp' +
        '&count=1' +
        '&pretty=1',
    });

    const data = await response.json();
    return data;
  }
}
