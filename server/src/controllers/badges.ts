import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { verifyAccess } from "../middleware/verifyAccess";
import { Badge, UserBadge } from "../database/models";

const router = Router();

router.get("/", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const userId = req.payload!.userId;
	const badges = await Badge.findAll(
		{
			include: { model: UserBadge }
		}
	);

	for (let badge of badges) {
		const isAwarded = badge.userBadges.filter((userBadge: UserBadge) => userBadge.userId === userId).length > 0;
		badge.setDataValue('isAwarded', isAwarded)
	}

	res.json(badges)
}));

export default router;