import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { verifyAccess } from "../middleware/verifyAccess";
import { Badge, Challenge, UserBadge } from "../database/models";
import { verifyIsAdmin } from "../middleware/verifyIsAdmin";

const router = Router();

router.get("/", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const userId = req.payload!.userId;
	const badges = await Badge.findAll(
		{
			include: { model: UserBadge }
		}
	);

	for (let badge of badges) {
		const isAwarded = badge.userBadges.filter((userBadge: UserBadge) => userBadge.userId === userId).length > 0;
		badge.setDataValue('isAwarded', isAwarded)
	}

	res.json(badges)
}));

const autoGenerateNames = [
	"Beginner",
	"Intermediate",
	"Advanced",
	"Master",
	"Grandmaster"
]

interface CategoryData {
	category: string;
	points: number;
	count: number;
}

router.post("/autoGenerate", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	const existingBadge = await Badge.findOne();
	if (existingBadge) {
		res.status(400).json({ error: "Cannot autogenerate badges if badges already exist." });
	}

	const challenges = await Challenge.findAll({ attributes: ['category', 'points'] });

	const totalPoints = challenges.reduce((acc, challenge) => acc + challenge.points, 0);
	const challengeCount = challenges.length;

	const categoryMap = new Map<string, CategoryData>();
	for (let challenge of challenges) {
		const categoryData = categoryMap.get(challenge.category);
		if (categoryData) {
			categoryData.points += challenge.points;
			categoryData.count++;
		} else {
			categoryMap.set(challenge.category, { category: challenge.category, points: challenge.points, count: 1 });
		}
	}

	const IMAGE_URL = '/images/badges/default.png';

	const badgesToCreate: any[] = [];
	let averageChallengesPerLevel = Math.floor(challengeCount / autoGenerateNames.length);
	let averagePointsPerLevel = Math.floor(totalPoints / autoGenerateNames.length);

	for (let i = autoGenerateNames.length - 1; i >= 0; i--) {
		const allChallengeBasedBadge = {
			name: autoGenerateNames[i] + " Solver",
			basedOn: 'all',
			condition: 'challenges',
			threshold: (i + 1) + averageChallengesPerLevel,
			imageUrl: IMAGE_URL
		};

		const allPointBasedBadge = {
			name: autoGenerateNames[i] + " Earner",
			basedOn: 'all',
			condition: 'points',
			threshold: (i + 1) * averagePointsPerLevel,
			imageUrl: IMAGE_URL
		};

		for (let [categoryName, categoryData] of categoryMap) {
			const categoryChallengeThreshold = Math.floor(categoryData.count / autoGenerateNames.length);
			const categoryPointThreshold = Math.floor(categoryData.points / autoGenerateNames.length);

			if (i * categoryChallengeThreshold < categoryData.count) {
				const categoryChallengeBasedBadge = {
					name: `${autoGenerateNames[i]} ${categoryName} Solver`,
					basedOn: 'category',
					condition: 'challenges',
					category: categoryName,
					threshold: categoryData.count,
					imageUrl: IMAGE_URL
				};
				badgesToCreate.push(categoryChallengeBasedBadge);
				break;
			}

			if (i * categoryPointThreshold < categoryData.points) {
				const categoryPointBasedBadge = {
					name: `${autoGenerateNames[i]} ${categoryName} Earner`,
					basedOn: 'category',
					condition: 'points',
					category: categoryName,
					threshold: categoryData.points,
					imageUrl: IMAGE_URL
				};
				badgesToCreate.push(categoryPointBasedBadge);
				break;
			}
		}

		badgesToCreate.push(allChallengeBasedBadge, allPointBasedBadge);
	};

	res.json(await Badge.bulkCreate(badgesToCreate));
}));

router.delete("/all", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	await Badge.destroy({ where: {} });
	res.status(204).send();
}));

export default router;