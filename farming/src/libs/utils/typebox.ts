import { Static, TSchema, Type } from '@sinclair/typebox';

export function Nullable<T extends TSchema>(schema: T) {
  return Type.Unsafe<Static<T> | null>({ ...schema, nullable: true });
}
