import { Badge, Challenge, PointLog, User, UserBadge } from '../../src/database/models';
import { BadgeService } from '../../src/services/badgeService';

// Mock the DB model calls
jest.mock('../../src/database/models', () => {
	return {
		Challenge: {
			findByPk: jest.fn(),
			findAll: jest.fn(() => Promise.resolve([{ id: 1 }, { id: 2 }])),
		},
		User: {
			findByPk: jest.fn(),
		},
		Badge: {
			findAll: jest.fn(),
		},
		UserBadge: {
			findAll: jest.fn(() => Promise.resolve([{ badgeId: 1 }, { badgeId: 2 }])),
			bulkCreate: jest.fn(),
		},
		Attempt: {
			count: jest.fn(),
		},
		PointLog: {
			count: jest.fn(),
		},
	}
});

describe('BadgeService', () => {
	describe('awardBadges method', () => {
		it('should throw Error if user not found', async () => {
			jest.mocked(User.findByPk).mockResolvedValue(null);
			jest.mocked(Challenge.findByPk).mockResolvedValue({} as Challenge);

			await expect(BadgeService.awardBadges(1, 1, {} as any))
				.rejects
				.toThrow('Challenge or user not found');
		});

		it('should throw Error if user not found', async () => {
			jest.mocked(Challenge.findByPk).mockResolvedValue(null);
			jest.mocked(User.findByPk).mockResolvedValue({} as User);

			await expect(BadgeService.awardBadges(1, 1, {} as any))
				.rejects
				.toThrow('Challenge or user not found');
		});

		it('should create UserBadges', async () => {
			jest.mocked(User.findByPk).mockResolvedValue({ id: 1 } as User);
			jest.mocked(Challenge.findByPk).mockResolvedValue({} as Challenge);
			jest.mocked(Badge.findAll).mockResolvedValue([{ id: 1 }, { id: 2 }] as Badge[]);

			await BadgeService.awardBadges(1, 1, {} as any);

			expect(UserBadge.bulkCreate).toHaveBeenCalledWith([
				{ userId: 1, badgeId: 1 },
				{ userId: 1, badgeId: 2 },
			], { transaction: {} });
		});
	});
});


