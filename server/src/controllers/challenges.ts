import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { Attempt, Challenge } from "../database/models";
import { ChallengeService } from "../services/challengeService";
import { verifyAccess } from "../middleware/verifyAccess";

const router = Router();

interface ExtendedChallenge extends Challenge {
	isSolvedOrExhausted: boolean;
}

router.get("/", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const challenges = await Challenge.findAll({
		include: [{
			model: Attempt,
			where: { userId: req.payload!.userId },
		}]
	}) as ExtendedChallenge[];

	for (let challenge of challenges) {
		challenge.isSolvedOrExhausted = ChallengeService.isSolvedOrExhausted(challenge);

		if (challenge.isSolvedOrExhausted) {
			ChallengeService.removeAnswers(challenge);
		}
	}

	return res.json(challenges);
}));

export default router;