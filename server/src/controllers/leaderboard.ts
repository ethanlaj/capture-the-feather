import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { verifyAccess } from "../middleware/verifyAccess";
import { PointLog, User } from "../database/models";

const router = Router();
const fifteenMinutes = 15 * 60 * 1000;

router.get("/", verifyAccess, errorHandler(async (_req: Request, res: Response) => {
	const top10Users = await User.findAll({
		order: [
			['totalPoints', 'DESC']
		],
		where: {
			isAdmin: false,
		},
		attributes: ['id', 'name', 'totalPoints', 'createdAt'],
		limit: 10,
	});

	const pointLogs = await PointLog.findAll({
		where: {
			userId: top10Users.map((user) => user.id),
		},
		order: [
			['awardedAt', 'ASC']
		],
	});

	if (pointLogs.length === 0) {
		return res.json({
			chartData: [],
			tableData: [],
		});
	}

	// Get starting timestamp:
	const lowestTimestamp = new Date(pointLogs[0].awardedAt).getTime();
	const startingTimestamp = Math.ceil(lowestTimestamp / fifteenMinutes) * fifteenMinutes;

	// Get ending timestamp:
	const highestTimestamp = new Date(pointLogs[pointLogs.length - 1].awardedAt).getTime();
	const endingTimestamp = Math.ceil(highestTimestamp / fifteenMinutes) * fifteenMinutes;

	const userCumulativePointMap = new Map<number, number>();
	const userPointLogsMap = new Map<number, PointLog[]>();
	const mappedData = [];
	for (let i = startingTimestamp; i <= endingTimestamp; i += fifteenMinutes) {
		for (let user of top10Users) {
			if (!userCumulativePointMap.has(user.id)) {
				userCumulativePointMap.set(user.id, 0);
			}
			if (!userPointLogsMap.has(user.id)) {
				userPointLogsMap.set(user.id, pointLogs.filter((pointLog) => pointLog.userId === user.id));
			}

			const userPointLogs = userPointLogsMap.get(user.id) as PointLog[];
			const userPointLogsBeforeTimestamp = userPointLogs.filter((pointLog) => new Date(pointLog.awardedAt).getTime() <= i);
			const userCumulativePoints = userPointLogsBeforeTimestamp.reduce((acc, pointLog) => acc + pointLog.pointsAwarded, 0);
			userCumulativePointMap.set(user.id, userCumulativePoints);

			mappedData.push({
				name: user.name,
				timestamp: i,
				cumulativePoints: userCumulativePoints,
			});
		}
	}

	res.json({
		chartData: mappedData,
		tableData: top10Users,
	});
}));

export default router;