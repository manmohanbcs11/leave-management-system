import { ApiResponse } from "../common/apiResponse";
import { httpStatusCode } from "../common/httpStatusCodes";
import { Util } from "../common/utils";

export class EmployeeController extends Util {
  constructor() {
    super();
    this.createEmployee = this.createEmployee.bind(this);
  }

  public async createEmployee(req: Request) {
    let response: ApiResponse;
    try {
      Util.validateBody(req.body);
    } catch (err) {
      response = new ApiResponse(err?.statusCode ? err.statusCode : httpStatusCode.internalServerError, err.message);
    }
    return response;
  }
}