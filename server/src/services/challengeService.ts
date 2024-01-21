import { Challenge } from "../database/models";

export class ChallengeService {
	static isSolvedOrExhausted(challenge: Challenge) {
		const attempts = challenge.attempts;
		const maxAttempts = challenge.maxAttempts;
		const attemptsLeft = maxAttempts - attempts.length;
		const isSolved = attempts.some(attempt => attempt.isCorrect);

		return attemptsLeft <= 0 || isSolved;
	}

	static removeAnswers(challenge: Challenge) {
		challenge.shortAnswerOptions = [];
		for (let option of challenge.multipleChoiceOptions) {
			option.isCorrect = false;
		}
	}
}