import { Router } from "express";
import { Configuration, User } from "../database/models";
import { verifyIsAdmin } from "../middleware/verifyIsAdmin";

const router = Router();

router.get("/", async (_req, res) => {
	const configuration = await Configuration.findOne();
	if (!configuration) {
		return res.json({});
	}

	return res.json(configuration);
});

router.put("/", verifyIsAdmin, async (req, res) => {
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
});

export default router;