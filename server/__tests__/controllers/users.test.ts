import request from 'supertest';
import app from '../../src/app';
import { verifyIsAdmin } from '../../src/middleware/verifyIsAdmin';
import { User } from '../../src/database/models';

// Mock the verifyIsAdmin middleware
jest.mock('../../src/middleware/verifyIsAdmin', () => ({
	verifyIsAdmin: jest.fn((req, _res, next) => {
		req.payload = { userId: 1 };
		next();
	}),
}));

// Mock the DB model calls
jest.mock('../../src/database/models', () => {
	return {
		User: {
			findAll: jest.fn().mockResolvedValue([]),
		},
	}
});

beforeEach(async () => {
	jest.clearAllMocks();
});

describe('GET /users', () => {
	it('should require access token', async () => {
		const response = await request(app).get('/users');

		expect(verifyIsAdmin).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('gets the users', async () => {
		const response = await request(app).get('/users');

		expect(User.findAll).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});
