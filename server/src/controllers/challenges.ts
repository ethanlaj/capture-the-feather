import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { Challenge, Container } from "../database/models";
import { ChallengeService } from "../services/challengeService";
import { verifyAccess } from "../middleware/verifyAccess";
import { verifyIsAdmin } from "../middleware/verifyIsAdmin";
import { KubernetesService } from "../services/kubernetesService";

const router = Router();

router.get("/", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const challenges = await Challenge
		.scope({ method: ['withUserAttempts', req.payload!.userId] })
		.findAll();

	for (let challenge of challenges) {
		if (!challenge.isSolvedOrExhausted) {
			ChallengeService.removeAnswers(challenge);
		}
	}

	return res.json(challenges);
}));

router.post("/:id/container", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const challengeId = Number(req.params.id);
	const userId = req.payload!.userId;

	const challenge = await Challenge
		.scope({ method: ['withUserAttempts', userId] })
		.findByPk(challengeId);
	if (!challenge) {
		return res.status(404).json({ error: "Challenge not found" });
	}

	if (challenge.isSolvedOrExhausted) {
		return res.status(400).json({ error: "Challenge already solved or exhausted" });
	}

	if (!challenge.containerImage || !challenge.containerPorts) {
		return res.status(400).json({ error: "Challenge does not have a container" });
	}

	const container = await Container.findOne({
		where: {
			challengeId,
			userId
		}
	});

	if (container) {
		return res.status(400).json({ error: "Container already exists for this user" });
	}

	try {
		const resp = await KubernetesService.createDeployment(
			challengeId,
			userId,
			challenge.containerImage,
			challenge.containerPorts
		);

		const ThirtyMinutes = 1000 * 60 * 30;

		const container = await Container.create({
			challengeId,
			userId,
			ports: resp,
			isDeleting: false,
			expiresAt: new Date(Date.now() + ThirtyMinutes)
		});

		res.json(container);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to create container" });
	}
}));

router.delete("/:id/container", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const challengeId = Number(req.params.id);
	const userId = req.payload!.userId;

	const container = await Container.findOne({
		where: {
			challengeId,
			userId
		}
	});

	if (!container) {
		return res.status(404).json({ error: "Container not found" });
	}

	if (container.isDeleting) {
		return res.status(400).json({ error: "Container is already being deleted" });
	}

	try {
		await container.update({ isDeleting: true });
		await KubernetesService.deleteDeployment(challengeId, userId);
		await container.destroy();
		return res.sendStatus(200);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to delete container" });
	}
}));

router.get("/admin", verifyIsAdmin, errorHandler(async (_req: Request, res: Response) => {
	const challenges = await Challenge.findAll();
	return res.json(challenges);
}));

export default router;