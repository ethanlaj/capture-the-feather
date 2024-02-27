import request from 'supertest';
import app from '../../src/app';
import { verifyAccess } from '../../src/middleware/verifyAccess';
import { PointLog, User } from '../../src/database/models';

// Mock the verifyAccess middleware
jest.mock('../../src/middleware/verifyAccess', () => ({
	verifyAccess: jest.fn((req, _res, next) => {
		req.payload = { userId: 1 };
		next();
	}),
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
		User: {
			findAll: jest.fn().mockResolvedValue([]),
		},
		PointLog: {
			findAll: jest.fn().mockResolvedValue([]),
		}
	}
});

beforeEach(async () => {
	jest.clearAllMocks();
});

describe('GET /leaderboard', () => {
	it('should require access token', async () => {
		const response = await request(app).get('/leaderboard');

		expect(verifyAccess).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('gets the leaderboard', async () => {
		jest.mocked(User.findAll).mockResolvedValue([
			{ id: 1, name: 'User1', totalPoints: 100 },
			{ id: 2, name: 'User2', totalPoints: 90 },
		] as User[]);

		jest.mocked(PointLog.findAll).mockResolvedValue([
			{ userId: 1, pointsAwarded: 100, awardedAt: new Date() },
			{ userId: 2, pointsAwarded: 90, awardedAt: new Date() },
		] as PointLog[]);

		const response = await request(app).get('/leaderboard');

		expect(response.statusCode).toBe(200);
	});
});
