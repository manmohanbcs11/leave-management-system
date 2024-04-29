import { Request } from 'express';
import { ApiResponse } from "../common/apiResponse";
import { httpStatusCode } from "../common/httpStatusCodes";
import { UserRole } from '../common/userRole';
import { Util } from "../common/utils";
import EmployeeModel, { Employee } from "../models/EmployeeModel";

export class UserController extends Util {
  constructor() {
    super();
    this.getuser = this.getuser.bind(this);
    this.updateuser = this.updateuser.bind(this);
    this.deleteuser = this.deleteuser.bind(this);
    this.createUserByAdmin = this.createUserByAdmin.bind(this);
  }

  public async getuser(req: Request) {
    let response: ApiResponse;
    try {
      const userId: string = req.body.user.id;
      console.log('Getting user details with id:', userId);
      const result: Employee = await EmployeeModel.findById(userId).exec();
      if (result) {
        result.password = undefined;
        response = new ApiResponse(httpStatusCode.success, `User fetched successfully.`, result);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `User not found.`);
      }
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async getUserManagers(req: Request) {
    let response: ApiResponse;
    try {
      const userId: string = req.body.user.id;
      console.log('Getting managers for user with id:', userId);
      const result: Employee = await EmployeeModel.findById(userId).exec();
      if (result) {
        const managerIds: string[] = result.managerIds;
        const managers = await EmployeeModel.find({ _id: { $in: managerIds } }).exec();
        const list = managers.map((manager) => ({
          id: manager._id,
          name: manager.name,
        }));
        response = new ApiResponse(httpStatusCode.success, `Managers fetched successfully.`, list);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `Managers not found.`, []);
      }
    } catch (err) {
      response = new ApiResponse(httpStatusCode.notFound, `Managers not found.`, []);
    }
    return response;
  }

  public async updateuser(req: Request) {
    let response: ApiResponse;
    try {
      const userId: string = req.body.user.id;
      console.log('Updating user details with id:', userId);
      const result: Employee = await EmployeeModel.findByIdAndUpdate(userId, req.body, { new: true });
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

  public async deleteuser(req: Request) {
    let response: ApiResponse;
    try {
      const emailId: string = req.params.emailid;
      const role: UserRole = req.body.user.role;
      if (role !== UserRole.ADMIN) {
        return new ApiResponse(httpStatusCode.forbidden, `Only admin can delete users.`);
      }

      console.log('Deleting user with emailId:', emailId);
      const result: Employee = await EmployeeModel.findOneAndDelete({ email: emailId });
      if (result) {
        result.password = undefined;
        response = new ApiResponse(httpStatusCode.success, `User deleted successfully.`, result);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `User not found.`);
      }
    } catch (err) {
      response = new ApiResponse(err.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async createUserByAdmin(req: Request) {
    let response: ApiResponse;
    try {
      const role: UserRole = req.body.user.role;
      if (role !== UserRole.ADMIN) {
        return new ApiResponse(httpStatusCode.forbidden, `Only admin can create users.`);
      }

      let user: Employee = await EmployeeModel.findOne({ email: req.body.email });
      if (user) {
        return new ApiResponse(httpStatusCode.badRequest, `User with emailId ${req.body.email} already exists.`);
      }

      Util.validateBody(req.body);
      const userRole = req.body?.role ? UserRole[req.body.role.toUpperCase()] : UserRole.USER;
      const securePassword: string = await Util.generatePasswordHash(req.body.password);

      user = await EmployeeModel.create({
        name: req.body.name,
        empId: req.body.empId,
        email: req.body.email,
        password: securePassword,
        role: userRole,
        department: req.body.department,
        jobTitle: req.body?.jobTitle,
        managerIds: req.body?.managerIds,
        leaveBalance: req.body?.leaveBalance,
        createdDate: Date.now(),
        updatedDate: Date.now()
      });

      user.password = undefined;
      response = new ApiResponse(httpStatusCode.success, 'User created successfully.', user);
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }
}