import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { Attempt, Badge, Challenge } from "../database/models";
import { ChallengeService } from "../services/challengeService";
import { verifyAccess } from "../middleware/verifyAccess";
import { AttemptService } from "../services/attemptService";
import { PointService } from "../services/pointService";
import { BadgeService } from "../services/badgeService";

const router = Router();

router.post("/:challengeId", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const challengeId = parseInt(req.params.challengeId);
	const userId = req.payload!.userId;
	const userAnswer = req.body.userAnswer;

	const challenge = await Challenge
		.scope({ method: ['withUserAttempts', userId] })
		.findByPk(challengeId);
	if (!challenge) {
		return res.status(404).send("Challenge not found");
	}

	if (challenge.isSolvedOrExhausted) {
		return res.status(400).send("Challenge is already solved or exhausted");
	}

	const isCorrect = await AttemptService.checkIsCorrect(challenge, userAnswer);

	const t = await Attempt.sequelize!.transaction();
	let badges: Badge[] = [];
	try {
		await Attempt.create({
			userId,
			challengeId,
			isCorrect,
			...challenge.type === 'multiple-choice' ? { multipleChoiceOptionId: userAnswer } : { userAnswer },
		}, { transaction: t });

		if (isCorrect) {
			await PointService.awardPoints(userId, challengeId, challenge.points, t);
			badges = await BadgeService.awardBadges(userId, challengeId, t);
		}

		await t.commit();
	} catch (error) {
		await t.rollback();
		console.error(error);
		return res.status(500).send("Failed to save attempt");
	}

	// Fetch the updated challenge with the user's attempts
	const updatedChallenge = await Challenge
		.scope({ method: ['withUserAttempts', userId] })
		.findByPk(challengeId) as Challenge;

	if (!challenge.isSolvedOrExhausted) {
		ChallengeService.removeAnswers(updatedChallenge);
	}

	return res.json({ challenge: updatedChallenge, badges });
}));

export default router;