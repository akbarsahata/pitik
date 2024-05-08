import { File } from 'fastify-multer/lib/interfaces';

export type BooleanMap = {
  [key: string]: boolean;
};

export type NumberArrMap = {
  [key: string]: number[];
};

export interface Role {
  id: string;
  name: string;
}

export interface RequestUser {
  id: string;
  userManagementId?: string;
  role: string;
  roles?: Role[];
  roleRank?: {
    internal?: number;
    downstream?: number;
    ownerApp?: number;
  };
  organizationId?: string;
}

export interface ActivityStatus {
  number: number;
  text: string;
}

/* eslint-disable no-unused-vars */
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      userManagementId: string;
      role: string;
      roles: Role[];
      roleRank?: {
        internal?: number;
        downstream?: number;
        ownerApp?: number;
      };
      organizationId?: string;
    };
    appId?: string;
    file: File;
  }
}

declare module '@fastify/request-context' {
  interface RequestContextData {
    requestId: string;
    userId?: string;
    userToken?: string;
    startTime?: number;
  }
}
