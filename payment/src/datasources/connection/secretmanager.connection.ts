/* eslint-disable no-console */
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { Initializer, Service } from 'fastify-decorators';

const xenditSecret = Type.Object({
  secretKey: Type.String({ default: '' }),
  callbackToken: Type.String({ default: '' }),
});

export type XenditSecret = Static<typeof xenditSecret>;

@Service()
export class SecretManagerConnection {
  private client: SecretManagerServiceClient;

  xendit: XenditSecret;

  @Initializer()
  async init() {
    try {
      this.client = new SecretManagerServiceClient();

      await this.fetchXenditSecret();

      console.log('[CONNECTION] Successfully obtained the secret from Secret Manager');
    } catch (error) {
      console.log('[CONNECTION] Failed to obtain secret from Secret Manager');
      throw error;
    }
  }

  async fetchXenditSecret() {
    try {
      const secretName = `projects/${process.env.GCP_PROJECT}/secrets/xendit-secret/versions/latest`;

      const [version] = await this.client.accessSecretVersion({
        name: secretName,
      });

      const payload = version.payload?.data?.toString() || '';

      const secretPayload: XenditSecret = JSON.parse(payload);

      if (!Value.Check(xenditSecret, secretPayload)) {
        const errors = Value.Errors(xenditSecret, secretPayload);

        const error = errors.First();
        throw new Error(`Invalid payload at path ${error?.path} with message ${error?.message}`);
      }

      this.xendit = secretPayload;
    } catch (error) {
      console.log('[CONNECTION] Failed to obtain xendit secret from Secret Manager');
      throw error;
    }
  }
}
