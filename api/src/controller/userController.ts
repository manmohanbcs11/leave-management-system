import { ApiResponse } from "../common/apiResponse";
import { httpStatusCode } from "../common/httpStatusCodes";
import { UserRole } from '../common/userRole';
import { Util } from "../common/utils";
import UserModel, { User } from "../models/UserModel";

export class UserController extends Util {
  constructor() {
    super();
    this.getuser = this.getuser.bind(this);
    this.updateuser = this.updateuser.bind(this);
    this.deleteuser = this.deleteuser.bind(this);
  }

  public async getuser(req: any) {
    let response: ApiResponse;
    try {
      const userId: string = req.body.user.id;
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
      const userId: string = req.body.user.id;
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
      const role: UserRole = req.body.user.role;
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

  public async createUserByAdmin(req: any) {
    let response: ApiResponse;
    try {
      const role: UserRole = req.body.user.role;
      if (role !== UserRole.ADMIN) {
        return new ApiResponse(httpStatusCode.forbidden, `Only admin can create users.`);
      }

      let user: User = await UserModel.findOne({ email: req.body.email });
      if (user) {
        return new ApiResponse(httpStatusCode.badRequest, `User with emailId ${req.body.email} already exists.`);
      }

      Util.validateBody(req.body);
      const userRole = req.body?.role ? UserRole[req.body.role.toUpperCase()] : UserRole.USER;
      const securePassword: string = await Util.generatePasswordHash(req.body.password);

      user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        role: userRole
      });
      response = new ApiResponse(httpStatusCode.success, 'User created successfully.', user);
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }
}