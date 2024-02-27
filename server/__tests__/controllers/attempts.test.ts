import request from 'supertest';
import app from '../../src/app';
import { verifyAccess } from '../../src/middleware/verifyAccess';
import { AttemptService } from '../../src/services/attemptService';
import { Attempt, Challenge } from '../../src/database/models';
import { PointService } from '../../src/services/pointService';
import { BadgeService } from '../../src/services/badgeService';

const mockCommit = jest.fn();

// Mock the verifyAccess middleware
jest.mock('../../src/middleware/verifyAccess', () => ({
	verifyAccess: jest.fn((req, _res, next) => {
		req.payload = { userId: 1 };
		next();
	}),
}));

// Mock attemptService
jest.mock('../../src/services/attemptService', () => ({
	AttemptService: {
		checkIsCorrect: jest.fn(),
	},
}))

// Mock pointService
jest.mock('../../src/services/pointService', () => ({
	PointService: {
		awardPoints: jest.fn(),
	},
}));

// Mock pointService
jest.mock('../../src/services/badgeService', () => ({
	BadgeService: {
		awardBadges: jest.fn(),
	},
}));

// Mock challengeService
jest.mock('../../src/services/challengeService', () => ({
	ChallengeService: {
		removeAnswers: jest.fn(),
	},
}));

// Mock the DB model calls
jest.mock('../../src/database/models', () => {
	return {
		Challenge: {
			findByPk: jest.fn().mockReturnValue({}),
			scope: jest.fn().mockReturnThis(),
		},
		Attempt: {
			create: jest.fn(),
			sequelize: {
				transaction: jest.fn().mockImplementation(() => ({
					commit: () => mockCommit(),
					rollback: jest.fn(),
				})),
			},
		},
	}
});

beforeEach(async () => {
	jest.clearAllMocks();
});

describe('POST /attempts/:challengeId', () => {
	it('should require access token', async () => {
		const response = await request(app).post('/attempts/1');

		expect(verifyAccess).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('creates an attempt', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			id: 1,
			isSolvedOrExhausted: false,
			points: 100,
		} as Challenge);

		jest.mocked(AttemptService.checkIsCorrect).mockResolvedValue(true);

		await request(app).post('/attempts/1');

		expect(Attempt.create).toHaveBeenCalled();
		expect(mockCommit).toHaveBeenCalled();
	});

	it('returns 404 if challenge is not found', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue(null);

		const response = await request(app).post('/attempts/1');

		expect(response.statusCode).toBe(404);
	});

	it('returns 400 if challenge is already solved or exhausted', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			id: 1,
			isSolvedOrExhausted: true,
		} as Challenge);

		const response = await request(app).post('/attempts/1');

		expect(response.statusCode).toBe(400);
	});

	it('awards points if the attempt is correct', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			id: 1,
			isSolvedOrExhausted: false,
			points: 100,
		} as Challenge);

		jest.mocked(AttemptService.checkIsCorrect).mockResolvedValue(true);

		await request(app).post('/attempts/1');

		expect(PointService.awardPoints).toHaveBeenCalled();
	});

	it('awards badges if the attempt is correct', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			id: 1,
			isSolvedOrExhausted: false,
			points: 100,
		} as Challenge);

		jest.mocked(AttemptService.checkIsCorrect).mockResolvedValue(true);

		await request(app).post('/attempts/1');

		expect(BadgeService.awardBadges).toHaveBeenCalled();
	});

	it('does not award points if the attempt is incorrect', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			id: 1,
			isSolvedOrExhausted: false,
			points: 100,
		} as Challenge);

		jest.mocked(AttemptService.checkIsCorrect).mockResolvedValue(false);

		await request(app).post('/attempts/1');

		expect(PointService.awardPoints).not.toHaveBeenCalled();
	});
});
