import { format } from 'date-fns';
import {
  DATE_DOCUMENT_FORMAT,
  FARMING_ACTIVITIES,
  FARMING_ACTIVITY_MIN_RANK_ACTOR,
  GENERATED_DOCUMENT_MODULE,
} from '../constants';
import { ActivityStatus, RequestUser } from '../types/index.d';

/**
 * function to remap status based on
 * @param user : user who made the request
 * @param objectStatus : common status which already categorized from respective services
 * @param activityType : type of activity e.g: PURCHASE_REQUEST, TRANSFER_REQUEST, etc,
 * @returns : Object which already overriden based on requester roles
 */
export function mapActivityStatusBasedRoleRank(
  user: RequestUser,
  objectStatus: ActivityStatus,
  activityType: keyof typeof FARMING_ACTIVITIES,
): ActivityStatus {
  const activityStatus: ActivityStatus = objectStatus;

  switch (activityType) {
    case FARMING_ACTIVITIES.PURCHASE_REQUEST: {
      if (
        Number(user.roleRank?.internal) <= FARMING_ACTIVITY_MIN_RANK_ACTOR.PURCHASE_REQUEST &&
        objectStatus.number === 0
      ) {
        activityStatus.text = 'Perlu Persetujuan';
      }
      return activityStatus;
    }
    case FARMING_ACTIVITIES.HARVEST_REQUEST: {
      if (
        Number(user.roleRank?.internal) <= FARMING_ACTIVITY_MIN_RANK_ACTOR.HARVEST_REQUEST &&
        objectStatus.number === 0
      ) {
        activityStatus.text = 'Perlu Persetujuan';
      }
      return activityStatus;
    }
    case FARMING_ACTIVITIES.TRANSFER_REQUEST: {
      if (
        Number(user.roleRank?.internal) <= FARMING_ACTIVITY_MIN_RANK_ACTOR.TRANSFER_REQUEST &&
        objectStatus.number === 0 &&
        objectStatus.text === 'Pengajuan'
      ) {
        activityStatus.text = 'Perlu Persetujuan';
      }
      return activityStatus;
    }
    case FARMING_ACTIVITIES.DOC_IN_REQUEST: {
      if (
        Number(user.roleRank?.internal) <= FARMING_ACTIVITY_MIN_RANK_ACTOR.DOC_IN_REQUEST &&
        objectStatus.number === 1
      ) {
        activityStatus.text = 'Perlu Persetujuan';
      }
      return activityStatus;
    }
    default:
      return activityStatus;
  }
}

/**
 * function to remap response metadata from specific module to expected output shown in docs
 * @param metadata : object metadata
 * @param documentModuleName : document module name
 * @returns : Object which already overriden based on particular format
 */
export function mapMetadataToTemplatePayload(metadata: any, documentModuleName: string): any {
  switch (documentModuleName) {
    case GENERATED_DOCUMENT_MODULE.HARVEST_REALIZATION: {
      return {
        ...metadata,
        truckDepartingTime:
          metadata.truckDepartingTime === '00:00' ? '-' : metadata.truckDepartingTime,
        createdDate: format(new Date(metadata.createdDate), DATE_DOCUMENT_FORMAT),
      };
    }
    default:
      return metadata;
  }
}
