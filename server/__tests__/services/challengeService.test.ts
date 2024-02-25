import { Challenge } from '../../src/database/models';
import { ChallengeService } from '../../src/services/challengeService';

describe('ChallengeService', () => {
	describe('removeAnswers method', () => {
		it('should remove answers correctly', async () => {
			const challenge = {
				shortAnswerOptions: [{ id: 1 }],
				multipleChoiceOptions: [{ id: 1, isCorrect: true }],
			} as Challenge;

			ChallengeService.removeAnswers(challenge);

			expect(challenge.shortAnswerOptions).toHaveLength(0);
			expect(challenge.multipleChoiceOptions[0].isCorrect).toBe(false);
		});
	});
});


