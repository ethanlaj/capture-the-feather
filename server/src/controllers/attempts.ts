import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { Attempt, Challenge } from "../database/models";
import { ChallengeService } from "../services/challengeService";
import { verifyAccess } from "../middleware/verifyAccess";
import { AttemptService } from "../services/attemptService";

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

	await Attempt.create({
		userId,
		challengeId,
		isCorrect: await AttemptService.checkIsCorrect(challenge, userAnswer),
		...challenge.type === 'multiple-choice' ? { multipleChoiceOptionId: userAnswer } : { userAnswer },
	});

	// Fetch the updated challenge with the user's attempts
	const updatedChallenge = await Challenge
		.scope({ method: ['withUserAttempts', userId] })
		.findByPk(challengeId) as Challenge;

	if (!challenge.isSolvedOrExhausted) {
		ChallengeService.removeAnswers(updatedChallenge);
	}

	return res.json(updatedChallenge);
}));

export default router;