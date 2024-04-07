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
	"Grandmaster",
	"Master",
	"Advanced",
	"Intermediate",
	"Beginner",
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
	let averageChallengesPerLevel = Math.max(1, Math.floor(challengeCount / autoGenerateNames.length));
	let averagePointsPerLevel = Math.max(1, Math.floor(totalPoints / autoGenerateNames.length));

	for (let i = autoGenerateNames.length - 1; i >= 0; i--) {
		const title = autoGenerateNames[autoGenerateNames.length - i - 1]

		// General badges for "all" categories
		const allChallengeBasedBadge = {
			name: title + " Solver",
			basedOn: 'all',
			condition: 'challenges',
			threshold: Math.min(challengeCount, (i + 1) * averageChallengesPerLevel),
			imageUrl: IMAGE_URL
		};

		const allPointBasedBadge = {
			name: title + " Earner",
			basedOn: 'all',
			condition: 'points',
			threshold: Math.min(totalPoints, (i + 1) * averagePointsPerLevel),
			imageUrl: IMAGE_URL
		};

		badgesToCreate.push(allChallengeBasedBadge, allPointBasedBadge);
	}

	for (let [categoryName, categoryData] of categoryMap) {
		const categoryChallengeThreshold = Math.max(1, Math.floor(categoryData.count / autoGenerateNames.length));
		const categoryPointThreshold = Math.max(1, Math.floor(categoryData.points / Math.min(autoGenerateNames.length, categoryData.count)));

		const numChallengeTypeToCreate = Math.min(Math.max(1, Math.floor(categoryData.count / categoryChallengeThreshold)));
		const numPointTypeToCreate = Math.min(Math.max(1, Math.floor(categoryData.points / categoryPointThreshold)));

		for (let i = numChallengeTypeToCreate - 1; i >= 0; i--) {
			const title = autoGenerateNames[numChallengeTypeToCreate - i - 1]

			const challengeBasedBadge = {
				name: title + " " + categoryName + " Solver",
				basedOn: 'category',
				category: categoryName,
				condition: 'challenges',
				threshold: Math.min(categoryData.count, (i + 1) * categoryChallengeThreshold),
				imageUrl: IMAGE_URL
			};

			badgesToCreate.push(challengeBasedBadge);
		}

		for (let i = numPointTypeToCreate - 1; i >= 0; i--) {
			const title = autoGenerateNames[numPointTypeToCreate - i - 1]

			const pointBasedBadge = {
				name: title + " " + categoryName + " Earner",
				basedOn: 'category',
				category: categoryName,
				condition: 'points',
				threshold: Math.min(categoryData.points, (i + 1) * categoryPointThreshold),
				imageUrl: IMAGE_URL
			};

			badgesToCreate.push(pointBasedBadge);
		}
	}

	res.json(await Badge.bulkCreate(badgesToCreate));
}));

router.delete("/all", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	await Badge.destroy({ where: {} });
	res.status(204).send();
}));

export default router;