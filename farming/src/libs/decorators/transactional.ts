/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import 'reflect-metadata';

import { QueryRunner } from 'typeorm';

function isQueryRunner(obj: any): obj is QueryRunner {
  return (
    obj &&
    typeof obj.startTransaction === 'function' &&
    typeof obj.commitTransaction === 'function' &&
    typeof obj.rollbackTransaction === 'function'
  );
}

export function Transactional(): MethodDecorator {
  return function (_: any, __: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const lastParam = args[args.length - 1];

      if (isQueryRunner(lastParam)) {
        const queryRunner: QueryRunner = lastParam;

        try {
          await queryRunner.startTransaction();

          const result = await originalMethod.apply(this, args);

          await queryRunner.commitTransaction();

          return result;
        } catch (error) {
          await queryRunner.rollbackTransaction();

          throw error;
        }
      } else {
        throw new Error(
          'Transactional decorator can only be applied to methods with QueryRunner as the last parameter.',
        );
      }
    };

    return descriptor;
  };
}
