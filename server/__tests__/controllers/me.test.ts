import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcrypt';
import { verifyAccess } from '../../src/middleware/verifyAccess';
import { RefreshToken, User } from '../../src/database/models';
import jsonwebtoken from 'jsonwebtoken';

// Mock the verifyAccess middleware
jest.mock('../../src/middleware/verifyAccess', () => ({
	verifyAccess: jest.fn((req, _res, next) => {
		req.payload = { userId: 1 };
		next();
	}),
}));

jest.mock('jsonwebtoken', () => ({
	...jest.requireActual('jsonwebtoken'),
	verify: jest.fn(),
}));

// Mock the DB model calls
jest.mock('../../src/database/models', () => {
	return {
		User: {
			findByPk: jest.fn(),
			findOne: jest.fn(),
			create: jest.fn().mockResolvedValue({ id: 1, isAdmin: false }),
			count: jest.fn(),
		},
		RefreshToken: {
			findByPk: jest.fn(),
			create: jest.fn().mockResolvedValue({ id: 1 })
		},
	}
});

// mock bcrypt
jest.mock('bcrypt', () => ({
	...jest.requireActual('bcrypt'),
	compare: jest.fn(),
	hash: jest.fn(),
}));

beforeEach(async () => {
	jest.clearAllMocks();
	process.env.ACCESS_TOKEN_SECRET = 'secret';
	process.env.REFRESH_TOKEN_SECRET = 'secret';
});

describe('GET /me', () => {
	it('should require access token', async () => {
		await request(app).get('/me');

		expect(verifyAccess).toHaveBeenCalled();
	});

	it('gets the current user', async () => {
		const response = await request(app).get('/me');

		expect(User.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
		expect(response.statusCode).toBe(200);
	});
});

describe('POST /me/register', () => {
	it('should return 400 when missing body params', async () => {
		const response = await request(app).post('/me/register');

		expect(response.status).toBe(400);
	});

	it('should return 400 when email already exists', async () => {
		jest.mocked(User.findOne).mockResolvedValue({} as User);

		const response = await request(app).post('/me/register')
			.send({
				email: 'a',
				name: 'a',
				password: 'a',
			});

		expect(response.status).toBe(400);
	});

	it('should create the user with hashed password', async () => {
		jest.mocked(User.findOne).mockResolvedValue(null);
		jest.mocked(bcrypt.hash).mockImplementation((_data: string | Buffer, _saltOrRounds: string | number): Promise<string> => {
			return Promise.resolve('hashedPassword');
		});
		jest.mocked(User.count).mockResolvedValue(1);

		const response = await request(app).post('/me/register')
			.send({
				email: 'a',
				name: 'a',
				password: 'a',
			});

		expect(User.create).toHaveBeenCalledWith({
			email: 'a',
			name: 'a',
			passwordHash: 'hashedPassword',
			isAdmin: false,
		});
		expect(response.status).toBe(200);
	});

	it('first user should be created as an admin', async () => {
		jest.mocked(User.findOne).mockResolvedValue(null);
		jest.mocked(bcrypt.hash).mockImplementation((_data: string | Buffer, _saltOrRounds: string | number): Promise<string> => {
			return Promise.resolve('hashedPassword');
		});
		jest.mocked(User.count).mockResolvedValue(0);

		const response = await request(app).post('/me/register')
			.send({
				email: 'a',
				name: 'a',
				password: 'a',
			});

		expect(User.create).toHaveBeenCalledWith({
			email: 'a',
			name: 'a',
			passwordHash: 'hashedPassword',
			isAdmin: true,
		});
		expect(response.status).toBe(200);
	});
});

describe('POST /me/login', () => {
	it('should return 400 when missing body params', async () => {
		const response = await request(app).post('/me/login');

		expect(response.status).toBe(400);
	});

	it('should return 400 when user does not exist', async () => {
		jest.mocked(User.findOne).mockResolvedValue(null);

		const response = await request(app).post('/me/login')
			.send({
				email: 'a',
				password: 'a',
			});

		expect(response.status).toBe(400);
	});

	it('should return 400 when password is incorrect', async () => {
		jest.mocked(User.findOne).mockResolvedValue({} as User);
		jest.mocked(bcrypt.compare).mockImplementation((_data: string | Buffer, _encrypted: string): Promise<boolean> => {
			return Promise.resolve(false);
		});

		const response = await request(app).post('/me/login')
			.send({
				email: 'a',
				password: 'a',
			});

		expect(response.status).toBe(400);
	});

	it('should return tokens when password is correct', async () => {
		jest.mocked(User.findOne).mockResolvedValue({} as User);
		jest.mocked(bcrypt.compare).mockImplementation((_data: string | Buffer, _encrypted: string): Promise<boolean> => {
			return Promise.resolve(true);
		});

		const response = await request(app).post('/me/login')
			.send({
				email: 'a',
				password: 'a',
			});

		expect(response.status).toBe(200);
		expect(JSON.parse(response.text)).toHaveProperty('accessToken');
		expect(JSON.parse(response.text)).toHaveProperty('refreshToken');
	});
});

describe('POST /me/refresh', () => {
	it('should return 403 when no refresh token is provided', async () => {
		const response = await request(app).post('/me/refresh');

		expect(response.status).toBe(403);
		expect(response.text).toBe("Invalid refresh token");
	});

	it('should return 403 when refresh token is invalid', async () => {
		jest.mocked(jsonwebtoken.verify).mockImplementation(() => {
			throw new Error('Invalid token');
		});

		const response = await request(app).post('/me/refresh')
			.send({ token: 'invalidToken' });

		expect(response.status).toBe(403);
		expect(response.text).toBe("Invalid refresh token");
	});

	it('should return 403 when refresh token is not in DB', async () => {
		jest.mocked(jsonwebtoken.verify).mockImplementation(() => ({
			id: 1,
			userId: 1,
			isAdmin: false
		}));

		jest.mocked(RefreshToken.findByPk).mockResolvedValue(null);

		const response = await request(app).post('/me/refresh')
			.send({ token: 'validTokenNotInDB' });

		expect(response.status).toBe(403);
		expect(response.text).toBe("Invalid refresh token");
	});

	it('should return 200 and new tokens when refresh token is valid', async () => {
		// Mock the verification process to simulate a valid token
		jest.mocked(jsonwebtoken.verify).mockImplementation(() => ({
			id: 1,
			userId: 1,
			isAdmin: false
		}));

		const mockDestroyFn = jest.fn();
		jest.mocked(RefreshToken.findByPk).mockResolvedValue({
			id: 1,
			destroy: mockDestroyFn,
		} as unknown as RefreshToken);

		const response = await request(app).post('/me/refresh')
			.send({ token: 'validToken' });

		expect(response.status).toBe(200);
		expect(mockDestroyFn).toHaveBeenCalled();
		expect(response.body).toHaveProperty('accessToken');
		expect(response.body).toHaveProperty('refreshToken');
	});
});