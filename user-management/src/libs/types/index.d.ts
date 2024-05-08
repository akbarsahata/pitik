import { File } from 'fastify-multer/lib/interfaces';

export type BooleanMap = {
  [key: string]: boolean;
};

export type NumberArrMap = {
  [key: string]: number[];
};

export interface RequestUser {
  id: string;
  role: string;
  roleRank?: {
    internal?: string;
  };
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
      role: string;
      roleRank?: {
        internal?: string;
      };
    };
    file: File;
  }
}
