import { Request } from "express";
import fs from 'fs';
import path from 'path';
import { ApiResponse } from "../common/apiResponse";
import { httpStatusCode } from "../common/httpStatusCodes";
import { UserRole } from "../common/userRole";
import { Util } from "../common/utils";
import LeaveCalendar from "../models/LeaveCalendar";


export class LeaveCalendarController extends Util {
  constructor() {
    super();
    this.populateLeaveCalendar = this.populateLeaveCalendar.bind(this);
  }

  public async populateLeaveCalendar(req: Request) {
    const role: UserRole = req.body.user.role;
    if (role !== UserRole.ADMIN) {
      return new ApiResponse(httpStatusCode.forbidden, `Only admin can create leave calendar.`);
    }

    let response: ApiResponse;
    const year = req.body.year;
    const country = req.body.country;
    const csvFilePath = req.body.csvFilePath;

    const existingData = await LeaveCalendar.find({ year, country });
    if (!Util.isEmpty(existingData)) {
      return new ApiResponse(httpStatusCode.forbidden, `Leave calendar already exists for ${country}-${year}, please delete it first to recreate.`);
    }

    console.log(`Creating leave calendar for ${country}-${year}`);
    const leaveCalendarList = [];

    try {
      const csvData = fs.readFileSync(path.resolve(csvFilePath), 'utf8');
      const lines = csvData.trim().split('\n');
      for (let i = 1; i < lines.length; i++) {
        const eachLine = lines[i].split(',');
        const leaveName = eachLine[0];
        const date = eachLine[1];
        const day = eachLine[2];
        leaveCalendarList.push(new LeaveCalendar({
          leaveName,
          year,
          date,
          day,
          country
        }));
      }

      await LeaveCalendar.insertMany(leaveCalendarList);
      console.log(`Calendar created successfully for ${country}-${year}`);
      response = new ApiResponse(httpStatusCode.success, `Calendar created successfully for ${country}-${year}`);
    } catch (err) {
      console.error(err);
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }

    return response;
  }

  public async deleteLeaveCalendar(req: Request) {
    const role: UserRole = req.body.user.role;
    if (role !== UserRole.ADMIN) {
      return new ApiResponse(httpStatusCode.forbidden, `Only admin can delete a leave calendar.`);
    }

    let response: ApiResponse;
    const year = req.body.year;
    const country = req.body.country;
    console.log(`Deleting leave calendar for ${country}-${year}`);

    const existingData = await LeaveCalendar.find({ year, country });
    if (Util.isEmpty(existingData)) {
      return new ApiResponse(httpStatusCode.forbidden, `No calendar found for ${country}-${year}`);
    }

    try {
      await LeaveCalendar.deleteMany({ year, country });
      console.log(`Calendar deleted successfully for ${country}-${year}`);
      response = new ApiResponse(httpStatusCode.success, `Calendar deleted successfully for ${country}-${year}`);
    } catch (err) {
      console.error(err);
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }

    return response;
  }
}