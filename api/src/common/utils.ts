import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ApiError, ApiResponse } from './apiResponse';
import { Database } from './database';
import { httpStatusCode } from './httpStatusCodes';

export class Util {
  public static isEmpty(data: any): boolean {
    if (data === null || data === '' || data === 'undefined' || data.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  public static validateBody(body: any) {
    if (Object.keys(body).length > 0) {
      for (const key in body) {
        if (Util.isEmpty(body[key])) {
          throw new ApiError(httpStatusCode.badRequest, 'All fields are required.');
        } else if (key === 'email') {
          if (!body[key].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            throw new ApiError(httpStatusCode.badRequest, 'Invalid email address.');
          } else if (Util.getDomainFromEmail(body[key]) !== '2pirad.com') {
            throw new ApiError(httpStatusCode.badRequest, 'Only 2pirad accounts are allowed.');  
          }
        } else if (key === 'password') {
          if (body[key].length < 6) {
            throw new ApiError(httpStatusCode.badRequest, 'Password must be at least 6 characters long.');
          }
        }
      }
    } else {
      throw new ApiError(httpStatusCode.badRequest, 'Please pass all the mandatory fields in request.');
    }
  }

  private static getDomainFromEmail(email: string): string | null {
    const parts = email.split('@');
    if (parts.length === 2) {
        return parts[1];
    } else {
      throw new ApiError(httpStatusCode.badRequest, 'Invalid email address.');
    }
}


  public static async generatePasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  }
}

export async function processRequest(callback: Function, req: Request, res: Response) {
  await new Database().connectToMongo();
  const response: ApiResponse = await callback(req);
  res.status(response.statusCode).send(response);
}