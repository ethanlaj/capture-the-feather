import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { Challenge } from "../database/models";
import { ChallengeService } from "../services/challengeService";
import { verifyAccess } from "../middleware/verifyAccess";

const router = Router();

router.get("/", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const challenges = await Challenge
		.scope({ method: ['withUserAttempts', req.payload!.userId] })
		.findAll();

	for (let challenge of challenges) {
		if (!challenge.isSolvedOrExhausted) {
			ChallengeService.removeAnswers(challenge);
		}
	}

	return res.json(challenges);
}));

export default router;