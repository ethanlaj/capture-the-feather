import { Request, Response, Router } from "express";
import { Transaction } from "sequelize";
import errorHandler from "../middleware/errorHandler";
import { Challenge, ChallengeFile, Configuration, Container, MultipleChoiceOption, ShortAnswerOption, User } from "../database/models";
import { ChallengeService } from "../services/challengeService";
import { verifyAccess } from "../middleware/verifyAccess";
import { verifyIsAdmin } from "../middleware/verifyIsAdmin";
import { KubernetesService } from "../services/kubernetesService";
import { ChallengeType } from "../database/models/challenge";
import { upload } from "../middleware/multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const challenges = await Challenge
		.scope({ method: ['withUserAttempts', req.payload!.userId] })
		.findAll();

	const config = await Configuration.findOne({ attributes: ["categoryOrder"] });

	for (let challenge of challenges) {
		if (!challenge.isSolvedOrExhausted) {
			ChallengeService.removeAnswers(challenge);
		}
	}

	return res.json({ challenges, categoryOrder: config?.categoryOrder });
}));

router.get("/admin/:id", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	const challengeId = Number(req.params.id);

	const challenge = await Challenge.scope("withoutUserAttempts").findByPk(challengeId);
	if (!challenge) {
		return res.status(404).json({ error: "Challenge not found" });
	}

	return res.json(challenge);
}));

router.get("/file/:id", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const fileId = Number(req.params.id);

	const file = await ChallengeFile.findByPk(fileId);
	if (!file) {
		return res.status(404).json({ error: "File not found" });
	}

	const filePath = path.join(__dirname, "..", "..", file.path);
	res.status(200).download(filePath, file.filename);
}));

router.post("/admin",
	verifyIsAdmin,
	upload.any(),
	errorHandler(async (req: Request, res: Response) => {
		const files = req.files as Express.Multer.File[];
		const newChallenge = JSON.parse(req.body.challenge);

		const t = await Challenge.sequelize!.transaction();

		try {
			const challenge = await Challenge.create(newChallenge, {
				transaction: t,
				include: [MultipleChoiceOption, ShortAnswerOption]
			});

			if (Array.isArray(files) && files.length > 0) {
				await moveFilesAndSaveToDatabase(files, challenge.id, t);
			}

			await t.commit();

			return res.sendStatus(201);
		} catch (error) {
			console.error(error);
			await t.rollback();
			return res.status(500).json({ error: "Failed to create challenge" });
		}
	})
);

router.put("/admin/:id",
	verifyIsAdmin,
	upload.any(),
	errorHandler(async (req: Request, res: Response) => {
		const challengeId = Number(req.params.id);
		const challenge = await Challenge.findByPk(challengeId, {
			include: [{
				model: MultipleChoiceOption,
				attributes: ["id"]
			}, {
				model: ShortAnswerOption,
				attributes: ["id"]
			}, {
				model: ChallengeFile,
				attributes: ["id", "path"]
			}]
		})
		if (!challenge) {
			return res.status(404).json({ error: "Challenge not found" });
		}

		const files = req.files as Express.Multer.File[];
		const newChallenge = JSON.parse(req.body.challenge);

		const t = await Challenge.sequelize!.transaction();

		try {
			await challenge.update(newChallenge, {
				transaction: t,
			});

			if (challenge.type === ChallengeType.MultipleChoice) {
				const options = newChallenge.multipleChoiceOptions;
				const optionsToDelete = challenge.multipleChoiceOptions.filter(option => !options.some((o: any) => !o.isNew && o.id === option.id));
				await MultipleChoiceOption.destroy({
					where: {
						id: optionsToDelete.map((o: any) => o.id)
					},
					transaction: t
				});

				await ShortAnswerOption.destroy({
					where: {
						challengeId: challenge.id
					},
					transaction: t
				});

				for (let option of options) {
					if (option.isNew) {
						await MultipleChoiceOption.create({
							challengeId: challenge.id,
							...option,
							id: undefined
						}, { transaction: t });
					} else {
						const existingOption = challenge.multipleChoiceOptions.find(o => o.id === option.id);
						await existingOption!.update(option, { transaction: t });
					}
				}
			} else if (challenge.type === ChallengeType.ShortAnswer) {
				const options = newChallenge.shortAnswerOptions;
				const optionsToDelete = challenge.shortAnswerOptions.filter(option => !options.some((o: any) => !o.isNew && o.id === option.id));
				await ShortAnswerOption.destroy({
					where: {
						id: optionsToDelete.map((o: any) => o.id)
					},
					transaction: t
				});

				await MultipleChoiceOption.destroy({
					where: {
						challengeId: challenge.id
					},
					transaction: t
				});

				for (let option of options) {
					if (option.isNew) {
						await ShortAnswerOption.create({
							challengeId: challenge.id,
							...option,
							id: undefined
						}, { transaction: t });
					} else {
						const existingOption = challenge.shortAnswerOptions.find(o => o.id === option.id);
						await existingOption!.update(option, { transaction: t });
					}
				}
			}

			if (Array.isArray(files) && files.length > 0) {
				await moveFilesAndSaveToDatabase(files, challenge.id, t);
			}

			if (newChallenge.filesToDelete) {
				await ChallengeFile.destroy({
					where: {
						id: newChallenge.filesToDelete
					},
					transaction: t
				});

				for (let fileId of newChallenge.filesToDelete) {
					const file = challenge.files.find(f => f.id === fileId);
					if (file) {
						fs.unlinkSync(path.join(__dirname, "..", "..", file.path));
					}
				}
			}

			await t.commit();

			return res.sendStatus(201);
		} catch (error) {
			console.error(error);
			await t.rollback();
			return res.status(500).json({ error: "Failed to update challenge" });
		}
	})
);

