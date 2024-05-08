/* eslint-disable class-methods-use-this */
import { Service } from 'fastify-decorators';
import fetch from 'node-fetch';
import { env } from '../../config/env';
import { XenditLog } from '../../datasources/entity/postgresql/xenditLog';
import { VirtualAccountPayment } from '../../datasources/entity/postgresql/virtualAccountPayment.entity';

@Service()
export class SlackDAO {
  async postMessageToSlack(richText: any) {
    if (env.isDev) return;

    await fetch(env.SLACK_WEBHOOK_FAILED_API, {
      method: 'post',
      body: JSON.stringify(richText),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async alertXenditErrorLog(data: XenditLog) {
    let responseBody = data.log?.response?.body;
    try {
      responseBody = JSON.parse(responseBody);
    } catch (error) {
      // do nothing
    }

    const richText = {
      attachments: [
        {
          color: '#f20505',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Oh no! Some API call has been failed!',
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Xendit Log Id:* \`${data.id || ''}\``,
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
                text: `*Time:*\n${data.createdDate || ''}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*URL:*\n${data.log?.request?.url || ''}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Status Code:*\n${data.log?.response?.statusCode || ''}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Request Body:*\n\`\`\`${JSON.stringify(
                  data.log?.request?.body,
                  null,
                  '\t',
                )}\`\`\``,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Response Body:*\n\`\`\`${JSON.stringify(responseBody, null, '\t')}\`\`\``,
              },
            },
          ],
        },
      ],
    };

    await this.postMessageToSlack(richText);
  }

  async alertErpErrorLog(url: string, status: number, body: any, response: any, error: any) {
    const richText = {
      attachments: [
        {
          color: '#f20505',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Oh no! ERP API Call has been failed!',
                emoji: true,
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
                text: `*Time:*\n${new Date().toISOString() || ''}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*URL:*\n${url || ''}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Status Code:*\n${status || ''}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Request Body:*\n\`\`\`${JSON.stringify(body, null, '\t')}\`\`\``,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Response Body:*\n\`\`\`${response}\`\`\``,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Error:*\n\`\`\`${error}\`\`\``,
              },
            },
          ],
        },
      ],
    };

    await this.postMessageToSlack(richText);
  }

  async alertPaymentInDLQ(paymentId: string) {
    const richText = {
      attachments: [
        {
          color: '#f20505',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Payment-in consumer has been failed!',
                emoji: true,
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
                text: `*Time:*\n${new Date().toISOString() || ''}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Payment ID:*\n${paymentId}`,
              },
            },
          ],
        },
      ],
    };

    await this.postMessageToSlack(richText);
  }

  async alertUndeliveredPayment(payments: VirtualAccountPayment[]) {
    const richText = {
      attachments: [
        {
          color: '#f20505',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Undelivered payment has been found!',
                emoji: true,
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
                text: `*Time:*\n${new Date().toISOString() || ''}`,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Payment ID:*\n${payments.map((payment) => payment.paymentId).join('\n')}`,
              },
            },
          ],
        },
      ],
    };

    await this.postMessageToSlack(richText);
  }

  async alertFailedJobs(queueName: string, error: Error, data: any, jobId?: string) {
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

    await this.postMessageToSlack(richText);
  }
}
