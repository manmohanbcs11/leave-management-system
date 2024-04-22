import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from "../common/apiResponse";
import { httpStatusCode } from "../common/httpStatusCodes";
import { Util } from "../common/utils";
import UserModel, { User } from "../models/UserModel";
import { UserRole } from '../common/userRole';

export class AuthController extends Util {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
  }

  public async signup(req: any) {
    let response: ApiResponse;
    try {
      let user: User = await UserModel.findOne({ email: req.body.email });
      if (user) {
        return new ApiResponse(httpStatusCode.badRequest, `User with emailId ${req.body.email} already exists.`);
      }

      Util.validateBody(req.body);
      const userRole = req.body.role ? UserRole[req.body.role.toUpperCase()] : UserRole.USER;
      const securePassword: string = await Util.generatePasswordHash(req.body.password);

      user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        role: userRole
      });
      const data = {
        user: {
          id: user.id,
          role: user.role
        }
      }
      const authToken = await jwt.sign(data, process.env.JWT_SECRET);
      response = new ApiResponse(httpStatusCode.success, 'User signed up successfully.', { authToken: authToken });
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async login(req: any) {
    let response: ApiResponse;
    try {
      Util.validateBody(req.body);
      const user: User = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return new ApiResponse(httpStatusCode.notFound, `Please try to login with correct credentials.`);
      }
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return new ApiResponse(httpStatusCode.notFound, `Please try to login with correct credentials.`);
      }
      const data = {
        user: {
          id: user.id,
          role: user.role
        }
      }
      const authToken = await jwt.sign(data, process.env.JWT_SECRET);
      response = new ApiResponse(httpStatusCode.success, 'User logged in successfully.', { authToken: authToken });
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }
}