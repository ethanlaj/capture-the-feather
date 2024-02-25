import { Challenge, PointLog, User } from '../../src/database/models';
import { PointService } from '../../src/services/pointService';

// Mock the DB model calls
jest.mock('../../src/database/models', () => {
	return {
		Challenge: {
			findByPk: jest.fn(),
		},
		User: {
			findByPk: jest.fn(),
		},
		PointLog: {
			create: jest.fn(),
		},
	}
});

describe('PointService', () => {
	describe('awardPoints method', () => {
		it('should throw Error if user not found', async () => {
			jest.mocked(User.findByPk).mockResolvedValue(null);
			jest.mocked(Challenge.findByPk).mockResolvedValue({} as Challenge);

			await expect(PointService.awardPoints(1, 1, 1, {} as any))
				.rejects
				.toThrow('User or challenge not found');
		});

		it('should throw Error if user not found', async () => {
			jest.mocked(Challenge.findByPk).mockResolvedValue(null);
			jest.mocked(User.findByPk).mockResolvedValue({} as User);

			await expect(PointService.awardPoints(1, 1, 1, {} as any))
				.rejects
				.toThrow('User or challenge not found');
		});

		it('should increment points if positive', async () => {
			const user = { id: 1, increment: jest.fn() } as unknown as User;
			const challenge = { id: 1 } as Challenge;
			jest.mocked(User.findByPk).mockResolvedValue(user);
			jest.mocked(Challenge.findByPk).mockResolvedValue(challenge);

			await PointService.awardPoints(1, 1, 1, {} as any);

			expect(user.increment).toHaveBeenCalledWith('totalPoints', { by: 1, transaction: {} });
		});

		it('should decrement points if negative', async () => {
			const user = { id: 1, decrement: jest.fn() } as unknown as User;
			const challenge = { id: 1 } as Challenge;
			jest.mocked(User.findByPk).mockResolvedValue(user);
			jest.mocked(Challenge.findByPk).mockResolvedValue(challenge);

			await PointService.awardPoints(1, 1, -1, {} as any);

			expect(user.decrement).toHaveBeenCalledWith('totalPoints', { by: 1, transaction: {} });
		});

		it('should create point log', async () => {
			const user = { id: 1, increment: jest.fn() } as unknown as User;
			const challenge = { id: 1 } as Challenge;
			jest.mocked(User.findByPk).mockResolvedValue(user);
			jest.mocked(Challenge.findByPk).mockResolvedValue(challenge);

			await PointService.awardPoints(1, 1, 1, {} as any);

			expect(PointLog.create).toHaveBeenCalledWith({
				userId: 1,
				challengeId: 1,
				pointsAwarded: 1,
			}, { transaction: {} });
		});
	});
});


