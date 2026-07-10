import { pool } from "../../db";
import type { IIssue } from "./issues.interface";

const createIssueIntoDB = async (payLoad: IIssue, reporterId: number) => {
  const { title, description, type, status } = payLoad;

  const result = await pool.query(
    `
        INSERT INTO issues(title, description, type, status, reporter_id) VALUES($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *         
        `,
    [title, description, type, status, reporterId],
  );

  return result.rows[0];
};

const getALLIssueFromDB = async (queryParams: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  const { sort = "newest", type, status } = queryParams;

  let query = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: any[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type=$${values.length}`);
  }
  if (status) {
    values.push(status);
    conditions.push(`status=$${values.length}`);
  }
  if (conditions.length) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}`;

  const issueResult = await pool.query(query, values);
  const issues = issueResult.rows;

  if (issues.length === 0) {
    return [];
  }
  // Unique reporter ids
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  // Fetch reporters WITHOUT JOIN
  const reporterResult = await pool.query(
    `
      SELECT
        id,
        name,
        role
      FROM users
      WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  // Create reporter lookup map
  const reporterMap = new Map<
    number,
    {
      id: number;
      name: string;
      role: string;
    }
  >();

  reporterResult.rows.forEach((reporter) => {
    reporterMap.set(reporter.id, reporter);
  });

  // Merge reporter with issues
  const formattedIssues = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: reporterMap.get(issue.reporter_id),

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return formattedIssues;
};

const getSingleIssueFromDB = async (id: number) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);

  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }
  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id=$1
    `,
    [issue.reporter_id],
  );

  const reporter = reporterResult.rows[0];
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter,

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssueIntoDB = async (issueId: number, payload: Partial<IIssue>, user: any) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id=$1`,[issueId]
  )
  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }
  const issue = issueResult.rows[0];
  if (user.role !== "maintainer") {
    if (user.role !== "contributor") {
      throw new Error("Unauthorized access");
    }
      if (issue.reporter_id !== user.id) {
      throw new Error("You can update only your own issue");
    }
    if (issue.status !== "open") {
      throw new Error("Only open issues can be updated");
    }
  }
  const { title, description, type } = payload;
   const result = await pool.query(
    `
    UPDATE issues

    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      updated_at = NOW()

    WHERE id = $4

    RETURNING *
    `,
    [
      title,
      description,
      type,
      issueId,
    ]
  );
  return result.rows[0];

}
const deleteIssueFromDB = async (issueId: number, user: any) => {
    if (user.role !== "maintainer") {
    throw new Error("Only maintainer can delete issues.");
  }
   const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [issueId]
  );
   if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }
  await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    `,
    [issueId]
  );
}
export const issueService = {
  createIssueIntoDB,
  getALLIssueFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
deleteIssueFromDB
};
