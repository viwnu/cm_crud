import { Request } from 'express';

export type RequestWithProp<Type> = {
  [Property in keyof Type]: Type[Property];
} & Request;
