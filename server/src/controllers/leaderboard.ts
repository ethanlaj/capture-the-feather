import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { verifyAccess } from "../middleware/verifyAccess";
import { PointLog, User } from "../database/models";

const router = Router();

router.get("/", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const top10Users = await User.findAll({
		order: [
			['totalPoints', 'DESC']
		],
		limit: 10,
		include: [PointLog],
	});

	return res.json(top10Users);
}));

export default router;