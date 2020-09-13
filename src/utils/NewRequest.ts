import { Request } from 'express';

export interface NewRequest extends Request {
  _id: string;
}
