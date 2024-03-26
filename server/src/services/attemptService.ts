import { Challenge } from "../database/models";

export class AttemptService {
	static async checkIsCorrect(challenge: Challenge, userAnswer: string) {
		switch (challenge.type) {
			case 'multiple-choice': return this.isMultipleChoiceCorrect(challenge, userAnswer);
			case 'short-answer': return this.isShortAnswerCorrect(challenge, userAnswer);
			default: {
				throw new Error('Challenge type not supported in AttemptService');
			}
		}
	}

	static async isMultipleChoiceCorrect(challenge: Challenge, userAnswer: string) {
		const option = challenge.multipleChoiceOptions.find(option => option.id === parseInt(userAnswer));
		return option?.isCorrect || false;
	}

	static async isShortAnswerCorrect(challenge: Challenge, userAnswer: string) {
		const correctAnswers = challenge.shortAnswerOptions;

		for (let correctAnswer of correctAnswers) {
			if (correctAnswer.matchMode === 'regex') {
				const flags = correctAnswer.isCaseSensitive ? '' : 'i';

				const regExp = new RegExp(correctAnswer.value, flags);
				if (regExp.test(userAnswer)) {
					return true;
				}
			} else if (correctAnswer.matchMode === 'static') {
				const isCaseSensitive = correctAnswer.isCaseSensitive;
				if (!isCaseSensitive && correctAnswer.value.toLowerCase() === userAnswer.toLowerCase()) {
					return true;
				} else if (isCaseSensitive && correctAnswer.value === userAnswer) {
					return true;
				}
			}
		}

		return false;
	}
}