import request from 'supertest';
import app from '../../src/app';
import { verifyAccess } from '../../src/middleware/verifyAccess';
import { Badge } from '../../src/database/models';

// Mock the verifyAccess middleware
jest.mock('../../src/middleware/verifyAccess', () => ({
	verifyAccess: jest.fn((req, _res, next) => {
		req.payload = { userId: 1 };
		next();
	}),
}));

// Mock the DB model calls
jest.mock('../../src/database/models', () => {
	return {
		Badge: {
			findAll: jest.fn().mockResolvedValue([
				{
					userBadges: [],
					setDataValue: jest.fn(),
				},
			]),
		},
	}
});

beforeEach(async () => {
	jest.clearAllMocks();
});

describe('GET /badges', () => {
	it('should require access token', async () => {
		const response = await request(app).get('/badges');

		expect(verifyAccess).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('gets the badges', async () => {
		const response = await request(app).get('/badges');

		expect(response.statusCode).toBe(200);
	});
});
