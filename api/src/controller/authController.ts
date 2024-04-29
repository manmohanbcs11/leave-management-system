import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from "../common/apiResponse";
import { httpStatusCode } from "../common/httpStatusCodes";
import { UserRole } from '../common/userRole';
import { Util } from "../common/utils";
import EmployeeModel, { Employee } from "../models/EmployeeModel";

export class AuthController extends Util {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
  }

  public async signup(req: Request) {
    let response: ApiResponse;
    try {
      let user: Employee = await EmployeeModel.findOne({ email: req.body.email });
      if (user) {
        return new ApiResponse(httpStatusCode.badRequest, `User with emailId ${req.body.email} already exists.`);
      }

      Util.validateBody(req.body);
      const userRole = req.body.role ? UserRole[req.body.role.toUpperCase()] : UserRole.USER;
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

  public async login(req: Request) {
    let response: ApiResponse;
    try {
      Util.validateBody(req.body);
      const user: Employee = await EmployeeModel.findOne({ email: req.body.email });
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