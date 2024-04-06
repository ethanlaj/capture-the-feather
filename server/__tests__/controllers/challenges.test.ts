import request from 'supertest';
import app from '../../src/app';
import { verifyAccess } from '../../src/middleware/verifyAccess';
import { verifyIsAdmin } from '../../src/middleware/verifyIsAdmin';
import { Challenge, ChallengeFile, Container } from '../../src/database/models';
import path from 'path';

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
			findOne: jest.fn().mockReturnValue({}),
			findAll: jest.fn().mockResolvedValue([]),
			create: jest.fn(),
			destroy: jest.fn(),
			sequelize: {
				transaction: jest.fn().mockResolvedValue({
					commit: jest.fn(),
					rollback: jest.fn(),
				}),
			}
		},
		ChallengeFile: {
			findByPk: jest.fn().mockReturnValue({}),
			bulkCreate: jest.fn(),
			destroy: jest.fn(),
		}
	}
});

jest.mock('../../src/services/kubernetesService', () => ({
	KubernetesService: {
		createDeployment: jest.fn(),
		deleteDeployment: jest.fn(),
		getAllDeployments: jest.fn(),
	},
}));

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

	it('should create a challenge', async () => {
		const response = await request(app)
			.post('/challenges/admin')
			.field('challenge', JSON.stringify({}))

		expect(response.statusCode).toBe(201);
		expect(Challenge.create).toHaveBeenCalled();
	});

	it('should handle file uploads', async () => {
		jest.mocked(Challenge.create).mockResolvedValue({ id: 1 });

		const filePath = path.join(__dirname, '../../challengeFiles/challenges.test-file.ts');

		const response = await request(app)
			.post('/challenges/admin')
			.field('challenge', JSON.stringify({}))
			.attach('files', filePath);

		expect(response.statusCode).toBe(201);
		expect(ChallengeFile.bulkCreate).toHaveBeenCalled();
	});
});

describe('PUT challenges/admin/:id', () => {
	it('should require admin token', async () => {
		await request(app).put('/challenges/admin/1');

		expect(verifyIsAdmin).toHaveBeenCalled();
	});

	it('should return 404 if challenge not found', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue(null);

		const response = await request(app)
			.put('/challenges/admin/1')
			.field('challenge', JSON.stringify({}))

		expect(response.statusCode).toBe(404);
	});

	it('should update a challenge if exists', async () => {
		const updateFn = jest.fn();
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			update: updateFn,
		} as unknown as Challenge);

		const response = await request(app)
			.put('/challenges/admin/1')
			.field('challenge', JSON.stringify({}))

		expect(response.statusCode).toBe(201);
		expect(updateFn).toHaveBeenCalled();
	});

	it('should handle file deletions', async () => {
		const updateFn = jest.fn();
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			update: updateFn,
			files: [], // Testing the unlinking of files isn't the goal of this test
		} as unknown as Challenge);

		const response = await request(app)
			.put('/challenges/admin/1')
			.field('challenge', JSON.stringify({
				filesToDelete: [1, 2, 3],
			}))

		expect(response.statusCode).toBe(201);
		expect(ChallengeFile.destroy).toHaveBeenCalled();
	});

	it('should handle file uploads', async () => {
		const updateFn = jest.fn();
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			update: updateFn,
		} as unknown as Challenge);

		const filePath = path.join(__dirname, '../../challengeFiles/challenges.test-file.ts');

		const response = await request(app)
			.put('/challenges/admin/1')
			.field('challenge', JSON.stringify({}))
			.attach('files', filePath);

		expect(response.statusCode).toBe(201);
		expect(ChallengeFile.bulkCreate).toHaveBeenCalled();
	});
});

describe('DELETE challenges/:id', () => {
	it('should require admin token', async () => {
		await request(app).delete('/challenges/1');

		expect(verifyIsAdmin).toHaveBeenCalled();
	});

	it('should return 404 if challenge not found', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue(null);

		const response = await request(app).delete('/challenges/1');

		expect(response.statusCode).toBe(404);
	});

	it('should delete a challenge if exists', async () => {
		const destroyFn = jest.fn();
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			destroy: destroyFn,
			files: []
		} as unknown as Challenge);

		const response = await request(app).delete('/challenges/1');

		expect(response.statusCode).toBe(200);
		expect(destroyFn).toHaveBeenCalled();
		expect(ChallengeFile.destroy).toHaveBeenCalled();
	});
});

