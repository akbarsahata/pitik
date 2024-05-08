import crypto from 'crypto';
import { preHandlerAsyncHookHandler } from 'fastify';
import env from '../../../config/env';
import { ERR_AUTH_UNAUTHORIZED } from '../../../libs/constants/errors';

// generate time-based one time password
function generateTOTP(id: string): string {
  const chunk = 60 * 1000;
  const timestamp = new Date(Math.floor(Date.now() / chunk) * chunk).getTime();

  const hmac = crypto.createHmac('sha1', env.TOTP_KEY);
  hmac.update(timestamp.toString() + id);

  const b64 = hmac.digest().toString('base64');

  const verificationCode = b64.substring(0, 6);

  return verificationCode;
}

export const verifyIotSecurityKey: preHandlerAsyncHookHandler = async (request) => {
  const key = request.headers['x-pitik-iot-sec'] || request.headers['X-PITIK-IOT-SEC'];
  if (!key) {
    throw ERR_AUTH_UNAUTHORIZED('invalid security key');
  }

  try {
    const [id, code] = (key as string).split('::');

    if (code !== generateTOTP(id)) {
      throw ERR_AUTH_UNAUTHORIZED('security key not match');
    }
  } catch (error) {
    throw ERR_AUTH_UNAUTHORIZED('invalid security key format');
  }
};
