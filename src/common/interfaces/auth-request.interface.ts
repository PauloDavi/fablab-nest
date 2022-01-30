import { Request } from 'express';

import { AuthObject } from './auth-object.interface';

export interface AuthRequest extends Request {
  user: AuthObject;
}
