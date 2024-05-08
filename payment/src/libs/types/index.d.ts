export type BooleanMap = {
  [key: string]: boolean;
};

export type NumberArrMap = {
  [key: string]: number[];
};

export interface RequestUser {
  id: string;
  role: string;
}

/* eslint-disable no-unused-vars */
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      role: string;
    };
  }
}
