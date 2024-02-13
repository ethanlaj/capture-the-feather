import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { verifyAccess } from "../middleware/verifyAccess";
import { PointLog, User } from "../database/models";

const router = Router();

router.get("/", verifyAccess, errorHandler(async (_req: Request, res: Response) => {
	const top10Users = await User.findAll({
		order: [
			['totalPoints', 'DESC']
		],
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

	const mappedData = [];
	for (let user of top10Users) {
		let cumulativePoints = 0;
		const userPointLogs = pointLogs.filter((pointLog) => pointLog.userId === user.id);

		// Start users at 0 points
		mappedData.push({
			name: user.name,
			timestamp: user.createdAt.getTime(),
			cumulativePoints: 0,
		});

		for (let pointLog of userPointLogs) {
			cumulativePoints += pointLog.pointsAwarded;
			const timestamp = new Date(pointLog.awardedAt).getTime();

			mappedData.push({
				name: user.name,
				timestamp: timestamp,
				cumulativePoints: cumulativePoints,
			});
		}
	};

	mappedData.sort((a, b) => a.timestamp - b.timestamp);

	res.json({
		chartData: mappedData,
		tableData: top10Users,
	});
}));

export default router;