import { Challenge } from "../database/models";

export class ChallengeService {
	static removeAnswers(challenge: Challenge) {
		challenge.shortAnswerOptions = [];
		for (let option of challenge.multipleChoiceOptions) {
			option.isCorrect = false;
		}
	}
}