import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import UserSchema from '@schemas/UserSchema';
import md5 from 'md5';

function createToken(user) {
  return jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: 3600,
  });
}

class AuthController {
  public async authenticate(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const user = await UserSchema.findOne({
        email: email,
        password: md5(password),
      });
      if (!user) {
        return res.status(401).json();
      }
      const token = createToken({
        email,
        id: user._id,
      });
      return res.status(200).json(token);
    } catch (err) {
      return res.status(400).json({
        body: err.message,
      });
    }
  }

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const userRequest = req.body;
      console.log(Object.values(userRequest));
      // if (!name || !email || !password) {
      //   return res.status(400).json({
      //     body: 'Missing fields',
      //   });
      // }
      const emailAlreadyRegister = await UserSchema.findOne({ email });

      if (emailAlreadyRegister) {
        return res.status(409).json({ body: 'Email already register' });
      }
      const user = new UserSchema({
        name,
        email,
        password: md5(password),
      });
      await user.save();
      const token = createToken({
        name,
        email,
        id: user._id,
      });
      return res.json(token);
    } catch (err) {
      return res.status(400).json({
        body: err.message,
      });
    }
  }
}

export default new AuthController();
