import { Request } from 'express';
import { ApiResponse } from "../common/apiResponse";
import { httpStatusCode } from "../common/httpStatusCodes";
import { Util } from "../common/utils";
import LeaveRequestModel, { LeaveRequest } from '../models/LeaveRequestModel';
import EmployeeModel, { Employee } from '../models/EmployeeModel';

export class LeaveController extends Util {
  constructor() {
    super();
    this.getAllLeaves = this.getAllLeaves.bind(this);
    this.getLeaveById = this.getLeaveById.bind(this);
    this.createLeave = this.createLeave.bind(this);
    this.updateLeave = this.updateLeave.bind(this);
    this.deleteLeaveById = this.deleteLeaveById.bind(this);
  }

  public async getAllLeaves(req: Request) {
    let response: ApiResponse;
    try {
      const userId: string = req.body.user.id;
      console.log('Getting all requested leaves for user with id:', userId);

      const result: LeaveRequest[] = await LeaveRequestModel.find({ userId: userId }).exec();
      response = new ApiResponse(httpStatusCode.success, `Leaves fetched successfully.`, result);
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async getLeaveById(req: Request) {
    let response: ApiResponse;
    try {
      const leaveId = req.params.id;
      console.log('Getting leave details with id:', leaveId);

      const result: LeaveRequest = await LeaveRequestModel.findById(leaveId).exec();
      if (result) {
        response = new ApiResponse(httpStatusCode.success, `Leave fetched successfully.`, result);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `Leave not found.`);
      }
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async createLeave(req: Request) {
    let response: ApiResponse;
    try {
      let leave: LeaveRequest = await LeaveRequestModel.findOne({ startDate: req.body.startDate, endDate: req.body.endDate, email: req.body.email });
      if (leave) {
        return new ApiResponse(httpStatusCode.badRequest, `You already have a leave request for this time period.`);
      }

      Util.validateBody(req.body);
      console.log('Creating leave request for user with id:', req.body.user.id);

      req.body.userId = req.body.user.id;
      req.body.createdDate = Date.now();
      req.body.updatedDate = Date.now();
      leave = await LeaveRequestModel.create(req.body);

      response = new ApiResponse(httpStatusCode.success, 'Leave request submitted successfully.', leave);
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async updateLeave(req: Request) {
    let response: ApiResponse;
    try {
      Util.validateBody(req.body);
      console.log('Updating leave details with id:', req.body.id);

      req.body.updatedDate = Date.now();
      const result: LeaveRequest = await LeaveRequestModel.findByIdAndUpdate(req.body.id, req.body, { new: true });
      if (result) {
        response = new ApiResponse(httpStatusCode.success, `Leave updated successfully.`, result);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `Leave not found.`);
      }
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

  public async deleteLeaveById(req: Request) {
    let response: ApiResponse;
    try {
      console.log('Deleting leave with id:', req.params.id);

      const result: LeaveRequest = await LeaveRequestModel.findByIdAndDelete(req.params.id);
      if (result) {
        response = new ApiResponse(httpStatusCode.success, `Leave deleted successfully.`, result);
      } else {
        response = new ApiResponse(httpStatusCode.notFound, `Leave not found.`);
      }
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }

}