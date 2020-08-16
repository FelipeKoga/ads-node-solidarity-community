import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { authConfig } from '@config/auth';

class AuthController {
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const token = jwt.sign({ id: 1 }, authConfig.secretKey, {
      expiresIn: 3600,
    });

    return res.json(token);
  }
}

export default new AuthController();
