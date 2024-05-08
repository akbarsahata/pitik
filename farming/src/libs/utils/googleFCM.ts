/* eslint-disable camelcase */
import admin from 'firebase-admin';
import { PushNotificationJobData } from '../interfaces/job-data';

interface FCMPayload {
  tokens: string[];
  data: {
    request: string;
  };
  notification: {
    title: string;
    body: string;
  };
  android: {
    priority: 'normal' | 'high';
  };
  apns: {
    headers: {
      'apns-priority': string;
    };
    payload: {
      aps: {
        contentAvailable: boolean;
      };
    };
  };
}

export class GoogleFCM {
  private fcmApp: admin.app.App;

  constructor(creds: string, appName?: string) {
    this.fcmApp = admin.initializeApp(
      {
        credential: admin.credential.cert(creds),
      },
      appName,
    );
  }

  public async sendMessages(data: PushNotificationJobData, deviceTokens: string[]) {
    const payload = GoogleFCM.buildPayload(data, deviceTokens);
    return this.fcmApp.messaging().sendEachForMulticast(payload);
  }

  private static buildPayload(
    { content }: PushNotificationJobData,
    deviceTokens: string[],
  ): FCMPayload {
    return {
      tokens: deviceTokens,
      data: {
        request: JSON.stringify({
          headline: content.headline,
          sub_headline: content.body,
          type: content.type || 'android',
          id: content.id,
          target: content.target,
          additionalParameters: content.additionalParameters,
        }),
      },
      notification: {
        title: content.headline,
        body: content.body,
      },
      android: {
        priority: content.priority === 'normal' ? 'normal' : 'high',
      },
      apns: {
        headers: {
          /**
           * 5 is for normal priority, higher priority may cause error
           * (https://firebase.google.com/docs/cloud-messaging/concept-options#setting-the-priority-of-a-message)
           */
          'apns-priority': '5',
        },
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      },
    };
  }
}
