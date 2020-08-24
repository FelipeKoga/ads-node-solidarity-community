import { Request, Response } from 'express';
import UserSchema from '@schemas/UserSchema';
import { User } from '@entities/User';
import md5 from 'md5';

class UserController {
  public async list(req: Request, res: Response): Promise<Response> {
    const users = await UserSchema.find(
      {},
      { name: true, email: true, _id: false }
    );
    return res.json(users);
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    const user = await UserSchema.findOne({ _id: req._id });
    return res.status(200).json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    console.log(req);
    try {
      const userRequest: User = req.body;

      const user = new UserSchema({
        ...userRequest,
        password: md5(userRequest.password),
      });
      const response = await user.updateOne({ _id: userRequest._id });
      console.log(response);
      return res.status(201).json(response);
    } catch {
      return res.status(400).json();
    }
  }
}

export default new UserController();
