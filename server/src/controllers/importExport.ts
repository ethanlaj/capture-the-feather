import { Router, Request, Response } from "express";
import { verifyIsAdmin } from "../middleware/verifyIsAdmin";
import errorHandler from "../middleware/errorHandler";
import { ImportExportService } from "../services/importExportService";
import JSZip from "jszip";
import fs from "fs";
import { Challenge, ChallengeFile, MultipleChoiceOption, ShortAnswerOption } from "../database/models";
import { upload } from "../middleware/multer";
import path from "path";
import { Model, ModelCtor } from "sequelize-typescript";

const router = Router();
const models = [Challenge, ChallengeFile, MultipleChoiceOption, ShortAnswerOption];

router.post("/export", verifyIsAdmin, errorHandler(async (req: Request, res: Response) => {
	// Export tables we want for later imports
	try {
		const dbFiles: [string, string][] = [];
		for (const model of models) {
			const fileName = model.name + ".json";
			const filePath = await ImportExportService.exportTableToJSON(model, fileName);

			dbFiles.push([fileName, filePath]);
		}

		const zip = new JSZip();
		const dbFolder = zip.folder("db");
		for (const [fileName, filePath] of dbFiles) {
			const fileData = await fs.promises.readFile(filePath);
			dbFolder!.file(fileName, fileData);
		}

		const files = zip.folder("files");
		const challengeFiles = await ChallengeFile.findAll();
		for (const challengeFile of challengeFiles) {
			const fileData = await fs.promises.readFile(challengeFile.path);
			files!.file(challengeFile.path, fileData);
		}

		const zipData = await zip.generateAsync({ type: "nodebuffer" });
		const zipFileName = 'export.zip';
		res.setHeader('Content-Type', 'application/zip');
		res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
		res.send(zipData);

		for (const [, filePath] of dbFiles) {
			fs.promises.unlink(filePath).catch(console.error);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to export data");
	}
}));

router.post("/import", verifyIsAdmin, upload.single('file'), errorHandler(async (req: Request, res: Response) => {
	let t;
	try {
		if (!req.file) {
			return res.status(400).send("No file uploaded");
		}

		t = await models[0].sequelize!.transaction();

		const zip = new JSZip();
		const filePath = req.file.path;
		const fileData = await fs.promises.readFile(filePath);
		await zip.loadAsync(fileData);

		// Ensure dbFolder is correctly identified
		const dbFolder = zip.folder("db");
		if (!dbFolder) {
			throw new Error("No db folder found in zip file");
		}

		// Process JSON files based on the specified model order
		for (const model of models) {
			const typedModel: ModelCtor<Model<any, any>> = model as ModelCtor<Model<any, any>>;

			const modelName = model.name;
			const file = dbFolder.file(modelName + ".json");

			if (file) {
				const data = await file.async("string");
				const jsonData = JSON.parse(data);
				await typedModel.bulkCreate(jsonData, { validate: true, transaction: t });
			} else {
				return res.status(400).send(`No ${modelName} file found in zip`);
			}
		}

		// Process files in the files folder as before
		const filesFolder = zip.folder("files");
		if (filesFolder) {
			filesFolder.forEach(async (relativePath, file) => {
				if (!file.dir) {
					const data = await file.async("nodebuffer");
					const fileName = relativePath;
					const writePath = path.join(fileName);
					await fs.promises.writeFile(writePath, data);
				}
			});
		} else {
			console.error("No files folder found in zip file");
		}

		res.send("Import successful");
		await t.commit();

		// Clean up temp files
		fs.promises.unlink(filePath).catch(console.error);
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to import data");
		await t!.rollback();
	}
}));

export default router;