describe('GET challenges/containers', () => {
	it('should require admin token', async () => {
		const response = await request(app).get('/challenges/containers');

		expect(verifyIsAdmin).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('should return all containers', async () => {
		const response = await request(app).get('/challenges/containers');

		expect(Container.findAll).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});

describe('GET challenges/:id/container', () => {
	it('should require access token', async () => {
		await request(app).get('/challenges/1/container');

		expect(verifyAccess).toHaveBeenCalled();
	});

	it('should return the container if found in DB', async () => {
		const response = await request(app).get('/challenges/1/container');

		expect(Container.findOne).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
		expect(response.body).not.toBeNull();
	});

	it('should return null if container not found in DB', async () => {
		jest.mocked(Container.findOne).mockResolvedValue(null);

		const response = await request(app).get('/challenges/1/container');

		expect(Container.findOne).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
		expect(response.body).toBeNull();
	});
});

describe('POST challenges/:id/container', () => {
	it('should require access token', async () => {
		await request(app).post('/challenges/1/container');

		expect(verifyAccess).toHaveBeenCalled();
	});

	it('should return 404 if challenge not found', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue(null);

		const response = await request(app).post('/challenges/1/container');

		expect(response.statusCode).toBe(404);
	});

	it('should return 400 if challenge already solved or exhausted', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			isSolvedOrExhausted: true,
			containerPorts: [1, 2, 3],
			containerImage: 'test-image',
		} as unknown as Challenge);

		const response = await request(app).post('/challenges/1/container');

		expect(response.statusCode).toBe(400);
	});

	it('should return 400 if challenge doesn\'t have a container', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			isSolvedOrExhausted: false,
			containerPorts: [1, 2, 3],
		} as unknown as Challenge);

		const response = await request(app).post('/challenges/1/container');

		expect(response.statusCode).toBe(400);
	});

	it('should return 400 if container doesn\'t have ports', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			isSolvedOrExhausted: false,
			containerImage: 'test-image',
		} as unknown as Challenge);

		const response = await request(app).post('/challenges/1/container');

		expect(response.statusCode).toBe(400);
	});

	it('should return 400 if container already exists in the DB for the user', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			isSolvedOrExhausted: false,
			containerImage: 'test-image',
			containerPorts: [1, 2, 3],
		} as unknown as Challenge);

		jest.mocked(Container.findOne).mockResolvedValue({} as Container);

		const response = await request(app).post('/challenges/1/container');

		expect(response.statusCode).toBe(400);
	});

	it('should create a container for the challenge', async () => {
		jest.mocked(Challenge.findByPk).mockResolvedValue({
			isSolvedOrExhausted: false,
			containerImage: 'test-image',
			containerPorts: [1, 2, 3],
		} as unknown as Challenge);

		jest.mocked(Container.findOne).mockResolvedValue(null);

		const response = await request(app).post('/challenges/1/container');

		expect(response.statusCode).toBe(200);
		expect(Container.create).toHaveBeenCalled();
	});
});

describe('DELETE challenges/:id/container', () => {
	it('should require access token', async () => {
		await request(app).delete('/challenges/1/container');

		expect(verifyAccess).toHaveBeenCalled();
	});

	it('should return 404 if container not found', async () => {
		jest.mocked(Container.findOne).mockResolvedValue(null);

		const response = await request(app).delete('/challenges/1/container');

		expect(response.statusCode).toBe(404);
	});

	it('should delete a container if exists', async () => {
		const destroyFn = jest.fn();
		jest.mocked(Container.findOne).mockResolvedValue({
			destroy: destroyFn,
			update: jest.fn(),
		} as unknown as Container);

		const response = await request(app).delete('/challenges/1/container');

		expect(response.statusCode).toBe(200);
		expect(destroyFn).toHaveBeenCalled();
	});
});

describe('GET challenges/admin', () => {
	it('should require admin token', async () => {
		const response = await request(app).get('/challenges/admin');

		expect(verifyIsAdmin).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});

	it('should return all challenges', async () => {
		const response = await request(app).get('/challenges/admin');

		expect(Challenge.findAll).toHaveBeenCalled();
		expect(response.statusCode).toBe(200);
	});
});