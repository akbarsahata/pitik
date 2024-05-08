/* eslint-disable no-unused-vars */
import { Initializer, Service } from 'fastify-decorators';
import env from '../../config/env';
import { GoogleFCM } from './googleFCM';

export enum FCMAppTargetEnum {
  PPL = 'PPL',
  INTERNAL = 'INTERNAL',
}

@Service()
export class GoogleFCMFactory {
  private appTargetToAppMap = new Map<FCMAppTargetEnum, GoogleFCM>();

  @Initializer()
  async init() {
    this.appTargetToAppMap.set(
      FCMAppTargetEnum.PPL,
      new GoogleFCM(env.FCM_PPL_CREDS, FCMAppTargetEnum.PPL),
    );
    this.appTargetToAppMap.set(
      FCMAppTargetEnum.INTERNAL,
      new GoogleFCM(env.FCM_INTERNAL_CREDS, FCMAppTargetEnum.INTERNAL),
    );
  }

  public createByAppTarget(appTarget: FCMAppTargetEnum): GoogleFCM {
    return this.appTargetToAppMap.get(appTarget)!;
  }
}
