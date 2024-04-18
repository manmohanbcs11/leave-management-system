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
    this.generatePasswordHash = this.generatePasswordHash.bind(this);
    this.getuser = this.getuser.bind(this);
    this.updateuser = this.updateuser.bind(this);
    this.deleteuser = this.deleteuser.bind(this);
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
      const securePassword: string = await this.generatePasswordHash(req.body.password);

      user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        role: userRole
      });
      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = await jwt.sign(data, process.env.JWT_SECRET);
      response = new ApiResponse(httpStatusCode.success, 'User signed up successfully.', { authToken: authToken });
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  private async generatePasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
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

  public async getuser(req: any) {
    let response: ApiResponse;
    try {
      const userId: string = req.user.id;
      console.log('Getting user details with id:', userId);
      const result: User = await UserModel.findById(userId).exec();
      if (result) {
        response = new ApiResponse(httpStatusCode.success, `User fetched successfully.`, result);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `User not found.`);
      }
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async updateuser(req: any) {
    let response: ApiResponse;
    try {
      const userId: string = req.user.id;
      console.log('Updating user details with id:', userId);
      const result: User = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
      if (result) {
        response = new ApiResponse(httpStatusCode.success, `User updated successfully.`);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `User not found.`);
      }
    } catch (err) {
      response = new ApiResponse(err.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async deleteuser(req: any) {
    let response: ApiResponse;
    try {
      const emailId: string = req.params.emailid;
      const role: UserRole = req.user.role;
      if (role !== UserRole.ADMIN) {
        return new ApiResponse(httpStatusCode.forbidden, `Only admin can delete users.`);
      }

      console.log('Deleting user with emailId:', emailId);
      const result: User = await UserModel.findOneAndDelete({ email: emailId });
      if (result) {
        response = new ApiResponse(httpStatusCode.success, `User deleted successfully.`, result);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `User not found.`);
      }
    } catch (err) {
      response = new ApiResponse(err.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }
}