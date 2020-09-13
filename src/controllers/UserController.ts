/* eslint-disable indent */
import { Request, Response } from 'express';
import UserSchema from '@schemas/UserSchema';
import { User } from '@entities/User';
import md5 from 'md5';
import { NewRequest } from 'src/utils/NewRequest';

class UserController {
  public async list(req: Request, res: Response): Promise<Response> {
    const users = await UserSchema.find(
      {},
      { name: true, email: true, _id: false }
    );
    return res.json(users);
  }

  public async getById(req: NewRequest, res: Response): Promise<Response> {
    const user = await UserSchema.findOne(
      { _id: req._id },
      { password: false }
    );
    return res.status(200).json(user);
  }

  public async update(req: NewRequest, res: Response): Promise<Response> {
    try {
      const userRequest: User = req.body;
      delete userRequest.email;
      if (!userRequest.password) {
        delete userRequest.password;
      } else {
        userRequest.password = md5(userRequest.password);
      }
      await UserSchema.updateOne({ _id: req._id }, userRequest);
      return res.status(200).json();
    } catch (err) {
      console.log(err);
      return res.status(400).json();
    }
  }
}

export default new UserController();
