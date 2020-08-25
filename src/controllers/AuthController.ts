import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import UserSchema from '@schemas/UserSchema';
import md5 from 'md5';
import { User } from '@entities/User';
import nodemailer from 'nodemailer';

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
        _id: user._id,
        email,
        name: user.toObject().name,
        role: user.toObject().role,
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

  public async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const email = req.query.email;
      if (!email) {
        return res.status(400).json();
      }
      const newPassword = Math.random().toString(36).substring(7);
      await UserSchema.updateOne({ email }, { password: md5(newPassword) });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'comunidadesolidaria02@gmail.com',
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: 'comunidadesolidaria02@gmail.com',
        to: email as string,
        subject: 'Nova senha - Comunidade Solidária',
        text: `Sua nova senha de acesso ao Comunidade Solidária: ${newPassword}`,
      };
      await transporter.sendMail(mailOptions);
      return res.json();
    } catch (err) {
      console.log(err);
      return res.status(400).json();
    }
  }
}

export default new AuthController();
