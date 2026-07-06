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
      data: result
    })
    } catch (error:any) {
        sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error
    })
    }
}

export const issueController = {
    createIssue,
}