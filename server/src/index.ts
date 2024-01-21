import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { load } from "./loaders";
import usersRouter from "./controllers/users";
import meRouter from "./controllers/me";
import challengesRouter from "./controllers/challenges";

const app: Express = express();
const port = process.env.PORT || 3001;

load();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

app.use("/users", usersRouter);
app.use("/me", meRouter);
app.use("/challenges", challengesRouter);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});