import { Challenge, MultipleChoiceOption, ShortAnswerOption } from '../../src/database/models';
import { AttemptService } from '../../src/services/attemptService';

const multipleChoiceChallenge = {
	type: 'multiple-choice',
	multipleChoiceOptions: [
		{ id: 1, isCorrect: false },
		{ id: 2, isCorrect: true },
	],
} as Challenge;

const shortAnswerChallengeRegex = {
	type: 'short-answer',
	shortAnswerOptions: [
		{ matchMode: 'regex', value: '^test$' }
	],
} as Challenge;

const shortAnswerChallengeStatic = {
	type: 'short-answer',
	shortAnswerOptions: [
		{ matchMode: 'static', value: 'Test', isCaseSensitive: false }
	],
} as Challenge;

const shortAnswerChallengeStaticCaseSensitive = {
	type: 'short-answer',
	shortAnswerOptions: [
		{ matchMode: 'static', value: 'Test', isCaseSensitive: true }
	],
} as Challenge;

describe('AttemptService', () => {
	describe('checkIsCorrect method', () => {
		it('should correctly identify a correct multiple-choice answer', async () => {
			const spy = jest.spyOn(AttemptService, 'isMultipleChoiceCorrect');
			await AttemptService.checkIsCorrect(multipleChoiceChallenge, '2');
			expect(spy).toHaveBeenCalled();
		});

		it('should correctly identify a correct short-answer (regex match)', async () => {
			const spy = jest.spyOn(AttemptService, 'isShortAnswerCorrect');

			await AttemptService.checkIsCorrect(shortAnswerChallengeRegex, 'test');
			expect(spy).toHaveBeenCalled();
		});

		it('should throw an error for unsupported challenge types', async () => {
			await expect(AttemptService.checkIsCorrect({ type: 'essay' } as any, 'answer'))
				.rejects.toThrow(expect.any(Error));
		});
	});

	describe('isMultipleChoiceCorrect method', () => {
		it('should return true for a correct multiple-choice answer', async () => {
			const isCorrect = await AttemptService.isMultipleChoiceCorrect(multipleChoiceChallenge, '2');
			expect(isCorrect).toBe(true);
		});

		it('should return false for an incorrect multiple-choice answer', async () => {
			const isCorrect = await AttemptService.isMultipleChoiceCorrect(multipleChoiceChallenge, '1');
			expect(isCorrect).toBe(false);
		});
	});

	describe('isShortAnswerCorrect method', () => {
		it('should return true for a correct short-answer match (regex)', async () => {
			const isCorrect = await AttemptService.isShortAnswerCorrect(shortAnswerChallengeRegex, 'test');
			expect(isCorrect).toBe(true);
		});

		it('should return false for an incorrect short-answer (regex)', async () => {
			const isCorrect = await AttemptService.isShortAnswerCorrect(shortAnswerChallengeRegex, 'wrong answer');
			expect(isCorrect).toBe(false);
		});

		it('should return true for a correct short-answer match (static, case insensitive)', async () => {
			const isCorrect = await AttemptService.isShortAnswerCorrect(shortAnswerChallengeStatic, 'Test');
			expect(isCorrect).toBe(true);
		});

		it('should return true for a correct short-answer match (static, case insensitive)', async () => {
			const isCorrect = await AttemptService.isShortAnswerCorrect(shortAnswerChallengeStatic, 'test');
			expect(isCorrect).toBe(true);
		});

		it('should return false for an incorrect short-answer (static, case insensitive)', async () => {
			const isCorrect = await AttemptService.isShortAnswerCorrect(shortAnswerChallengeStatic, 'WOW');
			expect(isCorrect).toBe(false);
		});

		it('should return true for a correct short-answer match (static, case sensitive)', async () => {
			const isCorrect = await AttemptService.isShortAnswerCorrect(shortAnswerChallengeStaticCaseSensitive, 'Test');
			expect(isCorrect).toBe(true);
		});

		it('should return false for an incorrect short-answer (static, case sensitive)', async () => {
			const isCorrect = await AttemptService.isShortAnswerCorrect(shortAnswerChallengeStaticCaseSensitive, 'test');
			expect(isCorrect).toBe(false);
		});
	});
});


