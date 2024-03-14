import { Request, Response, Router } from "express";
import errorHandler from "../middleware/errorHandler";
import { Challenge } from "../database/models";
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

router.post("/:id/container", errorHandler(async (req: Request, res: Response) => {
	const challengeId = req.params.id;

	const resp = await KubernetesService.createDeployment(challengeId, "nginxdemos/hello");

	res.json(resp);
}));

router.get("/admin", verifyIsAdmin, errorHandler(async (_req: Request, res: Response) => {
	const challenges = await Challenge.findAll();
	return res.json(challenges);
}));

export default router;