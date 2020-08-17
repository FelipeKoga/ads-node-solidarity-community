import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { authConfig } from '@config/auth';
import UserSchema from '@schemas/UserSchema';
import md5 from 'md5';

function createToken(user) {
  return jwt.sign(user, authConfig.secretKey, {
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
        return res.status(404).json({
          body: 'Unauthorized',
        });
      }
      const token = createToken({
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

  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          body: 'Missing fields',
        });
      }
      const emailAlreadyRegister = await UserSchema.findOne({ email });

      if (emailAlreadyRegister) {
        return res.status(400).json({ body: 'Email already register' });
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
