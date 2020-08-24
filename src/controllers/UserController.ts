import { Request, Response } from 'express';
import UserSchema from '@schemas/UserSchema';
import { User } from '@entities/User';

class UserController {
  public async list(req: Request, res: Response): Promise<Response> {
    const users = await UserSchema.find(
      {},
      { name: true, email: true, _id: false }
    );
    return res.json(users);
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    const _id = req._id;
    console.log(_id);

    const user = await UserSchema.find({ _id });
    console.log(user);

    return res.status(200).json();
  }

  public async update(req: Request, res: Response): Promise<Response> {
    console.log(req);
    const user: User = req.body;
    console.log(user);
    return res.status(201).json();
  }
}

export default new UserController();
