import { Challenge, PointLog, User } from "../database/models";
import { Transaction } from "sequelize";

export class PointService {
	static async awardPoints(userId: number, challengeId: number, points: number, t: Transaction) {
		const user = await User.findByPk(userId);
		const challenge = await Challenge.findByPk(challengeId);
		if (!user || !challenge) {
			throw new Error('User or challenge not found');
		}

		if (points > 0) {
			await user.increment('totalPoints', { by: points, transaction: t });
		} else {
			await user.decrement('totalPoints', { by: -points, transaction: t });
		}

		await PointLog.create({
			userId: user.id,
			challengeId: challenge.id,
			pointsAwarded: points,
		}, { transaction: t });
	}
}