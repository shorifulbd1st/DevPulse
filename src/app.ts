import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import CookieParser from "cookie-parser"
import Cors from "cors"
import globalErrorHandler from "./middleware/globalErrorHandaler";
import { authRouter } from "./modules/auth/auth.router";
import { issuesRouter } from "./modules/issues/issues.router";

const app: Application = express();

app.use(CookieParser());

app.use(express.json());

const corsOptions = {
  origin: "http:/localhost:5000"
}

app.use(Cors(corsOptions))

app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello Express World!')
  res.status(200).json({
    message: "Express Server ",
    author: "Next Level Development",
  });
});

app.use("/api/auth", authRouter)
app.use("/api/issues", issuesRouter)


app.use(globalErrorHandler)
export default app;


