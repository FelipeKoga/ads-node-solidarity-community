import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ body: 'Missing token.' });
  }

  jwt.verify(authHeader, process.env.SECRET_KEY, (err, decoded: any) => {
    console.log(err);
    if (err) {
      return res.status(401).send({ error: 'Token invalid.' });
    }
    req._id = decoded._id;
    return next();
  });
};
