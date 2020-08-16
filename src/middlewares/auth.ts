import { Response, Request, NextFunction } from 'express';

export default (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  return next();
  // const authHeader = req.headers.authorization;

  // if (!authHeader) {
  //   return res.status(401).send({ error: "Missing token." });
  // }

  // const parts = authHeader.split(" ");

  // if (parts.length !== 2) {
  //   return res.status(401).send({ error: "Token error." });
  // }

  // const [scheme, token] = parts;

  // if (!/^Bearer$/i.test(scheme)) {
  //   return res.status(401).send({ error: "Token malformed." });
  // }

  // jwt.verify(token, authConfig.secretKey, (err, decoded: any) => {
  //   if (err) {
  //     return res.status(401).send({ error: "Token invalid." });
  //   }

  //   req.userId = decoded.id;

  //   return next();
  // });
};
