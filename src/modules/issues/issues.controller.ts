import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = req.user?.id;
    const result = await issueService.createIssueIntoDB(req.body, reporterId);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query;
    const result = await issueService.getALLIssueFromDB({
      sort: queryParams.sort as string,
      type: queryParams.type as string,
      status: queryParams.status as string,
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error:any) {
      sendResponse(res,{
            statusCode:500,
            success:false,
            message:error.message,
            error:error
        })
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const  id = Number(req.params.id);

    const result = await issueService.getSingleIssueFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: result
    });

  } catch (error:any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
      error
    })
  }
}
const updateIssue = async (req: Request, res: Response) => {
  try {
    const issueId  = Number(req.params.id);
    const result = await issueService.updateIssueIntoDB(issueId, req.body, req.user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue update successfully",
      data : result
    })
  } catch (error:any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
    });
  }
}

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const issueId = Number(req.params.id);
    await issueService.deleteIssueFromDB(issueId, req.user);
       sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error:any) {
     sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
    });
  }
}

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  
};
