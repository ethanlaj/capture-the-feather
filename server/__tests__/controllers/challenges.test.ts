import request from 'supertest';
import app from '../../src/app';
import { verifyAccess } from '../../src/middleware/verifyAccess';
import { Challenge } from '../../src/database/models';

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
		Challenge: {
			findAll: jest.fn(),
			scope: jest.fn().mockReturnThis(),
		},
	}
});

beforeEach(async () => {
	jest.clearAllMocks();
});

describe('GET /challenges', () => {
	it('should require access token', async () => {
		await request(app).get('/challenges');

		expect(verifyAccess).toHaveBeenCalled();
	});

	it('gets all challenges', async () => {
		await request(app).get('/challenges');

		expect(Challenge.findAll).toHaveBeenCalled();
	});
});