function moveFilesAndSaveToDatabase(files: Express.Multer.File[], challengeId: number, t: Transaction) {
	const filesToSave = [];

	for (let file of files) {
		const { path: currentPath, originalname, mimetype } = file;
		const newPath = `challengeFiles/${uuidv4()}-${originalname}`;

		console.log(file);

		filesToSave.push({
			path: newPath,
			mimetype,
			filename: originalname,
			challengeId
		});

		fs.renameSync(currentPath, path.join(__dirname, "..", "..", newPath));
	}

	return ChallengeFile.bulkCreate(filesToSave, { transaction: t });
}

router.delete("/:id", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	const challengeId = Number(req.params.id);

	const challenge = await Challenge.findByPk(challengeId, {
		include: [{
			model: ChallengeFile,
			attributes: ["id", "path"]
		}]
	});
	if (!challenge) {
		return res.status(404).json({ error: "Challenge not found" });
	}

	const t = await Challenge.sequelize!.transaction();

	try {
		await challenge.destroy({ transaction: t });

		await ChallengeFile.destroy({
			where: {
				challengeId: challengeId
			},
			transaction: t
		});

		for (let file of challenge.files) {
			fs.unlinkSync(path.join(__dirname, "..", "..", file.path));
		}

		return res.sendStatus(200);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to delete challenge" });
	}
}));

router.get("/containers", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	const containers = await Container.findAll({
		include: [
			{
				model: Challenge,
			},
			{
				model: User,
				attributes: ["name", "email"]
			}
		]
	});

	const allDeployments = await KubernetesService.getAllDeployments();

	const containersToReturn = [];
	for (let container of containers) {
		const deployment = allDeployments.find(d => d.metadata?.labels?.challengeId === container.challengeId.toString() && d.metadata.labels?.userId === container.userId.toString());

		const isDeploymentReady = deployment?.status?.readyReplicas === deployment?.status?.replicas;

		containersToReturn.push({
			...container.toJSON(),
			isDeploymentReady,
		});
	}

	return res.json(containersToReturn);
}))

router.get("/:id/container", verifyAccess, errorHandler(async (req: Request, res: Response) => {
	const challengeId = Number(req.params.id);
	const userId = req.payload!.userId;

	const container = await Container.findOne({
		where: {
			challengeId,
			userId
		}
	});

	if (!container) {
		return res.json(null);
	}

	return res.json(container);
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
			// challengeId,
			userId
		}
	});

	if (container) {
		return res.status(400).json({ error: "User already has a running container" });
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

	const t = await Container.sequelize!.transaction();
	try {
		await container.update({ isDeleting: true }, { transaction: t });
		await KubernetesService.deleteDeployment(challengeId, userId);
		await container.destroy({ transaction: t });

		await t.commit();
		return res.sendStatus(200);
	} catch (error) {
		await t.rollback();
		console.error(error);
		return res.status(500).json({ error: "Failed to delete container" });
	}
}));

router.get("/admin", verifyIsAdmin, errorHandler(async (_req: Request, res: Response) => {
	const challenges = await Challenge.findAll();
	return res.json(challenges);
}));

export default router;