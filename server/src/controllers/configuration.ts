import { Router, Request, Response } from "express";
import { Challenge, Configuration } from "../database/models";
import { verifyIsAdmin } from "../middleware/verifyIsAdmin";
import errorHandler from "../middleware/errorHandler";

const router = Router();

router.get("/", errorHandler(async (_req: Request, res: Response) => {
	const configuration = await Configuration.findOne({
		attributes: ["startTime", "endTime"],
	});
	if (!configuration) {
		return res.json({});
	}

	return res.json(configuration);
}));

router.put("/", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	const { startTime, endTime } = req.body;

	const [configuration, isCreated] = await Configuration.findOrCreate(
		{ where: {}, defaults: { startTime, endTime } }
	);

	if (!isCreated) {
		configuration.startTime = startTime;
		configuration.endTime = endTime;
		await configuration.save();
	}

	return res.json(configuration);
}));

router.post("/reorder/categories", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	if (!req.body.categories) {
		return res.status(400).json({ error: "Categories not provided" });
	}

	const categories = req.body.categories as string[];

	const [configuration, isCreated] = await Configuration.findOrCreate(
		{ where: {}, defaults: { categoryOrder: categories } }
	);

	if (!isCreated) {
		configuration.categoryOrder = categories;
		await configuration.save();
	}

	return res.json({ success: true });
}));

router.post("/reorder/category/:category", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	const { category } = req.params;
	const challenges = req.body.challenges as number[];

	if (!category || !challenges) {
		return res.status(400).json({ error: "Category or challenges not provided" });
	}

	const challengesInCategory = await Challenge.findAll({ where: { category } });
	// Match order of challenges 
	const orderedChallenges = challengesInCategory.map((challenge) => {
		const order = challenges.indexOf(challenge.id);
		challenge.order = order;

		return challenge;
	});

	await Promise.all(orderedChallenges.map((challenge) => challenge.save()));

	return res.json({ success: true });
}));

export default router;