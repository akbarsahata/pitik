/* eslint-disable class-methods-use-this */
import { createHmac } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import { IncomingHttpHeaders } from 'http';
import * as querystring from 'querystring';
import { env } from '../../config/env';
import { SlackEvent, slackEventDTO } from '../../dto/slack.dto';
import { SLACK_COMMAND_LIST } from '../../libs/constants/slack';
import { jsonToCsv } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PaymentService } from '../../services/payment.service';
import { VirtualAccountService } from '../../services/virtualAccount.service';

@Controller({ route: '/external/slack' })
export class SlackController {
  @Inject(PaymentService)
  private paymentService!: PaymentService;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(VirtualAccountService)
  private virtualAccountService!: VirtualAccountService;

  @POST({
    url: '/events',
    options: {
      schema: {
        body: slackEventDTO,
      },
    },
  })
  async slackEvents(
    req: FastifyRequest<{
      Body: SlackEvent;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    const { body, headers } = req;

    this.logger.info(
      { message: '[SLACK] Slack Event Received', body, headers },
      '[SLACK] Slack Event Received',
    );

    // Verify the Slack request signature
    const signature = headers['x-slack-signature'];
    const expectedSignature = this.slackSignature(headers, body);
    if (signature !== expectedSignature) {
      reply.code(200).send('Invalid request signature');
      return;
    }

    let responseBody = {
      text: '*Unrecognized Command!*',
      attachments: this.createDefaultAttachments(),
    };

    switch (true) {
      case body.command.startsWith(SLACK_COMMAND_LIST.RETRY_PAYMENT_VA):
        responseBody = await this.handleRetryPaymentCommand(body);
        break;
      case body.command.startsWith(SLACK_COMMAND_LIST.RETRY_VA_STATUS):
        responseBody = await this.handleRetryVAStatusCommand(body);
        break;
      case body.command.startsWith(SLACK_COMMAND_LIST.CHECK_UNDELIVERED_PAYMENT):
        responseBody = await this.handleCheckUndeliveredPaymentCommand(body);
        break;
      default:
        break;
    }

    reply.code(200);
    reply.send(responseBody);
  }

  private createDefaultAttachments() {
    return [
      {
        color: '#ff0000',
        text: 'Your command was not recognized. Please try again.',
        mrkdwn_in: ['text'],
        fields: [
          {
            title: 'Environment',
            value: `*${process.env.NODE_ENV}*`,
            short: true,
          },
        ],
        ...this.defaultFooter(),
      },
    ];
  }

  private async handleRetryPaymentCommand(body: SlackEvent) {
    const response = {
      text: `*Command Triggered: ${body.command}*`,
      attachments: [
        {
          color: '#36a64f',
          text: `Retry Payment VA with payment id: ${body.text}`,
          mrkdwn_in: ['text'],
          fields: [
            {
              title: 'Environment',
              value: `*${process.env.NODE_ENV}*`,
              short: true,
            },
            {
              title: 'Status',
              value: '*DONE*',
              short: true,
            },
          ],
          ...this.defaultFooter(),
        },
      ],
    };

    try {
      const payment = await this.paymentService.retryVirtualAccountPayment({
        params: {
          paymentId: body.text,
        },
      });

      response.attachments[0].fields.push(
        ...[
          {
            title: 'Retry Attempt',
            value: `${payment.retryAttempt}`,
            short: true,
          },
          {
            title: 'Failed Date',
            value: `${payment.failedDate || '-'}`,
            short: true,
          },
          {
            title: 'Retry Date',
            value: `${payment.retryDate}`,
            short: true,
          },
          {
            title: 'Transaction Timestamp',
            value: `${payment.transactionTimestamp}`,
            short: true,
          },
          {
            title: 'Remark',
            value: `${payment.remark || '-'}`,
            short: true,
          },
        ],
      );
    } catch (error) {
      response.attachments = [
        {
          color: '#ff0000',
          text: `Retry Payment VA with payment id: ${body.text}`,
          mrkdwn_in: ['text'],
          fields: [
            {
              title: 'Environment',
              value: `*${process.env.NODE_ENV}*`,
              short: true,
            },
            {
              title: 'Status',
              value: '*FAILED*',
              short: true,
            },
            {
              title: 'Error Message',
              value: `\`\`\`\n${error.message}\n\`\`\``,
              short: false,
            },
          ],
          ...this.defaultFooter(),
        },
      ];
    }

    return response;
  }

  private async handleRetryVAStatusCommand(body: SlackEvent) {
    const response = {
      text: `*Command Triggered: ${body.command}*`,
      attachments: [
        {
          color: '#36a64f',
          text: `Retry VA Status: ${body.text}`,
          mrkdwn_in: ['text'],
          fields: [
            {
              title: 'Environment',
              value: `*${process.env.NODE_ENV}*`,
              short: true,
            },
            {
              title: 'Status',
              value: '*DONE*',
              short: true,
            },
          ],
          ...this.defaultFooter(),
        },
      ],
    };

    try {
      await this.virtualAccountService.retryLatestVAStatus({
        params: {
          vaNumber: body.text,
        },
      });
    } catch (error) {
      response.attachments = [
        {
          color: '#ff0000',
          text: `Retry VA Status: ${body.text}`,
          mrkdwn_in: ['text'],
          fields: [
            {
              title: 'Environment',
              value: `*${process.env.NODE_ENV}*`,
              short: true,
            },
            {
              title: 'Status',
              value: '*FAILED*',
              short: true,
            },
            {
              title: 'Error Message',
              value: `\`\`\`\n${error.message}\n\`\`\``,
              short: false,
            },
          ],
          ...this.defaultFooter(),
        },
      ];

      if (error.response) {
        response.attachments[0].fields.push({
          title: 'Response',
          value: `\`\`\`\n${JSON.stringify(error.response.data)}\n\`\`\``,
          short: false,
        });
      }
    }

    return response;
  }

  private async handleCheckUndeliveredPaymentCommand(body: SlackEvent) {
    const response = {
      text: `*Command Triggered: ${body.command}*`,
      attachments: [
        {
          color: '#36a64f',
          text: 'Show Undelivered Payment',
          mrkdwn_in: ['text'],
          fields: [
            {
              title: 'Environment',
              value: `*${process.env.NODE_ENV}*`,
              short: true,
            },
            {
              title: 'Status',
              value: '*DONE*',
              short: true,
            },
          ],
          ...this.defaultFooter(),
        },
      ],
    };

    try {
      const undeliveredPayments = await this.paymentService.getUndeliveredPayments();

      if (undeliveredPayments.length === 0) {
        response.attachments[0].fields.push(
          ...[
            {
              title: 'Total Undelivered Payments',
              value: `${undeliveredPayments.length}`,
              short: true,
            },
            {
              title: 'Undelivered Payments',
              value: '```\nno undelivered payment\n```',
              short: false,
            },
          ],
        );
      } else {
        response.attachments[0].fields.push(
          ...[
            {
              title: 'Total Undelivered Payments',
              value: `${undeliveredPayments.length}`,
              short: true,
            },
            {
              title: 'Undelivered Payments',
              value: `\`\`\`\n${jsonToCsv(
                undeliveredPayments.map((item) => ({
                  paymentId: item.paymentId,
                  transactionTimestamp: item.transactionTimestamp.toISOString(),
                  amount: item.amount,
                })),
              )}\n\`\`\``,
              short: false,
            },
          ],
        );
      }
    } catch (error) {
      response.attachments = [
        {
          color: '#ff0000',
          text: 'Get Undelivered Payment',
          mrkdwn_in: ['text'],
          fields: [
            {
              title: 'Environment',
              value: `*${process.env.NODE_ENV}*`,
              short: true,
            },
            {
              title: 'Status',
              value: '*FAILED*',
              short: true,
            },
            {
              title: 'Error Message',
              value: `\`\`\`\n${error.message}\n\`\`\``,
              short: false,
            },
          ],
          ...this.defaultFooter(),
        },
      ];

      if (error.response) {
        response.attachments[0].fields.push({
          title: 'Response',
          value: `\`\`\`\n${JSON.stringify(error.response.data)}\n\`\`\``,
          short: false,
        });
      }
    }

    return response;
  }

  private defaultFooter() {
    return {
      footer: 'Whale Service',
      footer_icon: 'https://fms.pitik.id/favicon.ico',
      ts: new Date().getTime(),
    };
  }

  private slackSignature(headers: IncomingHttpHeaders, body: SlackEvent): string {
    const timestamp = headers['x-slack-request-timestamp'];

    // URL-encode the payload to replace '/' and ':'
    const encodedPayload = querystring.stringify(body, undefined, undefined, {
      encodeURIComponent: (str) => querystring.escape(str),
    });

    // Compose the message
    const sigBaseString = `v0:${timestamp}:${encodedPayload}`;

    // Convert sigBasestring to binary
    const sigBaseStringBuffer = Buffer.from(sigBaseString, 'utf-8');

    // Convert the Slack signing secret to binary
    const signingSecretBuffer = Buffer.from(env.SLACK_SIGNING_SECRET, 'utf-8');

    // Calculate the signature
    const mySignature = `v0=${createHmac('sha256', signingSecretBuffer)
      .update(sigBaseStringBuffer)
      .digest('hex')}`;

    return mySignature;
  }
}
