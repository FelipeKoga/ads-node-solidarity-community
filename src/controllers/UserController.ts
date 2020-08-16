import { User } from '@models/User';
import { Request, Response } from 'express';

const users = [
  { email: 'felipe.koga@hotmail.com', name: 'Felipe' } as User,
  { email: 'vinicius@hotmail.com', name: 'Vinicius' } as User,
];

class UserController {
  public async list(req: Request, res: Response): Promise<Response> {
    return res.json(users);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    return res.json('Created');
  }
}

export default new UserController();
