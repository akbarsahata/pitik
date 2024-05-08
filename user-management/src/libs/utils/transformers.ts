/* eslint-disable class-methods-use-this */
import { ValueTransformer } from 'typeorm';

export class BoolSmallIntTransformer implements ValueTransformer {
  // To db from typeorm
  to(value?: boolean | null): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    return value ? 1 : 0;
  }

  // From db to typeorm
  from(value?: number | null): boolean | null {
    if (value === null || value === undefined) {
      return null;
    }
    return value === 1;
  }
}
