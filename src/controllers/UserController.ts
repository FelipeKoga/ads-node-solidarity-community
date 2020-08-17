import { Request, Response } from 'express';
import UserSchema from '@schemas/UserSchema';

class UserController {
  public async list(req: Request, res: Response): Promise<Response> {
    const users = await UserSchema.find(
      {},
      { name: true, email: true, _id: false }
    );
    return res.json(users);
  }
}

export default new UserController();
