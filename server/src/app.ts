import express, { Express, Request, Response } from "express";
import cors from "cors";
import usersRouter from "./controllers/users";
import meRouter from "./controllers/me";
import challengesRouter from "./controllers/challenges";
import attemptsRouter from "./controllers/attempts";
import leaderboardRouter from "./controllers/leaderboard";
import badgeRouter from "./controllers/badges";
import configurationRouter from "./controllers/configuration";

const app: Express = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

app.use("/users", usersRouter);
app.use("/me", meRouter);
app.use("/challenges", challengesRouter);
app.use("/attempts", attemptsRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/badges", badgeRouter);
app.use("/configuration", configurationRouter);

export default app;
