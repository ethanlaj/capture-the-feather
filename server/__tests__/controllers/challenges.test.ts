import request from 'supertest';
import app from '../../src/app';
import { verifyAccess } from '../../src/middleware/verifyAccess';
import { verifyIsAdmin } from '../../src/middleware/verifyIsAdmin';
import { Challenge, ChallengeFile } from '../../src/database/models';

// Mock the verifyAccess middleware
jest.mock('../../src/middleware/verifyAccess', () => ({
	verifyAccess: jest.fn((req, _res, next) => {
		req.payload = { userId: 1 };
		next();
	}),
}));

jest.mock('../../src/middleware/verifyIsAdmin', () => ({
	verifyIsAdmin: jest.fn((req, _res, next) => {
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
			findByPk: jest.fn().mockReturnValue({}),
			findAll: jest.fn().mockResolvedValue([]),
			scope: jest.fn().mockReturnThis(),
			create: jest.fn(),
			sequelize: {
				transaction: jest.fn().mockResolvedValue({
					commit: jest.fn(),
					rollback: jest.fn(),
				}),
			}
		},
		Container: {
			findByPk: jest.fn().mockReturnValue({}),
			findAll: jest.fn().mockResolvedValue([]),
		},
		ChallengeFile: {
			findByPk: jest.fn().mockReturnValue({}),
		}
	}
});

beforeEach(async () => {
	jest.clearAllMocks();
});

describe('GET /challenges', () => {
	it('should require access token', async () => {
		const response = await request(app).get('/challenges');

		expect(verifyAccess).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('gets all challenges', async () => {
		await request(app).get('/challenges');

		expect(Challenge.findAll).toHaveBeenCalled();
	});
});

describe('GET challenges/admin/:id', () => {
	it('should require admin token', async () => {
		const response = await request(app).get('/challenges/admin/1');

		expect(verifyIsAdmin).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('should return the challenge if found in DB', async () => {
		const response = await request(app).get('/challenges/admin/1');

		expect(Challenge.findByPk).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('should return 404 if challenge not found in DB', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue(null);

		const response = await request(app).get('/challenges/admin/1');

		expect(Challenge.findByPk).toHaveBeenCalled();
		expect(response.statusCode).toBe(404);
	});
});

describe('GET challenges/file/:id', () => {
	beforeEach(() => {
		jest.mocked(ChallengeFile.findByPk).mockResolvedValue({
			id: 1,
			filename: 'file.txt',
			path: 'challengeFiles/challenges.test-file.ts',
		} as ChallengeFile);
	});

	it('should require access token', async () => {
		const response = await request(app).get('/challenges/file/1');

		expect(verifyAccess).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('should return a file if it exists in DB', async () => {
		const response = await request(app).get('/challenges/file/1');

		expect(ChallengeFile.findByPk).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('should return a 404 is file doesn\'t exist in DB', async () => {
		jest.mocked(ChallengeFile.findByPk).mockResolvedValue(null);

		const response = await request(app).get('/challenges/file/1');

		expect(ChallengeFile.findByPk).toHaveBeenCalled();
		expect(response.statusCode).toBe(404);
	});
});

describe('POST challenges/admin', () => {
	it('should require admin token', async () => {
		await request(app).post('/challenges/admin');

		expect(verifyIsAdmin).toHaveBeenCalled();
	});

	it('should create a multiple choice challenge challenge', async () => {
		const json = {
			category: 'category',
			title: 'title',
			shortDescription: 'shortDescription',
			description: 'description',
			type: 'type',
			pointsType: 'pointsType',
			points: 1,
			maxAttempts: 1,
			isContainer: true,
			challengeType: 'multiple-choice',
			multipleChoiceOptions: [
				{
					value: 'value',
				}
			]
		}

		const response = await request(app)
			.post('/challenges/admin')
			.field('challenge', JSON.stringify(json))

		expect(response.statusCode).toBe(201);
		expect(Challenge.create).toHaveBeenCalled();
	});
});

describe('PUT challenges/admin/:id', () => {
	it('should require admin token', async () => {
		const response = await request(app).put('/challenges/admin/1');

		expect(verifyIsAdmin).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});

describe('DELETE challenges/:id', () => {
	it('should require admin token', async () => {
		const response = await request(app).delete('/challenges/1');

		expect(verifyIsAdmin).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});

describe('GET challenges/containers', () => {
	it('should require admin token', async () => {
		const response = await request(app).get('/challenges/containers');

		expect(verifyIsAdmin).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});

describe('GET challenges/:id/container', () => {
	it('should require access token', async () => {
		const response = await request(app).get('/challenges/1/container');

		expect(verifyAccess).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});

describe('POST challenges/:id/container', () => {
	it('should require access token', async () => {
		const response = await request(app).post('/challenges/1/container');

		expect(verifyAccess).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});

describe('DELETE challenges/:id/container', () => {
	it('should require access token', async () => {
		const response = await request(app).delete('/challenges/1/container');

		expect(verifyAccess).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});

describe('GET challenges/admin', () => {
	it('should require admin token', async () => {
		const response = await request(app).get('/challenges/admin');

		expect(verifyIsAdmin).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});