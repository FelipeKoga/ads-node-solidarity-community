import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.log('MIDDLEWARES');
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ body: 'Missing token.' });
  }

  console.log(authHeader);

  // const parts = authHeader.split(" ");

  // if (parts.length !== 2) {
  //   return res.status(401).send({ error: "Token error." });
  // }

  // const [scheme, token] = parts;

  // if (!/^Bearer$/i.test(scheme)) {
  //   return res.status(401).send({ error: "Token malformed." });
  // }

  jwt.verify(authHeader, process.env.SECRET_KEY, (err, decoded: any) => {
    if (err) {
      return res.status(401).send({ error: 'Token invalid.' });
    }
    console.log(decoded);

    req._id = decoded._id;
    return next();
  });
};
