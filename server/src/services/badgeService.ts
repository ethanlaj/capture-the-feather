import { Attempt, Badge, Challenge, PointLog, User, UserBadge } from "../database/models";
import { Op, Transaction } from "sequelize";

export class BadgeService {
	static async awardBadges(userId: number, challengeId: number, t: Transaction) {
		const challenge = await Challenge.findByPk(challengeId, { transaction: t });
		const user = await User.findByPk(userId, { attributes: ['id', 'totalPoints'], transaction: t });
		if (!challenge || !user) {
			throw new Error('Challenge or user not found');
		}

		const categoryChallengeIds: number[] = await Challenge.findAll({
			attributes: ['id'],
			where: { category: challenge.category },
			transaction: t
		}).then(results => results.map(result => result.id));

		const userCategorySolveCounts = await Attempt.count({
			where: {
				userId,
				isCorrect: true,
				challengeId: categoryChallengeIds
			},
			transaction: t
		});

		const userSolveCounts = await Attempt.count({
			where: {
				userId,
				isCorrect: true,
			},
			transaction: t
		});

		const categoryPointCounts = await PointLog.sum('pointsAwarded', {
			where: {
				userId,
				challengeId: categoryChallengeIds
			},
			transaction: t
		});

		if (userCategorySolveCounts === 0 && userSolveCounts === 0) {
			return [];
		}

		const awardedBadgeIds = await UserBadge.findAll({
			where: { userId: userId },
			attributes: ['badgeId'],
			transaction: t
		}).then(result => result.map(badge => badge.badgeId));

		const badgesToAward = await Badge.findAll({
			transaction: t,
			where: {
				id: { [Op.notIn]: awardedBadgeIds },
				[Op.or]: [
					{
						// Category + Challenge based badge
						[Op.and]: [
							{ basedOn: 'category' },
							{ condition: 'challenges' },
							{ category: challenge.category },
							{ threshold: { [Op.lte]: userCategorySolveCounts } }
						]
					},
					{
						// All + Challenge based badge
						[Op.and]: [
							{ basedOn: 'all' },
							{ condition: 'challenges' },
							{ threshold: { [Op.lte]: userSolveCounts } }
						]
					},
					{
						// All + Challenge based badge (no threshold)
						// AKA badge that requires all challenges to be solved
						[Op.and]: [
							{ basedOn: 'all' },
							{ condition: 'challenges' },
							{ threshold: null }
						]
					},
					{
						// Category + Points based badge
						[Op.and]: [
							{ basedOn: 'category' },
							{ condition: 'points' },
							{ category: challenge.category },
							{ threshold: { [Op.lte]: categoryPointCounts } }
						]
					},
					{
						// All + Points based badge
						[Op.and]: [
							{ basedOn: 'all' },
							{ condition: 'points' },
							{ threshold: { [Op.lte]: user.totalPoints } }
						]
					},
				]
			},
		});

		const badgeIdsToAward = badgesToAward.map(badge => badge.id);
		await UserBadge.bulkCreate(badgeIdsToAward.map(badgeId => ({ userId, badgeId })), { transaction: t });

		return badgesToAward;
	}

	static getDescription(badge: Badge) {
		const sChallenges = badge.threshold === 1 ? '' : 's';
		const sPoints = badge.threshold === 1 ? '' : 's';

		if (badge.basedOn === 'category') {
			if (badge.condition === 'challenges') {
				return `Solve ${badge.threshold || 'all'} challenge${sChallenges} in ${badge.category} category to earn this badge.`;
			} else if (badge.condition === 'points') {
				return `Earn ${badge.threshold} point${sPoints} in ${badge.category} category to earn this badge.`;
			}
		} else if (badge.basedOn === 'all') {
			if (badge.condition === 'challenges') {
				return `Solve ${badge.threshold || 'all'} challenge${sChallenges} to earn this badge.`;
			} else if (badge.condition === 'points') {
				return `Earn ${badge.threshold} point${sPoints} to earn this badge.`;
			}
		}
		return '';
	}

	static getEarnersText(badge: Badge) {
		if (!badge.userBadges || badge.userBadges.length === 0) return [];

		const sliceEnd = badge.userBadges.length < 3 ? badge.userBadges.length : 3;
		return badge.userBadges.slice(0, sliceEnd).map((userBadge) => userBadge.user.name);
	}
}