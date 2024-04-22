import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { httpStatusCode } from '../common/httpStatusCodes';

export const authorizer = async (req: Request, res: Response, callback: Function) => {
  const token = req.headers['auth-token'];
  if (!token) {
    return res.status(httpStatusCode.unauthorized).send({ message: 'Failed to authenticate.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(httpStatusCode.unauthorized).send({ message: 'Failed to authenticate.' });
    }
    req.body.user = data.user;
    callback();
  });
}