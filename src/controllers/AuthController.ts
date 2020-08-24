import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import UserSchema from '@schemas/UserSchema';
import md5 from 'md5';
import { User } from '@entities/User';

function createToken(user) {
  return jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: 3600,
  });
}

class AuthController {
  public async authenticate(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const user = await UserSchema.findOne({
        email: email,
        password: md5(password),
      });
      console.log(user);
      if (!user) {
        return res.status(401).json();
      }
      const token = createToken({
        data: {
          _id: user._id,
          email,
          role: user.toObject().role,
        },
      });
      return res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      return res.status(400).json();
    }
  }

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const userRequest: User = req.body;

      console.log(userRequest);

      const emailAlreadyRegister = await UserSchema.findOne({
        email: userRequest.email,
      });

      if (emailAlreadyRegister) {
        return res.status(409).json();
      }

      const user = new UserSchema({
        ...userRequest,
        password: md5(userRequest.password),
      });

      await user.save();
      return res.status(201).json();
    } catch (err) {
      return res.status(400).json();
    }
  }
}

export default new AuthController();
